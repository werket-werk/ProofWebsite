const jsonHeaders = {
  'content-type': 'application/json; charset=utf-8',
};

function clean(value, maxLength = 1000) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
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
  target.pathname = '/feedback/';
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

function workflowList(input) {
  const options = [
    ['workflowImport', 'Adding folders'],
    ['workflowGrid', 'Grid culling'],
    ['workflowLoupe', 'Loupe view'],
    ['workflowSurvey', 'Survey comparison'],
    ['workflowRatings', 'Ratings, flags and labels'],
    ['workflowExport', 'Exporting photos'],
    ['workflowHif', 'Fujifilm HIF files'],
  ];

  const selected = options.filter(([key]) => clean(input[key], 10) === 'yes').map(([, label]) => label);
  return selected.length ? selected : ['None selected'];
}

function htmlParagraph(value) {
  return escapeHtml(value).replace(/\n/g, '<br>');
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const wantsJson = (request.headers.get('accept') || '').includes('application/json');

  try {
    const input = await parseInput(request);
    const name = clean(input.name, 100);
    const email = clean(input.email, 254);
    const appVersion = clean(input.appVersion, 40);
    const macosVersion = clean(input.macosVersion, 60);
    const macModel = clean(input.macModel, 100);
    const photographyType = clean(input.photographyType, 100);
    const rating = clean(input.rating, 10);
    const workedWell = clean(input.workedWell, 4000);
    const friction = clean(input.friction, 4000);
    const bugDetails = clean(input.bugDetails, 6000);
    const company = clean(input.company, 200);
    const followupAllowed = clean(input.followupAllowed, 10) === 'yes';
    const workflows = workflowList(input);

    if (company) {
      const params = new URLSearchParams({ error: 'Submission rejected.' });
      return wantsJson ? json({ ok: false, error: 'Submission rejected.' }, 400) : redirectBack(request.url, params);
    }

    if (!name || !email || !appVersion || !macosVersion || !rating || !workedWell || !friction) {
      const error = 'Please complete all required fields.';
      const params = new URLSearchParams({ error });
      return wantsJson ? json({ ok: false, error }, 400) : redirectBack(request.url, params);
    }

    if (!isEmail(email)) {
      const error = 'Please enter a valid email address.';
      const params = new URLSearchParams({ error });
      return wantsJson ? json({ ok: false, error }, 400) : redirectBack(request.url, params);
    }

    if (!['1', '2', '3', '4', '5'].includes(rating)) {
      const error = 'Please choose an overall experience rating.';
      const params = new URLSearchParams({ error });
      return wantsJson ? json({ ok: false, error }, 400) : redirectBack(request.url, params);
    }

    const apiKey = clean(env.RESEND_API_KEY, 500);
    const from = clean(env.CONTACT_FROM_EMAIL, 254);
    const to = clean(env.CONTACT_TO_EMAIL, 254);

    if (!apiKey || !from || !to) {
      return json({ ok: false, error: 'Feedback delivery is not configured.' }, 500);
    }

    const emailHtml = `
      <h2>Proof beta feedback</h2>
      <p><strong>Tester:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p>
      <p><strong>Proof version:</strong> ${escapeHtml(appVersion)}</p>
      <p><strong>macOS version:</strong> ${escapeHtml(macosVersion)}</p>
      <p><strong>Mac model:</strong> ${escapeHtml(macModel || 'Not provided')}</p>
      <p><strong>Photography:</strong> ${escapeHtml(photographyType || 'Not provided')}</p>
      <p><strong>Workflows tested:</strong> ${escapeHtml(workflows.join(', '))}</p>
      <p><strong>Overall rating:</strong> ${escapeHtml(rating)} / 5</p>
      <p><strong>Follow-up allowed:</strong> ${followupAllowed ? 'Yes' : 'No'}</p>
      <hr>
      <h3>What worked well</h3>
      <p>${htmlParagraph(workedWell)}</p>
      <h3>What got in the way</h3>
      <p>${htmlParagraph(friction)}</p>
      <h3>Bug details</h3>
      <p>${htmlParagraph(bugDetails || 'No bug details provided.')}</p>
    `;

    const emailText = [
      'Proof beta feedback',
      `Tester: ${name} (${email})`,
      `Proof version: ${appVersion}`,
      `macOS version: ${macosVersion}`,
      `Mac model: ${macModel || 'Not provided'}`,
      `Photography: ${photographyType || 'Not provided'}`,
      `Workflows tested: ${workflows.join(', ')}`,
      `Overall rating: ${rating} / 5`,
      `Follow-up allowed: ${followupAllowed ? 'Yes' : 'No'}`,
      '',
      'WHAT WORKED WELL',
      workedWell,
      '',
      'WHAT GOT IN THE WAY',
      friction,
      '',
      'BUG DETAILS',
      bugDetails || 'No bug details provided.',
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
        subject: `Proof beta feedback: ${rating}/5 — v${appVersion}`,
        reply_to: email,
        html: emailHtml,
        text: emailText,
      }),
    });

    if (!resendResponse.ok) {
      const details = await resendResponse.text().catch(() => '');
      return json({ ok: false, error: details || 'Feedback delivery failed.' }, 502);
    }

    if (wantsJson) {
      return json({ ok: true });
    }

    const params = new URLSearchParams({ sent: '1' });
    return redirectBack(request.url, params);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected feedback form failure.';
    if (wantsJson) {
      return json({ ok: false, error: message }, 500);
    }
    const params = new URLSearchParams({ error: message });
    return redirectBack(request.url, params);
  }
}
