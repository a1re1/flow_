/** Figures for posts: table, bar chart, line chart, hand-drawn doodle. Ported from the design mock. */
import type { ReactNode, CSSProperties } from "react";
import { label, meta } from "./ds";

const mono: CSSProperties = { fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)" };
const fig: CSSProperties = { margin: "var(--space-5) 0" };

export function Caption({ n, children }: { n?: string; children: ReactNode }) {
  return <figcaption style={{ ...meta, letterSpacing: 0, marginTop: 8 }}>{n ? `${n} — ` : ""}{children}</figcaption>;
}

export function DataTable({ columns, rows, caption, n }: { columns: string[]; rows: string[][]; caption: string; n?: string }) {
  return (
    <figure style={fig}>
      <div style={{ border: "1px solid var(--line-1)", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", ...mono }}>
          <thead><tr>{columns.map((c, i) => <th key={i} style={{ ...label, fontWeight: 500, textAlign: i ? "right" : "left", padding: "10px 14px", borderBottom: "1px solid var(--line-1)", background: "var(--bg-1)" }}>{c}</th>)}</tr></thead>
          <tbody>{rows.map((r, ri) => <tr key={ri}>{r.map((c, i) => <td key={i} style={{ padding: "10px 14px", textAlign: i ? "right" : "left", borderBottom: ri < rows.length - 1 ? "1px solid var(--line-1)" : 0, color: i ? "var(--fg-1)" : "var(--fg-2)", fontVariantNumeric: "tabular-nums" }}>{c}</td>)}</tr>)}</tbody>
        </table>
      </div>
      <Caption n={n}>{caption}</Caption>
    </figure>
  );
}

export function BarChart({ data, unit = "", caption, n, highlight }: { data: { k: string; v: number }[]; unit?: string; caption: string; n?: string; highlight?: string }) {
  const max = Math.max(...data.map((d) => d.v));
  return (
    <figure style={fig}>
      <div style={{ border: "1px solid var(--line-1)", background: "var(--bg-1)", padding: "var(--space-4) var(--space-4) var(--space-3)", display: "grid", gridTemplateColumns: "max-content 1fr max-content", columnGap: 14, rowGap: 10, alignItems: "center", ...mono }}>
        {data.map((d) => {
          const hi = d.k === highlight;
          return [
            <span key={d.k + "k"} style={{ color: "var(--fg-2)" }}>{d.k}</span>,
            <div key={d.k + "b"} style={{ height: 14, background: "var(--bg-3)" }}><div style={{ height: "100%", width: `${(d.v / max) * 100}%`, background: hi ? "var(--accent-1)" : "var(--fg-3)" }} /></div>,
            <span key={d.k + "v"} style={{ color: hi ? "var(--accent-1)" : "var(--fg-1)", fontVariantNumeric: "tabular-nums" }}>{d.v}{unit}</span>,
          ];
        })}
      </div>
      <Caption n={n}>{caption}</Caption>
    </figure>
  );
}

export function LineChart({ series, labels, caption, n, unit }: { series: { k: string; v: number[]; accent?: boolean }[]; labels: string[]; caption: string; n?: string; unit?: string }) {
  const W = 600, H = 180, px = 36, py = 16;
  const max = Math.max(...series.flatMap((s) => s.v)), min = 0;
  const x = (i: number) => px + (i * (W - px * 2)) / (labels.length - 1);
  const y = (v: number) => H - py - ((v - min) / (max - min)) * (H - py * 2);
  const ticks = [0, 0.5, 1].map((t) => min + (max - min) * t);
  return (
    <figure style={fig}>
      <div style={{ border: "1px solid var(--line-1)", background: "var(--bg-1)", padding: "var(--space-3)" }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block", fontFamily: "var(--font-mono)", fontSize: 11 }}>
          {ticks.map((t) => <g key={t}><line x1={px} x2={W - px} y1={y(t)} y2={y(t)} stroke="var(--line-1)" /><text x={px - 8} y={y(t) + 4} textAnchor="end" fill="var(--fg-3)">{Math.round(t)}</text></g>)}
          {labels.map((l, i) => <text key={l} x={x(i)} y={H - 2} textAnchor="middle" fill="var(--fg-3)">{l}</text>)}
          {series.map((s) => (
            <g key={s.k}>
              <polyline fill="none" stroke={s.accent ? "var(--accent-1)" : "var(--fg-2)"} strokeWidth="1.5" strokeDasharray={s.accent ? undefined : "4 3"} points={s.v.map((v, i) => `${x(i)},${y(v)}`).join(" ")} />
              {s.v.map((v, i) => <rect key={i} x={x(i) - 2.5} y={y(v) - 2.5} width="5" height="5" fill={s.accent ? "var(--accent-1)" : "var(--fg-2)"} />)}
            </g>
          ))}
        </svg>
        <div style={{ display: "flex", gap: 16, padding: "6px 4px 0", ...meta, letterSpacing: 0 }}>
          {series.map((s) => <span key={s.k} style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 14, borderTop: `1.5px ${s.accent ? "solid" : "dashed"} ${s.accent ? "var(--accent-1)" : "var(--fg-2)"}` }} />{s.k}{unit ? ` (${unit})` : ""}</span>)}
        </div>
      </div>
      <Caption n={n}>{caption}</Caption>
    </figure>
  );
}

/** Hand-drawn style boxes and arrows (Kalam font). */
export function Doodle({ caption, n, children, viewBox = "0 0 600 220" }: { caption: string; n?: string; children: ReactNode; viewBox?: string }) {
  return (
    <figure style={fig}>
      <div style={{ border: "1px solid var(--line-1)", background: "var(--bg-1)" }}>
        <svg viewBox={viewBox} style={{ width: "100%", display: "block" }}>{children}</svg>
      </div>
      <Caption n={n}>{caption}</Caption>
    </figure>
  );
}
const stroke = { fill: "none", stroke: "#e4e4e7", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
export const doodle = {
  text: { fontFamily: "Kalam, cursive", fontSize: 15, fill: "#e4e4e7" } as CSSProperties,
  box: (x: number, y: number, w: number, h: number) => <path {...stroke} d={`M${x + 2} ${y}q${w / 2} -3 ${w - 3} 1 q4 ${h / 2} 1 ${h - 1} q-${w / 2} 3 -${w + 1} 0 q-3 -${h / 2} 0 -${h}`} />,
  arrow: (x1: number, y1: number, x2: number, y2: number) => <g {...stroke}><path d={`M${x1} ${y1} Q${(x1 + x2) / 2} ${(y1 + y2) / 2 - 6} ${x2} ${y2}`} /><path d={`M${x2 - 9} ${y2 - 6} L${x2} ${y2} L${x2 - 9} ${y2 + 5}`} /></g>,
};
