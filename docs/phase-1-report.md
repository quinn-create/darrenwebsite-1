# Phase 1 report: design lock and assets

Run on 25–26 September 2026 from `docs/PROMPT-PLAN.md`, Phase 1. Nothing was deployed. D17 (private previews) is answered, but the firm's Vercel account doesn't exist yet, so the screenshots are from the site running on the build computer.

- **Branch:** the prompt asks for `phase-1-design-lock`. This session may only push to `claude/sleepy-clarke-wjlh48`, so the work is there (conflict C6).
- **Photo label:** D2 (photo approval) is answered, so the screenshots carry no "pending" label.

## What was done, step by step

| Step | Result | Where |
|---|---|---|
| 1. Crops | `make-portrait-crops.mjs` (sharp) cuts A2-a (4:5, 900×1125, x 548–1448) and A2-b (1:1, 800×800, x 600–1400, y 40–840) from the genuine strip. It refuses any box outside that strip. It also cuts the same two boxes from the untouched original, for the switch. | `site/scripts/make-portrait-crops.mjs`, `site/assets/portrait/` |
| 1. Records | Every asset is listed with its origin, size, use and approval. | `assets/photos/PROVENANCE.md` |
| 1. Master and switch | The original portrait is untouched (its SHA-256 is recorded). `PORTRAIT_VARIANT` ("signal" or "original") switches every page, the link previews and the search data. | `site/lib/site-basics.ts`, `site/lib/portrait.ts` |
| 1. Downloadable original | The site has no full-size portrait at all: `public/images/` is gone, and crops are served only as resized copies. | — |
| 2. Hero glow | Layered radial gradients at 42% (violet) and 38% (cyan) opacity, with no blur filter. Violet sits on the left and cyan on the right, where the photo's own light is. It stays inside the photo column. | `site/app/globals.css` (`.portrait-glow`) |
| 2. Name block | Measured against the concept at 1440 px: "DARREN" is 118 px wide on the site and about 117 px in the concept (30 px type, the plan's size). It already matches, so it wasn't enlarged further. | `site/components/Wordmark.tsx` |
| 2. First screen | Hero spacing tightened. At 1440×900 the header, eyebrow, three-line headline, supporting line, button, phone link, photo with glow and "How Darren can help" are all on screen. | e2e "Phase 1" checks |
| 2. Phones | The headline and button come before the photo. No text sits on the glow at 320, 390, 768 or 1440 px (checked on Home and About). | e2e "Phase 1" checks |
| 3. Page types | Home, a practice page (DUI/DWI), About, Contact and Intake. Per C1, Intake is the form on /contact/. About now has the same glow, still (no fade-in), and the photo is 320 px tall on phones, as the plan says. | the site |
| 4. Icons | The "DD" is drawn as shapes, in an open-corner frame; no scales, shields or seals. Files: `icon.svg`, `favicon.ico` (16/32/48), `apple-icon.png` (180, opaque `#090F1C`), 192/512 and maskable icons, and `/manifest.webmanifest`. | `site/scripts/make-icons.mjs`, `site/app/`, `site/public/icons/`, `site/app/manifest.ts` |
| 5. Link preview | 1200×630, navy, typed by code (no image model). The 4:5 crop sits in the centre square. "DARREN / DRAKE" and "Attorney at Law" are on the left; the practice areas and the service area on the right. It's a JPEG of about 53 KB (the limit is 300 KB). Practice pages highlight their own area. | `site/lib/share-card.tsx` |
| 6. PDF | 16 pages: a cover with the link-preview images, then each page type at 390, 768 and 1440 px beside `brand-concepts/01-signal.png`. | `printouts/Phase-1-Design-Lock.pdf`, `printouts/phase-1/*.jpg` |

**One change from the prompt (conflict C7):** the prompt's link-preview text and alt text say "Middle Tennessee". Darren confirmed Rutherford County cases only (24 Sep 2026), and the rules forbid unconfirmed facts. So the image says "Murfreesboro, Rutherford County & Smyrna", and the alt text is "Darren Drake, attorney at law, Murfreesboro and Rutherford County, Tennessee".

## Checks

| Check | Result |
|---|---|
| Lint, typecheck, build | Clean |
| End-to-end (`npm test`) | 91/91. Four checks are new: first desktop screen, glow, phone order and icons. The share-card checks now expect JPEGs under 300 KB. |
| Cookie consent | 13/13 |
| Inquiry delivery | 4/4 |
| Risky claims, cyan buttons, links | Pass (107 buttons; 12 pages) |
| Lighthouse (slow phone, 5 pages × 3 runs) | All budgets met: LCP 1.43–1.63 s, CLS 0, JS 159 KB (Contact 174 KB), total 242–263 KB |

## Waiting on Darren
1. **Approve the look** of the five page types in `printouts/Phase-1-Design-Lock.pdf`, or send changes in one list.
2. **Approve the headline and supporting line:** "Your next step starts with a conversation." and "Tell Darren Drake about your legal matter and how to reach you."
3. **Approve the link-preview image**, including the service-area wording (C7).
4. **D3:** the About-page photo shape. The recommended upright crop is in use.
5. **Photo records:** sign the photo note, and name the photographer and whoever edited the photo. Ask the editor for the full-quality master.
6. **Still open from Phase 0:** accounts and owners (D13), the privacy notice and retention (D8), conflicts C1–C5, and the footer component's license check (C1 in the asset register).
