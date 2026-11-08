// End-of-phase screenshots (CLAUDE.md): every page in the sitemap, plus the not-found page, at
// 390, 768 and 1440 px, saved as images and gathered into one PDF (one sheet per page, the three
// widths side by side). Until D17 previews exist, this is how Quinn and Darren see each phase.
//
// Needs the site running on http://localhost:3000 (npx next start -p 3000 after a build).
// Run from site/:  node scripts/screenshot-pages.mjs phase-2 "Phase 2: every page"
// Writes: printouts/<name>/*.jpg and printouts/<Name>.pdf
import { execSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import sharp from "sharp";
import { chromiumPath } from "../tests/browser.mjs";
import { BASE, sitePages } from "./site-pages.mjs";

const [name = "screenshots", heading = "Every page"] = process.argv.slice(2);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT = path.join(root, "printouts", name);
const PDF = path.join(root, "printouts", `${name.replace(/(^|-)(\w)/g, (_, d, c) => d + c.toUpperCase())}-Screenshots.pdf`);
mkdirSync(OUT, { recursive: true });

const WIDTHS = [
  { w: 390, h: 844, label: "Phone, 390 px" },
  { w: 768, h: 1024, label: "Tablet, 768 px" },
  { w: 1440, h: 900, label: "Desktop, 1440 px" },
];
const pages = [...(await sitePages()), "/no-such-page/"];
const slug = (p) => (p === "/" ? "home" : p.replace(/^\/|\/$/g, "").replace(/\//g, "__"));

const browser = await chromium.launch({ executablePath: chromiumPath() });
const shots = [];
for (const p of pages) {
  const row = { path: p, title: "", images: [] };
  for (const vw of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: vw.w, height: vw.h }, deviceScaleFactor: 2, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto(BASE + p, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    // Scroll through once so every scroll-in section is in place, then back to the top.
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 30));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(400);
    row.title ||= await page.title();
    const png = await page.screenshot({ fullPage: true, animations: "disabled" });
    await ctx.close();
    const meta = await sharp(png).metadata();
    await sharp(png).resize(Math.round(meta.width / 2)).jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(OUT, `${slug(p)}-${vw.w}.jpg`));
    row.images.push({ vw, jpg: await sharp(png).jpeg({ quality: 60, mozjpeg: true }).toBuffer(), width: meta.width / 2, height: meta.height / 2 });
  }
  shots.push(row);
  console.log(`${p}: ${row.title}`);
}

// Sheet: 17 × 11 in landscape (1632 × 1056 CSS px). The three widths share the width in the
// ratio of their sizes; each is cut into side-by-side strips when it is taller than the sheet.
const AREA_H = 900;
const GAP = 12;
function fit(width, height, areaW) {
  for (let s = 1; s > 0.03; s -= 0.005) {
    const sw = width * s;
    const n = Math.ceil((height * s) / AREA_H);
    if (n * sw + (n - 1) * GAP <= areaW) return { s, n, sw };
  }
  throw new Error("too tall");
}
const b64 = (buf) => `data:image/jpeg;base64,${buf.toString("base64")}`;
let commit = "unknown";
try {
  commit = execSync("git rev-parse --short HEAD", { cwd: root, encoding: "utf8" }).trim();
} catch {}
const today = new Date().toISOString().slice(0, 10);

const sheets = shots.map(({ path: p, title, images }) => {
  const cols = images.map(({ vw, jpg, width, height }, i) => {
    const areaW = [340, 440, 700][i];
    const { s, n, sw } = fit(width, height, areaW);
    const src = b64(jpg);
    const strips = Array.from({ length: n }, (_, k) => {
      const h = Math.min(AREA_H, height * s - k * AREA_H);
      return `<div class="strip" style="width:${sw}px;height:${h}px;background-image:url(${src});background-size:${sw}px auto;background-position:0 -${k * AREA_H}px"></div>`;
    }).join("");
    return `<div class="col" style="width:${areaW}px"><p>${vw.label} · ${Math.round(s * 100)}%${n > 1 ? ` · ${n} columns, left to right` : ""}</p><div class="strips">${strips}</div></div>`;
  });
  return `<section class="sheet"><header><h2>${p}</h2><p>${title}</p></header><div class="row">${cols.join("")}</div></section>`;
});

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@page { size: 17in 11in; margin: 0; }
* { box-sizing: border-box; }
body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: #0b1424; }
.sheet { width: 1632px; height: 1056px; padding: 28px 40px; page-break-after: always; overflow: hidden; }
header { display: flex; align-items: baseline; gap: 20px; border-bottom: 2px solid #0e7490; padding-bottom: 8px; margin-bottom: 14px; }
h1 { font-size: 34px; margin: 0 0 12px; } h2 { font-size: 24px; margin: 0; } header p { margin: 0; color: #3d4a5e; }
.row { display: flex; gap: 36px; } .col > p { margin: 0 0 8px; font-size: 13px; color: #3d4a5e; }
.strips { display: flex; gap: ${GAP}px; align-items: flex-start; } .strip { background-repeat: no-repeat; outline: 1px solid #ccd; }
.cover p { font-size: 18px; line-height: 1.5; max-width: 1300px; }
</style></head><body>
<section class="sheet cover"><h1>Darren Drake website: ${heading}</h1>
<p>Every page of the site at phone, tablet and desktop widths, taken ${today} from project version <code>${commit}</code>, on the site running on the build computer (nothing is online). Highlighted "Waiting on the firm" text marks items Darren still needs to confirm; the live site can't be published while any remain.</p>
<p>${shots.length} pages: ${shots.map((s) => s.path).join(", ")}</p></section>
${sheets.join("\n")}</body></html>`;

const page = await browser.newPage();
await page.setContent(html, { waitUntil: "load" });
await page.pdf({ path: PDF, width: "17in", height: "11in", printBackground: true });
await browser.close();
console.log(`\nWrote ${path.relative(root, PDF)} (${shots.length + 1} pages) and ${shots.length * 3} images in ${path.relative(root, OUT)}`);
