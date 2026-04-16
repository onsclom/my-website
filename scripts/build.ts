import { readdir, readFile, writeFile, mkdir, cp, rm } from "fs/promises";
import { join } from "path";
import { Marked } from "marked";
import { STYLES } from "./styles";

const CONTENT_DIR = join(import.meta.dir, "../content/posts");
const SRC_DIR = join(import.meta.dir, "../src");
const PUBLIC_DIR = join(import.meta.dir, "../public");
const DIST_DIR = join(import.meta.dir, "../dist");

type Post = {
  slug: string;
  title: string;
  pubDate: Date;
  content: string;
};

function parseFrontmatter(raw: string): {
  attrs: { title: string; pubDate: string };
  body: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error("Invalid frontmatter");
  const lines = match[1]!.split(/\r?\n/);
  const attrs: Record<string, string> = {};
  for (const line of lines) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const val = line
      .slice(idx + 1)
      .trim()
      .replace(/^['"]|['"]$/g, "");
    attrs[key] = val;
  }
  return { attrs: attrs as any, body: match[2]! };
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function htmlPage(title: string, body: string, bodyClass?: string): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} - onsclom</title>
  <link rel="stylesheet" href="/global.css" />
  <style>${STYLES}</style>
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ""}>
  ${body}
</body>
</html>`;
}

function postPage(post: Post): string {
  return htmlPage(
    post.title,
    `<a href="/posts" class="back-link">&larr; all posts</a>
  <div class="post-header">
    <h1>${post.title}</h1>
    <span class="post-date">${formatDate(post.pubDate)}</span>
  </div>
  <div class="post-content">
    ${post.content}
  </div>`,
  );
}

function postsListingPage(posts: Post[]): string {
  const sorted = [...posts].sort(
    (a, b) => b.pubDate.getTime() - a.pubDate.getTime(),
  );
  const items = sorted
    .map(
      (p) =>
        `<li>
      <a class="post-title" href="/posts/${p.slug}">${p.title}</a>
      <span class="post-date">${formatDate(p.pubDate)}</span>
    </li>`,
    )
    .join("\n    ");

  return htmlPage(
    "writing",
    `<a href="/" class="back-link">&larr; home</a>
  <h1>writing</h1>
  <div style="height: 1.5lh" aria-hidden="true"></div>
  <ul class="posts-list">
    ${items}
  </ul>`,
    "posts-listing",
  );
}

function vercelPage(): string {
  return htmlPage(
    "vercel work",
    `<a href="/" class="back-link">&larr; home</a>
  <h1>vercel work</h1>
  <p class="vercel-subtitle">austin merrick</p>

  <div style="height: 1.5lh" aria-hidden="true"></div>

  <h2>framework support</h2>
  <ul class="vercel-list">
    <li><a href="https://vercel.com/changelog/support-for-tanstack-start">support for tanstack start</a></li>
    <li><a href="https://vercel.com/changelog/zero-configuration-support-for-fastify">zero-configuration support for fastify</a></li>
    <li><a href="https://vercel.com/changelog/zero-configuration-support-for-nitro">zero-configuration support for nitro</a></li>
    <li><a href="https://vercel.com/changelog/zero-configuration-support-for-nestjs">zero-configuration support for nestjs</a></li>
  </ul>

  <div style="height: 0.5lh" aria-hidden="true"></div>

  <h2>cli & performance</h2>
  <ul class="vercel-list">
    <li><a href="https://vercel.com/changelog/split-tgz-is-now-the-default-cli-archive-deployment-behavior">split tgz is now the default cli archive deployment behavior</a></li>
    <li><a href="https://vercel.com/changelog/cli-archive-deployments-are-now-up-to-30-faster-with-split-tgz-archive">cli archive deployments are now up to 30% faster with split tgz archive</a></li>
  </ul>

  <div style="height: 0.5lh" aria-hidden="true"></div>

  <h2>package management</h2>
  <ul class="vercel-list">
    <li><a href="https://vercel.com/changelog/automatic-pnpm-v10-support">automatic pnpm v10 support</a></li>
    <li><a href="https://vercel.com/changelog/yarn-2-dependency-caching-now-supported">yarn 2 dependency caching now supported</a></li>
    <li><a href="https://vercel.com/changelog/buns-text-lockfile-is-now-supported-with-zero-configuration">bun's text lockfile is now supported with zero configuration</a></li>
  </ul>`,
    "vercel-page",
  );
}

export async function buildVercel() {
  const dir = join(DIST_DIR, "vercel");
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "index.html"), vercelPage());
  console.log("Built vercel page");
}

export async function buildPosts() {
  const marked = new Marked();

  // read all posts
  const files = await readdir(CONTENT_DIR);
  const mdFiles = files.filter((f) => f.endsWith(".md"));

  const posts: Post[] = [];
  for (const file of mdFiles) {
    const raw = await readFile(join(CONTENT_DIR, file), "utf-8");
    const { attrs, body } = parseFrontmatter(raw);
    const content = await marked.parse(body);
    const slug = file.replace(/\.md$/, "");
    posts.push({
      slug,
      title: attrs.title,
      pubDate: new Date(attrs.pubDate),
      content,
    });
  }

  // write individual post pages: dist/posts/<slug>/index.html
  for (const post of posts) {
    const dir = join(DIST_DIR, "posts", post.slug);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, "index.html"), postPage(post));
  }

  // write posts listing page: dist/posts/index.html
  await mkdir(join(DIST_DIR, "posts"), { recursive: true });
  await writeFile(
    join(DIST_DIR, "posts", "index.html"),
    postsListingPage(posts),
  );

  console.log(`Built ${posts.length} posts`);
}

export async function buildSite() {
  // clean dist
  await rm(DIST_DIR, { recursive: true, force: true });
  await mkdir(DIST_DIR, { recursive: true });

  // build main site JS/HTML with Bun bundler
  const result = await Bun.build({
    entrypoints: [join(SRC_DIR, "index.html")],
    outdir: DIST_DIR,
  });

  if (!result.success) {
    console.error("Build failed:", result.logs);
    process.exit(1);
  }
  console.log("Built main site");

  // copy public assets (images etc)
  try {
    await cp(PUBLIC_DIR, DIST_DIR, { recursive: true });
    console.log("Copied public assets");
  } catch {
    // no public dir, that's fine
  }

  // build markdown posts
  await buildPosts();

  // build vercel page
  await buildVercel();

  console.log("Build complete!");
}

// run if called directly
if (import.meta.main) {
  await buildSite();
}
