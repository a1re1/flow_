/** Markdown posts in ./posts with a small front matter block. */
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { Marked, type Tokens } from "marked";
import { renderToStaticMarkup } from "react-dom/server";
import { Callout, CodeBlock } from "./components/ds";

export type Post = {
  slug: string;
  title: string;
  date: Date;
  dateLabel: string;
  readTime: string;
  minutes: number;
  excerpt: string;
  tags: string[];
  draft: boolean;
  html: string;
  toc: [string, string][];
};

export function parseFrontMatter(src: string): { data: Record<string, string>; body: string } {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(src);
  if (!m) return { data: {}, body: src };
  const data: Record<string, string> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["'](.*)["']$/, "$1");
  }
  return { data, body: src.slice(m[0].length) };
}

export function slugify(s: string): string {
  return s.toLowerCase().replace(/<[^>]+>/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function formatDate(d: Date): string {
  return `${d.getUTCDate()} ${d.toLocaleString("en-GB", { month: "short", timeZone: "UTC" })} ${d.getUTCFullYear()}`;
}

/** Render markdown to HTML using the design system's code block and callout. */
export function renderMarkdown(body: string): { html: string; toc: [string, string][] } {
  const toc: [string, string][] = [];
  const md = new Marked({ gfm: true });
  md.use({
    renderer: {
      code({ text, lang }: Tokens.Code) {
        // ```lang:filename  or  ```lang filename  — optional "ln" flag enables line numbers.
        const parts = (lang ?? "").split(/[:\s]+/).filter(Boolean);
        const language = parts[0];
        const lineNumbers = parts.includes("ln");
        const filename = parts.slice(1).find((p) => p !== "ln");
        return renderToStaticMarkup(CodeBlock({ code: text, language, filename, lineNumbers }));
      },
      heading({ tokens, depth }: Tokens.Heading) {
        const inner = this.parser.parseInline(tokens);
        const id = slugify(inner);
        if (depth === 2) toc.push([id, inner.replace(/<[^>]+>/g, "")]);
        return `<h${depth} id="${id}">${inner}</h${depth}>\n`;
      },
      blockquote({ tokens }: Tokens.Blockquote) {
        // > [!tip] Title  → Callout. Plain quotes stay plain.
        const inner = this.parser.parse(tokens);
        const m = /^<p>\[!(\w+)\]\s*([^<\n]*)(?:<br>|\n)?/.exec(inner);
        if (!m) return `<blockquote>${inner}</blockquote>\n`;
        const html = inner.replace(m[0], "<p>").replace(/<p><\/p>/, "");
        return renderToStaticMarkup(Callout({ tone: m[1].toLowerCase(), title: m[2].trim() || undefined, html }));
      },
    },
  });
  return { html: md.parse(body) as string, toc };
}

export function loadPost(slug: string, src: string): Post {
  const { data, body } = parseFrontMatter(src);
  const { html, toc } = renderMarkdown(body);
  const words = body.split(/\s+/).filter(Boolean).length;
  const minutes = data.readTime ? parseInt(data.readTime, 10) || 1 : Math.max(1, Math.round(words / 200));
  const date = data.date ? new Date(data.date) : new Date(0);
  return {
    slug,
    title: data.title ?? slug,
    date,
    dateLabel: formatDate(date),
    readTime: `${minutes} min`,
    minutes,
    excerpt: data.excerpt ?? "",
    tags: data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    draft: data.draft === "true",
    html,
    toc,
  };
}

export async function loadPosts(dir: string): Promise<Post[]> {
  const files = (await readdir(dir)).filter((f) => f.endsWith(".md"));
  const posts = await Promise.all(files.map(async (f) => loadPost(f.replace(/\.md$/, ""), await Bun.file(join(dir, f)).text())));
  return posts.filter((p) => !p.draft).sort((a, b) => b.date.getTime() - a.date.getTime());
}
