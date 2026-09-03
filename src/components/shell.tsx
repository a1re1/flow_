/** Page chrome: nav, footer, layout, newsletter block. */
import type { ReactNode } from "react";
import { site } from "../site";
import { Button, Input, label, meta } from "./ds";

export type Route = "home" | "post" | "404";

export function Nav({ route, base }: { route: Route; base: string }) {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 20, background: "var(--surface-page)", borderBottom: "1px solid var(--line-1)" }}>
      <div style={{ maxWidth: "var(--content-width)", margin: "0 auto", padding: "0 var(--gutter)", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href={base} className="plain" style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--fg-1)" }}>
          <span style={{ color: "var(--accent-1)" }}>&gt;</span> {site.title}_
        </a>
        <nav style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <a className={`nav-link${route === "home" ? " on" : ""}`} href={base}>Posts</a>
          <a className="nav-link" href={`${base}feed.xml`}>RSS ↗</a>
        </nav>
      </div>
    </header>
  );
}

export function Footer({ base }: { base: string }) {
  return (
    <footer style={{ borderTop: "1px solid var(--line-1)", marginTop: "var(--space-9)" }}>
      <div style={{ maxWidth: "var(--content-width)", margin: "0 auto", padding: "var(--space-5) var(--gutter)", display: "flex", justifyContent: "space-between", gap: 16, ...meta }}>
        <span>© {site.year} {site.title}</span>
        <span style={{ display: "flex", gap: 16 }}>
          <a href={site.github} className="plain" style={{ color: "var(--fg-3)" }}>github ↗</a>
          <a href={`${base}feed.xml`} className="plain" style={{ color: "var(--fg-3)" }}>rss ↗</a>
        </span>
      </div>
    </footer>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return <main className="page">{children}</main>;
}

export function Subscribe({ base }: { base: string }) {
  return (
    <div style={{ marginTop: "var(--space-8)", paddingTop: "var(--space-5)", borderTop: "1px solid var(--line-1)" }}>
      <div style={label}>newsletter</div>
      <p style={{ margin: "8px 0 var(--space-4)", color: "var(--fg-2)", fontSize: "var(--text-sm)" }}>
        One email per post, no more. Or grab the <a href={`${base}feed.xml`}>RSS feed</a>.
      </p>
      {site.subscribeUrl && (
        <form className="sub-row" method="post" action={site.subscribeUrl} style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}><Input name="email" type="email" placeholder="you@example.com" /></div>
          <Button type="submit">Subscribe</Button>
        </form>
      )}
    </div>
  );
}

export function Layout({ title, description, route, base, children }: { title: string; description?: string; route: Route; base: string; children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        <link rel="alternate" type="application/rss+xml" title={site.title} href={`${base}feed.xml`} />
        <link rel="stylesheet" href={`${base}assets/site.css`} />
      </head>
      <body>
        <Nav route={route} base={base} />
        {children}
        <Footer base={base} />
        <script src={`${base}assets/site.js`} defer />
      </body>
    </html>
  );
}
