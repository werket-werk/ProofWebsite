import { CONSENT_TEXT, CONSENT_VERSION, nowSeconds, token, hash, sign, siteOrigin, sameOrigin, result, readInput, cleanup, rateLimit, sendEmail } from '../../lib/email.js';
const accepted = 'If this address is eligible, a confirmation email is on its way. Confirm within 24 hours to join. Downloading Proof does not subscribe you.';
export async function onRequestPost({ request, env }) {
  if (!sameOrigin(request)) return result(request, 'Please use the signup form on this website.', 403);
  let input;
  try { input = await readInput(request); } catch { return result(request, 'Please enter a valid email address.', 400); }
  if (input.company) return result(request, accepted);
  const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
  if (email.length > 254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) || input.consent !== CONSENT_VERSION) return result(request, 'Please enter a valid email address and use the current signup form.', 400);
  if (!env.DB || !env.RESEND_API_KEY || !(env.SIGNUP_FROM_EMAIL || env.CONTACT_FROM_EMAIL) || !env.EMAIL_TOKEN_SECRET) return result(request, 'Email signup is temporarily unavailable. You can still download Proof.', 503);
  try {
    const now = nowSeconds();
    await cleanup(env.DB, now);
    const hour = Math.floor(now / 3600);
    const client = await sign(`rate:${hour}:${request.headers.get('cf-connecting-ip') || 'local'}`, env.EMAIL_TOKEN_SECRET);
    if (!await rateLimit(env.DB, client, now + 3600, 5) || !await rateLimit(env.DB, `global:${hour}`, now + 3600, 100)) return result(request, 'Too many signup attempts. Please try again in an hour.', 429);
    const value = token();
    const digest = await hash(value);
    const row = await env.DB.prepare(`INSERT INTO subscribers(email,status,consent_version,consent_text,requested_at,token_hash,token_expires)
      VALUES(?,'pending',?,?,?,?,?) ON CONFLICT(email) DO UPDATE SET token_hash=excluded.token_hash,token_expires=excluded.token_expires,requested_at=excluded.requested_at,consent_version=excluded.consent_version,consent_text=excluded.consent_text
      WHERE subscribers.status='pending' AND subscribers.requested_at <= ? RETURNING email`)
      .bind(email, CONSENT_VERSION, CONSENT_TEXT, now, digest, now + 86400, now - 300).first();
    if (!row) return result(request, accepted);
    try {
      const url = `${siteOrigin(env)}/email/confirm?token=${value}`;
      await sendEmail(env, { to: [email], subject: 'Confirm your Proof email signup', text: `You asked to join Proof emails.\n\n${CONSENT_TEXT}\n\nConfirm your signup: ${url}\n\nThis link expires in 24 hours. If you did not request this, ignore this email; you will not be subscribed.\n\nDownload Proof anytime: ${siteOrigin(env)}/download/mac\n\nProof by Erik Sawaya\n${siteOrigin(env)}/support/` });
    } catch {
      await env.DB.prepare("DELETE FROM subscribers WHERE email=? AND status='pending' AND token_hash=?").bind(email, digest).run();
      return result(request, 'We could not send your confirmation. Please try again shortly. Your download is still available.', 502);
    }
    return result(request, accepted);
  } catch { return result(request, 'Email signup is temporarily unavailable. You can still download Proof.', 503); }
}
