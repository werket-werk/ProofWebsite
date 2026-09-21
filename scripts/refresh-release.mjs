import { readFileSync, writeFileSync, renameSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { validateRelease } from '../lib/release.js';
const root = fileURLToPath(new URL('../', import.meta.url));
const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'ProofWebsite-release-sync' };
if (process.env.GH_TOKEN) headers.Authorization = `Bearer ${process.env.GH_TOKEN}`;
async function github(path) {
  const response = await fetch(`https://api.github.com/repos/werket-werk/${path}`, { headers });
  if (!response.ok) throw new Error(`Release refresh failed: GitHub HTTP ${response.status}`);
  return response.json();
}
// Complete all remote validation before replacing the checked-in last-known-good data.
const release = await github('proof-releases/releases/latest');
if (release.draft || release.prerelease) throw new Error('Expected a published release');
const version = release.tag_name.replace(/^v/, '');
const asset = release.assets.find(a => a.name === `Proof_${version}_universal.dmg` && a.state === 'uploaded');
if (!asset) throw new Error('Universal DMG missing');
const snapshot = validateRelease({ version, tag: release.tag_name, publishedAt: release.published_at, url: asset.browser_download_url, size: asset.size, sha256: asset.digest?.replace(/^sha256:/, ''), changelogSource: `https://github.com/werket-werk/Proof/blob/${release.tag_name}/CHANGELOG.md` });
const source = await github(`Proof/contents/CHANGELOG.md?ref=${encodeURIComponent(release.tag_name)}`);
const markdown = Buffer.from(source.content, 'base64').toString('utf8');
const heading = markdown.match(/^## (.+)$/m)?.[1];
if (heading !== version) throw new Error('Tagged changelog does not start with the public release');
const assetCheck = await fetch(snapshot.url, { method: 'HEAD' });
if (!assetCheck.ok) throw new Error('Public DMG unavailable');
writeFileSync(`${root}data/release.json.tmp`, JSON.stringify(snapshot, null, 2) + '\n');
writeFileSync(`${root}data/changelog.md.tmp`, markdown);
renameSync(`${root}data/changelog.md.tmp`, `${root}data/changelog.md`);
renameSync(`${root}data/release.json.tmp`, `${root}data/release.json`);
console.log(`Verified public release ${version}`);
