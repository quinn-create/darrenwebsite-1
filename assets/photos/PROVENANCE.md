# Asset register: where every image came from

Required by the build plan, Appendix C (`plans/signal-website-plan.md`). One row per asset: its origin, size, use and approval. Update this file whenever an image is added, changed or approved.

**Approval record.** Darren approved the edited portrait for all uses (website, Google Business Profile and link previews) on 24 Sep 2026. He gave his answers in person; Quinn relayed them in the Claude Code session, and they're written up in `plans/for-darren/answers-2026-09-24.md` (decision D2 in `docs/DECISIONS.md`). On 26 Sep 2026 Quinn confirmed the photo paperwork is approved and needs no further action (`plans/for-darren/answers-2026-09-26.md`); no signed note or photographer/editor names are filed.

## Masters (never edited, never served)

| ID | File | Type | Origin | Size | SHA-256 | Use | Approval |
|---|---|---|---|---|---|---|---|
| A1 | `assets/photos/darren-drake-portrait.jpg` | Genuine photograph (original, 2024) | Supplied by the client; identical to the live site's `DRAKE-Darren-WEB_0090A_pp.jpg` | 1000×1400 | `a8a283d9e383da3fdf6fdb174f29f9a64873e65f39f73a9c1bf47db493217e13` | Archived master. Shown only if `PORTRAIT_VARIANT` is switched to `"original"` | Approved for web use (build prompt). **Photographer: unknown, to record** |
| A2 | `assets/photos/darren-drake-portrait-signal.webp` | Genuine photograph, digitally edited. The face was not reshaped or replaced. The colours were adjusted and the background replaced everywhere. About 130 px of sleeve and shoulder (left, x≈370–497) and a strip at the lower right were added by an editing tool. | Supplied by the client, commit `4150c10` (24 Sep 2026). **Editor and tool: to record.** Full-quality master: to request. | 2000×1125, sRGB, no EXIF | `a0e6d6df579721097d38a40471786c90744a70adc70b5eed4d4dc6e05a935710` | Source of every crop below. The genuine photograph is x≈497–1497 (A1 sits at x+497, y−2) | **Approved for all uses, 24 Sep 2026 (D2)**; signed note not filed. Photographer's permission for edited versions: **to record** |

The SHA-256 fingerprints prove the masters haven't changed: `sha256sum assets/photos/*` must print the same values.

## Crops (cut by `site/scripts/make-portrait-crops.mjs`, sharp, JPEG quality 90)

All are cut from inside the genuine strip only; the script refuses any box outside it. They live in `site/assets/portrait/` and are imported by the site, so only resized copies are ever sent to visitors. There's no downloadable full-size portrait on the site (the old `public/images/darren-drake-portrait.jpg` is gone).

| ID | File | Box | Size | Use | Alt text | Approval |
|---|---|---|---|---|---|---|
| A2-a | `darren-drake-signal-4x5.jpg` | A2 x 548–1448, full height | 900×1125 | Home hero (about 392 px wide on desktop, 256 px on phones); About hero (420 / 256 px); centre of the link-preview image; search-engine data (`image` of Darren) | "Darren Drake, attorney at law" | Covered by D2 |
| A2-b | `darren-drake-signal-1x1.jpg` | A2 x 600–1400, y 40–840 | 800×800 | Round avatars (96 and 64 px; the component exists but no page uses it yet); the 800×800 export for Google Business Profile and directories | `""` (his name is beside it) | Covered by D2, including Google and directories |
| A2-c | not made | A2 x 250–1750 | 1500×1125 | Only if D3 picks option (b); it includes the added sleeve and shoulder | "Darren Drake, attorney at law" | Not needed: Darren chose option (a) for D3 on 26 Sep 2026 |
| A1-a | `darren-drake-original-4x5.jpg` | A1 x 51–951, y 2–1127 (the same box as A2-a) | 900×1125 | Fallback for A2-a when `PORTRAIT_VARIANT = "original"` | as A2-a | Covered by A1's approval |
| A1-b | `darren-drake-original-1x1.jpg` | A1 x 103–903, y 42–842 (the same box as A2-b) | 800×800 | Fallback for A2-b | as A2-b | Covered by A1's approval |

**The switch:** `PORTRAIT_VARIANT` in `site/lib/site-basics.ts`. `"signal"` (in use) shows the approved edited portrait; `"original"` puts the untouched 2024 photo back on every page, in the link previews and in the search data.

## Made in-house by code

| ID | Files | What it is | How it's made | Use | Alt text | Approval |
|---|---|---|---|---|---|---|
| A3 | `/opengraph-image`, `/twitter-image`, and one per practice page (built by `site/lib/share-card.tsx`) | Link-preview image, 1200×630 JPEG (quality 82, about 53 KB). A composite of A2-a and text typed by code (Manrope font); no image model. A2-a fills the centre square. "DARREN / DRAKE" and "Attorney at Law" are on the left; the practice areas and "Murfreesboro, Rutherford County & Smyrna" on the right. | Next.js image route, then sharp | When a page is shared in a text, email or social post | "Darren Drake, attorney at law, Murfreesboro and Rutherford County, Tennessee" (practice pages add the practice name first) | Covered by D2 (link-preview use). **Design approved by Darren, 26 Sep 2026** (`plans/for-darren/answers-2026-09-26.md`). The plan's "Middle Tennessee" wording was replaced by the confirmed service area (`docs/DECISIONS.md`, C7). |
| A4 | `site/app/icon.svg`, `site/app/favicon.ico` (16/32/48), `site/app/apple-icon.png` (180, opaque `#090F1C`), `site/public/icons/icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, and `site/app/manifest.ts` | Vector icon: an open-corner cyan frame with "DD" drawn as shapes. No scales, shields or seals. | `site/scripts/make-icons.mjs` (sharp) | Browser tab, bookmarks, home screen | Decorative | In-house (Claude, 25 Sep 2026) |

## Not in use

| ID | What | Status |
|---|---|---|
| A5 | A licensed local architecture photo (optional) | None supplied. The home page uses the "At a glance" facts card (D11 default). If one's added, record the photographer, license, location and caption here. |
| A6 | A generated abstract texture (optional) | Not used. If ever used, log the image job's ID and never present it as a real place. |
| C1 | `site/components/ui/footer-section.tsx`, a third-party component adapted from 21st.dev (shadcn "footer-section") | **Removed in Phase 2 (26 Sep 2026).** 21st.dev leaves licensing to each author and the original author's license couldn't be confirmed, so the footer was rewritten as the site's own `site/components/Footer.tsx`. No third-party UI code remains in the footer. |
| R1–R9 | `brand-concepts/*.png`, including `01-signal.png` (Higgsfield job `f3f33b0f-cd9c-49c3-98f5-bafb3626dacc`) | Generated design references, never published. The job IDs are in `brand-concepts/README.md`. |
| Old | Media from the old ddrakelaw.com (old header images with the old name, number and address; the group, family and courthouse photos; the badges) | Not reused. The family photo is private, and the badges and old names conflict with the rules. |
