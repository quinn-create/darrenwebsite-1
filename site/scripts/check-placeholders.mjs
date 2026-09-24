// Refuses a production release while any unconfirmed placeholder text remains.
// Placeholders are bracketed notes such as "[CONFIRM WITH FIRM]", "[FIRM TO SUPPLY]",
// "[Office address — to confirm]" or "[TO BE SUPPLIED …]".
// Usage: node scripts/check-placeholders.mjs   (exit code 1 if any are found)
//        node scripts/check-placeholders.mjs --only-production   (skips unless SITE_ENV=production;
//        used by `npm run build`, so a production deploy on Vercel can't go out with placeholders)
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

if (process.argv.includes("--only-production") && process.env.SITE_ENV !== "production") {
  console.log("Placeholder check skipped (SITE_ENV is not production).");
  process.exit(0);
}

const ROOTS = ["app", "components", "lib"];
const PATTERN = /\[[^\]\n]*\b(confirm|to confirm|firm to|to be supplied|proposed copy|firm to review|draft|to approve)\b[^\]\n]*\]/gi;
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
if (found.length) {
  console.error(`Release blocked: ${found.length} unconfirmed placeholder(s) remain.\n`);
  console.error(found.join("\n"));
  console.error("\nReplace each with confirmed wording (see plans/signal-website-plan.md, Section 7).");
  process.exit(1);
}
console.log("No placeholders found.");
