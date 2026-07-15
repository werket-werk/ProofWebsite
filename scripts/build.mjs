import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const projectRoot = dirname(root);
const distDir = join(projectRoot, 'dist');

rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });

const entries = [
  'index.html',
  'robots.txt',
  'sitemap.xml',
  '_redirects',
  'assets',
  'privacy',
  'trust',
  'beta',
  'feedback',
  'release-notes',
  'photo-culling-app',
  'local-photo-library',
  'fujifilm-hif-to-heic',
  'support',
  'manual',
  'guide',
];

function copyEntry(source, destination) {
  const stat = statSync(source);
  if (stat.isDirectory()) {
    mkdirSync(destination, { recursive: true });
    for (const entry of readdirSync(source, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue;
      copyEntry(join(source, entry.name), join(destination, entry.name));
    }
    return;
  }

  cpSync(source, destination);
}

for (const entry of entries) {
  const source = join(projectRoot, entry);
  const destination = join(distDir, entry);
  if (!existsSync(source)) continue;
  copyEntry(source, destination);
}
