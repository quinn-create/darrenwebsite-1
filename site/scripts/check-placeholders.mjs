// Refuses a production release while any unconfirmed placeholder text remains.
// Placeholders are bracketed notes such as "[CONFIRM WITH FIRM]", "[FIRM TO SUPPLY]",
// "[Office address — to confirm]" or "[TO BE SUPPLIED …]".
// Usage: node scripts/check-placeholders.mjs   (exit code 1 if any are found)
//        node scripts/check-placeholders.mjs --only-production   (skips unless SITE_ENV=production;
//        used by `npm run build`, so a production deploy on Vercel can't go out with placeholders)
//        node scripts/check-placeholders.mjs --report      (lists them but exits 0; CI uses this before launch)
//        node scripts/check-placeholders.mjs --self-test   (proves every required pattern is caught)
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

if (process.argv.includes("--only-production") && process.env.SITE_ENV !== "production") {
  console.log("Placeholder check skipped (SITE_ENV is not production).");
  process.exit(0);
}

const ROOTS = ["app", "components", "lib"];
// Plan Appendix A requires [CONFIRM, [FIRM TO, to confirm], [TO BE SUPPLIED and [Office.
const PATTERN = /\[[^\]\n]*\b(confirm|to confirm|firm to|to be supplied|proposed copy|firm to review|draft|to approve)\b[^\]\n]*\]|\[Office\b[^\]\n]*\]/gi;

if (process.argv.includes("--self-test")) {
  const samples = ["[CONFIRM WITH FIRM]", "[FIRM TO SUPPLY]", "[Office address — to confirm]", "[TO BE SUPPLIED — licensed image]", "[Office hours]", "[DRAFT — DARREN TO APPROVE]"];
  const missed = samples.filter((t) => !new RegExp(PATTERN.source, "i").test(t));
  const falsePositive = ["[aria-current]", "[data-state=active]"].filter((t) => new RegExp(PATTERN.source, "i").test(t));
  if (missed.length || falsePositive.length) {
    console.error(`Placeholder guard self-test failed. Missed: ${missed.join(", ") || "none"}. Wrongly caught: ${falsePositive.join(", ") || "none"}.`);
    process.exit(1);
  }
  console.log(`Placeholder guard self-test passed (${samples.length} patterns caught, no false positives).`);
  process.exit(0);
}
const found = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (/\.(tsx?|mdx?)$/.test(name)) {
      readFileSync(full, "utf8")
        .split("\n")
        .forEach((line, i) => {
          for (const m of line.matchAll(PATTERN)) found.push(`${full}:${i + 1}  ${m[0]}`);
        });
    }
  }
}

ROOTS.forEach(walk);
if (found.length && process.argv.includes("--report")) {
  console.log(`${found.length} placeholder(s) still waiting on the firm (they block a production build):\n`);
  console.log(found.join("\n"));
  process.exit(0);
}
if (found.length) {
  console.error(`Release blocked: ${found.length} unconfirmed placeholder(s) remain.\n`);
  console.error(found.join("\n"));
  console.error("\nReplace each with confirmed wording (see plans/signal-website-plan.md, Section 7).");
  process.exit(1);
}
console.log("No placeholders found.");
