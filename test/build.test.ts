import { describe, expect, test } from "bun:test";
import { join } from "node:path";
import { build, OUT } from "../src/build";
import { loadPost, parseFrontMatter, renderMarkdown, slugify } from "../src/content";

describe("content", () => {
  test("front matter", () => {
    const { data, body } = parseFrontMatter("---\ntitle: Hi\ntags: a, b\n---\nbody");
    expect(data).toEqual({ title: "Hi", tags: "a, b" });
    expect(body).toBe("body");
  });
  test("slugify", () => expect(slugify("What I'd tell past me")).toBe("what-i-d-tell-past-me"));
  test("headings feed the toc and code blocks use the design system", () => {
    const { html, toc } = renderMarkdown("## The setup\n\n```ts:a.ts ln\nconst x = 1;\n```\n\n> [!tip]\n> hi\n");
    expect(toc).toEqual([["the-setup", "The setup"]]);
    expect(html).toContain('id="the-setup"');
    expect(html).toContain('class="codeblock has-head"');
    expect(html).toContain("a.ts");
    expect(html).toContain('class="callout"');
  });
  test("read time is derived from word count", () => {
    const p = loadPost("x", "---\ntitle: X\ndate: 2026-01-04\n---\n" + "word ".repeat(600));
    expect(p.minutes).toBe(3);
    expect(p.dateLabel).toBe("4 Jan 2026");
  });
});

describe("build", () => {
  test("writes the hello world page", async () => {
    const posts = await build();
    expect(posts.some((p) => p.slug === "hello-world")).toBe(true);
    const home = await Bun.file(join(OUT, "index.html")).text();
    expect(home).toContain("Hello, world");
    expect(home).toContain("flow_");
    const post = await Bun.file(join(OUT, "posts/hello-world/index.html")).text();
    expect(post).toContain('class="side-toc"');
    expect(await Bun.file(join(OUT, "404.html")).exists()).toBe(true);
    expect(await Bun.file(join(OUT, "feed.xml")).exists()).toBe(true);
    expect(await Bun.file(join(OUT, "assets/site.js")).exists()).toBe(true);
  });
});
