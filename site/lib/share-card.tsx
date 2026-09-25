import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { FIRM, PHONE_DISPLAY } from "./site";

// Link-preview card (Open Graph / X), 1200 × 630, drawn from the site's own data so the
// name and phone number stay current. Design: plans/link-previews-plan.md, section 4.
// Text uses only approved facts; the portrait is the approved crop, unaltered (decision D2).
export const SHARE_CARD_SIZE = { width: 1200, height: 630 };

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
      readFile(path.join(root, "public/images/darren-drake-signal-4x5.jpg")),
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

// The card renderer's PNG encoder is quick but loose (~550 KB with the photo). Re-save the
// same pixels (full colour, palette off) with maximum PNG compression using sharp, which Next.js already ships.
// If sharp is ever unavailable, serve the original PNG unchanged.
async function compact(image: ImageResponse): Promise<Response> {
  const png = Buffer.from(await image.arrayBuffer());
  let body: Buffer = png;
  try {
    const sharp = (await import("sharp")).default;
    const smaller = await sharp(png).png({ compressionLevel: 9, adaptiveFiltering: true, palette: false }).toBuffer();
    if (smaller.length < png.length) body = smaller;
  } catch {
    // keep the original
  }
  return new Response(new Uint8Array(body), {
    headers: { "content-type": "image/png", "cache-control": "public, max-age=31536000, immutable" },
  });
}

export async function renderShareCard({ label }: { label?: string }): Promise<Response> {
  const { fonts, portrait } = await loadAssets();
  const M = 36; // outer margin around the portrait
  const photoH = SHARE_CARD_SIZE.height - M * 2;
  const photoW = Math.round((photoH * 4) / 5);

  const image = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#090F1C",
          fontFamily: "Manrope",
        }}
      >
        {/* Soft violet and cyan glow behind the portrait, as on the home page. */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: 760,
            height: 630,
            display: "flex",
            backgroundImage:
              "radial-gradient(circle at 55% 50%, rgba(139,92,246,0.45), rgba(9,15,28,0) 60%), radial-gradient(circle at 90% 45%, rgba(103,232,249,0.30), rgba(9,15,28,0) 55%)",
          }}
        />
        {/* Text: left 60%, at least 60 px from the edges. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: 660,
            padding: "60px 0 60px 64px",
          }}
        >
          {label ? (
            <div style={{ display: "flex", color: "#67E8F9", fontSize: 34, fontWeight: 800, marginBottom: 18 }}>
              {label}
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              color: "#F4F7FC",
              fontSize: label ? 72 : 88,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.02,
            }}
          >
            {FIRM.name}
          </div>
          <div style={{ display: "flex", color: "#CAD4E2", fontSize: 34, fontWeight: 600, marginTop: 18 }}>
            {FIRM.descriptor} · Murfreesboro, TN
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 44, color: "#F4F7FC" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#67E8F9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <div style={{ display: "flex", marginLeft: 16, fontSize: 40, fontWeight: 700, letterSpacing: "0.01em" }}>
              {PHONE_DISPLAY}
            </div>
          </div>
        </div>
        {/* Approved portrait, 4:5, rounded, thin border. The card renderer needs a plain <img>. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={portrait}
          alt=""
          width={photoW}
          height={photoH}
          style={{
            position: "absolute",
            right: M,
            top: M,
            width: photoW,
            height: photoH,
            objectFit: "cover",
            borderRadius: 24,
            border: "2px solid #718199",
          }}
        />
      </div>
    ),
    { ...SHARE_CARD_SIZE, fonts },
  );
  return compact(image);
}
