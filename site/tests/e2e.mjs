// End-to-end checks for the Signal preview. Uses test data only.
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
const PAGES = ["/", "/practice-areas/", "/practice-areas/first-time-offenders/", "/practice-areas/domestic-assault/", "/practice-areas/criminal-defense/", "/about/", "/contact/", "/intake/", "/privacy/", "/accessibility/", "/legal-notice/"];

const results = [];
const SUMMARY = '[aria-labelledby="contact-error-title"]';
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

// The site's one form (components/ui/form-1.tsx), on /intake/ and /contact/.
async function fillValid(page, { reach = "Call" } = {}) {
  await page.locator("#cf-yourName").fill(`Test Person ${RUN}-${++seq}`);
  await page.locator("form").getByText("Arrested in Rutherford County").click();
  await page.locator("form").getByText(reach, { exact: true }).first().click();
  if (reach === "Email") await page.locator("#cf-email").fill("test@example.com");
  else await page.locator("#cf-phone").fill("615-555-0123");
  await page.locator("form").getByText("Sometime this week").click();
  await page.locator("#cf-message").fill("Test inquiry, please ignore.");
}

await rm(".data/intake-test.jsonl", { force: true });
const browser = await chromium.launch({ executablePath });
const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await desktop.newPage();

await check("Required-field errors: summary gets focus and lists each problem", async () => {
  await page.goto(DEMO + "/intake/");
  await page.getByRole("button", { name: "Send message" }).click();
  const summary = page.locator(SUMMARY);
  await summary.waitFor();
  const focused = await page.evaluate(() => document.activeElement?.getAttribute("role"));
  assert(focused === "alert", "error summary not focused");
  const items = await summary.locator("li").count();
  assert(items === 4, `expected 4 errors (name, about, reach, callback), got ${items}`);
  const invalid = await page.locator("#cf-yourName").getAttribute("aria-invalid");
  assert(invalid === "true", "name field not marked invalid");
  return `${items} errors listed`;
});

await check("Summary link moves focus to the field", async () => {
  await page.locator(SUMMARY).getByRole("link").first().click();
  const id = await page.evaluate(() => document.activeElement?.id);
  assert(id === "cf-yourName", `focus went to ${id}`);
});

await check("Call/text needs a phone, email needs an email; bad values rejected; ASAP shows the callback note", async () => {
  await page.locator("#cf-yourName").fill("Test Person");
  await page.locator("form").getByText("Other", { exact: true }).click();
  await page.locator("form").getByText("Text", { exact: true }).click();
  assert(await page.locator("#cf-phone-error").isVisible(), "phone should be required after choosing Text");
  await page.locator("form").getByText("Email", { exact: true }).first().click();
  await page.locator("#cf-email").fill("not-an-email");
  await page.locator("#cf-phone").fill("12");
  await page.locator("form").getByText("As soon as possible").click();
  assert(await page.getByText("We generally return calls within a day").isVisible(), "ASAP note missing");
  await page.getByRole("button", { name: "Send message" }).click();
  const text = await page.locator(SUMMARY).innerText();
  assert(/Email: Enter an email address like/.test(text), "email format error missing");
  assert(/Phone: Enter a 10-digit/.test(text), "bad phone should be flagged");
  await page.locator("#cf-phone").fill("615-555-0123");
  await page.locator("#cf-email").fill("test@example.com");
  await page.waitForTimeout(100);
  assert((await page.locator(SUMMARY).count()) === 0, "errors should clear once fixed");
  await page.locator("form").getByText("Sometime this week").click();
  assert(!(await page.getByText("We generally return calls within a day").isVisible()), "ASAP note should hide");
});

await check("Demo mode: 'not connected' note shown, nothing claimed as sent, values kept", async () => {
  await page.goto(DEMO + "/intake/");
  assert(await page.locator("#contact-demo-note").isVisible(), "demo note missing");
  await fillValid(page);
  await page.getByRole("button", { name: "Send message" }).click();
  await page.getByText("Not sent: this demo form isn't connected yet.").waitFor();
  assert((await page.getByText("Message received").count()) === 0, "must not show success");
  assert((await page.locator("#cf-yourName").inputValue()).startsWith("Test Person"), "values not preserved");
});

await check("Configured (test destination): 'Sending…' state, success only after server acceptance", async () => {
  await page.goto(LIVE + "/intake/");
  assert((await page.locator("#contact-demo-note").count()) === 0, "demo note should be hidden when configured");
  await page.locator("#cf-yourName").fill(`Test Person ${RUN}-${++seq}`);
  await page.locator("#cf-clientName").fill("Test Client");
  await page.locator("form").getByText("Arrested in Rutherford County").click();
  await page.locator("form").getByText("Other", { exact: true }).click();
  await page.locator("form").getByText("Call", { exact: true }).click();
  await page.locator("form").getByText("Email", { exact: true }).first().click();
  await page.locator("#cf-phone").fill("615-555-0123");
  await page.locator("#cf-email").fill("test@example.com");
  await page.locator("form").getByText("As soon as possible").click();
  await page.route("**/api/contact/", async (route) => {
    await new Promise((r) => setTimeout(r, 800));
    await route.continue();
  });
  await page.getByRole("button", { name: "Send message" }).click();
  const sending = page.getByRole("button", { name: "Sending…" });
  await sending.waitFor();
  assert(await sending.isDisabled(), "button should be disabled while sending");
  await page.getByText("Your inquiry was received. Submitting it does not establish representation.").waitFor();
  const focusedRole = await page.evaluate(() => document.activeElement?.getAttribute("role"));
  assert(focusedRole === "status", "success message should receive focus");
  await page.unroute("**/api/contact/");
  const lines = (await readFile(".data/intake-test.jsonl", "utf8")).trim().split("\n");
  assert(lines.length === 1, `expected 1 stored test inquiry, got ${lines.length}`);
  const saved = JSON.parse(lines[0]);
  assert(
    saved.clientName === "Test Client" && saved.about.length === 2 && saved.reach.join(",") === "call,email" && saved.callback === "asap",
    JSON.stringify(saved),
  );
});

await check("Double-click submit sends only once", async () => {
  await page.goto(LIVE + "/intake/");
  await fillValid(page, { reach: "Email" });
  await page.locator("#cf-message").fill("Double click test.");
  let posts = 0;
  await page.route("**/api/contact/", async (route) => {
    posts++;
    await new Promise((r) => setTimeout(r, 500));
    await route.continue();
  });
  await page.getByRole("button", { name: "Send message" }).dblclick();
  await page.getByText("Message received").waitFor();
  await page.unroute("**/api/contact/");
  assert(posts === 1, `expected 1 request, got ${posts}`);
  const lines = (await readFile(".data/intake-test.jsonl", "utf8")).trim().split("\n");
  assert(lines.length === 2, `expected 2 stored test inquiries total, got ${lines.length}`);
});

await check("Network failure: values kept, retry offered, retry succeeds", async () => {
  await page.goto(LIVE + "/intake/");
  await fillValid(page);
  await page.locator("#cf-message").fill("Network failure test.");
  await page.route("**/api/contact/", (route) => route.abort("failed"));
  await page.getByRole("button", { name: "Send message" }).click();
  await page.getByText("could not be sent because of a connection problem").waitFor();
  assert((await page.locator("#cf-message").inputValue()) === "Network failure test.", "values lost");
  assert(await page.getByRole("link", { name: "(615) 546-5551" }).first().isVisible(), "phone link missing");
  await page.unroute("**/api/contact/");
  await page.getByRole("button", { name: "Send message" }).click();
  await page.getByText("Message received").waitFor();
});

await check("Keyboard-only completion of the form", async () => {
  await page.goto(LIVE + "/intake/");
  await page.locator("#cf-yourName").focus();
  await page.keyboard.type("Keyboard Tester");
  await page.keyboard.press("Tab"); // client's name
  await page.keyboard.press("Tab"); // "Arrested in Rutherford County"
  await page.keyboard.press("Space");
  await page.keyboard.press("Tab"); // "Other"
  await page.keyboard.press("Tab"); // "Call"
  await page.keyboard.press("Tab"); // "Text"
  await page.keyboard.press("Tab"); // "Email"
  await page.keyboard.press("Space");
  await page.keyboard.press("Tab"); // phone
  await page.keyboard.press("Tab"); // email
  await page.keyboard.type("keyboard@example.com");
  await page.keyboard.press("Tab"); // callback group (first radio)
  await page.keyboard.press("Space");
  await page.keyboard.press("Enter");
  await page.getByText("Message received").waitFor({ timeout: 5000 });
});

await check("Phone tab bar: visible without opening anything, works without JavaScript, marks the current page", async () => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  const p = await ctx.newPage();
  await p.goto(DEMO + "/about/");
  const nav = p.getByRole("navigation", { name: "Main (phone)" });
  assert(await nav.isVisible(), "phone tab bar not visible");
  const links = await nav.getByRole("link").allInnerTexts();
  assert(links.join("|") === "Home|Practice|About|Contact", `tabs: ${links.join(", ")}`);
  const current = await nav.locator('[aria-current="page"]').getAttribute("aria-label");
  assert(current === "About Darren", `current tab: ${current}`);
  await nav.getByRole("link", { name: "Practice Areas" }).click();
  await p.waitForURL("**/practice-areas/");
  assert((await p.getByRole("navigation", { name: "Main", exact: true }).isVisible()) === false, "desktop tabs should be hidden on phones");
  await ctx.close();
});

await check("Desktop tabs: current page marked, and every tab is at least 44 px tall", async () => {
  await page.goto(DEMO + "/practice-areas/dui-dwi/");
  const nav = page.getByRole("navigation", { name: "Main", exact: true });
  const current = await nav.locator('[aria-current="page"]').innerText();
  assert(current === "Practice Areas", `current tab: ${current}`);
  const heights = await nav.getByRole("link").evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height));
  assert(heights.every((h) => h >= 44), `tab heights: ${heights.join(", ")}`);
});

await check("Mobile hero: headline and CTA appear before the portrait; sticky bar hidden while hero CTA visible", async () => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  await p.goto(DEMO + "/");
  const cta = await p.locator("[data-hero-cta]").boundingBox();
  const img = await p.getByAltText("Darren Drake, attorney at law").boundingBox();
  assert(cta && img && cta.y < img.y, "CTA not above portrait");
  assert(img.height <= 321, `portrait height ${img.height} exceeds 320`);
  await p.waitForTimeout(300);
  const barAtTop = await p.locator(".fixed.bottom-0").count();
  await p.mouse.wheel(0, 1400);
  await p.waitForTimeout(400);
  const barAfterScroll = await p.locator(".fixed.bottom-0").count();
  assert(barAtTop === 0 && barAfterScroll === 1, `sticky bar top=${barAtTop} after=${barAfterScroll}`);
  await ctx.close();
  return `portrait ${Math.round(img.height)}px tall`;
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

await check("Reduced motion: no hero animation", async () => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto(DEMO + "/");
  const anim = await p.locator(".hero-rise").first().evaluate((el) => getComputedStyle(el).animationName);
  const glow = await p.locator(".portrait-glow").evaluate((el) => getComputedStyle(el).animationName);
  await ctx.close();
  assert(anim === "none" && glow === "none", `animations still running: ${anim}, ${glow}`);
});

await check("Motion allowed: hero entrance runs once (420 ms)", async () => {
  await page.goto(DEMO + "/");
  const info = await page.locator(".hero-rise").first().evaluate((el) => {
    const s = getComputedStyle(el);
    return `${s.animationName} ${s.animationDuration} x${s.animationIterationCount}`;
  });
  assert(info === "rise 0.42s x1", info);
  return info;
});

await check("Keyboard: skip link is first and moves focus to main", async () => {
  await page.goto(DEMO + "/");
  await page.keyboard.press("Tab");
  const text = await page.evaluate(() => document.activeElement?.textContent);
  assert(text === "Skip to content", `first tab stop was ${text}`);
});

await check("Old WordPress addresses: one-hop permanent redirects, and 'gone' (410) for junk", async () => {
  const REDIRECTS = {
    "/areas-of-practice/": "/practice-areas/",
    "/areas-of-practice/criminaldefense/": "/practice-areas/criminal-defense/",
    "/areas-of-practice/dui/": "/practice-areas/dui-dwi/",
    "/areas-of-practice/expungement/": "/practice-areas/expungement/",
    "/areas-of-practice/juvenile-defense/": "/practice-areas/criminal-defense/",
    "/criminal-defense/": "/practice-areas/criminal-defense/",
    "/dui/": "/practice-areas/dui-dwi/",
    "/expungement/": "/practice-areas/expungement/",
    "/testimonials/": "/about/",
    "/blog/": "/",
    "/sitemap_index.xml": "/sitemap.xml",
    "/criminal-defense/darren_drake/": "/about/",
    "/contact/ruco/": "/contact/",
    "/?page_id=2": "/contact/",
    "/?page_id=12": "/",
    "/intake": "/intake/",
  };
  const GONE = ["/submit-a-testimonial/", "/wp-login.php", "/wp-admin/", "/xmlrpc.php", "/feed/", "/contact/feed/",
    "/?s=test", "/?p=999", "/6668243_qpkgeeqfkxmexnek_24_come_9021_/", "/criminal-defense/john_drake/", "/category/news/",
    "/wp-content/uploads/2016/09/google061b36be2fc32f66.html"];
  const bad = [];
  for (const [from, to] of Object.entries(REDIRECTS)) {
    const r1 = await fetch(DEMO + from, { redirect: "manual" });
    const loc = new URL(r1.headers.get("location") ?? "", DEMO);
    if (![301, 308].includes(r1.status) || loc.pathname !== new URL(to, DEMO).pathname) {
      bad.push(`${from} -> ${r1.status} ${loc.pathname}`);
      continue;
    }
    const r2 = await fetch(loc, { redirect: "manual" });
    if (r2.status !== 200) bad.push(`${from} -> ${loc.pathname} second hop ${r2.status}`);
  }
  // Old addresses typed without the ending "/" (the old site never used these as its own
  // addresses): Next.js adds the "/" first, so allow two hops, ending on the right page.
  for (const [from, to] of [["/areas-of-practice", "/practice-areas/"], ["/dui", "/practice-areas/dui-dwi/"]]) {
    const r = await fetch(DEMO + from, { redirect: "follow" });
    if (r.status !== 200 || new URL(r.url).pathname !== to || r.redirected !== true) bad.push(`${from} (no slash) ended at ${r.status} ${new URL(r.url).pathname}`);
  }
  for (const path of GONE) {
    const r = await fetch(DEMO + path, { redirect: "manual" });
    if (r.status !== 410) bad.push(`${path} -> ${r.status} (expected 410)`);
  }
  assert(bad.length === 0, bad.join("; "));
  return `${Object.keys(REDIRECTS).length} redirects, ${GONE.length} gone`;
});

await check("Sitemap lists every page; previews are hidden from search engines", async () => {
  const sm = await (await fetch(DEMO + "/sitemap.xml")).text();
  const missing = PAGES.filter((p) => !sm.includes(`https://ddrakelaw.com${p}</loc>`));
  assert(missing.length === 0, `missing from sitemap: ${missing.join(", ")}`);
  const robots = await (await fetch(DEMO + "/robots.txt")).text();
  assert(/Disallow: \/\s*$/m.test(robots), "preview robots.txt should disallow everything");
  await page.goto(DEMO + "/");
  const meta = await page.locator('meta[name="robots"]').getAttribute("content");
  assert(/noindex/.test(meta ?? ""), `preview robots meta is ${meta}`);
});

await check("Every cyan button is at least 52 px tall", async () => {
  const small = [];
  for (const [w, paths] of [[1440, PAGES], [390, ["/", "/intake/"]]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
    const p = await ctx.newPage();
    for (const path of paths) {
      await p.goto(DEMO + path);
      const hs = await p.locator(".btn-primary:visible").evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height));
      hs.forEach((h) => h < 51.5 && small.push(`${w}px ${path}: ${h}px`));
    }
    await ctx.close();
  }
  assert(small.length === 0, small.join("; "));
});

await check("Axe scan at phone and tablet widths", async () => {
  const summary = [];
  for (const width of [390, 768]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    const p = await ctx.newPage();
    for (const path of PAGES) {
      await p.goto(DEMO + path);
      await p.addScriptTag({ content: axeSource });
      const res = await p.evaluate(async () => axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] }));
      for (const v of res.violations) summary.push(`${width}px ${path}: ${v.id} (${v.nodes.length})`);
    }
    await ctx.close();
  }
  assert(summary.length === 0, summary.join("; "));
  return "0 violations";
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
  await page.goto(DEMO + "/intake/");
  await page.getByRole("button", { name: "Send message" }).click();
  await page.locator(SUMMARY).waitFor();
  await page.addScriptTag({ content: axeSource });
  const res = await page.evaluate(async () =>
     
    axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] }),
  );
  assert(res.violations.length === 0, res.violations.map((v) => v.id).join(", "));
});

await check("Home shows the three featured practice areas; Practice Areas lists all five", async () => {
  await page.goto(DEMO + "/");
  const home = await page.locator("main ul.grid li.card h3").allInnerTexts();
  assert(home.join("|") === "First-Time Offenders|DUI/DWI|Domestic Assault", `home cards: ${home.join(", ")}`);
  await page.goto(DEMO + "/practice-areas/");
  const all = await page.locator("main li.card h2").count();
  assert(all === 5, `expected 5 practice areas, got ${all}`);
  return home.join(", ");
});

await check("Contact page uses the same form", async () => {
  await page.goto(DEMO + "/contact/");
  assert(await page.locator("#cf-yourName").isVisible(), "form missing on /contact/");
  assert((await page.getByText("full intake form").count()) === 0, "old intake-form link should be gone");
});

await check("Axe scan of the contact page with errors shown", async () => {
  await page.goto(DEMO + "/contact/");
  await page.getByRole("button", { name: "Send message" }).click();
  await page.locator(SUMMARY).waitFor();
  await page.addScriptTag({ content: axeSource });
  const res = await page.evaluate(async () =>
     
    axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] }),
  );
  assert(res.violations.length === 0, res.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" ")}`).join(", "));
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
