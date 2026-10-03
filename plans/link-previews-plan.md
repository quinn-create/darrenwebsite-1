# Plan: better link previews (share cards)

**Order:** run this **after** `plans/faq-jump-links-plan.md` is finished.

**To run both:** open a Claude Code session on this repository (branch `claude/sleepy-clarke-wjlh48`) and say *"Run plans/faq-jump-links-plan.md, then plans/link-previews-plan.md."* To run only this one, once the first is done, say *"Run plans/link-previews-plan.md."* Nothing else is needed from you. Every decision is made below, and every check is automated.

Written 25 September 2026.

---

## 0. Before starting: confirm the FAQ plan is finished

All of these must be true. If any isn't, run `plans/faq-jump-links-plan.md` first, then come back.

- `site/components/FaqJumpLinks.tsx` exists.
- `site/HANDOFF.md` has a section about the FAQ jump buttons.
- `git log --oneline` shows that plan's commit.
- `node site/tests/e2e.mjs` passes, with both servers running as described in that plan's 6.2.

## 1. Goal

When anyone texts, emails or posts a link to the site (iMessage, WhatsApp, Facebook, LinkedIn, X, Slack), a **finished-looking preview card** appears. It shows Darren's approved portrait, his name, "Attorney at Law", "Murfreesboro, TN" and the office phone number on the site's navy background.

- **Practice pages** get their own card, for example **"DUI/DWI · Darren Drake"**.
- **Keeping it current:** the cards are generated from the site's own data (`lib/site.ts`), so a changed phone number or a new practice area updates them automatically.

## 2. Non-goals (don't do these)

- **No new claims, taglines, ratings or awards on the card.** Use only:
  - the name;
  - "Attorney at Law";
  - "Murfreesboro, TN";
  - the phone number;
  - the practice-area title;
  - the approved portrait.
- **Don't generate or alter Darren's likeness.** Use the approved crop as it is. Darren approved the edited portrait for link previews on 24 September 2026 (decision D2 in `plans/for-darren/answers-2026-09-24.md`).
- **Don't use outside services.** The images come from the site itself, with nothing hosted elsewhere.
- **Don't deploy anything.** The one external step, testing on a live link, is written down for launch day (section 8). It isn't part of "finished".

## 3. Starting point (verified 25 Sep 2026)

- **Base address:** `site/app/layout.tsx` already sets `metadataBase: new URL(SITE_URL)`, so image addresses come out in full.
- **Missing today:** there are no `openGraph` or `twitter` settings and no `opengraph-image` files, so links show a plain preview or none.
- **Portrait:**
  - `site/public/images/darren-drake-signal-4x5.jpg` (upright crop), which this plan uses;
  - `site/public/images/darren-drake-signal-square.jpg`.

  Both are JPEG, which the card generator supports.
- **Font:** the site's Manrope comes only as `.woff2`, which Next.js's card generator can't read. This plan adds the static `@fontsource/manrope` package, which includes `.woff` files. It's the **only new package allowed.** If its `.woff` files are missing, fall back to the Manrope TTF from the official Google Fonts GitHub repository (`google/fonts`, `ofl/manrope`), saved in `site/assets/fonts/` with its `OFL.txt` licence.

## 4. Design (already decided)

**Size:** 1200 × 630 px PNG. This is what Facebook, LinkedIn, X and iMessage expect. Keep each image under 500 KB; the platforms allow 5–8 MB.

| Part | Specification |
|---|---|
| Background | navy `#090F1C`, with a soft violet (`#8B5CF6`) and cyan (`#67E8F9`) glow behind the portrait, as on the home page |
| Portrait | right side, full height inside a 36 px margin, 4:5 crop, rounded 24 px, thin `#718199` border |
| Top-left label (practice cards only) | the practice title in cyan `#67E8F9`, 34 px, weight 800, e.g. "DUI/DWI" |
| Name | "Darren Drake", white `#F4F7FC`, 88 px (72 px on practice cards), weight 800, tracking −0.03em |
| Line 2 | "Attorney at Law · Murfreesboro, TN", `#CAD4E2`, 34 px, weight 600 |
| Phone | the phone icon plus "(615) 546-5551", white, 40 px, weight 700, evenly spaced digits, taken from `PHONE_DISPLAY` |
| Safe area | keep all text inside the left 60% and at least 60 px from each edge, because some apps crop the sides |

**Wording on the page (the `<head>` tags):**

| Page | Title | Card image alt text |
|---|---|---|
| Home and every page without its own card | "Darren Drake · Attorney at Law · Murfreesboro, TN" | "Darren Drake, Attorney at Law, Murfreesboro, Tennessee. Call (615) 546-5551." |
| Practice page | "<Practice title> · Darren Drake" | "<Practice title>: Darren Drake, Attorney at Law, Murfreesboro, Tennessee." |

**Descriptions:** reuse the existing page descriptions. Don't write new ones.

**Tags every page must end up with:**
- `og:title`, `og:description`, `og:url`, `og:type` (`website`), `og:site_name` ("Darren Drake Law PLLC");
- `og:image` (full address), `og:image:width` 1200, `og:image:height` 630, `og:image:alt`;
- `twitter:card` = `summary_large_image`, plus `twitter:image` pointing at the same image.

## 5. Steps

1. **Font:**
   - Run `npm install @fontsource/manrope` inside `site/`.
   - Confirm that `files/manrope-latin-800-normal.woff` and `manrope-latin-600-normal.woff` exist. If they don't, use the fallback in section 3.
2. **Shared card drawing:** create `site/lib/share-card.tsx`. It:
   - exports `renderShareCard({ label?: string })`, which returns a Next.js `ImageResponse` drawn to the design in section 4;
   - reads the font and portrait from disk with `fs` (server-only) and turns the portrait into a `data:` URL;
   - takes the name, phone and location from `lib/site.ts`, never from typed-in copies.
3. **Home and default card:** add `site/app/opengraph-image.tsx` with `export const size = { width: 1200, height: 630 }`, `contentType = "image/png"` and `alt` from the table in section 4, calling `renderShareCard({})`.
4. **Practice cards:** add `site/app/practice-areas/[slug]/opengraph-image.tsx`, which:
   - generates one card per `PRACTICES` slug (`generateStaticParams`);
   - calls `renderShareCard({ label: practice.title })`;
   - sets the alt text per section 4.
5. **Page tags:**
   - In `site/app/layout.tsx`, add `openGraph` (`siteName`, `type`, `locale: "en_US"`) and `twitter: { card: "summary_large_image" }`.
   - In `site/app/practice-areas/[slug]/page.tsx`'s `generateMetadata`, set `openGraph.title` to "<title> · Darren Drake".
   - Let Next.js add the image tags automatically from the `opengraph-image` files. Don't hard-code image addresses.
6. **Tests:** add the checks in 7.1 to `site/tests/e2e.mjs`.
7. **Run everything:** the commands in 7.2.
8. **Save the cards:**
   - Download each generated card to `printouts/share-cards/` as `home.png` plus one per practice area, e.g. `dui-dwi.png`.
   - Make `printouts/share-cards/preview-sheet.png`: every card shrunk to 600 × 315, the size a phone shows, on one sheet.
9. **Handoff notes:**
   - Append a section to `site/HANDOFF.md`.
   - Mark idea 10 as built in `plans/polish-ideas.md`.
   - Add the launch-day checks from section 8 to the launch checklist in `plans/for-darren/go-live-setup.md`, under "Later: launch day".
10. **Commit and push:** commit, with the usual co-author and session lines, and push to `claude/sleepy-clarke-wjlh48`. The clickable preview link doesn't show share cards, so it needs no republish.

## 6. What "correct" looks like on the card

- Only the text allowed in section 2 appears, spelled exactly as on the site.
- The portrait is the approved photo, not stretched, flipped or recoloured.
- The text is readable on the 600 × 315 sheet (the size of a phone preview).
- Nothing touches the edges or is cut off.

## 7. Checks

### 7.1 New automated tests (add to `site/tests/e2e.mjs`)
1. **Card images exist:**
   - `GET /opengraph-image`, and `/practice-areas/<slug>/opengraph-image` for all 5 slugs, each return 200 with `content-type: image/png`.
   - Each is exactly 1200 × 630 (read the width and height from the PNG header bytes 16–23).
   - Each is under 500 KB.
2. **Each practice card is different:** the 6 images have 6 different SHA-256 hashes.
3. **Home page tags:**
   - `og:title`, `og:description`, `og:url`, `og:site_name`, `og:image`, `og:image:width` = 1200, `og:image:height` = 630, `og:image:alt`, `twitter:card` = `summary_large_image` and `twitter:image` are all present;
   - `og:image` starts with the site's full address (`SITE_URL`), not a relative path.
4. **Practice page tags:** on `/practice-areas/dui-dwi/`, `og:title` is "DUI/DWI · Darren Drake", and `og:image` points at that page's own card.
5. **Every other page has a card:** `/about/`, `/contact/`, `/privacy/`, `/accessibility/` and `/legal-notice/` each have `og:image`, falling back to the home card.
6. **The card uses live data:** the home card's alt text contains `PHONE_DISPLAY` from `lib/site.ts`.

### 7.2 Commands (all must pass)
Run from `site/`.

1. `npx tsc --noEmit`: no errors.
2. `npm run lint`: no errors.
3. `npm run build`: succeeds, and the build output lists the 6 `opengraph-image` routes.
4. `node scripts/check-placeholders.mjs`: the count stays the same as after the FAQ plan (3).
5. **Main test suite:**
   - Start both servers from that build:
     - `npx next start -p 3000`;
     - `INTAKE_DESTINATION=local-test npx next start -p 3001`.
   - Run `node tests/e2e.mjs`: every check passes, including the FAQ plan's checks and the 6 new ones.
6. `node tests/delivery.mjs`: 4/4.

### 7.3 Visual check
Open `printouts/share-cards/preview-sheet.png` and every full-size card, and confirm each point in section 6. If anything is off, fix it, regenerate and look once more.

## 8. Launch day (recorded here, not part of "finished")

These checks need the real public address, so they happen when ddrakelaw.com points at the new site. Add them to the launch checklist in step 9.

- **Facebook:** paste the home page and one practice page into the Facebook Sharing Debugger (developers.facebook.com/tools/debug), press **Scrape Again**, and confirm the right card shows.
- **LinkedIn:** the same with LinkedIn Post Inspector (linkedin.com/post-inspector).
- **X:** start a post containing the link, without posting it, and confirm the large card appears.
- **iMessage/WhatsApp:** text the link to yourself and confirm the card appears.
- **If an old preview still shows:** that app cached the old site. Facebook and LinkedIn refresh when you press Scrape Again or Inspect; iMessage can take up to a day.

## 9. Finished when

- [ ] Every item in section 0 was confirmed before starting.
- [ ] `/opengraph-image` and all 5 practice-area cards generate at 1200 × 630, each under 500 KB, and all 6 are different.
- [ ] Every page's `<head>` has the full set of Open Graph and X tags listed in section 4, with full image addresses.
- [ ] The cards contain only the approved text and the approved portrait (section 6), confirmed on the preview sheet.
- [ ] All the commands in 7.2 pass, with the placeholder count unchanged.
- [ ] The card images and preview sheet are saved in `printouts/share-cards/`.
- [ ] `HANDOFF.md`, `polish-ideas.md` and the launch-day checklist in `go-live-setup.md` are updated.
- [ ] The commit is pushed to `claude/sleepy-clarke-wjlh48`.
- [ ] The final message to Quinn gives:
  - what changed;
  - the test counts;
  - the preview sheet image;
  - a note that the platform checkers run on launch day (section 8).

## 10. If something goes wrong

- **The font won't load in the card generator:** use the TTF fallback in section 3. If that fails too, report it and stop. Don't switch to a different typeface.
- **A check fails and can't be fixed in a reasonable time:** leave the code as it was before this plan (`git checkout -- site/`, and remove the new package with `npm uninstall @fontsource/manrope`). Report the failing check by name, and don't push.
- **The portrait looks wrong at card size** (cropped face, for example): try the square crop (`darren-drake-signal-square.jpg`) instead. If neither works, report it with the preview sheet and let Quinn decide.
