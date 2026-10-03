// Archive a website for the firm's 2-year advertising record (Tennessee RPC 7.1(c); plan
// Phase 0 and "After any release"). Saves a full-page PDF and a 1440 px full-page screenshot of
// every page, plus index.md (URL, capture date, git commit), into
// archive/<site>-YYYY-MM-DD/ at the repository root. That folder is never served publicly.
//
// Usage (from site/):
//   npm run archive -- https://ddrakelaw.com
//   npm run archive -- http://localhost:3000 --out /tmp/test-archive
// Options:
//   --out <dir>     save somewhere else (never inside site/public)
//   --max <n>       at most n pages (default 100)
//   --sitemap       take pages from <url>/sitemap.xml instead of following links. Don't use this on
//                   the old WordPress site: its sitemap lists 41,660 junk addresses (plan Section 10).
import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import { chromiumPath } from "../tests/browser.mjs";

const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const target = args.find((a) => /^https?:\/\//.test(a));
if (!target) {
  console.error("Give the site's address, for example: npm run archive -- https://ddrakelaw.com");
  process.exit(1);
}
const origin = new URL(target).origin;
const host = new URL(target).host.replace(/:/g, "_");
const max = Number(opt("--max") ?? 100);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const today = new Date().toISOString().slice(0, 10);
const outDir = path.resolve(opt("--out") ?? path.join(repoRoot, "archive", `${host}-${today}`));
if (outDir.startsWith(path.join(repoRoot, "site", "public"))) {
  console.error("The archive must not go inside site/public (it would be served to the public).");
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });

let commit = "unknown";
try {
  commit = execSync("git rev-parse HEAD", { cwd: repoRoot, encoding: "utf8" }).trim();
} catch {}

// Addresses that are never real pages (WordPress internals, feeds, search, files).
const SKIP = /\/(wp-admin|wp-content|wp-includes|wp-json|feed|xmlrpc\.php)|[?&](s|p|page_id|replytocom)=|\.(pdf|jpe?g|png|gif|webp|svg|zip|xml|txt)$/i;
const clean = (href) => {
  try {
    const u = new URL(href, origin);
    if (u.origin !== origin || SKIP.test(u.pathname + u.search)) return null;
    return u.origin + u.pathname;
  } catch {
    return null;
  }
};

const browser = await chromium.launch({ executablePath: chromiumPath() });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const page = await ctx.newPage();

let queue = [origin + "/"];
if (args.includes("--sitemap")) {
  const xml = await (await fetch(origin + "/sitemap.xml")).text();
  queue = [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => clean(new URL(m[1]).pathname)).filter(Boolean))];
}
const seen = new Set(queue);
const rows = [];
const names = new Set();
while (queue.length && rows.length < max) {
  const url = queue.shift();
  let status = 0;
  try {
    const res = await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
    status = res?.status() ?? 0;
  } catch (e) {
    rows.push({ url, status: "failed", note: e.message.split("\n")[0] });
    continue;
  }
  await page.evaluate(() => document.fonts?.ready);
  const title = await page.title();
  let name = new URL(url).pathname.replace(/^\/|\/$/g, "").replace(/\//g, "__") || "home";
  while (names.has(name)) name += "_";
  names.add(name);
  await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true });
  await page.pdf({ path: path.join(outDir, `${name}.pdf`), format: "Letter", printBackground: true });
  rows.push({ url, status, title, name, at: new Date().toISOString() });
  if (!args.includes("--sitemap")) {
    for (const href of await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")))) {
      const u = clean(href);
      if (u && !seen.has(u)) {
        seen.add(u);
        queue.push(u);
      }
    }
  }
  console.log(`saved ${name} (${status})`);
}
await browser.close();

const md = `# Website archive: ${origin}

- **Captured:** ${new Date().toISOString().replace("T", " ").slice(0, 16)} UTC
- **Git commit of this project at capture:** \`${commit}\`
- **Pages:** ${rows.filter((r) => r.name).length}${rows.length >= max ? ` (stopped at the ${max}-page limit)` : ""}
- **Why:** Tennessee RPC 7.1(c) requires keeping a copy of lawyer advertising for 2 years after it was last shown. Copy this folder into the firm's own storage (the archive owner). It is never served publicly.

| Page | Title | HTTP status | Captured (UTC) | Files |
|---|---|---|---|---|
${rows.map((r) => `| ${r.url} | ${(r.title ?? r.note ?? "").replace(/\|/g, "\\|")} | ${r.status} | ${r.at ?? ""} | ${r.name ? `[PDF](${r.name}.pdf), [screenshot](${r.name}.png)` : ""} |`).join("\n")}
`;
writeFileSync(path.join(outDir, "index.md"), md);
console.log(`\nArchive written to ${outDir} (${rows.length} pages).`);
