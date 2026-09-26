// Builds every site icon from one vector drawing (plan Appendix C, A4): the open-corner cyan
// frame with an outlined "DD" drawn as shapes, not typed letters (so it looks the same on every
// device, with no font needed). No scales, shields or seals.
//
// Run from site/:  node scripts/make-icons.mjs
// Writes: app/icon.svg, app/favicon.ico (16/32/48), app/apple-icon.png (180, opaque #090F1C),
//         public/icons/icon-192.png, icon-512.png, icon-maskable-512.png
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NAVY = "#090F1C";
const CYAN = "#67E8F9";
const WHITE = "#F4F7FC";

// One "D" on a 64-unit grid: a straight back and a rounded bowl, with its counter cut out
// (even-odd fill). x = left edge; the letter is 12 wide and 18 tall, strokes 4.5 / 4.
const d = (x) =>
  `M${x} 23H${x + 5}A7 9 0 0 1 ${x + 5} 41H${x}Z` + `M${x + 4.5} 27H${x + 5}A2.5 5 0 0 1 ${x + 5} 37H${x + 4.5}Z`;

// scale < 1 shrinks the artwork towards the centre (maskable icons keep it in the safe zone).
function svg({ rounded = true, scale = 1 } = {}) {
  const art =
    `<path d="M14 22V14h8M42 14h8v8M50 42v8h-8M22 50h-8v-8" fill="none" stroke="${CYAN}" stroke-width="3"/>` +
    `<path d="${d(19)}${d(33)}" fill="${WHITE}" fill-rule="evenodd"/>`;
  const t = scale === 1 ? art : `<g transform="translate(32 32) scale(${scale}) translate(-32 -32)">${art}</g>`;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` +
    `<rect width="64" height="64"${rounded ? ' rx="12"' : ""} fill="${NAVY}"/>${t}</svg>`
  );
}

// Opaque PNGs for home screens; the favicon keeps its transparent rounded corners (ICO readers
// expect RGBA PNGs inside).
const png = (source, size, { alpha = false } = {}) => {
  const img = sharp(Buffer.from(source), { density: Math.ceil((72 * size) / 64) * 2 }).resize(size, size);
  return (alpha ? img.ensureAlpha() : img.flatten({ background: NAVY })).png({ compressionLevel: 9 }).toBuffer();
};

// favicon.ico holding PNG images (supported by every current browser).
function ico(images) {
  const header = Buffer.alloc(6 + images.length * 16);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, data }, i) => {
    const e = 6 + i * 16;
    header.writeUInt8(size >= 256 ? 0 : size, e);
    header.writeUInt8(size >= 256 ? 0 : size, e + 1);
    header.writeUInt16LE(1, e + 4); // colour planes
    header.writeUInt16LE(32, e + 6); // bits per pixel
    header.writeUInt32LE(data.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map((i) => i.data)]);
}

const write = (rel, data) => {
  const file = path.join(site, rel);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, data);
  console.log(`${rel}  ${data.length} bytes`);
};

write("app/icon.svg", svg() + "\n");
write("app/favicon.ico", ico(await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(svg(), size, { alpha: true }) })))));
// Home-screen icons are square and opaque; the phone rounds the corners itself.
write("app/apple-icon.png", await png(svg({ rounded: false }), 180));
write("public/icons/icon-192.png", await png(svg({ rounded: false }), 192));
write("public/icons/icon-512.png", await png(svg({ rounded: false }), 512));
// Maskable: the artwork fits inside the central 80% circle that Android may crop to.
write("public/icons/icon-maskable-512.png", await png(svg({ rounded: false, scale: 0.78 }), 512));
