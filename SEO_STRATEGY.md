# Proof Website SEO Strategy

Last reviewed: 2026-07-08.

## Positioning

Proof should rank around current, truthful product strengths:

- Mac photo culling app
- Local photo library for Mac
- Non-destructive photo culling workflow
- Fujifilm HIF to HEIC workflow on Mac
- Signed and notarized Mac photo app

The site should not chase keywords for features that are hidden, experimental, or not ready in the current app.

## Executed In This Pass

- Added high-intent landing page: `/photo-culling-app/`
- Added high-intent landing page: `/local-photo-library/`
- Added long-tail workflow page: `/fujifilm-hif-to-heic/`
- Added crawlable internal links from the homepage and shared footer navigation.
- Added the new URLs to `sitemap.xml`.
- Added the new directories to `scripts/build.mjs`.
- Expanded homepage structured data for the actual app offer and publisher.
- Added FAQ structured data to the support page using only visible FAQ content.
- Added Open Graph and Twitter metadata to the privacy page for metadata consistency.

## Technical SEO Baseline

- Every indexable page should have one unique `<title>`, one useful `<meta name="description">`, one canonical URL, and crawlable internal links.
- The sitemap should list canonical public URLs only.
- `robots.txt` should allow the public site and point crawlers at `https://www.proof-photo.com/sitemap.xml`.
- Structured data must match visible page content. Do not invent ratings, reviews, awards, or pricing claims.

## Content Roadmap

Next pages should be added only when the current product can support the claims:

- `/photo-culling-workflow/` for a step-by-step educational article around import, cull, compare, export, and backup.
- `/lightroom-alternative-for-culling/` only if framed carefully as a focused culling companion, not a full Lightroom replacement.
- `/mac-photo-organizer/` if the site can explain folders, collections, keywords, filters, move/rename, and local catalog behavior in detail.
- `/raw-photo-culling/` after confirming current RAW display/export limits and avoiding Develop claims that are not visible in the shipping app.

## Measurement

- Submit `sitemap.xml` in Google Search Console after deployment.
- Use URL Inspection for the homepage and the three new landing pages.
- Run Rich Results Test for the support page FAQ structured data.
- Validate homepage app structured data syntax without inventing ratings or reviews just to qualify for app rich results.
- Track impressions and clicks for queries containing `photo culling app mac`, `mac photo culling`, `local photo library mac`, `fujifilm hif heic`, and `proof photo app`.
