// High-resolution screenshots for printed handouts (test data only).
// Needs :3000 (demo) and :3001 (INTAKE_DESTINATION=local-test). Usage: node tests/print-shots.mjs <outDir>
import { mkdirSync } from "node:fs";
import { chromium } from "playwright-core";

const out = process.argv[2] ?? "print-shots";
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium" });
const opts = { reducedMotion: "reduce", deviceScaleFactor: 2 };

const desk = await (await browser.newContext({ ...opts, viewport: { width: 1440, height: 900 } })).newPage();
for (const [name, path] of [["home", "/"], ["practice", "/practice-areas/dui-dwi"], ["about", "/about"], ["contact", "/contact"], ["intake", "/intake"]]) {
  await desk.goto("http://localhost:3000" + path, { waitUntil: "networkidle" });
  await desk.screenshot({ path: `${out}/desktop-${name}.jpg`, quality: 85, type: "jpeg" });
  if (name === "home") await desk.screenshot({ path: `${out}/desktop-home-full.jpg`, fullPage: true, quality: 85, type: "jpeg" });
}

const ctx = await browser.newContext({ ...opts, viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const p = await ctx.newPage();
const shot = (n) => p.screenshot({ path: `${out}/phone-${n}.jpg`, quality: 85, type: "jpeg" });
await p.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await shot("home");
await p.getByRole("button", { name: "Open menu" }).click();
await shot("menu");
await p.goto("http://localhost:3000/intake", { waitUntil: "networkidle" });
await shot("intake");
await p.getByRole("button", { name: "Send inquiry" }).click();
await p.locator('[aria-labelledby="error-summary-title"]').waitFor();
await p.locator('[aria-labelledby="error-summary-title"]').evaluate((el) => el.scrollIntoView({ block: "start" }));
await p.evaluate(() => window.scrollBy(0, -90));
await shot("intake-errors");

const fill = async (tag) => {
  await p.locator("#fullName").fill(`Handout Test ${tag} ${Date.now()}`);
  await p.getByLabel("DUI/DWI").check();
  await p.getByLabel("Phone", { exact: true }).first().check();
  await p.locator("#phone").fill("615-555-0123");
};
await p.goto("http://localhost:3000/intake", { waitUntil: "networkidle" });
await fill("demo");
await p.getByRole("button", { name: "Send inquiry" }).click();
const note = p.getByText("Not sent: this demo form");
await note.waitFor();
await note.evaluate((el) => el.scrollIntoView({ block: "center" }));
await shot("intake-demo-not-sent");

await p.goto("http://localhost:3001/intake", { waitUntil: "networkidle" });
await fill("ok");
await p.getByRole("button", { name: "Send inquiry" }).click();
await p.getByText("Your inquiry was received").waitFor();
await p.getByText("Your inquiry was received").evaluate((el) => el.scrollIntoView({ block: "center" }));
await shot("intake-received");

await browser.close();
console.log("print shots written to", out);
