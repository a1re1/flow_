/** Design-system primitives, ported from the Claude Design bundle to static TSX. */
import type { ReactNode, CSSProperties } from "react";

export const meta: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text-xs)",
  letterSpacing: "var(--tracking-wide)",
  color: "var(--fg-3)",
};
export const label: CSSProperties = { ...meta, textTransform: "uppercase" };

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export function Button({
  variant = "primary",
  size = "md",
  href,
  type,
  children,
}: {
  variant?: Variant;
  size?: Size;
  href?: string;
  type?: "submit" | "button";
  children: ReactNode;
}) {
  const cls = `btn btn-${variant}${size !== "md" ? ` btn-${size}` : ""}`;
  if (href) return <a className={cls} href={href}>{children}</a>;
  return <button className={cls} type={type ?? "button"}>{children}</button>;
}

export function Input(props: { name: string; placeholder?: string; type?: string; label?: string }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: "var(--text-sm)", color: "var(--fg-2)" }}>
      {props.label}
      <input className="input" name={props.name} type={props.type ?? "text"} placeholder={props.placeholder} />
    </label>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", height: 24, padding: "0 10px", border: "1px solid var(--line-1)", color: "var(--fg-2)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)" }}>
      #{children}
    </span>
  );
}

export function PostCard({ href, title, excerpt, date, readTime, tags = [] }: { href: string; title: string; excerpt?: string; date: string; readTime?: string; tags?: string[] }) {
  return (
    <a className="card hoverable" href={href}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={meta}>{date}{readTime ? ` · ${readTime}` : ""}</div>
        <div style={{ fontSize: "var(--text-lg)", fontWeight: 600, letterSpacing: "var(--tracking-tight)", lineHeight: "var(--leading-snug)", color: "var(--fg-1)" }}>{title}</div>
        {excerpt && <p style={{ margin: 0, color: "var(--fg-2)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>{excerpt}</p>}
        {tags.length > 0 && <div style={{ display: "flex", gap: 6, marginTop: 4 }}>{tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>}
      </div>
    </a>
  );
}

const TONES: Record<string, [string, string]> = {
  note: ["var(--info)", "note"],
  tip: ["var(--accent-1)", "tip"],
  warning: ["var(--warning)", "warning"],
  danger: ["var(--danger)", "danger"],
};
export function Callout({ tone = "note", title, children, html }: { tone?: string; title?: string; children?: ReactNode; html?: string }) {
  const [color, def] = TONES[tone] ?? TONES.note;
  return (
    <div className="callout">
      <div className="callout-title" style={{ color }}>{title || def}</div>
      {html ? <div className="callout-body" dangerouslySetInnerHTML={{ __html: html }} /> : <div className="callout-body">{children}</div>}
    </div>
  );
}

/* Tiny regex highlighter, identical to the design system's CodeBlock. */
const RE = /(\/\/.*$|#.*$)|("[^"]*"|'[^']*'|`[^`]*`)|\b(\d+\.?\d*)\b|\b([A-Za-z_]\w*)(?=\()|\b(const|let|var|function|return|if|else|for|while|import|from|export|default|async|await|class|new|fn|pub|struct|impl|def|match|use|mut|type|interface)\b/gm;
function hl(line: string): ReactNode[] {
  const out: ReactNode[] = [];
  let i = 0;
  let m: RegExpExecArray | null;
  RE.lastIndex = 0;
  while ((m = RE.exec(line))) {
    if (m.index > i) out.push(line.slice(i, m.index));
    const c = m[1] ? "var(--syn-comment)" : m[2] ? "var(--syn-string)" : m[3] ? "var(--syn-number)" : m[4] ? "var(--syn-function)" : "var(--syn-keyword)";
    out.push(<span key={m.index} style={{ color: c, fontStyle: m[1] ? "italic" : "normal" }}>{m[0]}</span>);
    i = m.index + m[0].length;
  }
  if (i < line.length) out.push(line.slice(i));
  return out;
}

export function CodeBlock({ code = "", language, filename, lineNumbers, highlight = true }: { code?: string; language?: string; filename?: string; lineNumbers?: boolean; highlight?: boolean }) {
  const lines = code.replace(/\n$/, "").split("\n");
  const head = Boolean(filename || language);
  return (
    <div className={`codeblock${head ? " has-head" : ""}`}>
      {head && (
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 14px", borderBottom: "1px solid var(--line-1)", fontSize: "var(--text-xs)", color: "var(--fg-3)", letterSpacing: "var(--tracking-wide)" }}>
          <span>{filename || ""}</span><span>{language || ""}</span>
        </div>
      )}
      <button className="copy" type="button" data-copy aria-label="Copy code">copy</button>
      <pre>
        {lines.map((l, i) => (
          <div key={i} style={{ display: "flex", gap: 16 }}>
            {lineNumbers && <span className="ln">{i + 1}</span>}
            <span style={{ whiteSpace: "pre" }}>{highlight ? hl(l) : l}{l === "" ? " " : ""}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}
