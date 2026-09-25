// End-to-end checks for the Signal preview. Uses test data only.
// Needs two servers from the same build:
//   next start -p 3000                                  (no destination: demo mode)
//   INTAKE_DESTINATION=local-test next start -p 3001    (writes to .data/intake-test.jsonl)
// Usage: node tests/e2e.mjs
import { readFile, rm } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { chromium } from "playwright-core";
import { chromiumPath } from "./browser.mjs";

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const DEMO = "http://localhost:3000";
const LIVE = "http://localhost:3001";
const executablePath = chromiumPath();
const PAGES = ["/", "/practice-areas/", "/practice-areas/first-time-offenders/", "/practice-areas/domestic-assault/", "/practice-areas/criminal-defense/", "/about/", "/contact/", "/privacy/", "/accessibility/", "/legal-notice/"];

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

// The site's one form (components/ui/form-1.tsx), on the Contact page (/intake/ redirects there).
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
  await page.goto(DEMO + "/contact/");
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
  await page.goto(DEMO + "/contact/");
  assert(await page.locator("#contact-demo-note").isVisible(), "demo note missing");
  await fillValid(page);
  await page.getByRole("button", { name: "Send message" }).click();
  await page.getByText("Not sent: this demo form isn't connected yet.").waitFor();
  assert((await page.getByText("Message received").count()) === 0, "must not show success");
  assert((await page.locator("#cf-yourName").inputValue()).startsWith("Test Person"), "values not preserved");
});

await check("Configured (test destination): 'Sending…' state, success only after server acceptance", async () => {
  await page.goto(LIVE + "/contact/");
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
  await page.goto(LIVE + "/contact/");
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
  await page.goto(LIVE + "/contact/");
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
  await page.goto(LIVE + "/contact/");
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
    "/intake/": "/contact/",
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
  for (const [w, paths] of [[1440, PAGES], [390, ["/", "/contact/"]]]) {
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

await check("Axe scan of the Contact page form with errors shown (laptop)", async () => {
  await page.goto(DEMO + "/contact/");
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

await check("Home carousel: every practice area, arrows scroll it, no autoplay", async () => {
  await page.goto(DEMO + "/");
  const region = page.locator('[aria-roledescription="carousel"]');
  const slides = region.locator('[aria-roledescription="slide"]');
  assert((await slides.count()) === 5, `expected 5 slides, got ${await slides.count()}`);
  const prev = region.getByRole("button", { name: "Previous practice areas" });
  const next = region.getByRole("button", { name: "Next practice areas" });
  await page.waitForTimeout(300);
  assert(await prev.isDisabled(), "Previous should be disabled at the start");
  const list = region.locator("ul");
  const before = await list.evaluate((el) => el.scrollLeft);
  await page.waitForTimeout(1500);
  assert((await list.evaluate((el) => el.scrollLeft)) === before, "carousel moved on its own");
  await next.click();
  await page.waitForTimeout(800);
  assert((await list.evaluate((el) => el.scrollLeft)) > before, "Next didn't scroll");
  assert(!(await prev.isDisabled()), "Previous should be enabled after scrolling");
});

await check("Phone bar on a practice page: \"Ask about\" that area, opens the form with the topic, topic is delivered", async () => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto(LIVE + "/practice-areas/dui-dwi/");
  await p.waitForTimeout(400);
  const bar = p.locator(".fixed.bottom-0");
  await bar.waitFor();
  const ask = bar.getByRole("link", { name: "Ask about DUI/DWI" });
  assert(await ask.isVisible(), "bar should read \"Ask about DUI/DWI\"");
  assert(await bar.getByRole("link", { name: "Call (615) 546-5551" }).isVisible(), "call button missing");
  await ask.click();
  await p.waitForURL("**/contact/?topic=dui-dwi");
  assert(await p.getByText("Asking about:").isVisible(), "topic label missing on the form");
  await p.locator("#cf-yourName").fill(`Topic Tester ${RUN}`);
  await p.locator("form").getByText("Other", { exact: true }).click();
  await p.locator("form").getByText("Call", { exact: true }).click();
  await p.locator("#cf-phone").fill("615-555-0123");
  await p.locator("form").getByText("Sometime this week").click();
  await p.getByRole("button", { name: "Send message" }).click();
  await p.getByText("Message received").waitFor();
  const lines = (await readFile(".data/intake-test.jsonl", "utf8")).trim().split("\n");
  const saved = JSON.parse(lines.at(-1));
  assert(saved.topic === "DUI/DWI", `saved topic: ${saved.topic}`);
  await p.goto(DEMO + "/contact/?topic=not-a-practice");
  assert((await p.getByText("Asking about:").count()) === 0, "unknown topics must be ignored");
  await ctx.close();
});

// ---- FAQ "Jump to" buttons (plans/faq-jump-links-plan.md, section 6.1) ----
const JUMP_NAV = 'nav[aria-label="Jump to a FAQ topic"]';
const PRACTICE_SLUGS = ["first-time-offenders", "dui-dwi", "domestic-assault", "criminal-defense", "expungement"];

await check("FAQ jump 1: home page shows two jump buttons in topic order", async () => {
  await page.goto(DEMO + "/");
  const nav = page.locator(JUMP_NAV);
  assert(await nav.isVisible(), "jump nav missing on home");
  const labels = await nav.getByRole("link").allInnerTexts();
  assert(labels.join("|") === "Getting started|Working with the office", `labels: ${labels.join(", ")}`);
});

await check("FAQ jump 2: practice pages have no jump buttons and keep their two FAQs", async () => {
  for (const slug of PRACTICE_SLUGS) {
    await page.goto(`${DEMO}/practice-areas/${slug}/`);
    assert((await page.locator(JUMP_NAV).count()) === 0, `${slug}: jump nav should not show`);
    const n = await page.locator("section[aria-labelledby=faq] details").count();
    assert(n === 2, `${slug}: expected 2 FAQs, got ${n}`);
  }
});

await check("FAQ jump 3: a button scrolls below the sticky header, opens the group's first question and focuses it", async () => {
  await page.goto(DEMO + "/");
  await page.locator(JUMP_NAV).getByRole("link", { name: "Working with the office" }).click();
  await page.waitForTimeout(900);
  const group = page.locator("#faq-faq-working-with-us");
  const headTop = (await group.locator("h3").boundingBox()).y;
  const headerBottom = await page.evaluate(() => document.querySelector("header").getBoundingClientRect().bottom);
  assert(headTop >= headerBottom - 1, `group heading at ${headTop}, header ends at ${headerBottom}`);
  assert(await group.locator("details").first().evaluate((d) => d.open), "first question not opened");
  const focused = await page.evaluate(() => {
    const el = document.activeElement;
    return el?.tagName === "SUMMARY" && !!el.closest("#faq-faq-working-with-us");
  });
  assert(focused, "focus not on the group's first question");
});

await check("FAQ jump 4: works without JavaScript (address changes, group scrolled into view)", async () => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const p = await ctx.newPage();
  await p.goto(DEMO + "/");
  await p.locator(JUMP_NAV).getByRole("link", { name: "Working with the office" }).click();
  await p.waitForTimeout(400);
  assert(p.url().endsWith("#faq-faq-working-with-us"), `url: ${p.url()}`);
  const box = await p.locator("#faq-faq-working-with-us").boundingBox();
  assert(box.y >= 0 && box.y < 900, `group not in view (y=${box.y})`);
  await ctx.close();
});

await check("FAQ jump 5: keyboard reaches each button with a visible focus ring; Enter jumps", async () => {
  await page.goto(DEMO + "/");
  let label = "";
  for (let i = 0; i < 80 && label !== "Getting started"; i++) {
    await page.keyboard.press("Tab");
    label = await page.evaluate(() => (document.activeElement?.closest('nav[aria-label="Jump to a FAQ topic"]') ? document.activeElement.textContent.trim() : ""));
  }
  assert(label === "Getting started", "Tab never reached the first jump button");
  const ring1 = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
  await page.keyboard.press("Tab");
  const second = await page.evaluate(() => document.activeElement.textContent.trim());
  assert(second === "Working with the office", `second tab stop: ${second}`);
  const ring2 = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
  assert(ring1 !== "none" && ring2 !== "none", `focus ring missing (${ring1}, ${ring2})`);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(900);
  assert(await page.locator("#faq-faq-working-with-us details").first().evaluate((d) => d.open), "Enter did not open the group");
});

await check("FAQ jump 6: buttons are at least 44 px tall on a phone", async () => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  await p.goto(DEMO + "/");
  const heights = await p.locator(`${JUMP_NAV} a`).evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height));
  assert(heights.length === 2 && heights.every((h) => h >= 44), `heights: ${heights.join(", ")}`);
  await ctx.close();
});

await check("FAQ jump 7: no sideways scroll at 320 px", async () => {
  const ctx = await browser.newContext({ viewport: { width: 320, height: 800 } });
  const p = await ctx.newPage();
  await p.goto(DEMO + "/");
  const over = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(over <= 0, `overflows by ${over}px`);
  await ctx.close();
});

await check("FAQ jump 8: every question and answer matches the approved text in lib/site.ts", async () => {
  const src = readFileSync("lib/site.ts", "utf8");
  const phone = readFileSync("lib/site-basics.ts", "utf8").match(/PHONE_DISPLAY = "([^"]+)"/)[1];
  const unq = (t) => t.replace(/\$\{PHONE_DISPLAY\}/g, phone).replace(/\\'/g, "'");
  const approved = [...src.matchAll(/q: "([^"]+)",\s*topic: "[^"]+",\s*a: (?:"((?:[^"\\]|\\.)*)"|`([^`]*)`)/g)].map((m) => ({
    q: m[1],
    a: unq(m[2] ?? m[3]),
  }));
  assert(approved.length === 14, `expected 14 approved FAQs in lib/site.ts, parsed ${approved.length}`);
  const want = new Map(approved.map((f) => [f.q, f.a]));
  let compared = 0;
  for (const path of ["/", ...PRACTICE_SLUGS.map((s) => `/practice-areas/${s}/`)]) {
    await page.goto(DEMO + path);
    const shown = await page.locator("section[aria-labelledby=faq] details").evaluateAll((ds) =>
      ds.map((d) => ({ q: d.querySelector("summary span").textContent.trim(), a: d.querySelector("p").textContent.trim() })),
    );
    for (const f of shown) {
      assert(want.has(f.q), `${path}: unapproved question "${f.q}"`);
      assert(want.get(f.q) === f.a, `${path}: answer changed for "${f.q}"`);
      compared++;
    }
  }
  assert(compared === 14, `compared ${compared} FAQs, expected 14`);
  return `${compared} FAQs match`;
});

await check("FAQ jump 9: axe finds 0 violations on the home page with a FAQ group open (1440 and 390 px)", async () => {
  const summary = [];
  for (const width of [1440, 390]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(DEMO + "/");
    await p.locator(JUMP_NAV).getByRole("link", { name: "Getting started" }).click();
    await p.waitForTimeout(800);
    await p.addScriptTag({ content: axeSource });
    const res = await p.evaluate(async () => axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] }));
    for (const v of res.violations) summary.push(`${width}px: ${v.id} (${v.nodes.length})`);
    await ctx.close();
  }
  assert(summary.length === 0, summary.join("; "));
  return "0 violations";
});

// ---- Link-preview share cards (plans/link-previews-plan.md, section 7.1) ----
const metaOf = async (path) => {
  const html = await (await fetch(DEMO + path)).text();
  const tags = {};
  for (const m of html.matchAll(/<meta (?:property|name)="((?:og|twitter):[^"]+)" content="([^"]*)"/g)) tags[m[1]] ??= m[2];
  return tags;
};
// Image addresses are absolute (the live site's URL); fetch the same path from this server.
const localUrl = (abs) => DEMO + new URL(abs).pathname + new URL(abs).search;
const CARD_PAGES = ["/", ...PRACTICE_SLUGS.map((s) => `/practice-areas/${s}/`)];

await check("Share card 1: all six cards are 1200 × 630 PNGs under 500 KB", async () => {
  const sizes = [];
  for (const path of CARD_PAGES) {
    const img = (await metaOf(path))["og:image"];
    assert(img, `${path}: no og:image`);
    const res = await fetch(localUrl(img));
    assert(res.status === 200 && res.headers.get("content-type") === "image/png", `${path}: ${res.status} ${res.headers.get("content-type")}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
    assert(w === 1200 && h === 630, `${path}: ${w}×${h}`);
    assert(buf.length < 500 * 1024, `${path}: ${Math.round(buf.length / 1024)} KB`);
    sizes.push(Math.round(buf.length / 1024));
  }
  return `${sizes.join(", ")} KB`;
});

await check("Share card 2: each of the six cards is different", async () => {
  const { createHash } = await import("node:crypto");
  const hashes = new Set();
  for (const path of CARD_PAGES) {
    const buf = Buffer.from(await (await fetch(localUrl((await metaOf(path))["og:image"]))).arrayBuffer());
    hashes.add(createHash("sha256").update(buf).digest("hex"));
  }
  assert(hashes.size === 6, `only ${hashes.size} distinct cards`);
});

await check("Share card 3: home page has the full set of Open Graph and X tags with an absolute image address", async () => {
  const t = await metaOf("/");
  for (const k of ["og:title", "og:description", "og:url", "og:site_name", "og:image", "og:image:alt", "twitter:image"]) assert(t[k], `missing ${k}`);
  assert(t["og:image:width"] === "1200" && t["og:image:height"] === "630", "image size tags wrong");
  assert(t["twitter:card"] === "summary_large_image", `twitter:card = ${t["twitter:card"]}`);
  assert(/^https?:\/\//.test(t["og:image"]), `og:image not absolute: ${t["og:image"]}`);
  assert(t["og:title"] === "Darren Drake · Attorney at Law · Murfreesboro, TN", `og:title = ${t["og:title"]}`);
});

await check("Share card 4: a practice page has its own title and card", async () => {
  const t = await metaOf("/practice-areas/dui-dwi/");
  assert(t["og:title"] === "DUI/DWI · Darren Drake", `og:title = ${t["og:title"]}`);
  assert(t["og:image"].includes("/practice-areas/dui-dwi/"), `og:image = ${t["og:image"]}`);
});

await check("Share card 5: every other page falls back to the home card", async () => {
  const home = (await metaOf("/"))["og:image"];
  for (const path of ["/about/", "/contact/", "/privacy/", "/accessibility/", "/legal-notice/"]) {
    const img = (await metaOf(path))["og:image"];
    assert(img === home, `${path}: og:image = ${img}`);
  }
});

await check("Share card 6: the card's alt text carries the phone number from lib/site.ts", async () => {
  const phone = readFileSync("lib/site-basics.ts", "utf8").match(/PHONE_DISPLAY = "([^"]+)"/)[1];
  const alt = (await metaOf("/"))["og:image:alt"];
  assert(alt.includes(phone), `alt text: ${alt}`);
});

// ---- Gentle scroll reveals (plans/scroll-reveals-plan.md, section 6.1) ----
const TIMELINE = 'section[aria-labelledby="how-contact-works"] [data-reveal]';
const translates = (p) => p.locator("[data-reveal]").evaluateAll((els) => els.map((e) => getComputedStyle(e).translate));
const scrollThrough = async (p) => {
  const h = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= h; y += 400) {
    await p.evaluate((v) => window.scrollTo(0, v), y);
    await p.waitForTimeout(40);
  }
};

await check("Reveal 1: reduced motion — nothing is ever offset and reveals never switch on", async () => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto(DEMO + "/");
  await p.waitForTimeout(300);
  const h = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= h; y += 400) {
    await p.evaluate((v) => window.scrollTo(0, v), y);
    const t = await translates(p);
    assert(t.every((v) => v === "none"), `offset at y=${y}: ${t.join(",")}`);
  }
  assert(!(await p.evaluate(() => document.documentElement.classList.contains("reveal-ready"))), "reveal-ready set under reduced motion");
  await ctx.close();
});

await check("Reveal 2: without JavaScript nothing is offset", async () => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const p = await ctx.newPage();
  await p.goto(DEMO + "/");
  const t = await translates(p);
  assert(t.length >= 8 && t.every((v) => v === "none"), `translates: ${t.join(",")}`);
  await ctx.close();
});

await check("Reveal 3: phones stay still (390 px, motion allowed)", async () => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  await p.goto(DEMO + "/");
  await p.waitForTimeout(400);
  assert(!(await p.evaluate(() => document.documentElement.classList.contains("reveal-ready"))), "reveal-ready set on a phone");
  await scrollThrough(p);
  const t = await translates(p);
  assert(t.every((v) => v === "none"), `offset on phone: ${t.join(",")}`);
  await ctx.close();
});

const motionCtx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });
const mp = await motionCtx.newPage();

await check("Reveal 4 + 7: a section below the fold starts 12 px low, settles, and its text never fades", async () => {
  await mp.goto(DEMO + "/");
  await mp.waitForFunction(() => document.documentElement.classList.contains("reveal-ready"));
  const el = mp.locator(TIMELINE);
  const before = await el.evaluate((e) => getComputedStyle(e).translate);
  assert(before === "0px 12px", `initial translate: ${before}`);
  await el.evaluate((e) => e.scrollIntoView({ block: "center" }));
  const opacities = await el.evaluate(async (e) => {
    const out = [];
    for (let i = 0; i < 12; i++) {
      out.push(getComputedStyle(e).opacity);
      await new Promise((r) => setTimeout(r, 50));
    }
    return out;
  });
  assert(opacities.every((o) => o === "1"), `opacity samples: ${opacities.join(",")}`);
  await mp.waitForTimeout(200);
  const after = await el.evaluate((e) => getComputedStyle(e).translate);
  assert(after === "none", `settled translate: ${after}`);
});

await check("Reveal 5: once only — scrolling away and back never re-animates", async () => {
  const el = mp.locator(TIMELINE);
  await mp.evaluate(() => window.scrollTo(0, 0));
  await mp.waitForTimeout(300);
  assert((await el.evaluate((e) => getComputedStyle(e).translate)) === "none", "offset returned after scrolling away");
  await el.evaluate((e) => e.scrollIntoView({ block: "center" }));
  await mp.waitForTimeout(100);
  const anims = await el.evaluate((e) => e.getAnimations().length);
  assert(anims === 0, `${anims} animations running on re-entry`);
});

await check("Reveal 6: nothing animates on page load (blocks already on screen)", async () => {
  await mp.goto(DEMO + "/");
  await mp.waitForFunction(() => document.documentElement.classList.contains("reveal-ready"));
  const head = mp.locator('section[aria-labelledby="practice-title"] > div > [data-reveal]').first();
  const t = await head.evaluate((e) => getComputedStyle(e).translate);
  const anims = await head.evaluate((e) => e.getAnimations().length);
  assert(t === "none" && anims === 0, `on-screen heading translate=${t}, animations=${anims}`);
});

await check("Reveal 8: featured cards stagger 0 / 60 / 120 ms; no other delay over 120 ms", async () => {
  const delays = await mp
    .locator('section[aria-labelledby="practice-title"] li.card[data-reveal]')
    .evaluateAll((els) => els.map((e) => getComputedStyle(e).transitionDelay.split(",")[0].trim()));
  assert(delays.join("|") === "0s|0.06s|0.12s", `card delays: ${delays.join(", ")}`);
  const all = await mp.locator("[data-reveal]").evaluateAll((els) =>
    els.flatMap((e) => getComputedStyle(e).transitionDelay.split(",").map((d) => parseFloat(d))),
  );
  assert(Math.max(...all) <= 0.12, `max delay ${Math.max(...all)}s`);
});

await check("Reveal 9: no layout shift across a full scroll", async () => {
  await mp.addInitScript(() => {
    window.__cls = 0;
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
  });
  await mp.goto(DEMO + "/");
  await mp.waitForFunction(() => document.documentElement.classList.contains("reveal-ready"));
  await scrollThrough(mp);
  await mp.waitForTimeout(600);
  const cls = await mp.evaluate(() => window.__cls);
  assert(cls === 0, `layout shift total ${cls}`);
});

await check("Reveal 10: the off switch renders nothing when SCROLL_REVEALS is false", async () => {
  const comp = readFileSync("components/ScrollReveal.tsx", "utf8");
  const site = readFileSync("lib/site-basics.ts", "utf8");
  assert(/export const SCROLL_REVEALS = (true|false);/.test(site), "SCROLL_REVEALS constant missing");
  assert(comp.includes("return SCROLL_REVEALS ? <Reveals /> : null;"), "ScrollReveal is not gated on SCROLL_REVEALS");
  assert(readFileSync("app/globals.css", "utf8").includes("html.reveal-ready [data-reveal]:not(.is-revealed)"), "offset is not gated on reveal-ready");
  return "gated in the component and the CSS";
});

await check("Reveal 11: axe finds 0 violations after scrolling (home and a practice page, 1440 px)", async () => {
  const summary = [];
  for (const path of ["/", "/practice-areas/dui-dwi/"]) {
    await mp.goto(DEMO + path);
    await scrollThrough(mp);
    await mp.waitForTimeout(600);
    await mp.addScriptTag({ content: axeSource });
    const res = await mp.evaluate(async () => axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] }));
    for (const v of res.violations) summary.push(`${path}: ${v.id} (${v.nodes.length})`);
  }
  assert(summary.length === 0, summary.join("; "));
  return "0 violations";
});
await motionCtx.close();

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

// ---- SEO (plans/seo-fixes-plan.md, 6.1 and 6.4) ----
const SITE = "https://ddrakelaw.com";
const ALL_PAGES = [...PAGES, "/practice-areas/dui-dwi/", "/practice-areas/expungement/"];
const html = async (path) => (await fetch(DEMO + path)).text();
const ldBlocks = (h) => [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
const ld = (h) => ldBlocks(h).map((t) => JSON.parse(t));
const firmGraph = (h) => ld(h).find((d) => d["@graph"])["@graph"];
const node = (graph, id) => graph.find((n) => n["@id"] === `${SITE}/#${id}`);
function walk(v, fn) {
  if (Array.isArray(v)) v.forEach((x) => walk(x, fn));
  else if (v && typeof v === "object") { fn(v); Object.values(v).forEach((x) => walk(x, fn)); }
}

await check("SEO 1: every page has one clean canonical, even with ?utm_source", async () => {
  assert(ALL_PAGES.length === 12, `expected 12 pages, got ${ALL_PAGES.length}`);
  for (const path of ALL_PAGES) {
    for (const q of ["", "?utm_source=test"]) {
      const links = [...(await html(path + q)).matchAll(/<link rel="canonical" href="([^"]+)"/g)].map((m) => m[1]);
      assert(links.length === 1, `${path}${q}: ${links.length} canonicals`);
      assert(links[0] === SITE + path, `${path}${q}: canonical ${links[0]}`);
    }
  }
});

await check("SEO 2: business data parses and has the confirmed firm details", async () => {
  const f = node(firmGraph(await html("/")), "firm");
  assert(f, "no #firm node");
  assert(JSON.stringify(f["@type"]) === JSON.stringify(["LegalService", "LocalBusiness"]), "type");
  assert(f.name === "Darren Drake Law PLLC", `name ${f.name}`);
  assert(f.telephone === "+1-615-546-5551", `telephone ${f.telephone}`);
  assert(f.address.postalCode === "37129" && f.address.addressLocality === "Murfreesboro", "address");
  const h = f.openingHoursSpecification;
  assert(h.length === 1 && h[0].dayOfWeek.join() === "Monday,Tuesday,Wednesday,Thursday,Friday" && h[0].opens === "08:00" && h[0].closes === "17:00", "hours");
  const served = f.areaServed.map((a) => a.name);
  for (const n of ["Murfreesboro", "Smyrna", "Rutherford County"]) assert(served.includes(n), `areaServed missing ${n}`);
  assert(f.knowsAbout.join("|") === "First-Time Offenders|Criminal Defense|DUI/DWI|Domestic Assault|Expungement", `knowsAbout ${f.knowsAbout}`);
});

await check("SEO 3: structured address, phone and hours match the Contact page", async () => {
  await page.goto(DEMO + "/contact/");
  const f = node(firmGraph(await page.content()), "firm");
  const shown = await page.locator("dt:has-text('Office') + dd").innerText();
  const a = f.address;
  assert(`${a.streetAddress}, ${a.addressLocality}, ${a.addressRegion} ${a.postalCode}` === shown.trim(), `address "${shown}"`);
  const phone = await page.locator("main .phone-num").first().innerText();
  assert(phone.replace(/\D/g, "") === f.telephone.replace(/\D/g, "").slice(1), `phone ${phone}`);
  const hours = (await page.locator("dt:has-text('Hours') + dd").innerText()).trim();
  const s = f.openingHoursSpecification[0];
  assert(hours === "Monday–Friday, 8am–5pm" && s.dayOfWeek[0] === "Monday" && s.dayOfWeek.at(-1) === "Friday" && s.opens === "08:00" && s.closes === "17:00", `hours "${hours}"`);
});

await check("SEO 4: no unconfirmed fields anywhere in the structured data", async () => {
  const banned = ["aggregateRating", "review", "priceRange", "sameAs", "geo", "foundingDate", "award"];
  for (const path of ALL_PAGES) {
    walk(ld(await html(path)), (o) => {
      for (const k of banned) assert(!(k in o), `${path}: found ${k}`);
    });
  }
});

await check("SEO 5: Darren's node has the confirmed schools and memberships", async () => {
  const d = node(firmGraph(await html("/about/")), "darren");
  assert(d && d["@type"] === "Person" && d.name === "Darren Drake" && d.jobTitle === "Attorney at Law", "basics");
  assert(d.worksFor["@id"] === `${SITE}/#firm`, "worksFor");
  assert(d.alumniOf.map((x) => x.name).join("|") === "Southern Illinois University School of Law|Southern Illinois University Carbondale", "alumniOf");
  assert(d.memberOf.map((x) => x.name).join("|") === "Tennessee Association of Criminal Defense Lawyers|Rutherford & Cannon County Bar Association", "memberOf");
});

await check("SEO 6: breadcrumb data matches the visible breadcrumbs; none on home", async () => {
  await page.goto(DEMO + "/practice-areas/dui-dwi/");
  const list = ld(await page.content()).find((d) => d["@type"] === "BreadcrumbList");
  assert(list, "no BreadcrumbList");
  const items = list.itemListElement;
  assert(items.map((i) => i.position).join() === "1,2,3", "positions");
  assert(items.map((i) => i.item).join() === `${SITE}/,${SITE}/practice-areas/,${SITE}/practice-areas/dui-dwi/`, "urls");
  const visible = (await page.locator('nav[aria-label="Breadcrumb"] li').allInnerTexts()).map((t) => t.replace("/", "").trim());
  assert(items.map((i) => i.name).join("|") === visible.join("|"), `names ${visible}`);
  assert(visible.join("|") === "Home|Practice Areas|DUI/DWI", `visible ${visible}`);
  for (const path of ALL_PAGES.filter((p) => p !== "/")) {
    const b = ld(await html(path)).filter((d) => d["@type"] === "BreadcrumbList");
    assert(b.length === 1 && b[0].itemListElement.at(-1).item === SITE + path, `${path}: breadcrumb data`);
  }
  assert(!ld(await html("/")).some((d) => d["@type"] === "BreadcrumbList"), "home has a BreadcrumbList");
});

await check("SEO 7: titles ≤ 60 characters; home description ≤ 160", async () => {
  const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');
  for (const path of ALL_PAGES) {
    const h = await html(path);
    const title = decode(h.match(/<title>([^<]*)<\/title>/)[1]);
    assert(title.length <= 60, `${path}: title ${title.length} chars`);
    if (path === "/") {
      assert(title === "Darren Drake, Attorney at Law | Murfreesboro, TN", `home title "${title}"`);
      const desc = decode(h.match(/<meta name="description" content="([^"]*)"/)[1]);
      assert(desc.length <= 160, `home description ${desc.length} chars`);
    }
  }
});

await check("SEO 8: sitemap has 12 canonical entries with ISO lastmod dates", async () => {
  const xml = await html("/sitemap.xml");
  const urls = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1]);
  assert(urls.length === 12, `${urls.length} entries`);
  const locs = urls.map((u) => u.match(/<loc>([^<]+)<\/loc>/)[1]);
  assert([...locs].sort().join() === ALL_PAGES.map((p) => SITE + p).sort().join(), "locs differ from canonicals");
  for (const u of urls) {
    const lm = u.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
    assert(lm && /^\d{4}-\d\d-\d\dT/.test(lm) && !Number.isNaN(Date.parse(lm)), `bad lastmod ${lm}`);
  }
});

await check("SEO 9: preview build is still hidden (noindex everywhere, Disallow: /)", async () => {
  for (const path of ALL_PAGES) {
    assert(/<meta name="robots" content="noindex, nofollow"/.test(await html(path)), `${path}: no noindex`);
  }
  assert(/Disallow: \/\s*$/m.test(await html("/robots.txt")), "robots.txt lacks Disallow: /");
});

await check("SEO 10: JSON-LD is script-safe; types allow-listed; every @id reference resolves", async () => {
  const allowed = new Set(["LegalService", "LocalBusiness", "Person", "WebSite", "BreadcrumbList", "ListItem", "PostalAddress", "OpeningHoursSpecification", "City", "AdministrativeArea", "Organization", "EducationalOrganization"]);
  for (const path of ALL_PAGES) {
    const blocks = ldBlocks(await html(path));
    for (const t of blocks) assert(!t.includes("<"), `${path}: raw "<" in JSON-LD`);
    const docs = blocks.map((t) => JSON.parse(t));
    const ids = new Set();
    const refs = [];
    walk(docs, (o) => {
      if (o["@type"]) [o["@type"]].flat().forEach((ty) => assert(allowed.has(ty), `${path}: type ${ty}`));
      if (o["@id"] && Object.keys(o).length > 1) ids.add(o["@id"]);
      else if (o["@id"]) refs.push(o["@id"]);
    });
    for (const r of refs) assert(ids.has(r), `${path}: dangling ${r}`);
  }
  // The escaping itself: "<" becomes \u003c.
  const src = await readFile("lib/structured-data.ts", "utf8");
  assert(src.includes('JSON.stringify(data).replace(/</g, "\\\\u003c")'), "jsonLd no longer escapes <");
});

// ---- Light theme (plans/light-theme-plan.md, 6.1) ----
const DARK_BG = "rgb(9, 15, 28)";
const LIGHT_BG = "rgb(245, 247, 251)";
const bodyBg = (p) => p.evaluate(() => getComputedStyle(document.body).backgroundColor);
const toggle = (p) => p.getByRole("button", { name: "Light mode" });
async function themed(theme, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
  if (theme) await ctx.addInitScript((t) => { try { if (!sessionStorage.getItem("seeded")) { localStorage.setItem("theme", t); sessionStorage.setItem("seeded", "1"); } } catch {} }, theme);
  return ctx;
}
async function axeRun(p) {
  await p.addScriptTag({ content: axeSource });
  const res = await p.evaluate(async () => axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] }));
  return res.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" ")}`);
}

await check("Theme 1: dark by default, even when the device prefers light", async () => {
  const ctx = await themed(null, { colorScheme: "light" });
  const p = await ctx.newPage();
  await p.goto(DEMO + "/");
  assert((await p.evaluate(() => document.documentElement.dataset.theme)) === undefined, "data-theme set without a choice");
  assert((await bodyBg(p)) === DARK_BG, `background ${await bodyBg(p)}`);
  assert((await toggle(p).getAttribute("aria-pressed")) === "false", "aria-pressed should be false");
  await ctx.close();
});

await check("Theme 2: the button switches, is remembered across reloads and pages, and switches back", async () => {
  const ctx = await themed(null);
  const p = await ctx.newPage();
  await p.goto(DEMO + "/");
  await toggle(p).click();
  assert((await bodyBg(p)) === LIGHT_BG, `after click ${await bodyBg(p)}`);
  assert((await toggle(p).getAttribute("aria-pressed")) === "true", "aria-pressed not true");
  await p.reload();
  assert((await bodyBg(p)) === LIGHT_BG, "not remembered after reload");
  await p.goto(DEMO + "/practice-areas/dui-dwi/");
  assert((await bodyBg(p)) === LIGHT_BG, "not remembered on another page");
  assert((await toggle(p).getAttribute("aria-pressed")) === "true", "aria-pressed not true on another page");
  await toggle(p).click();
  assert((await bodyBg(p)) === DARK_BG, "did not switch back to dark");
  await p.reload();
  assert((await bodyBg(p)) === DARK_BG, "dark not remembered");
  await ctx.close();
});

await check("Theme 3: no flash — the saved theme is in place when <body> first appears", async () => {
  for (const [theme, want] of [["light", LIGHT_BG], ["dark", DARK_BG]]) {
    const ctx = await themed(theme);
    await ctx.addInitScript(() => {
      new MutationObserver((_, obs) => {
        if (document.body) {
          window.__firstBg = getComputedStyle(document.documentElement).getPropertyValue("--color-bg").trim();
          window.__firstTheme = document.documentElement.dataset.theme ?? "dark";
          obs.disconnect();
        }
      }).observe(document, { childList: true, subtree: true });
    });
    const p = await ctx.newPage();
    await p.goto(DEMO + "/about/");
    const first = await p.evaluate(() => [window.__firstBg, window.__firstTheme]);
    const hex = theme === "light" ? "#f5f7fb" : "#090f1c";
    assert(first[0] === hex && first[1] === theme, `${theme}: first paint had ${first.join(" ")}`);
    assert((await bodyBg(p)) === want, `${theme}: final ${await bodyBg(p)}`);
    await ctx.close();
  }
});

await check("Theme 4: axe finds 0 violations in both themes (12 pages at 1440, 3 at 390, form errors and success)", async () => {
  const pages = [...PAGES, "/practice-areas/dui-dwi/", "/practice-areas/expungement/"];
  const problems = [];
  for (const theme of ["light", "dark"]) {
    const ctx = await themed(theme, { reducedMotion: "reduce" });
    const p = await ctx.newPage();
    for (const path of pages) {
      await p.goto(DEMO + path);
      for (const v of await axeRun(p)) problems.push(`${theme} ${path} ${v}`);
    }
    await p.goto(DEMO + "/contact/");
    await p.getByRole("button", { name: "Send message" }).click();
    await p.locator(SUMMARY).waitFor();
    for (const v of await axeRun(p)) problems.push(`${theme} errors ${v}`);
    // Success state, with the server's acceptance mocked so no inquiry is stored.
    await p.goto(LIVE + "/contact/");
    await p.route("**/api/contact/", (route) => route.fulfill({ status: 200, contentType: "application/json", body: '{"status":"accepted"}' }));
    await fillValid(p);
    await p.getByRole("button", { name: "Send message" }).click();
    await p.locator('[role="status"]').first().waitFor();
    for (const v of await axeRun(p)) problems.push(`${theme} success ${v}`);
    await p.unroute("**/api/contact/");
    await ctx.close();
    const phone = await themed(theme, { viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    const q = await phone.newPage();
    for (const path of ["/", "/practice-areas/dui-dwi/", "/contact/"]) {
      await q.goto(DEMO + path);
      for (const v of await axeRun(q)) problems.push(`${theme} 390 ${path} ${v}`);
    }
    await phone.close();
  }
  assert(problems.length === 0, problems.join("; "));
});

await check("Theme 5: measured light contrast — text ≥ 4.5:1, borders and focus ≥ 3:1", async () => {
  const ctx = await themed("light");
  const p = await ctx.newPage();
  await p.goto(DEMO + "/");
  const out = await p.evaluate(() => {
    const probe = document.createElement("div");
    document.body.append(probe);
    const rgb = (name) => {
      probe.style.color = `var(${name})`;
      return getComputedStyle(probe).color.match(/\d+/g).slice(0, 3).map(Number);
    };
    const lum = ([r, g, b]) => [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
    const ratio = (a, b) => { const [x, y] = [lum(rgb(a)), lum(rgb(b))].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
    const fails = [];
    for (const bg of ["--color-bg", "--color-surface"]) {
      for (const fg of ["--color-text", "--color-muted", "--color-action", "--color-error", "--color-success"]) if (ratio(fg, bg) < 4.5) fails.push(`${fg} on ${bg} ${ratio(fg, bg).toFixed(2)}`);
      for (const fg of ["--color-border", "--color-focus", "--line-strong"]) if (ratio(fg, bg) < 3) fails.push(`${fg} on ${bg} ${ratio(fg, bg).toFixed(2)}`);
    }
    if (ratio("--color-on-action", "--color-action") < 4.5) fails.push("on-action on action");
    probe.remove();
    return fails;
  });
  assert(out.length === 0, out.join(", "));
  await ctx.close();
});

await check("Theme 6: keyboard — Tab reaches the button, Enter and Space toggle, visible focus ring", async () => {
  for (const start of [null, "light"]) {
    const ctx = await themed(start);
    const p = await ctx.newPage();
    await p.goto(DEMO + "/");
    let found = false;
    for (let i = 0; i < 12 && !found; i++) {
      await p.keyboard.press("Tab");
      found = await p.evaluate(() => document.activeElement?.getAttribute("aria-label") === "Light mode");
    }
    assert(found, "Tab never reached the button");
    const ring = await p.evaluate(() => {
      const s = getComputedStyle(document.activeElement);
      return { w: parseFloat(s.outlineWidth), style: s.outlineStyle, color: s.outlineColor };
    });
    assert(ring.w >= 2 && ring.style !== "none", `focus ring ${JSON.stringify(ring)}`);
    const focus = await p.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--color-focus").trim());
    assert(focus === (start ? "#0e7490" : "#67e8f9"), `focus colour ${focus}`);
    const before = await bodyBg(p);
    await p.keyboard.press("Enter");
    const mid = await bodyBg(p);
    await p.keyboard.press("Space");
    assert(mid !== before && (await bodyBg(p)) === before, `Enter/Space: ${before} → ${mid} → ${await bodyBg(p)}`);
    await ctx.close();
  }
});

await check("Theme 7: storage blocked — the button still switches, with no console errors", async () => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => {
    Object.defineProperty(window, "localStorage", { get() { throw new Error("blocked"); } });
  });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await p.goto(DEMO + "/");
  assert((await bodyBg(p)) === DARK_BG, "should start dark");
  await toggle(p).click();
  assert((await bodyBg(p)) === LIGHT_BG, "did not switch with storage blocked");
  assert(errors.length === 0, errors.join("; "));
  await ctx.close();
});

await check("Theme 8: without JavaScript — dark, button hidden but its space kept", async () => {
  const sizes = [];
  for (const js of [true, false]) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: js });
    const p = await ctx.newPage();
    await p.goto(DEMO + "/");
    const b = p.locator(".theme-toggle").first();
    const info = await b.evaluate((e) => ({ vis: getComputedStyle(e).visibility, w: e.offsetWidth, h: e.offsetHeight, x: e.getBoundingClientRect().x }));
    sizes.push(info);
    if (!js) {
      assert((await bodyBg(p)) === DARK_BG, "not dark without JS");
      assert(info.vis === "hidden", `button visibility ${info.vis}`);
    } else assert(info.vis === "visible", "button hidden with JS");
    await ctx.close();
  }
  assert(sizes[0].w === sizes[1].w && sizes[0].h === sizes[1].h && sizes[0].x === sizes[1].x, `box differs ${JSON.stringify(sizes)}`);
});

await check("Theme 9: no layout shift on load in either theme; 320 px fits with the header on one row", async () => {
  for (const theme of ["light", "dark"]) {
    const ctx = await themed(theme);
    const p = await ctx.newPage();
    // Warm the font cache first: a first-ever visit has a tiny web-font swap shift in both
    // themes (not theme-related; see HANDOFF.md). This isolates anything the theme adds.
    await p.goto(DEMO + "/");
    await p.evaluate(() => document.fonts.ready);
    await p.reload();
    const cls = await p.evaluate(() => new Promise((res) => {
      let total = 0;
      new PerformanceObserver((l) => { for (const e of l.getEntries()) total += e.value; }).observe({ type: "layout-shift", buffered: true });
      setTimeout(() => res(total), 500);
    }));
    assert(cls === 0, `${theme}: CLS ${cls}`);
    await ctx.close();
    const small = await themed(theme, { viewport: { width: 320, height: 700 } });
    const q = await small.newPage();
    for (const path of ["/", "/contact/"]) {
      await q.goto(DEMO + path);
      const r = await q.evaluate(() => {
        const row = document.querySelector("header > div").getBoundingClientRect();
        const logo = document.querySelector('header a[href="/"]').getBoundingClientRect();
        const btn = [...document.querySelectorAll(".theme-toggle")].find((e) => e.offsetParent !== null).getBoundingClientRect();
        const call = document.querySelector('header a[aria-label^="Call"]').getBoundingClientRect();
        return { over: document.documentElement.scrollWidth - innerWidth, rowTop: row.top, rowBottom: row.bottom, logoRight: logo.right, btn: [btn.left, btn.top, btn.bottom], call: [call.left, call.top, call.right, call.bottom], w: innerWidth };
      });
      assert(r.over <= 0, `${theme} ${path}: ${r.over}px horizontal scroll at 320`);
      const oneRow = r.btn[0] > r.logoRight && r.call[0] > r.btn[0] && r.call[2] <= r.w && Math.abs(r.btn[1] - r.call[1]) <= 1 && r.btn[1] >= r.rowTop && r.call[3] <= r.rowBottom;
      assert(oneRow, `${theme} ${path}: header buttons not on one row (${JSON.stringify(r)})`);
    }
    await small.close();
  }
});

await check("Theme 10: theme-color and color-scheme follow the theme", async () => {
  const ctx = await themed(null);
  const p = await ctx.newPage();
  await p.goto(DEMO + "/");
  const read = () => p.evaluate(() => [document.querySelector('meta[name="theme-color"]').content, getComputedStyle(document.documentElement).colorScheme]);
  let [tc, cs] = await read();
  assert(tc === "#090F1C" && cs === "dark", `dark: ${tc} ${cs}`);
  await toggle(p).click();
  [tc, cs] = await read();
  assert(tc === "#F5F7FB" && cs === "light", `light: ${tc} ${cs}`);
  await p.reload();
  [tc, cs] = await read();
  assert(tc === "#F5F7FB" && cs === "light", `light after reload: ${tc} ${cs}`);
  await ctx.close();
});

await check("Theme 11: dark palette unchanged (every token equals the Signal values)", async () => {
  const ctx = await themed(null);
  const p = await ctx.newPage();
  await p.goto(DEMO + "/");
  const want = {
    "--color-bg": "#090f1c", "--color-surface": "#131f31", "--color-text": "#f4f7fc", "--color-muted": "#cad4e2",
    "--color-action": "#67e8f9", "--color-on-action": "#07111f", "--color-border": "#718199", "--color-focus": "#67e8f9",
    "--color-decoration": "#8b5cf6", "--color-error": "#ff9a9a", "--color-success": "#86efac",
    "--card-border": "rgb(113 129 153 / 0.45)", "--card-sheen": "rgb(255 255 255 / 0.025)", "--card-hover-border": "rgb(103 232 249 / 0.55)",
    "--card-shadow": "none", "--tint-action": "rgb(103 232 249 / 0.08)", "--line-soft": "rgb(113 129 153 / 0.5)",
    "--line-strong": "rgb(113 129 153 / 0.8)", "--glow-violet": "rgb(139 92 246 / 0.62)", "--glow-cyan": "rgb(103 232 249 / 0.5)",
    "--hover-filter": "brightness(1.08)",
  };
  // Resolve both sides through the browser, so rgb(… / a) and #rrggbbaa compare equal.
  const diff = await p.evaluate((want) => {
    const probe = document.createElement("div");
    document.body.append(probe);
    const norm = (v) => {
      if (!/^(#|rgb)/.test(v)) return v;
      probe.style.color = "";
      probe.style.color = v;
      return getComputedStyle(probe).color;
    };
    const root = getComputedStyle(document.documentElement);
    const out = Object.entries(want).filter(([k, v]) => norm(root.getPropertyValue(k).trim()) !== norm(v)).map(([k]) => `${k}: ${root.getPropertyValue(k).trim()}`);
    probe.remove();
    return out;
  }, want);
  assert(diff.length === 0, diff.join(", "));
  await ctx.close();
});

await check("Theme 12: switches — LIGHT_THEME gates the button and head script; THEME_DEFAULT stays dark", async () => {
  const site = await readFile("lib/site-basics.ts", "utf8");
  assert(/export const LIGHT_THEME = true;/.test(site), "LIGHT_THEME not true");
  assert(/export const THEME_DEFAULT: "dark" \| "system" = "dark";/.test(site), "THEME_DEFAULT not dark");
  const toggleSrc = await readFile("components/ThemeToggle.tsx", "utf8");
  assert(toggleSrc.includes("return LIGHT_THEME ? <Toggle /> : null;"), "ThemeToggle not gated by LIGHT_THEME");
  const layout = await readFile("app/layout.tsx", "utf8");
  assert(/\{LIGHT_THEME && \(\s*<head>/.test(layout), "head script not gated by LIGHT_THEME");
  const html = await (await fetch(DEMO + "/")).text();
  const script = html.match(/<script>(\(function\(\)\{var d=document\.documentElement;[^<]*)<\/script>/)?.[1];
  assert(script && script.includes('localStorage.getItem("theme")') && !script.includes("matchMedia"), "served head script unexpected");
  assert(html.indexOf(script) < html.indexOf("<body"), "theme script not in <head>");
});

// ---- Speed (plans/speed-check-plan.md, 6.1) ----
const SPEED_PAGES = [...PAGES, "/practice-areas/dui-dwi/", "/practice-areas/expungement/"];
// The font file's unicode-range (Latin subset); must match app/layout.tsx.
const LATIN = "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"
  .split(", ")
  .map((r) => r.slice(2).split("-").map((h) => parseInt(h, 16)))
  .map(([a, b]) => [a, b ?? a]);
// Characters shown on purpose outside the font, drawn by the system font exactly as before.
const OUTSIDE_FONT = { "→": "arrow after 'About Darren' (Home page)" };

await check("Speed 1: one preloaded font file, one font request, old font CSS gone", async () => {
  for (const path of SPEED_PAGES) {
    const res = await fetch(DEMO + path);
    const html = await res.text();
    // Static pages carry a <link> tag; per-request pages (Contact) send the same preload as a Link header.
    const preloads = [...(html.match(/<link rel="preload"[^>]*as="font"[^>]*>/g) ?? []), ...(res.headers.get("link") ?? "").split(/,\s*</).filter((l) => /as="?font/.test(l))];
    assert(preloads.length === 1 && /font\/woff2/.test(preloads[0]) && /crossorigin/.test(preloads[0]), `${path}: ${preloads.length} font preloads`);
  }
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  const fonts = [];
  p.on("response", (r) => r.request().resourceType() === "font" && fonts.push(r.url()));
  await p.goto(DEMO + "/");
  await p.evaluate(() => document.fonts.ready);
  assert(fonts.length === 1, `${fonts.length} font requests: ${fonts.join(", ")}`);
  const css = await p.evaluate(() => [...document.styleSheets].flatMap((s) => [...s.cssRules].map((r) => r.cssText)).join("\n"));
  assert(!/Manrope Variable|cyrillic|vietnamese/.test(css), "old fontsource @font-face rules still present");
  await ctx.close();
});

await check("Speed 2: size-matched stand-in font (next/font fallback with size-adjust)", async () => {
  await page.goto(DEMO + "/");
  const r = await page.evaluate(() => {
    const family = getComputedStyle(document.body).fontFamily;
    const faces = [...document.styleSheets].flatMap((s) => [...s.cssRules]).filter((x) => x instanceof CSSFontFaceRule);
    const fallback = faces.find((f) => /Fallback/.test(f.style.getPropertyValue("font-family")));
    return { family, fallbackFamily: fallback?.style.getPropertyValue("font-family"), sizeAdjust: fallback?.style.getPropertyValue("size-adjust"), src: fallback?.style.getPropertyValue("src") };
  });
  assert(/^['"]?manrope/i.test(r.family), `body font-family starts with ${r.family}`);
  assert(r.fallbackFamily && r.family.includes(r.fallbackFamily.replace(/['"]/g, "").trim().split(" ")[0]), `fallback not in stack: ${JSON.stringify(r)}`);
  assert(r.sizeAdjust && r.sizeAdjust !== "100%", `size-adjust ${r.sizeAdjust}`);
  assert(/Arial/i.test(r.src), `fallback src ${r.src}`);
});

await check("Speed 3: every character shown is in the font's Latin range (or a listed exception)", async () => {
  const chars = new Map();
  const add = (text, where) => { for (const ch of text) if (!chars.has(ch)) chars.set(ch, where); };
  for (const path of SPEED_PAGES) {
    await page.goto(DEMO + path);
    add(await page.evaluate(() => document.body.innerText + [...document.querySelectorAll("[placeholder]")].map((e) => e.placeholder).join("")), path);
  }
  await page.goto(DEMO + "/contact/");
  await page.getByRole("button", { name: "Send message" }).click();
  await page.locator(SUMMARY).waitFor();
  add(await page.evaluate(() => document.body.innerText), "/contact/ errors");
  const outside = [...chars].filter(([ch]) => {
    const cp = ch.codePointAt(0);
    return !LATIN.some(([a, b]) => cp >= a && cp <= b) && !(ch in OUTSIDE_FONT);
  });
  assert(outside.length === 0, outside.map(([ch, where]) => `"${ch}" U+${ch.codePointAt(0).toString(16).toUpperCase()} on ${where}`).join(", "));
});

await check("Speed 4: no jump on a first visit (phone, 4× CPU, slow 4G): CLS ≤ 0.01", async () => {
  for (const path of ["/", "/practice-areas/dui-dwi/", "/about/", "/contact/"]) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const p = await ctx.newPage();
    const cdp = await ctx.newCDPSession(p);
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1638.4 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await p.addInitScript(() => {
      window.__cls = 0;
      new PerformanceObserver((l) => l.getEntries().forEach((e) => !e.hadRecentInput && (window.__cls += e.value))).observe({ type: "layout-shift", buffered: true });
    });
    await p.goto(DEMO + path, { waitUntil: "load" });
    await p.waitForTimeout(2500);
    const cls = await p.evaluate(() => window.__cls);
    await ctx.close();
    assert(cls <= 0.01, `${path}: CLS ${cls.toFixed(4)}`);
  }
});

await check("Speed 5: practice and FAQ wording is not in the browser's JavaScript", async () => {
  const { readdir } = await import("node:fs/promises");
  const dir = ".next/static/chunks";
  const files = (await readdir(dir)).filter((f) => f.endsWith(".js"));
  const js = (await Promise.all(files.map((f) => readFile(`${dir}/${f}`, "utf8")))).join("\n");
  const samples = [
    "Darren helps people who have never been through the court system",
    "A criminal charge raises urgent questions about your freedom",
    "The office will review it and discuss next steps if the firm can assist",
    "and a short overview if you like",
    "there may be separate questions about your driver",
  ];
  const found = samples.filter((s) => js.includes(s));
  assert(found.length === 0, `found in client JS: ${found.join(" | ")}`);
});

await check("Speed 6: the carousel still works (server list, client arrows)", async () => {
  const errors = [];
  const onErr = (e) => errors.push(e.message ?? e.text());
  page.on("pageerror", onErr);
  await page.goto(DEMO + "/");
  const list = page.locator("#all-practice-list");
  assert((await page.locator('section[aria-roledescription="carousel"]').count()) === 1, "carousel section missing");
  assert((await list.locator('li[aria-roledescription="slide"]').count()) === 5, "expected 5 slides");
  assert((await list.locator("li").first().getAttribute("aria-label")) === "1 of 5: First-Time Offenders", "slide label");
  const prev = page.getByRole("button", { name: "Previous practice areas" });
  const next = page.getByRole("button", { name: "Next practice areas" });
  await list.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  assert(await prev.isDisabled(), "Previous should start disabled");
  await next.click();
  await page.waitForFunction(() => document.getElementById("all-practice-list").scrollLeft > 50);
  await page.waitForTimeout(600);
  assert(!(await prev.isDisabled()), "Previous should enable after scrolling");
  for (let i = 0; i < 5 && !(await next.isDisabled()); i++) {
    await next.click();
    await page.waitForTimeout(600);
  }
  assert(await next.isDisabled(), "Next should be disabled at the end");
  page.off("pageerror", onErr);
  assert(errors.length === 0, errors.join("; "));
});

await check("Speed 7: phone bar still names each practice area and is hidden on Contact", async () => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  const areas = { "first-time-offenders": "First-Time Offenders", "criminal-defense": "Criminal Defense", "dui-dwi": "DUI/DWI", "domestic-assault": "Domestic Assault", expungement: "Expungement" };
  for (const [slug, title] of Object.entries(areas)) {
    await p.goto(`${DEMO}/practice-areas/${slug}/`);
    const link = p.getByRole("link", { name: `Ask about ${title}` });
    await link.waitFor();
    assert((await link.getAttribute("href")) === `/contact/?topic=${slug}`, `${slug}: ${await link.getAttribute("href")}`);
  }
  await p.goto(DEMO + "/contact/");
  await p.waitForTimeout(400);
  assert((await p.getByRole("link", { name: /^Ask about/ }).count()) === 0, "bar shown on /contact/");
  await ctx.close();
});

// ---- Cookie consent, no tracker IDs set (plans/cookie-consent-plan.md; tests/consent.mjs covers IDs set) ----
await check("Cookies off: with no tracker IDs there's no banner, no footer cookie links and no tracker requests", async () => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const hits = [];
  p.on("request", (r) => /googletagmanager|google-analytics|googleadservices|doubleclick|facebook\.(net|com)/.test(r.url()) && hits.push(r.url()));
  for (const path of ["/", "/practice-areas/dui-dwi/", "/contact/", "/privacy/"]) {
    await p.goto(DEMO + path);
    await p.waitForTimeout(400);
    assert((await p.locator('section[aria-labelledby="cookie-banner-title"]').count()) === 0, `${path}: banner shown`);
    assert((await p.getByRole("button", { name: "Cookie settings" }).count()) === 0, `${path}: footer cookie link shown`);
  }
  assert(await p.getByText("This website doesn't use advertising or tracking cookies.").isVisible(), "privacy notice should say no tracking cookies");
  assert(hits.length === 0, `tracker requests: ${hits}`);
  assert(!(await ctx.cookies()).some((c) => /^(dd_consent|_ga|_gcl|_fbp|_fbc)/.test(c.name)), "unexpected cookies");
  await ctx.close();
});

// ---- Review improvements (25 Sep 2026) ----
await check("Review 1: footer 'Contact us' uses the same pill button as the rest of the site", async () => {
  await page.goto(DEMO + "/");
  const cls = await page.locator("footer").getByRole("link", { name: "Contact us" }).getAttribute("class");
  assert(/\bbtn-primary\b/.test(cls), `footer CTA classes: ${cls}`);
});

await check("Review 2: Meet Darren shows the 'At a glance' facts card, not a placeholder", async () => {
  await page.goto(DEMO + "/");
  const card = page.locator("section[aria-labelledby='meet-title']");
  const text = (await card.innerText()).replace("AT A GLANCE", "At a glance");
  for (const s of ["At a glance", "U.S. Navy, 1996–2002", "Southern Illinois University School of Law", "Rutherford County DUI Court", "138 S. Cannon Ave", "Monday–Friday, 8am–5pm"]) assert(text.includes(s), `missing "${s}"`);
  assert(!/TO BE SUPPLIED|Local architecture photo/i.test(await page.content()), "photo placeholder still on the page");
});

await check("Review 3: each practice page links to the other four practice areas", async () => {
  for (const slug of PRACTICE_SLUGS) {
    await page.goto(`${DEMO}/practice-areas/${slug}/`);
    const hrefs = await page.locator("section[aria-labelledby='other-practices-title'] a").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
    assert(hrefs.length === PRACTICE_SLUGS.length - 1 && !hrefs.includes(`/practice-areas/${slug}/`), `${slug}: ${hrefs}`);
  }
});

await check("Review 4: the not-found page offers contact, a call button and every practice area", async () => {
  const res = await page.goto(DEMO + "/this-page-does-not-exist/");
  assert(res.status() === 404, `status ${res.status()}`);
  assert(await page.locator("main").getByRole("link", { name: "Contact us" }).isVisible(), "no Contact us");
  assert(await page.locator('main a[href^="tel:"]').first().isVisible(), "no call button");
  for (const slug of PRACTICE_SLUGS) assert((await page.locator(`main a[href="/practice-areas/${slug}/"]`).count()) === 1, `missing ${slug}`);
});

await check("Review 5: Contact page has a 'Get directions' link to the office on Google Maps", async () => {
  await page.goto(DEMO + "/contact/");
  const a = page.getByRole("link", { name: /Get directions/ });
  const href = await a.getAttribute("href");
  assert(href.startsWith("https://www.google.com/maps/search/?api=1&query=") && decodeURIComponent(href).includes("138 S. Cannon Ave, Murfreesboro, TN 37129"), href);
  assert((await a.getAttribute("target")) === "_blank" && /noopener/.test(await a.getAttribute("rel")), "must open safely in a new tab");
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
