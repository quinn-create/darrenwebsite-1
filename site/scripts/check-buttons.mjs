// Cyan button check (plan Section 3, "Locked decisions"): every main cyan button (.btn-primary)
// is at least 52 px tall, and no section has more than one. The header and the phone's bottom
// bar are the allowed repeats. Checked at 390, 768 and 1440 px on every page.
// Usage: BASE_URL=http://localhost:3000 node scripts/check-buttons.mjs
import { chromium } from "playwright-core";
import { chromiumPath } from "../tests/browser.mjs";
import { BASE, sitePages } from "./site-pages.mjs";

const browser = await chromium.launch({ executablePath: chromiumPath() });
const problems = [];
let counted = 0;
for (const width of [390, 768, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  for (const path of [...(await sitePages()), "/page-that-does-not-exist/"]) {
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    const r = await page.evaluate(() => {
      const visible = (el) => {
        const s = getComputedStyle(el);
        const b = el.getBoundingClientRect();
        return s.display !== "none" && s.visibility !== "hidden" && b.width > 0 && b.height > 0;
      };
      const buttons = [...document.querySelectorAll(".btn-primary")].filter(visible);
      const groups = new Map();
      const short = [];
      for (const b of buttons) {
        const h = b.getBoundingClientRect().height;
        if (h < 51.5) short.push(`"${b.textContent.trim()}" ${Math.round(h)}px`);
        const owner = b.closest("header, footer, section, form, [data-sticky-cta]") ?? b.closest("main") ?? document.body;
        if (owner.tagName === "HEADER" || b.closest(".fixed")) continue; // header and phone bar repeat by design
        const key = owner.id || owner.getAttribute("aria-labelledby") || owner.tagName + ":" + [...owner.parentElement.children].indexOf(owner);
        groups.set(key, [...(groups.get(key) ?? []), b.textContent.trim()]);
      }
      return { count: buttons.length, short, crowded: [...groups].filter(([, v]) => v.length > 1).map(([k, v]) => `${k}: ${v.join(" + ")}`) };
    });
    counted += r.count;
    for (const s of r.short) problems.push(`${width}px ${path}: button under 52px: ${s}`);
    for (const c of r.crowded) problems.push(`${width}px ${path}: more than one cyan button in one section (${c})`);
  }
  await page.close();
}
await browser.close();
if (problems.length) {
  console.error(`Cyan button check failed:\n${problems.join("\n")}`);
  process.exit(1);
}
console.log(`Cyan button check passed (${counted} buttons checked across 3 widths).`);
