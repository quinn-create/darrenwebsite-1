// Captures review screenshots at 390, 768 and 1440 px. Run with the site on :3000.
// Usage: node tests/screenshots.mjs [baseUrl]
import { chromium } from "playwright-core";

const base = process.argv[2] ?? "http://localhost:3000";
const executablePath = process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium";
const pages = [
  ["home", "/"],
  ["practice", "/practice-areas/dui-dwi/"],
  ["about", "/about/"],
  ["contact", "/contact/"],
  ["intake", "/intake/"],
];
const widths = [390, 768, 1440];

const browser = await chromium.launch({ executablePath });
for (const width of widths) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  for (const [name, path] of pages) {
    await page.goto(base + path, { waitUntil: "networkidle" });
    await page.screenshot({ path: `screenshots/${name}-${width}.png`, fullPage: true });
    await page.screenshot({ path: `screenshots/${name}-${width}-fold.png` });
  }
  if (width === 390) {
    await page.goto(base + "/", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.screenshot({ path: "screenshots/menu-390.png" });
  }
  await ctx.close();
}
await browser.close();
console.log("screenshots written");
