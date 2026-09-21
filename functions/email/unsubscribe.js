import { sign, validToken, page, escapeHtml } from '../../lib/email.js';
async function verified(request, env) {
  const params = new URL(request.url).searchParams;
  const email = params.get('email') || '';
  const token = params.get('token');
  if (!env.EMAIL_TOKEN_SECRET || !validToken(token) || email.length > 254) return null;
  const expected = await sign(`unsubscribe:${email}`, env.EMAIL_TOKEN_SECRET);
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  return diff === 0 ? email : null;
}
export async function onRequestGet({ request, env }) {
  if (!await verified(request, env)) return page('Invalid unsubscribe link', '<p>Please use the link in a Proof email or <a href="/support/#contact">contact us</a>.</p>', 400);
  return page('Unsubscribe from Proof emails', `<p>Stop feature updates and beta survey invitations.</p><form method="post" action="${escapeHtml(new URL(request.url).pathname + new URL(request.url).search)}"><button class="btn-primary" type="submit">Unsubscribe</button></form>`);
}
export async function onRequestPost({ request, env }) {
  try {
    const email = await verified(request, env);
    if (!email) return page('Invalid unsubscribe link', '<p>Use the link in a Proof email.</p>', 400);
    await env.DB.prepare("UPDATE subscribers SET status='unsubscribed',unsubscribed_at=COALESCE(unsubscribed_at,?),token_hash=NULL,token_expires=NULL WHERE email=?").bind(Math.floor(Date.now()/1000), email).run();
    return page('You’re unsubscribed', '<p>You will no longer receive Proof feature updates or beta surveys. You can continue using and downloading Proof.</p>');
  } catch { return page('Please try again shortly', '<p>We could not save your unsubscribe request. Please retry or <a href="/support/#contact">contact us</a>.</p>', 503); }
}
