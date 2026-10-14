import { readFileSync, writeFileSync } from 'node:fs';
import { validateRelease } from '../lib/release.js';
const source = new URL('../data/release.json', import.meta.url);
const release = JSON.parse(readFileSync(source, 'utf8'));
validateRelease(release);
writeFileSync(new URL('../data/release-metadata.js', import.meta.url), '// Generated from release.json. Do not edit directly.\nexport default ' + JSON.stringify(release, null, 2) + ';\n');
