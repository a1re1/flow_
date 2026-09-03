/** Progressive enhancement: copy buttons and the reading-progress table of contents. */
for (const btn of document.querySelectorAll<HTMLButtonElement>("[data-copy]")) {
  btn.addEventListener("click", () => {
    const pre = btn.parentElement?.querySelector("pre");
    const text = pre ? Array.from(pre.children, (row) => (row.lastElementChild as HTMLElement).innerText).join("\n") : "";
    navigator.clipboard?.writeText(text).catch(() => {});
    btn.textContent = "copied";
    btn.classList.add("copied");
    setTimeout(() => { btn.textContent = "copy"; btn.classList.remove("copied"); }, 1200);
  });
}

const toc = document.querySelector<HTMLElement>(".side-toc");
if (toc) {
  const links = Array.from(toc.querySelectorAll<HTMLAnchorElement>("a[href^='#']"));
  const fills = toc.querySelectorAll<HTMLElement>(".fill");
  const lefts = toc.querySelectorAll<HTMLElement>("[data-left]");
  const total = Number(toc.dataset.minutes) || 5;
  const update = () => {
    let cur = links[0];
    for (const a of links) {
      const el = document.getElementById(a.hash.slice(1));
      if (el && el.getBoundingClientRect().top - 120 <= 0) cur = a;
    }
    for (const a of links) a.classList.toggle("on", a === cur);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.min(1, window.scrollY / max) : 1;
    const left = Math.max(0, Math.round(total * (1 - pct)));
    fills.forEach((f) => (f.style.width = `${pct * 100}%`));
    lefts.forEach((l) => (l.textContent = left === 0 ? "done" : `${left} min left`));
  };
  for (const a of links) {
    a.addEventListener("click", (e) => {
      const el = document.getElementById(a.hash.slice(1));
      if (!el) return;
      e.preventDefault();
      history.replaceState(null, "", a.hash);
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: "smooth" });
    });
  }
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}
