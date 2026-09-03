/** Local preview: rebuilds on change under posts/ and src/, serves dist/ on :3000. */
import { watch } from "node:fs";
import { join } from "node:path";
import { build, OUT } from "./build";

let timer: Timer | undefined;
const rebuild = () => {
  clearTimeout(timer);
  timer = setTimeout(() => build().then((p) => console.log(`rebuilt ${p.length} post(s)`)).catch((e) => console.error(e)), 100);
};
await build();
for (const d of ["posts", "src"]) watch(join(import.meta.dir, "..", d), { recursive: true }, rebuild);

Bun.serve({
  port: Number(process.env.PORT ?? 3000),
  async fetch(req) {
    const url = new URL(req.url);
    let path = decodeURIComponent(url.pathname);
    if (path.endsWith("/")) path += "index.html";
    let file = Bun.file(join(OUT, path));
    if (!(await file.exists())) file = Bun.file(join(OUT, path, "index.html"));
    if (!(await file.exists())) return new Response(Bun.file(join(OUT, "404.html")), { status: 404 });
    return new Response(file);
  },
});
console.log("http://localhost:3000");
