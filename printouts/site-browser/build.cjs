// Packs the running site (next start -p 3000) into one offline HTML file with a small
// browser around it: printouts/Darren-Drake-Website-Browser.html
// Pages are captured as the server renders them (no page scripts). Styles, fonts and
// images are stored once and shared by all pages.
const { chromium } = require("../../site/node_modules/playwright-core");
const fs = require("node:fs");
const path = require("node:path");

const BASE = "http://localhost:3000";
const OUT = path.join(__dirname, "..", "Darren-Drake-Website-Browser.html");
const PAGES = [
  ["/", "Home"],
  ["/practice-areas/", "Practice Areas"],
  ["/practice-areas/first-time-offenders/", "First-Time Offenders"],
  ["/practice-areas/dui-dwi/", "DUI/DWI"],
  ["/practice-areas/domestic-assault/", "Domestic Assault"],
  ["/practice-areas/criminal-defense/", "Criminal Defense"],
  ["/practice-areas/expungement/", "Expungement"],
  ["/about/", "About Darren"],
  ["/contact/", "Contact"],
  ["/intake/", "Start your intake"],
  ["/privacy/", "Privacy notice"],
  ["/accessibility/", "Accessibility"],
  ["/legal-notice/", "Legal notice"],
];

(async () => {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const assets = []; // { url, mime, data(base64) }
  const assetIndex = new Map();
  const cssParts = new Map();

  async function asset(url) {
    if (assetIndex.has(url)) return assetIndex.get(url);
    const res = await ctx.request.get(new URL(url, BASE).href, { headers: { accept: "image/webp,image/*,*/*" } });
    if (!res.ok()) throw new Error(`asset ${url}: ${res.status()}`);
    const mime = (res.headers()["content-type"] || "application/octet-stream").split(";")[0];
    assets.push({ mime, data: (await res.body()).toString("base64") });
    const token = `asset://${assets.length - 1}`;
    assetIndex.set(url, token);
    return token;
  }

  const pages = {};
  for (const [route, title] of PAGES) {
    await page.goto(BASE + route, { waitUntil: "load" });
    const info = await page.evaluate(() => {
      const css = [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.getAttribute("href"));
      document.querySelectorAll('script, link[rel="stylesheet"], link[rel="preload"], link[rel="modulepreload"], link[as]').forEach((n) => n.remove());
      const imgs = [];
      document.querySelectorAll("img").forEach((img, i) => {
        let src = img.getAttribute("src") || "";
        if (src.includes("/_next/image")) src = src.replace(/([?&])w=\d+/, "$1w=828");
        img.removeAttribute("srcset");
        img.removeAttribute("sizes");
        img.setAttribute("data-asset-i", String(i));
        imgs.push(src);
      });
      document.querySelectorAll('link[rel="icon"]').forEach((l) => l.remove());
      return { css, imgs, html: "<!doctype html>" + document.documentElement.outerHTML };
    });
    let html = info.html;
    for (let i = 0; i < info.imgs.length; i++) {
      const token = await asset(info.imgs[i]);
      html = html.replace(new RegExp(`(<img[^>]*?)src="[^"]*"([^>]*data-asset-i="${i}")`), `$1src="${token}"$2`);
    }
    for (const href of info.css) if (!cssParts.has(href)) cssParts.set(href, null);
    html = html.replace("</head>", "<!--SITE-CSS--></head>");
    pages[route] = { title, html };
  }

  // Stylesheets, with fonts and other url(...) references turned into shared assets.
  let css = "";
  for (const href of cssParts.keys()) {
    const cssUrl = new URL(href, BASE).href;
    let text = await (await ctx.request.get(cssUrl)).text();
    const urls = [...new Set([...text.matchAll(/url\(\s*["']?([^)"']+)["']?\s*\)/g)].map((m) => m[1]))].filter((u) => !u.startsWith("data:") && !u.startsWith("#"));
    for (const u of urls) {
      const token = await asset(new URL(u, cssUrl).href);
      text = text.replace(new RegExp(`url\\(\\s*["']?${u.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']?\\s*\\)`, "g"), `url(${token})`);
    }
    css += text + "\n";
  }
  await browser.close();

  const template = fs.readFileSync(path.join(__dirname, "shell.html"), "utf8");
  const data = JSON.stringify({ pages, css, assets, order: PAGES.map(([r]) => r) }).replace(/<\//g, "<\\/");
  const full = template.replace("/*__DATA__*/null", data);
  fs.writeFileSync(OUT, full);
  // Same page for a private claude.ai link: the host adds the html/head/body skeleton itself.
  const bare = full
    .replace(/<!doctype html>\s*<html[^>]*>\s*<head>\s*/i, "")
    .replace(/<meta charset="utf-8">\s*<meta name="viewport"[^>]*>\s*/i, "")
    .replace(/<\/head>\s*<body>/i, "")
    .replace(/<\/body>\s*<\/html>\s*$/i, "\n");
  fs.writeFileSync(path.join(__dirname, "artifact.html"), bare);
  console.log(`${OUT} ${(fs.statSync(OUT).size / 1024 / 1024).toFixed(2)} MB, ${PAGES.length} pages, ${assets.length} assets`);
})();
