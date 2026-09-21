import release from '../../data/release.json' with { type: 'json' };
import { validateRelease } from '../../lib/release.js';
export function onRequest({ request, env, waitUntil }) {
  if (!['GET','HEAD'].includes(request.method)) return new Response('Method not allowed', { status: 405, headers: { allow: 'GET, HEAD' } });
  try { validateRelease(release); } catch { return new Response('Download temporarily unavailable. Please try again shortly.', { status: 503 }); }
  if (request.method === 'GET' && !request.headers.has('purpose') && !request.headers.has('sec-purpose') && env.DB) {
    // Measurement is best effort and never blocks the download. No visitor identifiers are stored.
    waitUntil(Promise.resolve().then(() => env.DB.prepare("INSERT INTO daily_counts(day,event,release,count) VALUES(?,'download_request',?,1) ON CONFLICT(day,event,release) DO UPDATE SET count=count+1")
      .bind(new Date().toISOString().slice(0,10), release.version).run()).catch(() => console.error('Download count unavailable')));
  }
  return new Response(null, { status: 302, headers: { location: release.url, 'cache-control': 'no-store', 'referrer-policy': 'no-referrer' } });
}
