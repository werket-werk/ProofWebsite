export const CONSENT_VERSION = '2026-09-21';
export const CONSENT_TEXT = 'Get feature releases and occasional beta surveys by email. Unsubscribe anytime.';
const encoder = new TextEncoder();
export const nowSeconds = () => Math.floor(Date.now() / 1000);
export const token = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, '0')).join('');
export const validToken = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
export async function hash(value) {
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(value))), b => b.toString(16).padStart(2, '0')).join('');
}
export async function sign(value, secret) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return Array.from(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(value))), b => b.toString(16).padStart(2, '0')).join('');
}
export function siteOrigin(env) {
  const url = new URL(env.SITE_ORIGIN || 'https://www.proof-photo.com');
  if (url.protocol !== 'https:' && url.hostname !== 'localhost' && url.hostname !== '127.0.0.1') throw new Error('Invalid site origin');
  return url.origin;
}
export function sameOrigin(request) {
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
}
export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
export function page(title, body, status = 200) {
  return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${escapeHtml(title)} — Proof</title><link rel="stylesheet" href="/assets/css/style.css"></head><body><main class="page-content email-result"><a href="/">Proof</a><h1>${escapeHtml(title)}</h1>${body}<p><a href="/download/mac">Download for Mac</a> · <a href="/privacy/">Privacy</a></p></main></body></html>`, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'referrer-policy': 'no-referrer', 'x-content-type-options': 'nosniff', 'content-security-policy': "default-src 'none'; style-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'" } });
}
export function result(request, message, status = 200) {
  if (request.headers.get('accept')?.includes('application/json')) return Response.json({ ok: status < 400, message }, { status, headers: { 'cache-control': 'no-store' } });
  return page(status < 400 ? 'Check your inbox' : 'Please try again', `<p>${escapeHtml(message)}</p><p><a href="/#signup">Back to signup</a></p>`, status);
}
export async function readInput(request) {
  if (Number(request.headers.get('content-length')) > 4096) throw new Error('Input too large');
  const text = await request.text();
  if (text.length > 4096) throw new Error('Input too large');
  if (request.headers.get('content-type')?.includes('application/json')) return JSON.parse(text);
  return Object.fromEntries(new URLSearchParams(text));
}
export async function cleanup(db, now) {
  await db.batch([
    db.prepare('DELETE FROM rate_limits WHERE expires < ?').bind(now),
    db.prepare("DELETE FROM subscribers WHERE status = 'pending' AND requested_at < ?").bind(now - 7 * 86400),
    db.prepare('UPDATE subscribers SET token_hash = NULL, token_expires = NULL WHERE token_expires < ?').bind(now),
  ]);
}
export async function rateLimit(db, key, expires, maximum) {
  const row = await db.prepare('INSERT INTO rate_limits(key,count,expires) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count').bind(key, expires).first();
  return row.count <= maximum;
}
export async function sendEmail(env, payload) {
  const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' }, body: JSON.stringify({ from: env.SIGNUP_FROM_EMAIL || env.CONTACT_FROM_EMAIL, ...payload }) });
  if (!response.ok) throw new Error('Email delivery failed');
}
// Use this helper for any future product email. It rechecks consent and always adds unsubscribe.
export async function sendProductEmail(env, email, subject, text) {
  const subscriber = await env.DB.prepare("SELECT email FROM subscribers WHERE email = ? AND status = 'active'").bind(email).first();
  if (!subscriber) return false;
  const signature = await sign(`unsubscribe:${email}`, env.EMAIL_TOKEN_SECRET);
  const url = `${siteOrigin(env)}/email/unsubscribe?email=${encodeURIComponent(email)}&token=${signature}`;
  await sendEmail(env, { to: [email], subject, text: `${text}\n\nProof by Erik Sawaya\n${siteOrigin(env)}/support/\nUnsubscribe: ${url}`, headers: { 'List-Unsubscribe': `<${url}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' } });
  return true;
}
