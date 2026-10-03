// Cuts the site's portrait crops (plan Appendix C: A2-a and A2-b) with sharp.
//
// Every "signal" crop stays inside the genuine middle strip of the edited portrait (x 497-1497).
// Only the background and colours were changed there; the sleeve, shoulder and lower-right strip
// that an editing tool added outside it are never used. The "original" crops are the same boxes
// cut from the untouched 2024 master (A1 sits inside A2 at x+497, y-2), for the PORTRAIT_VARIANT
// fallback in lib/site-basics.ts. The masters in assets/photos/ are only read, never written.
//
// Run from site/:  node scripts/make-portrait-crops.mjs
// Records: assets/photos/PROVENANCE.md
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT = path.join(root, "site", "assets", "portrait"); // imported by components, never served as-is
const SIGNAL = path.join(root, "assets", "photos", "darren-drake-portrait-signal.webp"); // A2
const ORIGINAL = path.join(root, "assets", "photos", "darren-drake-portrait.jpg"); // A1
const GENUINE = [497, 1497]; // x range of the genuine photograph inside A2
const A1_OFFSET = { x: 497, y: -2 }; // where A1's top-left corner sits in A2

// Boxes in A2 coordinates: [left, top, right, bottom].
const CROPS = {
  "4x5": [548, 0, 1448, 1125], // A2-a, 900x1125: Home and About heroes, link-preview centre
  "1x1": [600, 40, 1400, 840], // A2-b, 800x800: avatars, Google Business Profile, directories
};

async function cut(src, variant, offset) {
  const meta = await sharp(src).metadata();
  for (const [shape, [l, t, r, b]] of Object.entries(CROPS)) {
    if (l < GENUINE[0] || r > GENUINE[1]) throw new Error(`${shape} leaves the genuine strip`);
    const box = { left: l - offset.x, top: t - offset.y, width: r - l, height: b - t };
    if (box.left < 0 || box.top < 0 || box.left + box.width > meta.width || box.top + box.height > meta.height) {
      throw new Error(`${variant} ${shape}: box ${JSON.stringify(box)} is outside ${meta.width}x${meta.height}`);
    }
    const file = path.join(OUT, `darren-drake-${variant}-${shape}.jpg`);
    await sharp(src)
      .extract(box)
      .toColorspace("srgb")
      .jpeg({ quality: 90, mozjpeg: true, progressive: true })
      .toFile(file);
    console.log(`${path.relative(root, file)}  ${box.width}x${box.height} from x ${box.left}, y ${box.top}`);
  }
}

const a2 = await sharp(SIGNAL).metadata();
if (a2.width !== 2000 || a2.height !== 1125) throw new Error(`A2 is ${a2.width}x${a2.height}, expected 2000x1125`);
await cut(SIGNAL, "signal", { x: 0, y: 0 });
await cut(ORIGINAL, "original", A1_OFFSET);
