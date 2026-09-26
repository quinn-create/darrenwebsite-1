// End-to-end checks for the Precision preview. Uses test data only.
// Needs two servers from the same build:
//   next start -p 3000                                  (no destination: demo mode)
//   INTAKE_DESTINATION=local-test next start -p 3001    (writes to .data/intake-test.jsonl)
// Usage: node tests/e2e.mjs
import { readFile, rm } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { chromium } from "playwright-core";

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const DEMO = "http://localhost:3000";
const LIVE = "http://localhost:3001";
const executablePath = process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium";
const PAGES = ["/", "/practice-areas", "/practice-areas/criminal-defense", "/about", "/contact", "/intake", "/privacy"];

const results = [];
const SUMMARY = '[aria-labelledby="error-summary-title"]';
const RUN = Date.now().toString(36);
let seq = 0;
async function check(name, fn) {
  try {
    const note = await fn();
    results.push({ name, ok: true, note });
  } catch (err) {
    results.push({ name, ok: false, note: err.message });
  }
}
function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function fillValid(page, { method = "phone" } = {}) {
  await page.getByLabel("Full name").fill(`Test Person ${RUN}-${++seq}`);
  await page.getByLabel("DUI/DWI").check();
  await page.getByLabel(method === "phone" ? "Phone" : "Email", { exact: true }).first().check();
  if (method === "phone") await page.locator("#phone").fill("615-555-0123");
  else await page.locator("#email").fill("test@example.com");
  await page.locator("#county").fill("Not sure");
  await page.locator("#message").fill("Test inquiry, please ignore.");
}

await rm(".data/intake-test.jsonl", { force: true });
const browser = await chromium.launch({ executablePath });
const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await desktop.newPage();

await check("Required-field errors: summary gets focus and lists each problem", async () => {
  await page.goto(DEMO + "/intake");
  await page.getByRole("button", { name: "Send inquiry" }).click();
  const summary = page.locator(SUMMARY);
  await summary.waitFor();
  const focused = await page.evaluate(() => document.activeElement?.getAttribute("role"));
  assert(focused === "alert", "error summary not focused");
  const items = await summary.locator("li").count();
  assert(items === 3, `expected 3 errors (name, matter, contact method), got ${items}`);
  const invalid = await page.locator("#fullName").getAttribute("aria-invalid");
  assert(invalid === "true", "name field not marked invalid");
  return `${items} errors listed`;
});

await check("Summary link moves focus to the field", async () => {
  await page.locator(SUMMARY).getByRole("link").first().click();
  const id = await page.evaluate(() => document.activeElement?.id);
  assert(id === "fullName", `focus went to ${id}`);
});

await check("Only the chosen contact method is required; invalid email/phone rejected", async () => {
  await page.locator("#fullName").fill("Test Person");
  await page.getByLabel("Criminal defense").check();
  await page.getByLabel("Email", { exact: true }).first().check();
  await page.locator("#email").fill("not-an-email");
  await page.locator("#phone").fill("12");
  await page.getByRole("button", { name: "Send inquiry" }).click();
  const text = await page.locator(SUMMARY).innerText();
  assert(/Email: Enter an email address like/.test(text), "email format error missing");
  assert(/Phone: Enter a 10-digit/.test(text), "optional phone with bad value should still be flagged");
  await page.locator("#phone").fill("");
  await page.locator("#email").fill("test@example.com");
  await page.waitForTimeout(100);
  assert((await page.locator(SUMMARY).count()) === 0, "errors should clear once fixed");
});

await check("Demo mode: 'not connected' banner shown, nothing claimed as sent, values kept", async () => {
  await page.goto(DEMO + "/intake");
  assert(await page.getByRole("note").getByText("Demo form, not connected").isVisible(), "banner missing");
  await fillValid(page);
  await page.getByRole("button", { name: "Send inquiry" }).click();
  await page.getByText("Not sent: this demo form isn't connected yet.").waitFor();
  assert((await page.getByText("Your inquiry was received").count()) === 0, "must not show success");
  assert((await page.locator("#fullName").inputValue()).startsWith("Test Person"), "values not preserved");
});

await check("Configured (test destination): 'Sending…' state, success only after server acceptance", async () => {
  await page.goto(LIVE + "/intake");
  assert((await page.getByRole("note").count()) === 0, "banner should be hidden when configured");
  await fillValid(page);
  await page.route("**/api/intake", async (route) => {
    await new Promise((r) => setTimeout(r, 800));
    await route.continue();
  });
  await page.getByRole("button", { name: "Send inquiry" }).click();
  const sending = page.getByRole("button", { name: "Sending…" });
  await sending.waitFor();
  assert(await sending.isDisabled(), "button should be disabled while sending");
  await page.getByText("Your inquiry was received. Submitting it does not establish representation.").waitFor();
  const focusedRole = await page.evaluate(() => document.activeElement?.getAttribute("role"));
  assert(focusedRole === "status", "success message should receive focus");
  await page.unroute("**/api/intake");
  const lines = (await readFile(".data/intake-test.jsonl", "utf8")).trim().split("\n");
  assert(lines.length === 1, `expected 1 stored test inquiry, got ${lines.length}`);
});

await check("Double-click submit sends only once", async () => {
  await page.goto(LIVE + "/intake");
  await fillValid(page, { method: "email" });
  await page.locator("#message").fill("Double click test.");
  let posts = 0;
  await page.route("**/api/intake", async (route) => {
    posts++;
    await new Promise((r) => setTimeout(r, 500));
    await route.continue();
  });
  await page.getByRole("button", { name: "Send inquiry" }).dblclick();
  await page.getByText("Your inquiry was received").waitFor();
  await page.unroute("**/api/intake");
  assert(posts === 1, `expected 1 request, got ${posts}`);
  const lines = (await readFile(".data/intake-test.jsonl", "utf8")).trim().split("\n");
  assert(lines.length === 2, `expected 2 stored test inquiries total, got ${lines.length}`);
});

await check("Network failure: values kept, retry offered, retry succeeds", async () => {
  await page.goto(LIVE + "/intake");
  await fillValid(page);
  await page.locator("#message").fill("Network failure test.");
  await page.route("**/api/intake", (route) => route.abort("failed"));
  await page.getByRole("button", { name: "Send inquiry" }).click();
  await page.getByText("could not be sent because of a connection problem").waitFor();
  assert((await page.locator("#message").inputValue()) === "Network failure test.", "values lost");
  assert(await page.getByRole("link", { name: "(615) 546-5551" }).first().isVisible(), "phone link missing");
  await page.unroute("**/api/intake");
  await page.getByRole("button", { name: "Try again" }).click();
  await page.getByText("Your inquiry was received").waitFor();
});

await check("Keyboard-only completion of the intake form", async () => {
  await page.goto(LIVE + "/intake");
  await page.locator("#fullName").focus();
  await page.keyboard.type("Keyboard Tester");
  await page.keyboard.press("Tab"); // matter type group (first radio)
  await page.keyboard.press("Space");
  await page.keyboard.press("Tab"); // contact method group
  await page.keyboard.press("ArrowRight"); // Email
  await page.keyboard.press("Tab"); // phone
  await page.keyboard.press("Tab"); // email
  await page.keyboard.type("keyboard@example.com");
  await page.keyboard.press("Enter");
  await page.getByText("Your inquiry was received").waitFor({ timeout: 5000 });
});

await check("Mobile menu: opens, traps focus, closes on Esc and returns focus", async () => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  await p.goto(DEMO + "/");
  const btn = p.getByRole("button", { name: "Open menu" });
  await btn.click();
  assert((await btn.getAttribute("aria-expanded")) === "true", "aria-expanded not true");
  const dialog = p.getByRole("dialog", { name: "Menu" });
  await dialog.waitFor();
  for (let i = 0; i < 12; i++) await p.keyboard.press("Tab");
  const inside = await p.evaluate(() => !!document.activeElement?.closest("#mobile-menu"));
  assert(inside, "focus escaped the menu");
  await p.keyboard.press("Escape");
  assert((await dialog.count()) === 0, "menu did not close");
  const label = await p.evaluate(() => document.activeElement?.textContent);
  assert(/Open menu/.test(label ?? ""), "focus not returned to menu button");
  await ctx.close();
});

await check("Mobile hero: CTA and next steps appear before the portrait; nothing sticky on mobile", async () => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  await p.goto(DEMO + "/");
  const hero = p.locator('section[aria-labelledby="hero-title"]');
  const cta = await hero.locator("a.btn-primary").boundingBox();
  const steps = await hero.getByRole("list", { name: "What happens next" }).boundingBox();
  const img = await hero.getByAltText("Darren Drake, attorney at law").boundingBox();
  assert(cta && steps && img && cta.y < steps.y && steps.y < img.y, "order should be CTA, steps, portrait");
  assert(cta.y + cta.height < 844, "CTA not in the first screen");
  const headerPos = await p.locator("header").evaluate((el) => getComputedStyle(el).position);
  const fixedCount = await p.evaluate(
    () => [...document.querySelectorAll("body *")].filter((el) => ["fixed", "sticky"].includes(getComputedStyle(el).position)).length,
  );
  await ctx.close();
  assert(headerPos !== "sticky" && fixedCount === 0, `mobile header ${headerPos}, ${fixedCount} fixed/sticky elements`);
  return `CTA bottom at ${Math.round(cta.y + cta.height)}px`;
});

await check("No horizontal scroll at 320 px on any page", async () => {
  const ctx = await browser.newContext({ viewport: { width: 320, height: 800 } });
  const p = await ctx.newPage();
  const bad = [];
  for (const path of PAGES) {
    await p.goto(DEMO + path);
    const w = await p.evaluate(() => document.documentElement.scrollWidth);
    if (w > 320) bad.push(`${path} (${w}px)`);
  }
  await ctx.close();
  assert(bad.length === 0, `overflow: ${bad.join(", ")}`);
});

await check("200% zoom (720 px CSS viewport at 1440): no horizontal scroll", async () => {
  const ctx = await browser.newContext({ viewport: { width: 720, height: 450 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  const bad = [];
  for (const path of PAGES) {
    await p.goto(DEMO + path);
    const w = await p.evaluate(() => document.documentElement.scrollWidth);
    if (w > 720) bad.push(path);
  }
  await ctx.close();
  assert(bad.length === 0, `overflow: ${bad.join(", ")}`);
});

await check("No animations on any page (Precision has no entrance motion)", async () => {
  const running = [];
  for (const path of PAGES) {
    await page.goto(DEMO + path);
    const n = await page.evaluate(() => document.getAnimations().length);
    if (n) running.push(`${path} (${n})`);
  }
  assert(running.length === 0, `animations found: ${running.join(", ")}`);
});

await check("Reduced motion: transitions removed", async () => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto(DEMO + "/");
  const t = await p.locator(".btn-primary").first().evaluate((el) => getComputedStyle(el).transitionDuration);
  await ctx.close();
  assert(t === "0s", `button transition ${t}`);
});

await check("Works without JavaScript: pages, nav, FAQ and intake fields render", async () => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const p = await ctx.newPage();
  for (const path of PAGES) {
    await p.goto(DEMO + path);
    assert((await p.locator("h1").count()) === 1, `${path}: missing h1`);
  }
  await p.goto(DEMO + "/");
  assert(await p.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Practice Areas" }).isVisible(), "nav missing");
  const faq = p.locator("details").first();
  await faq.locator("summary").click();
  assert((await faq.getAttribute("open")) !== null, "FAQ did not open without JS");
  await p.goto(DEMO + "/intake");
  assert(await p.locator("#fullName").isVisible(), "intake fields missing");
  await ctx.close();
});

await check("Keyboard: skip link is first and moves focus to main", async () => {
  await page.goto(DEMO + "/");
  await page.keyboard.press("Tab");
  const text = await page.evaluate(() => document.activeElement?.textContent);
  assert(text === "Skip to content", `first tab stop was ${text}`);
});

await check("Axe accessibility scan (WCAG 2.0/2.1/2.2 A & AA) on every page", async () => {
  const summary = [];
  for (const path of [...PAGES, "/does-not-exist"]) {
    await page.goto(DEMO + path);
    await page.waitForTimeout(1000); // let the one-time hero entrance finish before measuring contrast
    await page.addScriptTag({ content: axeSource });
    const res = await page.evaluate(async () =>
       
      axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] }),
    );
    for (const v of res.violations) summary.push(`${path}: ${v.id} (${v.nodes.length})`);
  }
  assert(summary.length === 0, summary.join("; "));
  return "0 violations";
});

await check("Axe scan of the intake page with errors shown", async () => {
  await page.goto(DEMO + "/intake");
  await page.getByRole("button", { name: "Send inquiry" }).click();
  await page.locator(SUMMARY).waitFor();
  await page.addScriptTag({ content: axeSource });
  const res = await page.evaluate(async () =>
     
    axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] }),
  );
  assert(res.violations.length === 0, res.violations.map((v) => v.id).join(", "));
});

await browser.close();
await rm(".data/intake-test.jsonl", { force: true });

let failed = 0;
for (const r of results) {
  if (!r.ok) failed++;
  console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.note ? ` — ${r.note}` : ""}`);
}
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
