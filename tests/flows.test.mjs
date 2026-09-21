import test, { beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { onRequestPost as signup } from '../functions/api/signup.js';
import { onRequestGet as confirmGet, onRequestPost as confirm } from '../functions/email/confirm.js';
import { onRequestGet as unsubscribeGet, onRequestPost as unsubscribe } from '../functions/email/unsubscribe.js';
import { onRequest as download } from '../functions/download/mac.js';
import { CONSENT_VERSION, cleanup, sign, sendProductEmail, nowSeconds } from '../lib/email.js';
import { validateRelease } from '../lib/release.js';
let sql, env, sent, originalFetch;
function statement(query) {
  let args = [];
  return { bind(...values) { args = values; return this; }, async first() { return sql.prepare(query).get(...args) || null; }, async run() { return sql.prepare(query).run(...args); } };
}
beforeEach(() => {
  sql = new DatabaseSync(':memory:'); sql.exec(readFileSync('migrations/0001_email.sql','utf8'));
  env = { DB: { prepare: statement, async batch(statements) { sql.exec('BEGIN'); try { const results = []; for (const s of statements) results.push(await s.run()); sql.exec('COMMIT'); return results; } catch(e) { sql.exec('ROLLBACK'); throw e; } } }, EMAIL_TOKEN_SECRET: 'test-only-secret', RESEND_API_KEY: 'test-key', SIGNUP_FROM_EMAIL: 'Proof <test@example.com>', SITE_ORIGIN: 'https://www.proof-photo.com' };
  sent=[]; originalFetch=globalThis.fetch;
  globalThis.fetch=async (_, options) => { sent.push(JSON.parse(options.body)); return Response.json({ id: 'test-email' }); };
});
afterEach(() => { globalThis.fetch=originalFetch; sql.close(); });
function request(path, data, headers={}) { return new Request(`https://www.proof-photo.com${path}`, { method: data ? 'POST' : 'GET', headers: { 'content-type':'application/x-www-form-urlencoded', accept:'application/json', ...headers }, body: data ? new URLSearchParams(data) : undefined }); }
function submit(email='person@example.com', extra={}, headers={}) { return signup({ env, request:request('/api/signup',{email,consent:CONSENT_VERSION,...extra},headers) }); }
const confirmationToken = () => new URL(sent[0].text.match(/https:\/\/[^\s]+\/email\/confirm\?token=[a-f0-9]+/)[0]).searchParams.get('token');
test('signup stores consent, requires explicit confirmation, counts exactly once', async () => {
  assert.equal((await submit(' Person@Example.com ')).status,200);
  const row=sql.prepare('SELECT * FROM subscribers').get();
  assert.equal(row.email,'person@example.com'); assert.equal(row.status,'pending'); assert.equal(row.consent_version,CONSENT_VERSION); assert.match(row.consent_text,/beta surveys/);
  const token=confirmationToken(); assert.notEqual(row.token_hash,token);
  assert.equal((await confirmGet({request:request(`/email/confirm?token=${token}`)})).status,200);
  assert.equal(sql.prepare('SELECT status FROM subscribers').get().status,'pending');
  assert.equal((await confirm({env,request:request('/email/confirm',{token})})).status,200);
  assert.equal(sql.prepare('SELECT status FROM subscribers').get().status,'active');
  assert.equal((await confirm({env,request:request('/email/confirm',{token})})).status,410);
  assert.equal(sql.prepare("SELECT count FROM daily_counts WHERE event='confirmed_signup'").get().count,1);
  await submit(); assert.equal(sent.length,1);
});
test('unsubscribe is safe on GET, works for one-click POST, is idempotent and preserves suppression',async()=>{
  await submit(); await confirm({env,request:request('/email/confirm',{token:confirmationToken()})});
  assert.equal(await sendProductEmail(env,'person@example.com','Update','New features'),true);
  const url=sent[1].headers['List-Unsubscribe'].slice(1,-1);
  assert.equal((await unsubscribeGet({env,request:new Request(url)})).status,200);
  assert.equal(sql.prepare('SELECT status FROM subscribers').get().status,'active');
  assert.equal((await unsubscribe({env,request:new Request(url,{method:'POST',body:'List-Unsubscribe=One-Click'})})).status,200);
  assert.equal((await unsubscribe({env,request:new Request(url,{method:'POST'})})).status,200);
  assert.equal(await sendProductEmail(env,'person@example.com','Update','New features'),false);
  await submit(); assert.equal(sent.length,2);
  assert.equal(sql.prepare('SELECT status FROM subscribers').get().status,'unsubscribed');
  assert.equal((await unsubscribe({env,request:new Request(url.replace('person%40','other%40'),{method:'POST'})})).status,400);
});
test('expired links cannot confirm; stale records are cleaned without deleting opt-outs',async()=>{
  await submit(); const token=confirmationToken();
  sql.exec('UPDATE subscribers SET token_expires=1');
  assert.equal((await confirm({env,request:request('/email/confirm',{token})})).status,410);
  sql.exec('UPDATE subscribers SET requested_at=1');
  await cleanup(env.DB,nowSeconds()); assert.equal(sql.prepare('SELECT count(*) AS n FROM subscribers').get().n,0);
});
test('duplicates do not flood inboxes and IP limits are enforced',async()=>{
  await submit(); await submit(); assert.equal(sent.length,1);
  for(let i=0;i<3;i++) await submit(`other${i}@example.com`);
  assert.equal((await submit('limit@example.com')).status,429);
  assert.equal(sent.length,4);
});
test('global limit constrains distributed signup spam',async()=>{
  sql.prepare('INSERT INTO rate_limits VALUES(?,100,?)').run(`global:${Math.floor(nowSeconds()/3600)}`,nowSeconds()+3600);
  assert.equal((await submit()).status,429); assert.equal(sent.length,0);
});
test('honeypot, invalid consent, malformed input and foreign origins do not send mail',async()=>{
  assert.equal((await submit('bad')).status,400);
  assert.equal((await submit('person@example.com',{consent:'old'})).status,400);
  assert.equal((await submit('person@example.com',{company:'bot'})).status,200);
  assert.equal((await submit('person@example.com',{}, {origin:'https://other.example'})).status,403);
  assert.equal(sent.length,0);
});
test('mail failure allows retry and does not leave an active subscription',async()=>{
  globalThis.fetch=async()=>new Response('provider error',{status:500});
  assert.equal((await submit()).status,502);
  assert.equal(sql.prepare('SELECT count(*) AS n FROM subscribers').get().n,0);
  delete env.RESEND_API_KEY; assert.equal((await submit()).status,503);
});
test('HTML signup works without JavaScript',async()=>{
  const response=await submit('person@example.com',{}, {accept:'text/html'});
  assert.match(response.headers.get('content-type'),/text\/html/);
  assert.match(await response.text(),/Check your inbox/);
});
test('downloads redirect even when measurement fails; HEAD and prefetch are not counted',async()=>{
  const tasks=[]; const context={env,request:request('/download/mac'),waitUntil:p=>tasks.push(p)};
  const response=download(context); assert.equal(response.status,302); assert.match(response.headers.get('location'),/Proof_0\.9\.2_universal\.dmg$/);
  await Promise.all(tasks); assert.equal(sql.prepare('SELECT count FROM daily_counts').get().count,1);
  download({...context,request:new Request('https://www.proof-photo.com/download/mac',{method:'HEAD'})});
  download({...context,request:request('/download/mac',undefined,{purpose:'prefetch'})});
  assert.equal(tasks.length,1);
  assert.equal(download({...context,env:{}}).status,302);
  assert.equal(download({...context,env:{DB:{prepare(){throw Error('offline');}}}}).status,302);
  await Promise.all(tasks);
  assert.equal(download({...context,request:request('/download/mac',{a:'b'})}).status,405);
});
test('reject missing and hostile release metadata',()=>{
  assert.throws(()=>validateRelease({}));
  const release=JSON.parse(readFileSync('data/release.json','utf8'));
  assert.equal(validateRelease(release),release);
  assert.throws(()=>validateRelease({...release,url:'https://attacker.example/Proof.dmg'}));
});
