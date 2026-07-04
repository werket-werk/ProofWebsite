import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
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
  'support',
];

for (const entry of entries) {
  const source = join(projectRoot, entry);
  if (!existsSync(source)) continue;
  cpSync(source, join(distDir, entry), { recursive: true });
}
