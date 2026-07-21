import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = dirname(scriptDir);
const outputPath = join(projectRoot, 'release-notes', 'index.html');
const rawChangelogUrl = process.env.PROOF_CHANGELOG_URL || 'https://raw.githubusercontent.com/werket-werk/Proof/main/CHANGELOG.md';

const changelogCandidates = process.env.PROOF_CHANGELOG_PATH
  ? [process.env.PROOF_CHANGELOG_PATH]
  : [join(projectRoot, '..', 'Proof', 'CHANGELOG.md')];

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

  try {
    const response = await fetch(rawChangelogUrl);
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    return {
      markdown: await response.text(),
      source: rawChangelogUrl,
    };
  } catch (error) {
    if (existsSync(outputPath)) {
      console.log(`Release notes source unavailable (${error.message}); using existing ${outputPath}`);
      return null;
    }

    throw new Error(`Could not fetch ${rawChangelogUrl}: ${error.message}`);
  }
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
  <link rel="stylesheet" href="../assets/css/style.css?v=20260719-premium-home">
  <link rel="icon" href="../assets/img/icon.png" type="image/png">
</head>
<body>
  <a class="skip-link" href="#main-content">Skip to content</a>
  <header>
    <nav class="site-nav" aria-label="Main navigation">
      <div class="container nav-inner">
        <a href="/" class="nav-logo" aria-label="Proof home">
          <img src="../assets/img/icon.png" alt="" aria-hidden="true" width="28" height="28">
          <span>Proof</span>
        </a>
        <ul class="nav-links" id="nav-links">
          <li><a href="/#features">Product</a></li>
          <li><a href="/#demo">Watch</a></li>
          <li><a href="/guide/">Guide</a></li>
          <li><a href="/support/">Support</a></li>
          <li><a class="nav-store-link" href="https://store.proof-photo.com" target="_blank" rel="noreferrer">Try Proof</a></li>
        </ul>
        <button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="nav-links">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  </header>

  <main id="main-content">
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
      <div class="footer-inner">
        <div class="footer-brand">
          <a href="/" class="nav-logo" aria-label="Proof home"><img src="../assets/img/icon.png" alt="" aria-hidden="true" width="28" height="28"><span>Proof</span></a>
          <p>An ultra-fast, lightweight, local photo culling app for Mac &amp; iPad.</p>
        </div>
        <nav class="footer-links" aria-label="Footer navigation">
          <section class="footer-col" aria-labelledby="footer-product"><h2 id="footer-product">Product</h2><ul><li><a href="/#features">Product</a></li><li><a href="/#demo">Watch</a></li><li><a href="/guide/">Guide</a></li><li><a href="/manual/">Manual</a></li><li><a href="/release-notes/">Release Notes</a></li></ul></section>
          <section class="footer-col" aria-labelledby="footer-explore"><h2 id="footer-explore">Explore</h2><ul><li><a href="/photo-culling-app/">Photo Culling</a></li><li><a href="/local-photo-library/">Local Library</a></li><li><a href="/fujifilm-hif-to-heic/">Fujifilm HIF</a></li></ul></section>
          <section class="footer-col" aria-labelledby="footer-trust"><h2 id="footer-trust">Trust</h2><ul><li><a href="/beta/">Beta</a></li><li><a href="/feedback/">Feedback</a></li><li><a href="/support/">Support</a></li><li><a href="/trust/">Security &amp; Trust</a></li><li><a href="/privacy/">Privacy</a></li></ul></section>
        </nav>
      </div>
      <div class="footer-bottom"><p>© 2026 Erik Sawaya. Made in Australia.</p></div>
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
    const closeMenu = (returnFocus = false) => {
      if (!links.classList.contains('open')) return;
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      if (returnFocus) toggle.focus();
    };
    links.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu(true);
    });
  </script>
</body>
</html>
`;
}

const changelog = await readChangelog();

if (changelog) {
  const { intro, introLineIndex } = extractIntro(changelog.markdown);
  const bodyHtml = markdownToHtml(changelog.markdown, { skipLineIndex: introLineIndex });

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, pageTemplate({ intro, bodyHtml }));
  console.log(`Generated release notes from ${changelog.source}`);
}
