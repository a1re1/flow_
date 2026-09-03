/** The three screens: home, post, 404. */
import type { Post } from "../content";
import { site } from "../site";
import { Button, CodeBlock, PostCard, meta } from "./ds";
import { Layout, Page, Subscribe } from "./shell";

export function Home({ posts, base }: { posts: Post[]; base: string }) {
  return (
    <Layout title={site.title} description={site.description} route="home" base={base}>
      <Page>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {posts.map((p) => <PostCard key={p.slug} href={`${base}posts/${p.slug}/`} title={p.title} excerpt={p.excerpt} date={p.dateLabel} readTime={p.readTime} tags={p.tags} />)}
          {posts.length === 0 && <p style={{ color: "var(--fg-3)", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)" }}>nothing here yet_</p>}
        </div>
      </Page>
    </Layout>
  );
}

function SideToc({ items, minutes }: { items: [string, string][]; minutes: number }) {
  if (items.length === 0) return null;
  return (
    <nav className="side-toc" aria-label="Contents" data-minutes={minutes}>
      {items.map(([id, t], i) => <a key={id} href={`#${id}`} className={i === 0 ? "on" : ""}><span className="dash" /><span className="lbl">{t}</span></a>)}
      <div className="progress"><div className="track"><div className="fill" style={{ width: "0%" }} /></div><span className="lbl" data-left>{minutes} min left</span></div>
      <div className="top-progress" aria-hidden="true"><div className="fill" style={{ width: "0%" }} /><span className="lbl" data-left>{minutes} min left</span></div>
    </nav>
  );
}

function NavLink({ post, dir, base }: { post?: Post; dir: "prev" | "next"; base: string }) {
  if (!post) return <span style={{ flex: 1 }} />;
  return (
    <a href={`${base}posts/${post.slug}/`} className="plain" style={{ color: "var(--fg-1)", display: "flex", flexDirection: "column", gap: 4, textAlign: dir === "next" ? "right" : "left", flex: 1, minWidth: 0 }}>
      <span style={meta}>{dir === "prev" ? "← older" : "newer →"}</span>
      <span style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>{post.title}</span>
    </a>
  );
}

export function PostPage({ post, prev, next, base }: { post: Post; prev?: Post; next?: Post; base: string }) {
  return (
    <Layout title={`${post.title} · ${site.title}`} description={post.excerpt} route="post" base={base}>
      <Page>
        <a href={base} className="plain" style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)", color: "var(--fg-2)" }}>← all posts</a>
        <div style={{ ...meta, marginTop: "var(--space-6)" }}>{post.dateLabel} · {post.readTime}</div>
        <h1 className="post-title" style={{ margin: "10px 0 var(--space-6)", fontWeight: 600, letterSpacing: "var(--tracking-tight)", lineHeight: "var(--leading-tight)" }}>{post.title}</h1>
        <SideToc items={post.toc} minutes={post.minutes} />
        <article className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />
        <div className="prev-next" style={{ marginTop: "var(--space-8)", paddingTop: "var(--space-5)", borderTop: "1px solid var(--line-1)", display: "flex", justifyContent: "space-between", gap: "var(--space-6)" }}>
          <NavLink post={prev} dir="prev" base={base} /><NavLink post={next} dir="next" base={base} />
        </div>
        <Subscribe base={base} />
      </Page>
    </Layout>
  );
}

export function NotFound({ base }: { base: string }) {
  const host = new URL(site.url).host;
  return (
    <Layout title={`Nothing here · ${site.title}`} route="404" base={base}>
      <Page>
        <div style={{ ...meta, marginBottom: 10 }}>404</div>
        <h1 className="post-title" style={{ margin: 0, fontWeight: 600, letterSpacing: "var(--tracking-tight)", lineHeight: "var(--leading-tight)" }}>Nothing here</h1>
        <p style={{ margin: "var(--space-4) 0 var(--space-6)", color: "var(--fg-2)" }}>The page moved, or I never wrote it. Either way it's not at this URL.</p>
        <CodeBlock language="bash" code={`$ curl -I ${host}/this-page\nHTTP/2 404\n$ _`} />
        <div style={{ marginTop: "var(--space-6)" }}><Button variant="secondary" href={base}>← all posts</Button></div>
      </Page>
    </Layout>
  );
}
