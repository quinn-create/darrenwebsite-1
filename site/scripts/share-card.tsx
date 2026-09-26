import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { PORTRAIT_4X5_NAME } from "@/lib/portrait";
import { FIRM, PRACTICES } from "@/lib/site";

// Link-preview card (Open Graph / X), 1200 × 630 JPEG under 300 KB, typed by code from the site's
// own data. Rendered ahead of time by scripts/make-share-cards.mjs into public/images/share/ (so
// the card renderer isn't part of the Cloudflare worker, which must stay under 3 MB on the free
// plan).
// Original description:
// own data (plan Phase 1 and Appendix C, A3). The 4:5 portrait sits in the centre square, so apps
// that crop previews to a square still show Darren's face. "DARREN / DRAKE" and "Attorney at Law"
// are on the left; the practice areas and the service area on the right. Nothing sits on the glow.
export const SHARE_CARD_SIZE = { width: 1200, height: 630 };
export const SHARE_CARD_TYPE = "image/jpeg";

const W = SHARE_CARD_SIZE.width;
const H = SHARE_CARD_SIZE.height;
const PHOTO_H = H;
const PHOTO_W = Math.round((PHOTO_H * 4) / 5); // 504
const PHOTO_X = (W - PHOTO_W) / 2; // 348
const SIDE = PHOTO_X - 40; // width of each text column, 40 px clear of the photo
const NAVY = "#090F1C";

const root = process.cwd();
const fontFile = (weight: number) =>
  readFile(path.join(root, "node_modules/@fontsource/manrope/files", `manrope-latin-${weight}-normal.woff`));

let assets: Promise<{ fonts: { name: string; data: Buffer; weight: 600 | 700 | 800 }[]; portrait: string }> | null = null;
function loadAssets() {
  assets ??= (async () => {
    const [w600, w700, w800, photo] = await Promise.all([
      fontFile(600),
      fontFile(700),
      fontFile(800),
      readFile(path.join(process.cwd(), "assets", "portrait", PORTRAIT_4X5_NAME)),
    ]);
    return {
      fonts: [
        { name: "Manrope", data: w600, weight: 600 },
        { name: "Manrope", data: w700, weight: 700 },
        { name: "Manrope", data: w800, weight: 800 },
      ],
      portrait: `data:image/jpeg;base64,${photo.toString("base64")}`,
    };
  })();
  return assets;
}

// `current` highlights one practice area (the practice pages' own cards).
export async function renderShareCard({ current }: { current?: string }): Promise<Response> {
  const { fonts, portrait } = await loadAssets();

  const image = new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", backgroundColor: NAVY, fontFamily: "Manrope" }}>
        {/* The photo's own light, continued just past its edges (violet left, cyan right). It stays
            between the two text columns, so no text sits on it. */}
        <div
          style={{
            position: "absolute",
            left: PHOTO_X - 34,
            top: 0,
            width: PHOTO_W + 68,
            height: H,
            display: "flex",
            backgroundImage:
              "radial-gradient(ellipse 12% 45% at 8% 50%, rgba(139,92,246,0.42), rgba(9,15,28,0) 100%), radial-gradient(ellipse 12% 45% at 92% 50%, rgba(103,232,249,0.38), rgba(9,15,28,0) 100%)",
          }}
        />
        {/* Left: name block. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: SIDE,
            height: H,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: 48,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", color: "#F4F7FC", fontSize: 58, fontWeight: 800, lineHeight: 0.98, letterSpacing: "-0.01em" }}>
            <div style={{ display: "flex" }}>DARREN</div>
            <div style={{ display: "flex" }}>DRAKE</div>
          </div>
          <div style={{ display: "flex", color: "#CAD4E2", fontSize: 28, fontWeight: 600, marginTop: 14 }}>{FIRM.descriptor}</div>
          <div style={{ display: "flex", width: 56, height: 4, backgroundColor: "#67E8F9", marginTop: 26, borderRadius: 2 }} />
        </div>
        {/* Centre: the approved 4:5 portrait, full height. The card renderer needs a plain <img>. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={portrait}
          alt=""
          width={PHOTO_W}
          height={PHOTO_H}
          style={{ position: "absolute", left: PHOTO_X, top: 0, width: PHOTO_W, height: PHOTO_H, objectFit: "cover" }}
        />
        {/* Right: practice areas and the confirmed service area. */}
        <div
          style={{
            position: "absolute",
            left: W - SIDE,
            top: 0,
            width: SIDE,
            height: H,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingRight: 40,
          }}
        >
          <div style={{ display: "flex", color: "#67E8F9", fontSize: 17, fontWeight: 800, letterSpacing: "0.14em", marginBottom: 14 }}>
            PRACTICE AREAS
          </div>
          {PRACTICES.map((p) => (
            <div
              key={p.slug}
              style={{
                display: "flex",
                fontSize: 25,
                fontWeight: p.title === current ? 800 : 600,
                color: p.title === current ? "#67E8F9" : "#F4F7FC",
                lineHeight: 1.45,
              }}
            >
              {p.title}
            </div>
          ))}
          <div style={{ display: "flex", color: "#CAD4E2", fontSize: 21, fontWeight: 600, marginTop: 22, lineHeight: 1.3 }}>
            {FIRM.serviceArea}
          </div>
        </div>
      </div>
    ),
    { ...SHARE_CARD_SIZE, fonts },
  );

  const png = Buffer.from(await image.arrayBuffer());
  const jpeg = await sharp(png).flatten({ background: NAVY }).jpeg({ quality: 82, mozjpeg: true, progressive: true }).toBuffer();
  return new Response(new Uint8Array(jpeg), {
    headers: { "content-type": SHARE_CARD_TYPE, "cache-control": "public, max-age=31536000, immutable" },
  });
}
