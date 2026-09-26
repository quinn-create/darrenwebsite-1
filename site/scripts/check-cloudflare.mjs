// Builds the Cloudflare version of the site (hosting decision C8) and checks it fits the Workers
// free plan: at most 3 MiB compressed. Nothing is uploaded ("wrangler deploy --dry-run").
// With --serve it then fills the page cache and starts the site locally in Cloudflare's own
// runtime on http://127.0.0.1:8787, so the e2e tests can run against it (E2E_DEMO=...).
//
// Run from site/:  node scripts/check-cloudflare.mjs [--serve]
// Note: this runs `next build` again (into .next), so restart any `next start` servers after it.
import { execSync, spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const LIMIT_KIB = 3072; // Workers free plan
const WARN_KIB = 2950;
const run = (cmd) => execSync(cmd, { stdio: ["ignore", "pipe", "pipe"], encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

rmSync(".open-next", { recursive: true, force: true });
console.log("Building for Cloudflare…");
run("npx opennextjs-cloudflare build");
const out = mkdtempSync(path.join(tmpdir(), "cf-dry-"));
const dry = run(`npx wrangler deploy --dry-run --outdir ${out}`);
const m = dry.match(/gzip:\s*([\d.]+)\s*KiB/);
if (!m) {
  console.error(`Couldn't read the worker size:\n${dry}`);
  process.exit(1);
}
const kib = Number(m[1]);
const note = `${kib.toFixed(0)} KiB compressed (free-plan limit ${LIMIT_KIB} KiB)`;
if (kib > LIMIT_KIB) {
  console.error(`Too big for the Cloudflare free plan: ${note}.`);
  process.exit(1);
}
console.log(`${kib > WARN_KIB ? "Close to the limit: " : "Fits the Cloudflare free plan: "}${note}.`);

if (process.argv.includes("--serve")) {
  run("npx opennextjs-cloudflare populateCache local");
  const child = spawn("npx", ["wrangler", "dev", "--port", "8787", "--ip", "127.0.0.1"], { stdio: "ignore", detached: true });
  child.unref();
  for (let i = 0; i < 90; i++) {
    try {
      if ((await fetch("http://127.0.0.1:8787/")).ok) {
        console.log("Cloudflare runtime ready on http://127.0.0.1:8787");
        process.exit(0);
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 1000));
  }
  console.error("The Cloudflare runtime did not start.");
  process.exit(1);
}
