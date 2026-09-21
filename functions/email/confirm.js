import { hash, validToken, nowSeconds, page, sameOrigin, readInput } from '../../lib/email.js';
export async function onRequestGet({ request }) {
  const token = new URL(request.url).searchParams.get('token');
  if (!validToken(token)) return page('Invalid confirmation link', '<p>Please <a href="/#signup">sign up again</a>.</p>', 400);
  return page('Confirm your signup', `<p>Get feature releases and occasional beta surveys by email. Unsubscribe anytime.</p><form method="post"><input type="hidden" name="token" value="${token}"><button class="btn-primary" type="submit">Confirm my signup</button></form>`);
}
export async function onRequestPost({ request, env }) {
  if (!sameOrigin(request)) return page('Please try again', '<p>Use the link in your confirmation email.</p>', 403);
  try {
    const { token } = await readInput(request);
    if (!validToken(token)) return page('Invalid confirmation link', '<p>Please sign up again.</p>', 400);
    const row = await env.DB.prepare("UPDATE subscribers SET status='active',confirmed_at=?,token_hash=NULL,token_expires=NULL WHERE status='pending' AND token_hash=? AND token_expires>? RETURNING email").bind(nowSeconds(), await hash(token), nowSeconds()).first();
    return row ? page('You’re on the list', '<p>Thanks for helping shape Proof. You’ll receive feature releases and occasional beta surveys. Every product email includes an unsubscribe link.</p>') : page('This link is no longer active', '<p>It may have expired or already been used. If you have not confirmed, <a href="/#signup">sign up again</a>.</p>', 410);
  } catch { return page('Please try again shortly', '<p>Your signup could not be confirmed. You can still download Proof.</p>', 503); }
}
