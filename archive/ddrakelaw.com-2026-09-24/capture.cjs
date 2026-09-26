// Read-only archive of the live ddrakelaw.com (GET requests only; no forms submitted).
const { chromium } = require(process.argv[3] + "/node_modules/playwright-core");
const fs = require("fs");
const out = process.argv[2];
const PAGES = ["/", "/areas-of-practice/", "/areas-of-practice/criminaldefense/", "/areas-of-practice/dui/",
  "/areas-of-practice/expungement/", "/areas-of-practice/juvenile-defense/", "/testimonials/",
  "/submit-a-testimonial/", "/contact/", "/blog/"];
(async () => {
  // In the build environment, outbound HTTPS is re-signed by a proxy CA; trust exactly that CA
  // (by its public-key hash, passed in CA_SPKI), never disable certificate checks.
  const args = process.env.CA_SPKI ? [`--ignore-certificate-errors-spki-list=${process.env.CA_SPKI}`] : [];
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args,
    proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined });
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  const log = [];
  for (const path of PAGES) {
    const slug = path === "/" ? "home" : path.replace(/^\/|\/$/g, "").replace(/\//g, "__");
    const res = await p.goto("https://ddrakelaw.com" + path, { waitUntil: "load", timeout: 60000 });
    await p.waitForTimeout(3000);
    fs.writeFileSync(`${out}/${slug}.html`, await p.content());
    await p.screenshot({ path: `${out}/${slug}.png`, fullPage: true });
    await p.pdf({ path: `${out}/${slug}.pdf`, format: "Letter", printBackground: true });
    log.push({ url: "https://ddrakelaw.com" + path, finalUrl: p.url(), status: res && res.status(), title: await p.title(), capturedAt: new Date().toISOString() });
    console.log(res && res.status(), path);
  }
  fs.writeFileSync(`${out}/index.json`, JSON.stringify(log, null, 2));
  await b.close();
})();
