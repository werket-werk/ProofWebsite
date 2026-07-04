const jsonHeaders = {
  'content-type': 'application/json; charset=utf-8',
};

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: jsonHeaders,
  });
}

function redirectBack(url, params) {
  const target = new URL(url);
  target.pathname = '/support/';
  target.search = params.toString();
  return Response.redirect(target.toString(), 302);
}

async function parseInput(request) {
  const contentType = request.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return request.json();
  }
  const formData = await request.formData();
  return Object.fromEntries(formData.entries());
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const wantsJson = (request.headers.get('accept') || '').includes('application/json');

  try {
    const input = await parseInput(request);
    const name = clean(input.name);
    const email = clean(input.email);
    const subject = clean(input.subject);
    const message = clean(input.message);
    const company = clean(input.company);

    if (company) {
      const params = new URLSearchParams({ error: 'Submission rejected.' });
      return wantsJson ? json({ ok: false, error: 'Submission rejected.' }, 400) : redirectBack(request.url, params);
    }

    if (!name || !email || !subject || !message) {
      const params = new URLSearchParams({ error: 'Please complete all required fields.' });
      return wantsJson ? json({ ok: false, error: 'Please complete all required fields.' }, 400) : redirectBack(request.url, params);
    }

    if (!isEmail(email)) {
      const params = new URLSearchParams({ error: 'Please enter a valid email address.' });
      return wantsJson ? json({ ok: false, error: 'Please enter a valid email address.' }, 400) : redirectBack(request.url, params);
    }

    const apiKey = clean(env.RESEND_API_KEY);
    const from = clean(env.CONTACT_FROM_EMAIL);
    const to = clean(env.CONTACT_TO_EMAIL);

    if (!apiKey || !from || !to) {
      return json({ ok: false, error: 'Contact delivery is not configured.' }, 500);
    }

    const emailHtml = `
      <h2>Proof website contact form</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
    `;

    const emailText = [
      'Proof website contact form',
      `Name: ${name}`,
      `Email: ${email}`,
      `Subject: ${subject}`,
      '',
      message,
    ].join('\n');

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Proof support: ${subject}`,
        reply_to: email,
        html: emailHtml,
        text: emailText,
      }),
    });

    if (!resendResponse.ok) {
      const details = await resendResponse.text().catch(() => '');
      return json(
        {
          ok: false,
          error: details || 'Message delivery failed.',
        },
        502
      );
    }

    if (wantsJson) {
      return json({ ok: true });
    }

    const params = new URLSearchParams({ sent: '1' });
    return redirectBack(request.url, params);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected contact form failure.';
    if (wantsJson) {
      return json({ ok: false, error: message }, 500);
    }
    const params = new URLSearchParams({ error: message });
    return redirectBack(request.url, params);
  }
}
