import { watch, statSync, readdirSync } from "fs";
import { join } from "path";
import { buildSite } from "./build";

const ROOT = join(import.meta.dir, "..");
const CONTENT_DIR = join(ROOT, "content");
const SRC_DIR = join(ROOT, "src");
const PUBLIC_DIR = join(ROOT, "public");
const DIST_DIR = join(ROOT, "dist");
const SCRIPTS_DIR = join(ROOT, "scripts");
const watchDirs = [SRC_DIR, CONTENT_DIR, PUBLIC_DIR, SCRIPTS_DIR];

let building = false;
let pendingRebuild = false;
async function rebuild() {
  if (building) {
    pendingRebuild = true;
    return;
  }
  building = true;
  console.clear();
  console.log("Rebuilding...");
  const start = performance.now();
  try {
    await buildSite();
    console.log(`Done in ${Math.round(performance.now() - start)}ms`);
  } catch (e) {
    console.error("Build error:", e);
  }
  building = false;
  if (pendingRebuild) {
    pendingRebuild = false;
    rebuild();
  }
}

function getSnapshot(dirs: string[]): Map<string, number> {
  const snap = new Map<string, number>();
  for (const dir of dirs) {
    try {
      const files = readdirSync(dir, { recursive: true });
      for (const f of files) {
        const full = join(dir, f as string);
        try {
          snap.set(full, statSync(full).mtimeMs);
        } catch {}
      }
    } catch {}
  }
  return snap;
}

let lastSnapshot = getSnapshot(watchDirs);
function hasChanges(): boolean {
  const current = getSnapshot(watchDirs);
  if (current.size !== lastSnapshot.size) {
    lastSnapshot = current;
    return true;
  }
  for (const [path, mtime] of current) {
    if (lastSnapshot.get(path) !== mtime) {
      lastSnapshot = current;
      return true;
    }
  }
  return false;
}

await rebuild();

for (const dir of watchDirs) {
  try {
    watch(dir, { recursive: true }, () => {
      if (hasChanges()) {
        rebuild();
      }
    });
    console.log(`Watching ${dir}`);
  } catch {}
}

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    let pathname = url.pathname;

    // try exact file
    let file = Bun.file(join(DIST_DIR, pathname));
    if (await file.exists()) return new Response(file);

    // try with index.html (for clean URLs like /posts/slug)
    file = Bun.file(join(DIST_DIR, pathname, "index.html"));
    if (await file.exists()) return new Response(file);

    // try with .html extension
    file = Bun.file(join(DIST_DIR, pathname + ".html"));
    if (await file.exists()) return new Response(file);

    return new Response("Not found", { status: 404 });
  },
});

console.log(`Dev server running at http://localhost:${server.port}`);
