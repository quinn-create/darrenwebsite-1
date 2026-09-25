// Cookie consent checks (plans/cookie-consent-plan.md). Builds a separate copy of the site
// with dummy tracker IDs into .next-consent/, starts it on :3007, and intercepts every request
// to Google and Meta (nothing leaves the machine; stand-in scripts record that they loaded).
// Usage: npm run test:consent   (add --no-build to reuse an existing .next-consent build)
import { execSync, spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { chromium } from "playwright-core";

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const PORT = 3007;
const BASE = `http://localhost:${PORT}`;
const IDS = {
  NEXT_PUBLIC_GA_ID: "G-TEST123456",
  NEXT_PUBLIC_GOOGLE_ADS_ID: "AW-1234567890",
  NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL: "leadLabel01",
  NEXT_PUBLIC_GOOGLE_ADS_CALL_LABEL: "callLabel01",
  NEXT_PUBLIC_META_PIXEL_ID: "1234567890123",
};
const env = { ...process.env, ...IDS, NEXT_DIST_DIR: ".next-consent" };
const TRACKER_HOSTS = /googletagmanager\.com|google-analytics\.com|googleadservices\.com|doubleclick\.net|facebook\.net|facebook\.com/;

if (!process.argv.includes("--no-build")) {
  console.log("Building the test copy with dummy tracker IDs…");
  execSync("npx next build", { env, stdio: "ignore" });
}
const server = spawn("npx", ["next", "start", "-p", String(PORT)], { env, stdio: "ignore", detached: true });
for (let i = 0; i < 60; i++) {
  try {
    if ((await fetch(BASE + "/")).ok) break;
  } catch {}
  await new Promise((r) => setTimeout(r, 500));
}

const results = [];
async function check(name, fn) {
  try {
    results.push({ name, ok: true, note: await fn() });
  } catch (err) {
    results.push({ name, ok: false, note: err.message });
  }
}
function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium" });

// A fresh visitor. Tracker requests are recorded and answered with stand-in scripts.
async function visitor({ gpc = false, width = 1440, theme } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height: width > 500 ? 900 : 844 } });
  if (gpc) await ctx.addInitScript(() => Object.defineProperty(Navigator.prototype, "globalPrivacyControl", { get: () => true }));
  if (theme) await ctx.addInitScript((t) => localStorage.setItem("theme", t), theme);
  const hits = [];
  await ctx.route(TRACKER_HOSTS, (route) => {
    const url = route.request().url();
    hits.push(url);
    const body = /gtag\/js/.test(url)
      ? "window.__gtagLoaded = (window.__gtagLoaded || 0) + 1;"
      : /fbevents/.test(url)
        ? "window.__fbLoaded = true;"
        : "";
    route.fulfill({ status: 200, contentType: "application/javascript", body });
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  return { ctx, page, hits, errors };
}
const banner = (p) => p.locator('section[aria-labelledby="cookie-banner-title"]');
const consentCookie = async (ctx) => {
  const c = (await ctx.cookies()).find((x) => x.name === "dd_consent");
  return c ? JSON.parse(decodeURIComponent(c.value)) : null;
};
const dataLayer = (p) => p.evaluate(() => (window.dataLayer ?? []).map((a) => JSON.parse(JSON.stringify(Array.from(a)))));
const fbQueue = (p) => p.evaluate(() => (window.fbq?.queue ?? []).map((a) => JSON.parse(JSON.stringify(Array.from(a)))));
async function axe(p, where) {
  await p.addScriptTag({ content: axeSource });
  const r = await p.evaluate(async () => axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] }));
  return r.violations.map((v) => `${where} ${v.id}: ${v.nodes.map((n) => n.target).join(" ")}`);
}

await check("Consent 1: first visit shows the banner and loads nothing from Google or Meta", async () => {
  const { ctx, page, hits, errors } = await visitor();
  await page.goto(BASE + "/");
  await banner(page).waitFor();
  const buttons = banner(page).getByRole("button");
  assert((await buttons.allInnerTexts()).join("|") === "Accept all|Reject non-essential|Manage choices", "banner buttons");
  const classes = await buttons.evaluateAll((bs) => bs.map((b) => b.className));
  assert(new Set(classes).size === 1, `buttons not equally styled: ${classes.join(" / ")}`);
  await page.goto(BASE + "/practice-areas/dui-dwi/");
  await banner(page).waitFor();
  const cookies = (await ctx.cookies()).map((c) => c.name);
  assert(!cookies.some((n) => /^(_ga|_gcl|_fbp|_fbc|dd_consent)/.test(n)), `cookies before a choice: ${cookies}`);
  assert(hits.length === 0, `tracker requests before a choice: ${hits.join(", ")}`);
  assert((await page.evaluate(() => typeof window.gtag + typeof window.fbq)) === "undefinedundefined", "tag functions defined before a choice");
  assert(errors.length === 0, errors.join("; "));
  await ctx.close();
});

await check("Consent 2: Accept all loads the tags with safe settings (no ad personalisation, no Meta auto-config)", async () => {
  const { ctx, page, hits } = await visitor();
  await page.goto(BASE + "/");
  await banner(page).getByRole("button", { name: "Accept all" }).click();
  await page.waitForFunction(() => window.__gtagLoaded && window.__fbLoaded);
  assert(!(await banner(page).count()), "banner still shown");
  const c = await consentCookie(ctx);
  assert(c && c.analytics && c.marketing && !c.gpc, `cookie ${JSON.stringify(c)}`);
  assert(hits.some((h) => /gtag\/js\?id=G-TEST123456/.test(h)) && hits.some((h) => /fbevents\.js/.test(h)), `requests ${hits}`);
  const dl = await dataLayer(page);
  const def = dl.find((a) => a[0] === "consent" && a[1] === "default");
  assert(def && Object.values(def[2]).every((v) => v === "denied"), "consent default not all denied");
  const upd = dl.filter((a) => a[0] === "consent" && a[1] === "update").at(-1);
  assert(upd[2].analytics_storage === "granted" && upd[2].ad_storage === "granted" && upd[2].ad_personalization === "denied", `update ${JSON.stringify(upd)}`);
  const adsCfg = dl.find((a) => a[0] === "config" && a[1] === "AW-1234567890");
  assert(adsCfg && adsCfg[2].allow_ad_personalization_signals === false, "Ads config must disable personalisation");
  const gaCfg = dl.find((a) => a[0] === "config" && a[1] === "G-TEST123456");
  assert(gaCfg && gaCfg[2].allow_google_signals === false, "GA config must disable Google signals");
  assert(dl.some((a) => a[0] === "event" && a[1] === "page_view"), "no page_view");
  const fq = await fbQueue(page);
  const autoIdx = fq.findIndex((a) => a[0] === "set" && a[1] === "autoConfig" && a[2] === false);
  const initIdx = fq.findIndex((a) => a[0] === "init");
  assert(autoIdx >= 0 && autoIdx < initIdx, "autoConfig false must come before init");
  assert(fq[initIdx].length === 2, `init must carry no advanced-matching data: ${JSON.stringify(fq[initIdx])}`);
  assert(fq.some((a) => a[0] === "track" && a[1] === "PageView"), "no PageView");
  await ctx.close();
});

await check("Consent 3: Reject keeps everything off across pages", async () => {
  const { ctx, page, hits } = await visitor();
  await page.goto(BASE + "/");
  await banner(page).getByRole("button", { name: "Reject non-essential" }).click();
  for (const p of ["/practice-areas/dui-dwi/", "/about/", "/contact/?topic=dui-dwi"]) await page.goto(BASE + p);
  await page.waitForTimeout(500);
  const c = await consentCookie(ctx);
  assert(c && !c.analytics && !c.marketing, `cookie ${JSON.stringify(c)}`);
  assert(hits.length === 0, `tracker requests after reject: ${hits}`);
  assert(!(await banner(page).count()), "banner came back");
  await ctx.close();
});

await check("Consent 4: the choice persists across reloads", async () => {
  const { ctx, page } = await visitor();
  await page.goto(BASE + "/");
  await banner(page).getByRole("button", { name: "Accept all" }).click();
  await page.reload();
  await page.waitForTimeout(800);
  assert(!(await banner(page).count()), "banner shown again after reload");
  assert((await page.evaluate(() => window.__gtagLoaded)) >= 1, "tags not reloaded after reload");
  await ctx.close();
});

await check("Consent 5: Global Privacy Control — no banner, advertising off, nothing loaded", async () => {
  const { ctx, page, hits } = await visitor({ gpc: true });
  await page.goto(BASE + "/");
  await page.waitForTimeout(800);
  assert(!(await banner(page).count()), "banner shown despite GPC");
  const c = await consentCookie(ctx);
  assert(c && c.gpc && !c.marketing && !c.analytics, `cookie ${JSON.stringify(c)}`);
  assert(hits.length === 0, `requests with GPC: ${hits}`);
  await page.getByRole("button", { name: "Do Not Sell or Share My Personal Information" }).click();
  const box = page.getByRole("checkbox", { name: /Advertising/ });
  assert(await box.isDisabled(), "advertising toggle should be locked off under GPC");
  assert(await page.getByText("Your browser sent a Global Privacy Control signal").isVisible(), "GPC note missing");
  // Even "Accept all" can't turn advertising on under GPC.
  await page.getByRole("dialog").getByRole("button", { name: "Accept all" }).click();
  const c2 = await consentCookie(ctx);
  assert(c2.analytics && !c2.marketing, `after accept under GPC: ${JSON.stringify(c2)}`);
  await page.waitForTimeout(300);
  assert(!hits.some((h) => /facebook|googleadservices/.test(h)), `ad requests under GPC: ${hits}`);
  await ctx.close();
});

await check("Consent 6: footer links reopen settings; turning advertising off deletes its cookies and revokes Meta", async () => {
  const { ctx, page } = await visitor();
  await page.goto(BASE + "/");
  await banner(page).getByRole("button", { name: "Accept all" }).click();
  await page.waitForFunction(() => window.__fbLoaded);
  await ctx.addCookies([
    { name: "_fbp", value: "fb.1.1.1", domain: "localhost", path: "/" },
    { name: "_gcl_au", value: "1.1.1", domain: "localhost", path: "/" },
    { name: "_ga", value: "GA1.1.1", domain: "localhost", path: "/" },
  ]);
  await page.getByRole("button", { name: "Cookie settings" }).click();
  const dialog = page.getByRole("dialog", { name: "Cookie settings" });
  await dialog.waitFor();
  await dialog.getByRole("checkbox", { name: /Advertising/ }).uncheck();
  await dialog.getByRole("button", { name: "Save choices" }).click();
  const names = (await ctx.cookies()).map((c) => c.name);
  assert(!names.includes("_fbp") && !names.includes("_gcl_au"), `ad cookies not deleted: ${names}`);
  assert(names.includes("_ga"), "statistics cookie should stay (statistics still on)");
  const fq = await fbQueue(page);
  assert(fq.some((a) => a[0] === "consent" && a[1] === "revoke"), "Meta consent not revoked");
  const upd = (await dataLayer(page)).filter((a) => a[0] === "consent" && a[1] === "update").at(-1);
  assert(upd[2].ad_storage === "denied" && upd[2].analytics_storage === "granted", `update ${JSON.stringify(upd)}`);
  await page.getByRole("button", { name: "Do Not Sell or Share My Personal Information" }).click();
  await dialog.waitFor();
  const focused = await page.evaluate(() => document.activeElement?.closest("label")?.textContent ?? "");
  assert(/Advertising/.test(focused), "Do Not Sell link should focus the advertising choice");
  await ctx.close();
});

await check("Consent 7: keyboard — Tab reaches the banner; Escape closes settings without accepting", async () => {
  const { ctx, page } = await visitor();
  await page.goto(BASE + "/");
  await banner(page).waitFor();
  let reached = false;
  for (let i = 0; i < 60 && !reached; i++) {
    await page.keyboard.press("Tab");
    reached = await page.evaluate(() => document.activeElement?.textContent === "Accept all");
  }
  assert(reached, "Tab never reached the banner");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter"); // Manage choices
  const dialog = page.getByRole("dialog", { name: "Cookie settings" });
  await dialog.waitFor();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
  assert(!(await dialog.isVisible()), "Escape did not close the dialog");
  assert((await consentCookie(ctx)) === null, "closing the dialog must not store a choice");
  assert(await banner(page).isVisible(), "banner should still ask");
  await ctx.close();
});

await check("Consent 8: no inquiry details reach the tags (?topic stripped, page_location clean)", async () => {
  const { ctx, page, hits } = await visitor();
  await page.goto(BASE + "/");
  await banner(page).getByRole("button", { name: "Accept all" }).click();
  await page.waitForFunction(() => window.__gtagLoaded);
  await page.goto(BASE + "/contact/?topic=dui-dwi");
  await page.waitForFunction(() => location.search === "");
  assert(await page.getByText("Asking about:").isVisible(), "topic chip should still show");
  const dl = JSON.stringify(await dataLayer(page));
  assert(!/topic=|\?/.test(dl.replace(/gtag\/js\?id=/g, "")), `query string reached dataLayer: ${dl.match(/.{40}topic.{20}/)}`);
  assert(!hits.some((h) => /topic=/.test(h)), `topic in a tracker request: ${hits}`);
  await ctx.close();
});

await check("Consent 9: a sent form reports only 'lead' — no names, numbers or message", async () => {
  const { ctx, page } = await visitor();
  await page.goto(BASE + "/");
  await banner(page).getByRole("button", { name: "Accept all" }).click();
  await page.waitForFunction(() => window.__gtagLoaded && window.__fbLoaded);
  await page.goto(BASE + "/contact/");
  await page.route("**/api/contact/", (r) => r.fulfill({ status: 200, contentType: "application/json", body: '{"status":"accepted"}' }));
  await page.locator("#cf-yourName").fill("Zed Testperson");
  await page.locator("form").getByText("Arrested in Rutherford County").click();
  await page.locator("form").getByText("Call", { exact: true }).first().click();
  await page.locator("#cf-phone").fill("615-555-0199");
  await page.locator("form").getByText("Sometime this week").click();
  await page.locator("#cf-message").fill("Secret detail xyzzy");
  await page.getByRole("button", { name: "Send message" }).click();
  await page.locator('[role="status"]').first().waitFor();
  const dl = await dataLayer(page);
  const fq = await fbQueue(page);
  assert(dl.some((a) => a[0] === "event" && a[1] === "generate_lead"), "no GA generate_lead");
  assert(dl.some((a) => a[0] === "event" && a[1] === "conversion" && a[2].send_to === "AW-1234567890/leadLabel01"), "no Ads lead conversion");
  assert(fq.some((a) => a[0] === "track" && a[1] === "Lead" && a.length === 2), "no Meta Lead (or it carried data)");
  const all = JSON.stringify([dl, fq]);
  for (const secret of ["Zed", "Testperson", "555-0199", "5550199", "xyzzy", "rutherford"]) assert(!all.toLowerCase().includes(secret.toLowerCase()), `"${secret}" reached a tag`);
  await ctx.close();
});

await check("Consent 10: tapping the phone number reports only 'call'", async () => {
  const { ctx, page } = await visitor();
  await page.goto(BASE + "/");
  await banner(page).getByRole("button", { name: "Accept all" }).click();
  await page.waitForFunction(() => window.__gtagLoaded);
  await page.evaluate(() => document.addEventListener("click", (e) => e.target.closest?.('a[href^="tel:"]') && e.preventDefault()));
  await page.locator('main a[href^="tel:"]').first().click();
  const dl = await dataLayer(page);
  assert(dl.some((a) => a[0] === "event" && a[1] === "phone_tap"), "no GA phone_tap");
  assert(dl.some((a) => a[0] === "event" && a[1] === "conversion" && a[2].send_to === "AW-1234567890/callLabel01"), "no Ads call conversion");
  assert((await fbQueue(page)).some((a) => a[0] === "track" && a[1] === "Contact" && a.length === 2), "no Meta Contact");
  await ctx.close();
});

await check("Consent 11: axe finds 0 violations with the banner and with settings open (both themes, 1440 and 390)", async () => {
  const problems = [];
  for (const theme of ["dark", "light"]) {
    for (const width of [1440, 390]) {
      const { ctx, page } = await visitor({ theme, width });
      await page.goto(BASE + "/");
      await banner(page).waitFor();
      problems.push(...(await axe(page, `${theme} ${width} banner`)));
      await banner(page).getByRole("button", { name: "Manage choices" }).click();
      await page.getByRole("dialog").waitFor();
      problems.push(...(await axe(page, `${theme} ${width} settings`)));
      await ctx.close();
    }
  }
  const { ctx, page } = await visitor();
  await page.goto(BASE + "/privacy/");
  problems.push(...(await axe(page, "privacy")));
  await ctx.close();
  assert(problems.length === 0, problems.join("; "));
});

await check("Consent 12: the banner never covers the phone call bar, and causes no layout shift", async () => {
  const { ctx, page } = await visitor({ width: 390 });
  await page.goto(BASE + "/practice-areas/dui-dwi/");
  await banner(page).waitFor();
  const bar = page.getByRole("link", { name: "Ask about DUI/DWI" });
  await bar.waitFor();
  const b = await banner(page).boundingBox();
  const s = await bar.boundingBox();
  assert(b.y + b.height <= s.y - 8, `banner (bottom ${b.y + b.height}) overlaps the call bar (top ${s.y})`);
  await page.reload();
  const cls = await page.evaluate(() => new Promise((res) => {
    let t = 0;
    new PerformanceObserver((l) => l.getEntries().forEach((e) => (t += e.value))).observe({ type: "layout-shift", buffered: true });
    setTimeout(() => res(t), 1500);
  }));
  assert(cls === 0, `CLS ${cls}`);
  await ctx.close();
});

await check("Consent 13: privacy notice lists exactly the configured tags", async () => {
  const { ctx, page } = await visitor();
  await page.goto(BASE + "/privacy/");
  const text = await page.locator("main").innerText();
  for (const s of ["Google Analytics", "Google Ads", "Meta Platforms", "_ga, _ga_*", "_gcl_*", "_fbp, _fbc", "dd_consent", "Global Privacy Control", "Do Not Sell or Share"]) {
    assert(text.includes(s), `privacy notice missing "${s}"`);
  }
  assert(!text.includes("doesn't use advertising or tracking cookies"), "old 'no cookies' sentence still shown");
  await page.getByRole("button", { name: "Open cookie settings" }).click();
  await page.getByRole("dialog", { name: "Cookie settings" }).waitFor();
  await ctx.close();
});

await browser.close();
try {
  process.kill(-server.pid);
} catch {}

let failed = 0;
for (const r of results) {
  if (!r.ok) failed++;
  console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.note ? ` — ${r.note}` : ""}`);
}
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
