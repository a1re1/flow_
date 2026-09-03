/** Static site build: posts/*.md → dist/. Run with `bun run build`. */
import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { Home, NotFound, PostPage } from "./components/pages";
import { loadPosts, type Post } from "./content";
import { site } from "./site";

const ROOT = join(import.meta.dir, "..");
export const OUT = join(ROOT, "dist");
/** Path prefix the site is served from, e.g. "/flow_/" on GitHub Pages. */
export const BASE = (process.env.BASE_PATH ?? "/").replace(/\/?$/, "/");

function page(node: React.ReactElement): string {
  return "<!doctype html>\n" + renderToStaticMarkup(node);
}

async function write(rel: string, content: string | Blob) {
  const path = join(OUT, rel);
  await mkdir(join(path, ".."), { recursive: true });
  await Bun.write(path, content);
}

function rss(posts: Post[]): string {
  const esc = (s: string) => s.replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[c]!);
  const items = posts.map((p) => `  <item>
    <title>${esc(p.title)}</title>
    <link>${site.url}/posts/${p.slug}/</link>
    <guid>${site.url}/posts/${p.slug}/</guid>
    <pubDate>${p.date.toUTCString()}</pubDate>
    <description>${esc(p.excerpt)}</description>
  </item>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>${esc(site.title)}</title>
  <link>${site.url}/</link>
  <description>${esc(site.description)}</description>
${items}
</channel></rss>
`;
}

export async function build(): Promise<Post[]> {
  const posts = await loadPosts(join(ROOT, "posts"));
  await rm(OUT, { recursive: true, force: true });

  await write("index.html", page(<Home posts={posts} base={BASE} />));
  await write("404.html", page(<NotFound base={BASE} />));
  for (const [i, p] of posts.entries()) {
    await write(`posts/${p.slug}/index.html`, page(<PostPage post={p} prev={posts[i + 1]} next={posts[i - 1]} base={BASE} />));
  }
  await write("feed.xml", rss(posts));

  const css = [await Bun.file(join(ROOT, "src/styles/tokens.css")).text(), await Bun.file(join(ROOT, "src/styles/site.css")).text()].join("\n");
  await write("assets/site.css", css);
  const js = await Bun.build({ entrypoints: [join(ROOT, "src/client/site.ts")], minify: true, target: "browser" });
  if (!js.success) throw new Error(js.logs.map(String).join("\n"));
  await write("assets/site.js", await js.outputs[0].text());
  await write(".nojekyll", "");
  return posts;
}

if (import.meta.main) {
  const posts = await build();
  console.log(`built ${posts.length} post(s) → dist/ (base ${BASE})`);
}
