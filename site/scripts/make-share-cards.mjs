// Builds the link-preview images (plan Appendix C, A3) ahead of time: the home card plus one per
// practice area, as JPEGs in public/images/share/, and lib/share-cards.json listing them for the
// page metadata. The card design is scripts/share-card.tsx, read from the site's own data.
// Why ahead of time: rendering them on the server needs a 1.4 MB image engine, which would push the
// Cloudflare worker over the free plan's 3 MB limit (hosting decision C8).
//
// Run from site/ after changing the name, the practice areas, the service area or the photo:
//   node scripts/make-share-cards.mjs
// Each file name carries a short fingerprint, so a changed card gets a new address and social apps
// fetch it again. The e2e tests check that a card exists for every practice area.
import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(site, "public", "images", "share");
const tmp = path.join(site, "node_modules", ".cache", "share-cards");
mkdirSync(tmp, { recursive: true });

// Bundle the card (TypeScript + JSX + the "@/" alias) into plain JavaScript for Node.
const outfile = path.join(tmp, "share-card.mjs");
await build({
  entryPoints: [path.join(site, "scripts", "share-card.tsx")],
  bundle: true,
  platform: "node",
  format: "esm",
  outfile,
  jsx: "automatic",
  alias: { "@": site },
  loader: { ".jpg": "empty" }, // only the photo's file name is needed, not the image imports
  external: ["next", "next/*", "sharp", "react", "react/*"],
  logLevel: "warning",
});
// Next.js has no "exports" map, so Node needs the file name spelled out.
writeFileSync(outfile, readFileSync(outfile, "utf8").replaceAll('from "next/og"', 'from "next/og.js"'));
const { renderShareCard } = await import(pathToFileURL(outfile).href + `?t=${Date.now()}`);

// The site's data, bundled the same way.
const dataFile = path.join(tmp, "site-data.mjs");
await build({
  stdin: { contents: 'export { PRACTICES } from "@/lib/site";', resolveDir: site, loader: "ts" },
  bundle: true,
  platform: "node",
  format: "esm",
  outfile: dataFile,
  alias: { "@": site },
  logLevel: "warning",
});
const { PRACTICES } = await import(pathToFileURL(dataFile).href + `?t=${Date.now()}`);

process.chdir(site); // the card reads fonts and the photo relative to site/
mkdirSync(OUT, { recursive: true });
for (const f of readdirSync(OUT)) if (f.endsWith(".jpg")) rmSync(path.join(OUT, f));

const cards = {};
const jobs = [{ key: "home", name: "darren-drake", current: undefined }, ...PRACTICES.map((p) => ({ key: p.slug, name: `darren-drake-${p.slug}`, current: p.title }))];
for (const job of jobs) {
  const jpg = Buffer.from(await (await renderShareCard({ current: job.current })).arrayBuffer());
  const file = `${job.name}-${createHash("sha256").update(jpg).digest("hex").slice(0, 8)}.jpg`;
  writeFileSync(path.join(OUT, file), jpg);
  cards[job.key] = `/images/share/${file}`;
  console.log(`${cards[job.key]}  ${Math.round(jpg.length / 1024)} KB`);
}
writeFileSync(
  path.join(site, "lib", "share-cards.json"),
  JSON.stringify({ _about: "Written by scripts/make-share-cards.mjs. Don't edit by hand.", width: 1200, height: 630, cards }, null, 2) + "\n",
);
