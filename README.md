# flow

A static blog. Markdown in, HTML out, built with Bun and TypeScript. No client-side framework; a few lines of JS for copy buttons and the reading-progress rail.

```
bun install
bun run dev     # build + serve on http://localhost:3000, rebuilds on change
bun run build   # write dist/
bun test
```

## Writing a post

Add `posts/<slug>.md` with a front matter block:

```md
---
title: Why I stopped mocking the database
date: 2026-03-12
excerpt: One line shown on the home page and in the feed.
tags: testing, postgres
draft: false
---
```

- `## Headings` become entries in the side table of contents.
- Fenced code: ```` ```ts:src/file.ts ln ```` sets the language, a filename header, and line numbers.
- Callouts: a blockquote starting with `[!tip]`, `[!note]`, `[!warning]`, or `[!danger]`.
- Read time is computed from word count unless `readTime` is set.

Site-wide settings (title, URL, GitHub link, newsletter endpoint) live in `src/site.ts`. Charts and tables for richer posts are in `src/components/viz.tsx`.

## Deploy

`.github/workflows/pages.yml` builds and publishes `dist/` to GitHub Pages on every push to `main`. `BASE_PATH` is set to the repo name so links work under `https://<user>.github.io/<repo>/`.
