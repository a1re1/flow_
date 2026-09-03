---
title: Hello, world
date: 2026-09-02
excerpt: The first post. A smoke test for the build, the styles, and the deploy pipeline.
tags: meta
---

This is the first post on **flow**. It exists so the build has something to render, and so I can check that every piece of the pipeline works before writing anything real.

## The setup

The whole site is static HTML built by Bun. Markdown goes in `posts/`, the build turns it into pages, and a workflow pushes the result to GitHub Pages on every merge to `main`.

```bash
$ bun run build
built 1 post(s) → dist/
```

## What gets tested

Code blocks with a filename header and line numbers:

```ts:src/hello.ts ln
export function hello(name: string) {
  return `hello, ${name}`; // that's it
}
```

Callouts:

> [!tip]
> Callouts are just blockquotes that start with `[!tip]`, `[!note]`, `[!warning]`, or `[!danger]`.

Tables:

| step | tool | time |
| --- | --- | --- |
| build | bun | 40ms |
| deploy | actions | 30s |

## What's next

Real posts. This one stays as the canary.
