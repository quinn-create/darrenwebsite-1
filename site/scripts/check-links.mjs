// Link check: every internal link on every page (from the sitemap) answers 200, and
// external links are listed for a person to look at (they aren't fetched, so the check
// never depends on another website being up). Unknown addresses must return 404.
// Usage: BASE_URL=http://localhost:3000 node scripts/check-links.mjs
import { chromium } from "playwright-core";
import { chromiumPath } from "../tests/browser.mjs";
import { BASE, sitePages } from "./site-pages.mjs";

const browser = await chromium.launch({ executablePath: chromiumPath() });
const page = await browser.newPage();
const links = new Map();
const external = new Map();
const pages = await sitePages();
for (const path of [...pages, "/page-that-does-not-exist/"]) {
  await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
  for (const href of await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")))) {
    if (href.startsWith("/") && !href.startsWith("//")) links.set(href.split("#")[0].split("?")[0] || path, path);
    else if (/^https?:/.test(href)) external.set(href, path);
  }
}
await browser.close();
const broken = [];
for (const [href, from] of links) {
  const res = await fetch(BASE + href, { redirect: "manual" });
  if (res.status !== 200) broken.push(`${href} -> ${res.status}${res.headers.get("location") ? ` (to ${res.headers.get("location")})` : ""}, linked from ${from}`);
}
const missing = await fetch(`${BASE}/page-that-does-not-exist/`);
if (missing.status !== 404) broken.push(`an unknown address returned ${missing.status}, not 404`);
if (broken.length) {
  console.error(`Link check failed:\n${broken.join("\n")}`);
  process.exit(1);
}
console.log(`Link check passed: ${links.size} internal links on ${pages.length} pages all answer 200; unknown addresses return 404.`);
if (external.size) console.log(`External links (not fetched):\n${[...external].map(([h, f]) => `  ${h}  (on ${f})`).join("\n")}`);
