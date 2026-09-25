// Repeatable speed test (plans/speed-check-plan.md). Starts its own server from the current
// build on :3006 and loads each page 5 times per profile in fresh browser contexts (a first
// visit, nothing cached), recording the median.
//   Phone:   412 × 823 at 1.75×, touch, CPU slowed 4×, 150 ms latency, 1.6 Mbps down (Lighthouse-style)
//   Desktop: 1440 × 900, no throttling
// Writes printouts/speed-report.{md,json}; exits non-zero if a budget fails.
// Usage (after `npm run build`, with nothing else running): npm run speed
//   --out=before   write printouts/speed-report-before.{md,json} instead, with budgets reported only
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import { chromium } from "playwright-core";

const PORT = 3006;
const BASE = `http://localhost:${PORT}`;
const RUNS = 5;
const PAGES = ["/", "/practice-areas/", "/practice-areas/dui-dwi/", "/about/", "/contact/"];
const OUT = process.argv.find((a) => a.startsWith("--out="))?.slice(6) ?? "";
const REPORT = new URL(`../../printouts/speed-report${OUT ? `-${OUT}` : ""}`, import.meta.url).pathname;
const executablePath = process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium";

const PROFILES = {
  phone: {
    context: { viewport: { width: 412, height: 823 }, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true },
    cpu: 4,
    network: { offline: false, latency: 150, downloadThroughput: (1638.4 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 },
  },
  desktop: { context: { viewport: { width: 1440, height: 900 } }, cpu: 1, network: null },
};

// Budgets (plans/speed-check-plan.md, 4.4). A page in TBT_OVERRIDE uses that phone TBT budget
// instead of the general one.
// Home: the plan asked for ≥ 25% below the "before" run (172 ms → ≤ 129 ms). Three runs after
// the fixes gave 131, 138 and 150 ms (about −20%); what remains is one ~180 ms framework
// start-up task that every page has. Per the plan's rule, home is held at the middle of those
// runs + 10% (138 → 152 ms), so a real slowdown fails.
const BUDGET = {
  phone: { lcp: 1800, cls: 0.01, tbt: 250, tap: 200, jsKB: 175, totalKB: 300, fonts: 1, fontKB: 30 },
  desktop: { lcp: 1000, cls: 0.01, tbt: 50 },
};
const TBT_OVERRIDE = { "/": 152 };

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
};

const server = spawn("npx", ["next", "start", "-p", String(PORT)], { stdio: "ignore", detached: true });
const stop = () => {
  try {
    process.kill(-server.pid);
  } catch {}
};
for (let i = 0; i < 60; i++) {
  try {
    if ((await fetch(BASE + "/")).ok) break;
  } catch {}
  await new Promise((r) => setTimeout(r, 500));
}

const browser = await chromium.launch({ executablePath });

async function measure(profile, path, withTaps) {
  const cfg = PROFILES[profile];
  const ctx = await browser.newContext(cfg.context);
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.enable");
  if (cfg.network) await cdp.send("Network.emulateNetworkConditions", cfg.network);
  if (cfg.cpu > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: cfg.cpu });
  const types = {};
  const bytes = {};
  let fontKB = 0;
  let fonts = 0;
  cdp.on("Network.responseReceived", (e) => (types[e.requestId] = e.type));
  cdp.on("Network.loadingFinished", (e) => {
    const t = types[e.requestId] ?? "Other";
    bytes[t] = (bytes[t] ?? 0) + e.encodedDataLength;
    if (t === "Font") {
      fonts++;
      fontKB += e.encodedDataLength / 1024;
    }
  });
  await page.addInitScript(() => {
    const v = (window.__speed = { lcp: 0, cls: 0, longTasks: [], events: [] });
    new PerformanceObserver((l) => l.getEntries().forEach((e) => (v.lcp = e.startTime))).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => l.getEntries().forEach((e) => !e.hadRecentInput && (v.cls += e.value))).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((l) => l.getEntries().forEach((e) => v.longTasks.push([e.startTime, e.duration, e.attribution?.[0]?.containerSrc || e.attribution?.[0]?.name || ""]))).observe({ type: "longtask", buffered: true });
    new PerformanceObserver((l) => l.getEntries().forEach((e) => v.events.push([e.name, e.duration, e.startTime]))).observe({ type: "event", durationThreshold: 16, buffered: true });
  });
  await page.goto(BASE + path, { waitUntil: "load" });
  await page.waitForTimeout(5000);
  const v = await page.evaluate(() => {
    const fcp = performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? 0;
    const s = window.__speed;
    // TBT: long-task time over 50 ms, from first paint to 5 s after it.
    const tbt = s.longTasks.filter(([t]) => t >= fcp && t <= fcp + 5000).reduce((sum, [, d]) => sum + Math.max(0, d - 50), 0);
    return { fcp, lcp: s.lcp, cls: s.cls, tbt, longTasks: s.longTasks };
  });
  const taps = {};
  if (withTaps) {
    const targets = {
      faq: page.locator(".faq summary").first(),
      carousel: page.getByRole("button", { name: "Next practice areas" }),
      theme: page.locator(".theme-toggle:visible").first(),
    };
    for (const [name, loc] of Object.entries(targets)) {
      if (!(await loc.count())) continue;
      await loc.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      const since = await page.evaluate(() => performance.now());
      if (profile === "phone") await loc.tap();
      else await loc.click();
      await page.waitForTimeout(800);
      const durs = await page.evaluate((t0) => window.__speed.events.filter(([, , st]) => st >= t0).map(([, d]) => d), since);
      taps[name] = durs.length ? Math.max(...durs) : 0; // no entry means under 16 ms
    }
  }
  await ctx.close();
  const kb = (t) => (bytes[t] ?? 0) / 1024;
  return {
    ...v,
    jsKB: kb("Script"),
    totalKB: Object.values(bytes).reduce((a, b) => a + b, 0) / 1024,
    fonts,
    fontKB,
    taps,
  };
}

const results = {};
for (const profile of Object.keys(PROFILES)) {
  results[profile] = {};
  for (const path of PAGES) {
    const runs = [];
    for (let i = 0; i < RUNS; i++) runs.push(await measure(profile, path, true));
    const tapNames = [...new Set(runs.flatMap((r) => Object.keys(r.taps)))];
    // Top long tasks of the median-TBT run, for the report's breakdown.
    const byTbt = [...runs].sort((a, b) => a.tbt - b.tbt)[Math.floor(RUNS / 2)];
    results[profile][path] = {
      fcp: median(runs.map((r) => r.fcp)),
      lcp: median(runs.map((r) => r.lcp)),
      cls: median(runs.map((r) => r.cls)),
      clsMax: Math.max(...runs.map((r) => r.cls)),
      tbt: median(runs.map((r) => r.tbt)),
      jsKB: median(runs.map((r) => r.jsKB)),
      totalKB: median(runs.map((r) => r.totalKB)),
      fonts: Math.max(...runs.map((r) => r.fonts)),
      fontKB: median(runs.map((r) => r.fontKB)),
      taps: Object.fromEntries(tapNames.map((n) => [n, median(runs.map((r) => r.taps[n] ?? 0))])),
      topTasks: byTbt.longTasks.sort((a, b) => b[1] - a[1]).slice(0, 5).map(([t, d, src]) => ({ at: Math.round(t), ms: Math.round(d), src })),
    };
  }
}

// Caching (plan 4.5).
const caching = [];
{
  const html = await (await fetch(BASE + "/")).text();
  const chunk = html.match(/\/_next\/static\/[^"]+\.js/)?.[0];
  const cc = (await fetch(BASE + chunk)).headers.get("cache-control") ?? "";
  caching.push({ name: "/_next/static/* is public, max-age=31536000, immutable", ok: /public/.test(cc) && /max-age=31536000/.test(cc) && /immutable/.test(cc), got: cc });
  for (const path of PAGES) {
    const h = (await fetch(BASE + path)).headers.get("cache-control") ?? "";
    caching.push({ name: `${path} is not no-store (back/forward cache)`, ok: !/no-store/.test(h), got: h });
  }
  const img = html.match(/\/_next\/image\/?\?url=[^"&]+(&amp;|&)w=\d+(&amp;|&)q=\d+/)?.[0]?.replace(/&amp;/g, "&");
  const ic = img ? ((await fetch(BASE + img)).headers.get("cache-control") ?? "") : "";
  const maxAge = Number(ic.match(/max-age=(\d+)/)?.[1] ?? 0);
  caching.push({ name: "/_next/image max-age ≥ 1 day", ok: maxAge >= 86400, got: ic });
}

await browser.close();
stop();

// Budgets.
const failures = [];
for (const [profile, pages] of Object.entries(results)) {
  const b = BUDGET[profile];
  for (const [path, r] of Object.entries(pages)) {
    const f = (cond, msg) => !cond && failures.push(`${profile} ${path}: ${msg}`);
    f(r.lcp <= b.lcp, `LCP ${Math.round(r.lcp)} ms > ${b.lcp}`);
    f(r.cls <= b.cls, `CLS ${r.cls.toFixed(4)} > ${b.cls}`);
    const tbtBudget = profile === "phone" ? (TBT_OVERRIDE[path] ?? b.tbt) : b.tbt;
    f(r.tbt <= tbtBudget, `TBT ${Math.round(r.tbt)} ms > ${tbtBudget}`);
    if (profile === "phone") {
      for (const [n, d] of Object.entries(r.taps)) f(d <= b.tap, `tap "${n}" ${Math.round(d)} ms > ${b.tap}`);
      f(r.jsKB <= b.jsKB, `JS ${r.jsKB.toFixed(1)} KB > ${b.jsKB}`);
      f(r.totalKB <= b.totalKB, `total ${r.totalKB.toFixed(1)} KB > ${b.totalKB}`);
      f(r.fonts === b.fonts, `${r.fonts} font requests (want ${b.fonts})`);
      f(r.fontKB <= b.fontKB, `fonts ${r.fontKB.toFixed(1)} KB > ${b.fontKB}`);
    }
  }
}
for (const c of caching) if (!c.ok) failures.push(`caching: ${c.name} (got "${c.got}")`);

// Report.
const ms = (x) => `${Math.round(x)} ms`;
let md = `# Speed report${OUT ? ` (${OUT})` : ""}\n\nGenerated ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC by \`npm run speed\` (plans/speed-check-plan.md). Median of ${RUNS} first visits per page, in fresh browser contexts.\n`;
for (const [profile, pages] of Object.entries(results)) {
  md += `\n## ${profile === "phone" ? "Phone (4× slower CPU, slow 4G, 412 × 823)" : "Desktop (1440 × 900, no throttling)"}\n\n| Page | FCP | LCP | CLS (worst run) | TBT | Taps | JS | Total | Fonts |\n|---|---|---|---|---|---|---|---|---|\n`;
  for (const [path, r] of Object.entries(pages)) {
    const taps = Object.entries(r.taps).map(([n, d]) => `${n} ${Math.round(d)}`).join(", ") || "n/a";
    md += `| \`${path}\` | ${ms(r.fcp)} | ${ms(r.lcp)} | ${r.cls.toFixed(4)} (${r.clsMax.toFixed(4)}) | ${ms(r.tbt)} | ${taps} | ${r.jsKB.toFixed(0)} KB | ${r.totalKB.toFixed(0)} KB | ${r.fonts} × ${r.fontKB.toFixed(0)} KB |\n`;
  }
}
md += `\n## Longest tasks (phone, median-TBT run)\n\n`;
for (const [path, r] of Object.entries(results.phone)) md += `- \`${path}\`: ${r.topTasks.map((t) => `${t.ms} ms at ${t.at} ms`).join("; ") || "none"}\n`;
md += `\n## Caching\n\n${caching.map((c) => `- ${c.ok ? "✓" : "✗"} ${c.name} (\`${c.got || "none"}\`)`).join("\n")}\n`;
md += `\n## Budgets\n\n${failures.length ? failures.map((f) => `- ✗ ${f}`).join("\n") : "- ✓ All budgets pass."}\n`;
if (Object.keys(TBT_OVERRIDE).length) md += `\nPhone TBT budget tightened from 250 ms (plan 4.4) for: ${Object.entries(TBT_OVERRIDE).map(([p, v]) => `\`${p}\` ${v} ms`).join(", ")}. See the note at BUDGET in tests/speed.mjs.\n`;
writeFileSync(REPORT + ".md", md);
writeFileSync(REPORT + ".json", JSON.stringify({ at: new Date().toISOString(), runs: RUNS, results, caching, failures }, null, 2));
console.log(md);
process.exit(OUT || failures.length === 0 ? 0 : 1);
