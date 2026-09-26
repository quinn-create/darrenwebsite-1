// Lab proxy for mobile performance on the homepage (not field data).
// Run with the site on :3000. Usage: node tests/perf.mjs
import { chromium } from "playwright-core";

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium" });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send("Network.enable");
await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
const sizes = new Map();
cdp.on("Network.responseReceived", (e) => sizes.set(e.requestId, { url: e.response.url, type: e.type, bytes: 0 }));
cdp.on("Network.loadingFinished", (e) => { const s = sizes.get(e.requestId); if (s) s.bytes = e.encodedDataLength; });
await page.addInitScript(() => {
  window.__lcp = 0; window.__cls = 0;
  new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: "largest-contentful-paint", buffered: true });
  new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: "layout-shift", buffered: true });
});
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
const { lcp, cls } = await page.evaluate(() => ({ lcp: window.__lcp, cls: window.__cls }));
const all = [...sizes.values()];
const total = all.reduce((a, s) => a + s.bytes, 0);
const js = all.filter((s) => s.type === "Script").reduce((a, s) => a + s.bytes, 0);
const img = all.filter((s) => s.type === "Image").reduce((a, s) => a + s.bytes, 0);
const font = all.filter((s) => s.type === "Font").reduce((a, s) => a + s.bytes, 0);
console.log(JSON.stringify({ lcpMs: Math.round(lcp), cls: +cls.toFixed(3), totalKB: Math.round(total / 1024), jsKB: Math.round(js / 1024), imageKB: Math.round(img / 1024), fontKB: Math.round(font / 1024), requests: all.length }, null, 1));
await browser.close();
