# Plan: speed check and fixes

**To run it:** open a Claude Code session on this repository (branch `claude/sleepy-clarke-wjlh48`) and say *"Run plans/speed-check-plan.md."* Nothing else is needed from you. Every decision is made below, and every check is automated.

Written 25 September 2026. It doesn't depend on any other open plan.

---

## 1. Goal

On a **typical mid-range phone on a slow 4G connection**, every page should:
- show its main content fast;
- **never jump around while loading**;
- respond to taps without delay.

The goal is to meet Google's "good" Core Web Vitals with a wide margin, with a repeatable speed test anyone can re-run, so the site stays fast as it grows.

**Nothing visible changes.** The same words, layout, colours, fonts and behaviour, pixel for pixel.

## 2. What the first measurement found (25 Sep 2026)

Measured with Chromium set up like Lighthouse's phone test:
- a 412 × 823 screen;
- the processor slowed 4×;
- 150 ms network delay and 1.6 Mbps download;
- a first visit with nothing cached;
- one run each.

| Page | Main content shown (LCP) | Jumping (CLS) | Busy processor (TBT) | Downloaded |
|---|---|---|---|---|
| Home | 0.82 s | 0.008 | 447 ms | 277 KB (scripts 181 KB) |
| DUI/DWI | 0.69 s | **0.048** | 317 ms | 254 KB |
| Contact | 0.69 s | **0.098** | 297 ms | 261 KB |

**What that means**
1. **Speed of first view is excellent.** Google's "good" limit is 2.5 s.
2. **Pages jump when the font arrives.** The jump happens about 1.3 s in, when the Manrope web font replaces the stand-in font and text re-wraps. On the Contact page it's 0.098, just under Google's 0.1 limit for "good": one more line of text could tip it over.
   - **Cause:** the font loads with `font-display: swap` and no size-matched stand-in, and it isn't preloaded.
   - **Also:** the handoff notes from the light-theme plan already record the same shift on desktop (0.004).
3. **The phone's processor is busy for 300–450 ms** after the page appears. Lighthouse counts under 200 ms as good. Two causes are within reach:
   - **The whole practice-area and FAQ text is sent twice.** `PracticeCarousel` and `StickyCta` import `lib/site.ts`, which puts all its wording into the browser's JavaScript, even though that text is already in the page. The two chunks carrying it total about 12 KB gzipped.
   - **The rest is the framework itself** (React and the Next.js router, about 116 KB gzipped). That can't be removed.
4. **Everything else is already lean:**
   - images are AVIF/WebP and correctly sized (17 KB on the home page for phones);
   - CSS is 13 KB;
   - there are no third-party scripts, trackers or chat widgets.

## 3. Non-goals (don't do these)

- **No visible change:** no wording, layout, colour, spacing or animation change, and no font swap to a different typeface.
- **No new npm package.** Measure with Playwright and Chromium's built-in tools; fonts use Next's built-in `next/font/local`.
- **Don't turn off link prefetching.** The 23 KB of "Fetch" traffic is Next loading the pages a visitor is likely to open next, which makes clicking instant.
- **Don't make the Contact page static.** The "Asking about …" chip must be in the first HTML, or it would itself cause a jump.
- **No paid monitoring service.** Real-visitor data comes from Google Search Console after launch (section 8).

## 4. Design (already decided)

### 4.1 Stop the font jump
1. **Load the font through `next/font/local`** (built into Next) instead of the `@fontsource-variable/manrope` stylesheet import:
   - copy the Latin subset file (`node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2`) to `site/app/fonts/manrope-latin-wght.woff2`;
   - add the font's licence as `site/app/fonts/OFL.txt` (SIL Open Font License, copied from the package).
2. **Font settings:** `weight: "200 800"`, `display: "swap"`, `preload: true`, `adjustFontFallback: "Arial"` and `variable: "--font-manrope"`. Next then:
   - **preloads** the file, so it arrives much earlier;
   - generates a **size-matched Arial stand-in**, so the text takes the same space before and after the swap, with no re-wrapping.
3. **Wiring it up:**
   - put the font's class on `<html>`;
   - make `--font-sans` in `globals.css` start with `var(--font-manrope)` (the fallbacks after it stay);
   - remove the `@fontsource-variable/manrope/wght.css` import from `layout.tsx`.

   Keep the package: the share cards read fonts from `@fontsource/manrope` (a different package), and nothing about them changes.
4. **Character check:** only the Latin subset is loaded. A test confirms every character shown on all 12 pages is inside that file's `unicode-range`. The site is English, and the Latin subset includes –, ’, “ ” and ·.

### 4.2 Stop sending page text twice
1. **`PracticeCarousel`:**
   - split it so the list of cards is rendered on the server (`PracticeCarousel` in `components/Sections.tsx` or its own server file);
   - move only the arrow-button logic into a small client component, `CarouselArrows`, that finds the list by `id` (`all-practice-list`);
   - the HTML output must be identical, apart from the added `id`.
2. **`StickyCta`:**
   - it only needs each practice area's `slug` and `title`, so the layout passes it a small list, `PRACTICES.map(({ slug, title }) => ({ slug, title }))`, as a prop;
   - it no longer imports `PRACTICES` or `practiceBySlug`;
   - it still imports the small constants (`PHONE_*`, `CTA_*`).
3. **Keep the page text out of browser code:**
   - move the small constants client components need (`PHONE_DISPLAY`, `PHONE_HREF`, `CTA_LABEL`, `CTA_HREF`, `NAV`, `SCROLL_REVEALS`, `LIGHT_THEME`, `THEME_DEFAULT`, `INTAKE_SUCCESS`) into `site/lib/site-basics.ts`;
   - `lib/site.ts` re-exports them, so no server file changes;
   - client components import from `site-basics.ts` only.
4. **Check:** after building, no client JavaScript chunk contains practice or FAQ wording. The test greps `.next/static/chunks` for five sample sentences from `PRACTICES` and `HOME_FAQ`.

### 4.3 The repeatable speed test
Add `site/tests/speed.mjs`, run with `npm run speed`. Like `tests/delivery.mjs`, it starts its own server (`next start -p 3006`) from the current build.

**Phone profile:** Lighthouse-style throttling through the Chrome DevTools Protocol:
- `Emulation.setCPUThrottlingRate` 4;
- `Network.emulateNetworkConditions` with 150 ms latency, 1.6 Mbps down and 750 Kbps up;
- a 412 × 823 screen at 1.75× scale, with touch.

**Desktop profile:** 1440 × 900 with no throttling.

**Pages:** home, Practice Areas, DUI/DWI, About and Contact.

**Runs:** each page and profile is loaded **5 times in fresh contexts** (first visit, nothing cached), and the **median** is recorded.

**Measured with Performance Observers:**
- **LCP**;
- **FCP**;
- **CLS**: the total, first visit, including the font swap;
- **TBT**: the long tasks' time over 50 ms, from first paint until 5 s;
- **transfer bytes by type**: from `Network.loadingFinished`;
- **the number of font requests**;
- **tap response (INP stand-in):** after load, the script taps the first FAQ question, the carousel's "Next" arrow and the theme button, and records each `PerformanceEventTiming` duration.

It writes `printouts/speed-report.md` (a table per profile) and `printouts/speed-report.json`, and exits non-zero if any budget in 4.4 fails.

### 4.4 Budgets (fail the test if broken)

| Measure (phone profile, median) | Budget | Google "good" |
|---|---|---|
| LCP | ≤ 1.8 s | ≤ 2.5 s |
| CLS, first visit | **≤ 0.01** | ≤ 0.1 |
| TBT | ≤ 250 ms on every page, and at least 25% lower than the step-1 baseline on the home page | ≤ 200 ms (Lighthouse) |
| Tap response (each of the three taps) | ≤ 200 ms | ≤ 200 ms (INP) |
| JavaScript transferred | ≤ 175 KB | n/a |
| Total transferred | ≤ 300 KB | n/a |
| Font requests | exactly 1, ≤ 30 KB | n/a |

**Desktop profile:** LCP ≤ 1.0 s, CLS ≤ 0.01 and TBT ≤ 50 ms.

**If TBT can't reach 250 ms after 4.2:** the remaining time is framework start-up. Record the measured figure and the breakdown (the top 5 long tasks and their scripts) in the report, set that page's TBT budget to the measured median + 10%, and say so in the final message. Never loosen any other budget.

### 4.5 Caching check
Add to the speed test:
- `/_next/static/*` responses carry `Cache-Control: public, max-age=31536000, immutable`;
- HTML pages are not `no-store`, so the browser's back/forward cache can work;
- images from `/_next/image` have a `max-age` of at least one day.

Report each result. Fix only `next.config.ts` headers if one fails.

## 5. Steps

1. **Record the starting point:**
   - the placeholder count (3 on 25 Sep 2026) and the e2e count (74 on 25 Sep 2026);
   - write `tests/speed.mjs` (4.3), build, and run it **before any fix**. Save the output as `printouts/speed-report-before.md`. This is the baseline for the TBT improvement rule.
   - take full-page screenshots, in both themes, of home, DUI/DWI and Contact (with errors showing) at 1440 and 390 px, for the pixel comparison in 6.1-6.
2. **Fonts:** make the changes in 4.1.
3. **Page text:** make the changes in 4.2.
4. **Look for anything else the report shows:** `npx next experimental-analyze --output` writes a module-size breakdown without starting a server. Record the 10 largest client modules in the report.
   - Fix anything that is **this site's own code** and over 5 KB gzipped, with the same "no visible change" rule.
   - Framework modules stay.
5. **Tests:** add the checks in 6.1 to `site/tests/e2e.mjs`.
6. **Run everything:** the commands in 6.2, then `npm run speed` until every budget passes.
7. **Report:**
   - `printouts/speed-report.md`: before and after side by side, the analyzer's top 10, the caching results, and any TBT budget adjustment with its reason;
   - `printouts/speed-report-before.md` stays as the record.
8. **Handoff notes:**
   - Append a section to `site/HANDOFF.md`: how to run `npm run speed`, the budgets, the font setup, and the "client components import `site-basics.ts`" rule.
   - Mark idea 8 as done in `plans/polish-ideas.md`.
   - Remove the "found in passing" font-shift note from the light-theme section, or mark it fixed.
   - Add the launch-day items in section 8 to `plans/for-darren/go-live-setup.md`.
9. **Preview and push:**
   - Rebuild the clickable preview (`node printouts/site-browser/build.cjs`) so it uses the new font setup, and republish the existing link (https://claude.ai/artifact/HRkufSWZ8TydyinEMhLHNF). Check that the preview's font still loads.
   - Commit, with the usual co-author and session lines, and push to `claude/sleepy-clarke-wjlh48`.

## 6. Checks

### 6.1 New automated tests (add to `site/tests/e2e.mjs`)
1. **One font file, preloaded:**
   - every page has exactly one `<link rel="preload" as="font" type="font/woff2" crossorigin>`;
   - a first visit makes exactly one font request;
   - no page loads the old fontsource CSS.
2. **Size-matched stand-in:** the computed `font-family` of `body` starts with the next/font family and includes its generated fallback. The fallback's `@font-face` has `size-adjust` set.
3. **Every character is covered:**
   - collect all text characters from the 12 pages, in both the page and the form's error messages;
   - every code point falls inside the Latin `unicode-range` of the loaded `@font-face`.
4. **No jump on a first visit:** at 390 px with 4× CPU and slow-4G throttling, on home, DUI/DWI and Contact, a fresh context gives a total `layout-shift` of **≤ 0.01**.
5. **Page text not in browser code:** five sample sentences (two from `PRACTICES`, two from `HOME_FAQ`, one practice FAQ answer) appear in no file under `.next/static/chunks`.
6. **Nothing visible changed:** full-page screenshots from step 1 compare pixel for pixel, with zero different pixels, in both themes: home, DUI/DWI and Contact with errors, at 1440 and 390 px.
   - If the font renders a sub-pixel differently only because of how it's now loaded, allow at most 0.1% of pixels with a per-channel difference ≤ 8. Record that in the report.
7. **The carousel still works:**
   - the arrows scroll the list, and are disabled at the ends;
   - the list keeps `aria-roledescription="carousel"` and its slide labels;
   - there are no console errors.
8. **The phone bar still works:**
   - on each practice page, "Ask about <title>" links to `/contact/?topic=<slug>`;
   - it's hidden on `/contact/`.

The existing tests already cover the rest of the phone bar's behaviour; they must still pass.

### 6.2 Commands (all must pass)
Run from `site/`.

1. `npx tsc --noEmit`: no errors.
2. `npm run lint`: no errors.
3. `npm run build`: succeeds.
4. `node scripts/check-placeholders.mjs`: the count is unchanged from step 1.
5. **Main test suite:**
   - Restart both servers:
     - `npx next start -p 3000`;
     - `INTAKE_DESTINATION=local-test npx next start -p 3001`.
   - Run `node tests/e2e.mjs`: every existing check passes, plus all the new ones.
6. `node tests/delivery.mjs`: 4/4.
7. `npm run speed`: every budget in 4.4 passes, and the caching checks in 4.5 pass.

### 6.3 Noise control
Speed numbers vary from run to run. That's why the test uses the median of 5, and runs nothing else at the same time (stop the e2e servers first). If a budget fails by less than 5%, re-run once. A second failure is real.

## 7. Finished when

- [ ] The font loads from one preloaded file with a size-matched stand-in, and first-visit CLS is ≤ 0.01 on every measured page on the phone profile.
- [ ] No practice or FAQ wording is in the browser's JavaScript. Client components import only `lib/site-basics.ts`.
- [ ] `npm run speed` exists, runs the 5-page, 2-profile, 5-run test, writes the report and passes every budget. Any TBT budget adjustment follows 4.4's rule and is explained.
- [ ] Screenshots are pixel-identical to before in both themes (6.1-6).
- [ ] Every check in 6.1 and 6.2 passes, with the placeholder count unchanged.
- [ ] `speed-report-before.md`, `speed-report.md`, `HANDOFF.md`, `polish-ideas.md` and the launch-day items are written.
- [ ] The preview is republished, and the commit is pushed to `claude/sleepy-clarke-wjlh48`.
- [ ] The final message to Quinn gives:
  - a before/after table (LCP, CLS, TBT and KB for home, DUI/DWI and Contact, on the phone profile);
  - the test counts;
  - one sentence on what to do on launch day.

## 8. Launch day (recorded here, not part of "finished")

1. **PageSpeed Insights** (pagespeed.web.dev): test the home page, `/practice-areas/dui-dwi/` and `/contact/` on the live address. Record the mobile scores in `printouts/speed-report.md`. The "Lab" part should broadly match `npm run speed`.
2. **Search Console → Core Web Vitals:** after about 28 days of real visitors, check that phone and desktop both show **"Good URLs"** and no "Poor" ones. Before that, Google won't have enough data.
3. **Re-run `npm run speed`** after any larger change: a new page, a new photo or a new feature. The budgets fail loudly if something makes the site slower.

## 9. If something goes wrong

- **The font change alters how text looks** (the pixel comparison fails beyond the allowance in 6.1-6): first check the `weight` range and that the same file is used. If the text still looks different, put the fontsource import back, keep only the 4.2 changes, and report the font jump as unresolved, with the numbers.
- **The carousel or phone bar split causes any behaviour difference:** undo that one change, keep the others, and report.
- **A check fails and can't be fixed in a reasonable time:** leave the code as it was before this plan (`git checkout -- site/`). Report the failing check by name, and don't push.
