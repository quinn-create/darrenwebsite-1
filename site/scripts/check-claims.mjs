// Risky-claims check (CLAUDE.md "Never" list; plan Appendix A). Reads what visitors and search
// engines see on every page: visible text, the title and meta descriptions, image alt text and
// JSON-LD. Class names, CSS and colours are never read. Approved exceptions live in
// scripts/claims-allowlist.json. Usage: BASE_URL=http://localhost:3000 node scripts/check-claims.mjs
import { readFileSync } from "node:fs";
import { chromium } from "playwright-core";
import { chromiumPath } from "../tests/browser.mjs";
import { BASE, sitePages } from "./site-pages.mjs";

const RULES = [
  ["specialist wording", /\bspeciali[sz](?:t|ts|e|es|ed|ing|ation|ations)\b/i],
  ["certified", /\bcertified\b/i],
  ["expert (other than 'expert witness')", /\bexpert(?:s|ise)?\b(?!\s+witness)/i],
  ["best", /\bbest\b/i],
  ["top", /\btop[- ](?:rated|attorney|lawyer|firm|notch)\b/i],
  ["highest rated", /\bhighest[- ]rated\b/i],
  ["number one", /(?:#\s?1\b|\bnumber one\b|\bno\. 1\b)/i],
  ["free consultation", /\bfree (?:consultation|case review|case evaluation)\b/i],
  ["24/7", /\b24\s?\/\s?7\b|\b24 hours a day\b/i],
  ["guarantee", /\bguarantee(?:s|d)?\b/i],
  ["'our attorneys' (a solo practice)", /\bour (?:attorneys|lawyers|legal team)\b/i],
  ["results or win claims", /\b(?:we|he|darren)\s+(?:won|win|wins|will win)\b|\bproven (?:results|track record)\b|\brecord of success\b|\bsuccess rate\b/i],
  ["response-time promise", /\bwithin (?:an?|one|\d+|twenty[- ]four)\s+(?:minute|minutes|hour|hours|day|days|business day|business days)\b|\bsame[- ]day (?:response|call)\b/i],
  ["comparison with other lawyers", /\b(?:better|more experienced) than (?:other|most|any)\b/i],
];

if (process.argv.includes("--self-test")) {
  const bad = ["He specializes in DUI defense.", "A certified criminal law specialist.", "An expert in Tennessee law.", "The best lawyer in town.", "Top-rated attorney.", "Call for a free consultation.", "Available 24/7.", "We guarantee results.", "Our attorneys will help.", "We won 200 cases.", "We call back within 1 hour.", "Better than other firms."];
  const good = ["He may call an expert witness.", "Scroll to the top of the page.", "Tell us how to reach you.", "Contact the office as soon as you can."];
  const missed = bad.filter((t) => !RULES.some(([, rx]) => rx.test(t)));
  const wrong = good.filter((t) => RULES.some(([, rx]) => rx.test(t)));
  if (missed.length || wrong.length) {
    console.error(`Risky-claims self-test failed. Missed: ${missed.join(" | ") || "none"}. Wrongly caught: ${wrong.join(" | ") || "none"}.`);
    process.exit(1);
  }
  console.log(`Risky-claims self-test passed (${bad.length} risky sentences caught, ${good.length} safe ones ignored).`);
  process.exit(0);
}

const allow = JSON.parse(readFileSync(new URL("./claims-allowlist.json", import.meta.url), "utf8")).allowed.map((a) => a.text);

const browser = await chromium.launch({ executablePath: chromiumPath() });
const page = await browser.newPage();
const hits = [];
for (const path of await sitePages()) {
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  const parts = await page.evaluate(() => {
    const meta = [...document.querySelectorAll('meta[name="description"], meta[property^="og:"], meta[name^="twitter:"]')].map((m) => m.getAttribute("content") ?? "");
    const alts = [...document.querySelectorAll("img[alt]")].map((i) => i.alt);
    const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent ?? "");
    return { text: document.body.innerText, title: document.title, meta, alts, ld };
  });
  const sources = [["page text", parts.text], ["title", parts.title], ...parts.meta.map((m) => ["meta", m]), ...parts.alts.map((a) => ["alt text", a]), ...parts.ld.map((l) => ["JSON-LD", l])];
  for (const [where, text] of sources) {
    let t = text;
    for (const a of allow) t = t.split(a).join(" ");
    for (const sentence of t.split(/(?<=[.!?])\s+|\n+/)) {
      for (const [name, rx] of RULES) if (rx.test(sentence)) hits.push(`${path} (${where}) [${name}]: "${sentence.trim().slice(0, 160)}"`);
    }
  }
}
await browser.close();
if (hits.length) {
  console.error(`Risky-claims check failed: ${hits.length} match(es).\n\n${[...new Set(hits)].join("\n")}\n\nRewrite the sentence, or record Darren's approval in scripts/claims-allowlist.json.`);
  process.exit(1);
}
console.log(`Risky-claims check passed (${RULES.length} rules; ${allow.length} approved exception${allow.length === 1 ? "" : "s"}).`);
