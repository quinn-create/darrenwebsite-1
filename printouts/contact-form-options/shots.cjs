// Screenshots for the contact-form placement PDF. Needs the demo server: next start -p 3000
// Options B and C are mock-ups: the real form's markup is copied into the page for the picture only.
const { chromium } = require("../../site/node_modules/playwright-core");
const BASE = "http://localhost:3000";
const OUT = __dirname + "/img/";
(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const desk = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const p = await desk.newPage();
  // Element screenshots scroll the page; keep the sticky header and phone bar from covering the form.
  const unstick = (page) => page.addStyleTag({ content: "header { position: static !important; } div.fixed.inset-x-0.bottom-0 { display: none !important; }" });

  // The form, filled in as an example (desktop).
  await p.goto(BASE + "/contact/", { waitUntil: "load" });
  await p.waitForTimeout(800);
  await unstick(p);
  const formHtml = await p.locator('form[aria-labelledby="contact-form-title"]').evaluate((f) => f.outerHTML);
  await p.screenshot({ path: OUT + "a-contact-desktop.png", fullPage: true });
  await p.locator("#cf-yourName").fill("Jordan Example");
  await p.locator("#cf-clientName").fill("Sam Example");
  await p.getByText("Arrested in Rutherford County").click();
  await p.getByText("Call", { exact: true }).click();
  await p.getByText("Text", { exact: true }).click();
  await p.locator("#cf-phone").fill("615-555-0123");
  await p.getByText("As soon as possible").click();
  await p.locator("#cf-message").fill("My son was arrested last night and has a court date next week.");
  await p.locator('form[aria-labelledby="contact-form-title"]').screenshot({ path: OUT + "form-filled.png" });

  // The current full intake form, for comparison.
  await p.goto(BASE + "/intake/", { waitUntil: "load" });
  await p.waitForTimeout(500);
  await unstick(p);
  await p.locator("main form").screenshot({ path: OUT + "intake-form.png" });

  // Option B: the new form replaces the intake form on /intake/.
  await p.evaluate((html) => {
    const form = document.querySelector("main form");
    const wrap = document.createElement("div");
    wrap.className = "mt-8 rounded-card border border-border bg-surface px-5 py-8 sm:px-8";
    wrap.innerHTML = html;
    form.replaceWith(wrap);
    document.querySelectorAll("main h1, main h1 ~ p, main h1 ~ div.rounded-card.border-border\\/60").forEach((el) => el.remove());
  }, formHtml);
  await p.screenshot({ path: OUT + "b-intake-replaced.png", fullPage: true });

  // Option C: the form near the bottom of the home page, above the closing band.
  await p.goto(BASE + "/", { waitUntil: "load" });
  await p.waitForTimeout(500);
  const box = await p.evaluate((html) => {
    const sections = [...document.querySelectorAll("main > section")];
    const last = sections.at(-1);
    const s = document.createElement("section");
    s.className = "py-14 lg:py-24";
    s.innerHTML = `<div class="mx-auto w-full max-w-site px-5 sm:px-6 lg:px-8"><div class="mx-auto max-w-3xl rounded-card border border-border bg-surface px-5 py-8 sm:px-8 lg:px-10 lg:py-12">${html}</div></div>`;
    last.before(s);
    const faq = sections.at(-2).getBoundingClientRect();
    const band = last.getBoundingClientRect();
    return { y: faq.top + window.scrollY + faq.height - 260, bottom: band.bottom + window.scrollY };
  }, formHtml);
  await p.screenshot({ path: OUT + "c-home.png", fullPage: true, clip: { x: 0, y: box.y, width: 1440, height: box.bottom - box.y } });
  await desk.close();

  // Phone view of option A.
  const phone = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
  const m = await phone.newPage();
  await m.goto(BASE + "/contact/", { waitUntil: "load" });
  await m.waitForTimeout(800);
  await unstick(m);
  await m.locator('form[aria-labelledby="contact-form-title"]').screenshot({ path: OUT + "form-phone.png" });
  await b.close();
})();
