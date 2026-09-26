// Phase 1 deliverable (docs/PROMPT-PLAN.md, step 6): side-by-side screenshots of the five page
// types beside the approved 1A concept (brand-concepts/01-signal.png) at 390, 768 and 1440 px,
// as one PDF for Darren to approve. Also saves the screenshots themselves.
//
// Needs the site running on http://localhost:3000 (npx next start -p 3000 after a build).
// Run from site/:  node scripts/make-design-lock-pdf.mjs
// Writes: printouts/Phase-1-Design-Lock.pdf and printouts/phase-1/*.jpg
import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import sharp from "sharp";
import { chromiumPath } from "../tests/browser.mjs";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT = path.join(root, "printouts", "phase-1");
const PDF = path.join(root, "printouts", "Phase-1-Design-Lock.pdf");
mkdirSync(OUT, { recursive: true });

const WIDTHS = [
  { w: 390, h: 844, name: "Phone (390 px)" },
  { w: 768, h: 1024, name: "Tablet (768 px)" },
  { w: 1440, h: 900, name: "Desktop (1440 px)" },
];
const PAGES = [
  { id: "home", title: "Home", path: "/" },
  { id: "practice", title: "Practice page (DUI/DWI)", path: "/practice-areas/dui-dwi/" },
  { id: "about", title: "About", path: "/about/" },
  { id: "contact", title: "Contact", path: "/contact/" },
  // Conflict C1: the form lives on /contact/ and /intake/ redirects there. The Intake view is the
  // form itself, after pressing Send with nothing filled in, so its error design is approved too.
  { id: "intake", title: "Intake (the form on /contact/, with its error messages)", path: "/intake/", form: true },
];

const b64 = (buf, type = "image/jpeg") => `data:${type};base64,${buf.toString("base64")}`;
const concept = await sharp(path.join(root, "brand-concepts", "01-signal.png")).resize(1344).jpeg({ quality: 80 }).toBuffer();

const browser = await chromium.launch({ executablePath: chromiumPath() });
const shots = [];
for (const pg of PAGES) {
  for (const vw of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: vw.w, height: vw.h }, deviceScaleFactor: 2, reducedMotion: "reduce" });
    const p = await ctx.newPage();
    await p.goto(BASE + pg.path, { waitUntil: "networkidle" });
    await p.evaluate(() => document.fonts.ready);
    let png;
    if (pg.form) {
      await p.locator('form button[type="submit"]').click();
      await p.waitForTimeout(400);
      // The form plus a 16 px margin, measured from the top of the page.
      const box = await p.locator("form").evaluate((f) => {
        const r = f.getBoundingClientRect();
        return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height };
      });
      const m = Math.min(16, box.x);
      png = await p.screenshot({ fullPage: true, animations: "disabled", clip: { x: box.x - m, y: box.y - m, width: box.width + 2 * m, height: box.height + 2 * m } });
    } else {
      // Scroll through once so every scroll-in section is in its final place, then back to the top.
      await p.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 500) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 30));
        }
        window.scrollTo(0, 0);
      });
      await p.waitForTimeout(500);
      png = await p.screenshot({ fullPage: true, animations: "disabled" });
    }
    await ctx.close();
    const jpg = await sharp(png).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
    // The saved copies are at normal (1x) resolution to keep the project small.
    const meta = await sharp(png).metadata();
    await sharp(png)
      .resize(Math.round(meta.width / 2))
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(path.join(OUT, `${pg.id}-${vw.w}.jpg`));
    shots.push({ pg, vw, jpg, width: meta.width / 2, height: meta.height / 2 });
    console.log(`${pg.id} ${vw.w}: ${meta.width / 2}×${meta.height / 2}`);
  }
}

// Page area (tabloid landscape, 17 × 11 in = 1632 × 1056 CSS px).
const AREA_W = 1080; // right-hand area for the screenshot strips
const AREA_H = 900;
const GAP = 16;
// Largest scale at which the page, cut into side-by-side strips, fits the area.
function layout(width, height) {
  for (let s = 1; s > 0.05; s -= 0.01) {
    const sw = width * s;
    const n = Math.ceil((height * s) / AREA_H);
    if (n * sw + (n - 1) * GAP <= AREA_W) return { s, n, sw, sh: Math.min(AREA_H, height * s) };
  }
  throw new Error("too tall");
}

let commit = "unknown";
try {
  commit = execSync("git rev-parse --short HEAD", { cwd: root, encoding: "utf8" }).trim();
} catch {}
const today = new Date().toISOString().slice(0, 10);

const sheets = shots.map(({ pg, vw, jpg, width, height }) => {
  const { s, n, sw, sh } = layout(width, height);
  const src = b64(jpg);
  const strips = Array.from({ length: n }, (_, i) => {
    const h = Math.min(sh, height * s - i * AREA_H);
    return `<div class="strip" style="width:${sw}px;height:${h}px;background-image:url(${src});background-size:${sw}px auto;background-position:0 -${i * AREA_H}px"></div>`;
  }).join("");
  return `<section class="sheet">
  <header><h2>${pg.title}</h2><p>${vw.name}${pg.form ? "" : ` · whole page${n > 1 ? `, cut into ${n} columns (read left to right)` : ""}`} · shown at ${Math.round(s * 100)}%</p></header>
  <div class="row">
    <figure class="concept"><img src="${b64(concept)}" alt=""><figcaption>Approved concept 1A (<code>brand-concepts/01-signal.png</code>). It was drawn for a desktop home page only, so on other pages and sizes it is the style to match, not a layout to copy. Its "Start your intake" button and "Middle Tennessee" line were replaced by the approved "Contact us" and the confirmed service area.</figcaption></figure>
    <div class="strips">${strips}</div>
  </div>
</section>`;
});

// Link-preview cards, saved for the cover (and for the record).
for (const [file, url] of [
  ["share-card-home.jpg", "/"],
  ["share-card-dui-dwi.jpg", "/practice-areas/dui-dwi/"],
]) {
  const page = await (await fetch(BASE + url)).text();
  const img = new URL(page.match(/property="og:image" content="([^"]+)"/)[1]);
  writeFileSync(path.join(OUT, file), Buffer.from(await (await fetch(BASE + img.pathname + img.search)).arrayBuffer()));
}

const card = (file) => b64(readFileSync(path.join(OUT, file)));
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@page { size: 17in 11in; margin: 0; }
* { box-sizing: border-box; }
body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: #0b1424; }
.sheet { width: 1632px; height: 1056px; padding: 36px 44px; page-break-after: always; overflow: hidden; }
header { display: flex; align-items: baseline; gap: 24px; border-bottom: 2px solid #0e7490; padding-bottom: 10px; margin-bottom: 20px; }
h1 { font-size: 34px; margin: 0 0 12px; } h2 { font-size: 26px; margin: 0; } header p { margin: 0; color: #3d4a5e; font-size: 16px; }
.row { display: flex; gap: 40px; }
.concept { width: 420px; margin: 0; flex: none; } .concept img { width: 100%; border: 1px solid #ccd; }
figcaption { font-size: 13px; color: #3d4a5e; margin-top: 8px; line-height: 1.4; }
.strips { display: flex; gap: ${GAP}px; align-items: flex-start; }
.strip { background-repeat: no-repeat; outline: 1px solid #ccd; }
.cover p, .cover li { font-size: 18px; line-height: 1.5; max-width: 1300px; }
.cards { display: flex; gap: 32px; margin-top: 16px; } .cards img { width: 700px; border: 1px solid #ccd; }
code { font-size: 0.9em; }
</style></head><body>
<section class="sheet cover">
  <h1>Darren Drake website: Phase 1 design check</h1>
  <p>For Darren's approval. Screenshots of the five page types (Home, a practice page, About, Contact and the intake form) at phone, tablet and desktop widths, each beside the approved 1A concept. Nothing is online: these were taken from the site running on the build computer. Taken ${today} from project version <code>${commit}</code>.</p>
  <p><strong>Please approve or send changes for:</strong></p>
  <ul>
    <li>the look of each page type (pages 2 to 16);</li>
    <li>the headline "Your next step starts with a conversation." and the supporting line "Tell Darren Drake about your legal matter and how to reach you.";</li>
    <li>the link-preview image, which appears when someone shares the site in a text, email or social post (below);</li>
    <li>the About-page photo shape (D3): these screenshots use the recommended upright crop, from the unedited middle of the photo.</li>
  </ul>
  <p><strong>Photo:</strong> the edited portrait was approved for all uses on 24 Sep 2026 (D2). A signed photo note is still recommended.</p>
  <p><strong>One change from the plan:</strong> the plan's link-preview text says "Murfreesboro &amp; Middle Tennessee". Darren confirmed Rutherford County cases only, so the image says "Murfreesboro, Rutherford County &amp; Smyrna". Tell us if Darren prefers the plan's wording.</p>
  <div class="cards"><img src="${card("share-card-home.jpg")}" alt=""><img src="${card("share-card-dui-dwi.jpg")}" alt=""></div>
  <p style="font-size:14px;color:#3d4a5e">Left: the card for the home page and every other page. Right: a practice page's card (its practice area is highlighted). Square previews show only the centre, which keeps Darren's face.</p>
</section>
${sheets.join("\n")}
</body></html>`;

const p = await browser.newPage();
await p.setContent(html, { waitUntil: "load" });
await p.pdf({ path: PDF, width: "17in", height: "11in", printBackground: true });
await browser.close();
console.log(`\nWrote ${path.relative(root, PDF)} (${shots.length + 1} pages) and ${shots.length + 2} images in ${path.relative(root, OUT)}`);
