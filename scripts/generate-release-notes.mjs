import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = dirname(scriptDir);
const outputPath = join(projectRoot, 'release-notes', 'index.html');
const rawChangelogUrl = process.env.PROOF_CHANGELOG_URL || 'https://raw.githubusercontent.com/werket-werk/Proof/main/CHANGELOG.md';

const changelogCandidates = [
  process.env.PROOF_CHANGELOG_PATH,
  join(projectRoot, '..', 'Proof', 'CHANGELOG.md'),
  '/Users/eriksawaya/Desktop/Proof/CHANGELOG.md',
].filter(Boolean);

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function renderInline(value) {
  let rendered = escapeHtml(value);
  rendered = rendered.replace(/`([^`]+)`/g, '<code>$1</code>');
  rendered = rendered.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return rendered;
}

function flushParagraph(paragraph, html) {
  if (!paragraph.length) return;
  html.push(`      <p>${renderInline(paragraph.join(' '))}</p>`);
  paragraph.length = 0;
}

function flushList(listItems, html) {
  if (!listItems.length) return;
  html.push('      <ul>');
  for (const item of listItems) {
    html.push(`        <li>${renderInline(item)}</li>`);
  }
  html.push('      </ul>');
  listItems.length = 0;
}

function markdownToHtml(markdown, { skipLineIndex } = {}) {
  const html = [];
  const paragraph = [];
  const listItems = [];
  const lines = markdown.split(/\r?\n/);

  for (const [index, line] of lines.entries()) {
    if (index === skipLineIndex) continue;

    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph(paragraph, html);
      flushList(listItems, html);
      continue;
    }

    if (trimmed.startsWith('# ')) {
      continue;
    }

    const heading = /^(#{2,3})\s+(.+)$/.exec(trimmed);
    if (heading) {
      flushParagraph(paragraph, html);
      flushList(listItems, html);
      const level = heading[1].length;
      html.push(`      <h${level}>${renderInline(heading[2])}</h${level}>`);
      continue;
    }

    const boldHeading = /^\*\*([^*]+)\*\*$/.exec(trimmed);
    if (boldHeading) {
      flushParagraph(paragraph, html);
      flushList(listItems, html);
      html.push(`      <h3>${renderInline(boldHeading[1])}</h3>`);
      continue;
    }

    if (trimmed.startsWith('- ')) {
      flushParagraph(paragraph, html);
      listItems.push(trimmed.slice(2));
      continue;
    }

    paragraph.push(trimmed);
  }

  flushParagraph(paragraph, html);
  flushList(listItems, html);
  return html.join('\n');
}

function extractIntro(markdown) {
  const lines = markdown.split(/\r?\n/);
  const title = lines.find((line) => line.startsWith('# '))?.replace(/^#\s+/, '').trim() || 'Release Notes';
  const introLineIndex = lines.findIndex((line) => {
    const trimmed = line.trim();
    return trimmed && !trimmed.startsWith('#');
  });
  const intro = introLineIndex >= 0
    ? lines[introLineIndex].trim()
    : 'All notable changes to Proof are documented here. Newest releases first.';
  return { intro, introLineIndex };
}

async function readChangelog() {
  for (const candidate of changelogCandidates) {
    const resolved = resolve(candidate);
    if (existsSync(resolved)) {
      return {
        markdown: readFileSync(resolved, 'utf8'),
        source: resolved,
      };
    }
  }

  const response = await fetch(rawChangelogUrl);
  if (!response.ok) {
    throw new Error(`Could not fetch ${rawChangelogUrl}: ${response.status} ${response.statusText}`);
  }

  return {
    markdown: await response.text(),
    source: rawChangelogUrl,
  };
}

function pageTemplate({ intro, bodyHtml }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Release Notes — Proof for Mac</title>
  <meta name="description" content="Read the latest Proof for Mac release notes, including stability improvements, fixes, update support, and earlier beta changes.">
  <link rel="canonical" href="https://www.proof-photo.com/release-notes/">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Release Notes — Proof for Mac">
  <meta property="og:description" content="Latest Proof for Mac updates, fixes, reliability improvements, and beta development notes.">
  <meta property="og:url" content="https://www.proof-photo.com/release-notes/">
  <meta property="og:image" content="https://www.proof-photo.com/assets/img/icon.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Release Notes — Proof for Mac">
  <meta name="twitter:description" content="Latest Proof for Mac updates, fixes, reliability improvements, and beta development notes.">
  <meta name="twitter:image" content="https://www.proof-photo.com/assets/img/icon.png">
  <link rel="stylesheet" href="../assets/css/style.css">
  <link rel="icon" href="../assets/img/icon.png" type="image/png">
</head>
<body>
  <header>
    <nav class="site-nav" aria-label="Main navigation">
      <div class="container nav-inner">
        <a href="/" class="nav-logo" aria-label="Proof home">
          <img src="../assets/img/icon.png" alt="" aria-hidden="true" width="28" height="28">
          <span>Proof</span>
        </a>
        <ul class="nav-links" id="nav-links">
          <li><a href="/#features">Features</a></li>
          <li><a href="/#screenshots">Screenshots</a></li>
          <li><a href="/#develop">Develop</a></li>
          <li><a href="/guide/">Guide</a></li>
          <li><a href="/support/">Support</a></li>
          <li><a href="/#download">Download</a></li>
        </ul>
        <button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="nav-links">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  </header>

  <main>
    <div class="page-hero">
      <div class="container">
        <h1>Release Notes</h1>
        <p>${renderInline(intro)}</p>
      </div>
    </div>

    <div class="page-content">
${bodyHtml}
    </div>
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-bottom">
        <p>© 2026 Erik Sawaya. All rights reserved.</p>
        <nav aria-label="Footer links">
          <a href="/">Home</a> &nbsp;·&nbsp;
          <a href="/photo-culling-app/">Photo Culling App</a> &nbsp;·&nbsp;
          <a href="/local-photo-library/">Local Photo Library</a> &nbsp;·&nbsp;
          <a href="/fujifilm-hif-to-heic/">Fujifilm HIF to HEIC</a> &nbsp;·&nbsp;
          <a href="/guide/">User Guide</a> &nbsp;·&nbsp;
          <a href="/manual/">User Manual</a> &nbsp;·&nbsp;
          <a href="/beta/">Beta &amp; Contributions</a> &nbsp;·&nbsp;
          <a href="/release-notes/">Release Notes</a> &nbsp;·&nbsp;
          <a href="/support/">Support</a> &nbsp;·&nbsp;
          <a href="/trust/">Security &amp; Trust</a> &nbsp;·&nbsp;
          <a href="/privacy/">Privacy Policy</a>
        </nav>
      </div>
    </div>
  </footer>

  <script>
    const nav = document.querySelector('.site-nav');
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });

    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
  </script>
</body>
</html>
`;
}

const { markdown, source } = await readChangelog();
const { intro, introLineIndex } = extractIntro(markdown);
const bodyHtml = markdownToHtml(markdown, { skipLineIndex: introLineIndex });

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, pageTemplate({ intro, bodyHtml }));
console.log(`Generated release notes from ${source}`);
