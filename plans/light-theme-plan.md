# Plan: light theme option

**To run it:** open a Claude Code session on this repository (branch `claude/sleepy-clarke-wjlh48`) and say *"Run plans/light-theme-plan.md."* Nothing else is needed from you. Every decision is made below, and every check is automated.

Written 25 September 2026. It doesn't depend on any other open plan.

---

## 1. Goal

Visitors who find white-on-navy hard to read can switch the whole site to a **light version** with one clearly labelled button in the header. Their choice is **remembered on every page and on later visits**, the page **never flashes** the wrong colours while loading, and **every page still meets WCAG 2.2 AA** in both versions.

**The site still opens in the dark Signal design** unless the visitor picks light. Nothing about the dark version changes.

## 2. Brand rules this must obey

These come from `Darren_Drake_AI_Brand_Guidelines.md`.

- **Signal is a dark design** ("dark navy, bold sans typography, cyan action"). So dark stays the default and the light theme is an **opt-in extension**. Idea 7 in `plans/polish-ideas.md`; Quinn asked for this plan on 25 September 2026. There's a one-line off switch (4.6) if Darren prefers dark only.
- **Contrast:** normal text at least 4.5:1, and controls and focus indicators at least 3:1, "checked separately".
- **"Decorative color is not an approved text color."** Violet stays decoration only in both themes.
- **Keep the same typography, layout, spacing, shapes and wording.** Only colours change.
- **"Use error and success colors on the base surface only after checking contrast."** Both are re-chosen for light backgrounds and measured (4.1).

## 3. Non-goals (don't do these)

- **Don't follow the device's light/dark setting by default.** Most phones and PCs are set to light out of the box, so that would quietly replace the brand's dark design for most visitors. A one-line setting allows it later (4.6).
- **No change to anything outside the web pages:**
  - the link-preview share cards;
  - the browser-tab icon (`app/icon.svg`);
  - the inquiry PDF and the email.
- **No wording, layout, spacing or font change.** No new npm package.
- **No animated colour fade when switching.** The change is instant, so nothing flickers and reduced motion needs no special case.
- **No third "Auto" button.** Two states keep it simple for the visitors it's meant for.

## 4. Design (already decided)

### 4.1 Light palette

These are the same token names as `site/app/globals.css`, set under `html[data-theme="light"]`. The ratios were measured on 25 Sep 2026 and are re-checked by test 6.1-5.

| Token | Dark (unchanged) | Light | Light contrast |
|---|---|---|---|
| `--color-bg` | `#090f1c` | `#f5f7fb` | n/a |
| `--color-surface` | `#131f31` | `#ffffff` | n/a |
| `--color-text` | `#f4f7fc` | `#0b1424` | 17.2:1 on bg, 18.4:1 on surface |
| `--color-muted` | `#cad4e2` | `#3d4a5e` | 8.4:1 / 9.0:1 |
| `--color-action` | `#67e8f9` | `#0e7490` | 5.0:1 / 5.4:1 (used as text for inline links) |
| `--color-on-action` | `#07111f` | `#ffffff` | 5.4:1 on action |
| `--color-border` | `#718199` | `#7a889d` | 3.4:1 / 3.6:1 (control edges need 3:1) |
| `--color-focus` | `#67e8f9` | `#0e7490` | 5.0:1 / 5.4:1 |
| `--color-decoration` | `#8b5cf6` | `#7c3aed` | decoration only |
| `--color-error` | `#ff9a9a` | `#b42318` | 6.1:1 / 6.6:1 |
| `--color-success` | `#86efac` | `#166534` | 6.7:1 / 7.1:1 |

**If a measured ratio falls short anywhere** (for example text on a tinted chip), darken the light-theme value in steps of 5% lightness until it passes. Never lighten dark-theme values, and never lower a target.

### 4.2 Hard-coded colours to turn into tokens
A few rules in `globals.css` use fixed `rgb(...)` values tuned for navy. Give each a token with a dark value (exactly today's, so the dark theme is pixel-identical) and a light value:

| Where | New token | Dark (today) | Light |
|---|---|---|---|
| Card and panel border | `--card-border` | `rgb(113 129 153 / 0.45)` | `rgb(61 74 94 / 0.22)` |
| Card top sheen | `--card-sheen` | `rgb(255 255 255 / 0.025)` | `rgb(11 20 36 / 0.02)` |
| Card hover border | `--card-hover-border` | `rgb(103 232 249 / 0.55)` | `rgb(14 116 144 / 0.55)` |
| Chip and tinted backgrounds | `--tint-action` | `rgb(103 232 249 / 0.08)` | `rgb(14 116 144 / 0.08)` |
| Other `rgb(113 129 153 / …)` borders | `--line` | as today | `rgb(61 74 94 / 0.35)` |
| Hero portrait glow | `--glow-violet`, `--glow-cyan` | `rgb(139 92 246 / 0.62)`, `rgb(103 232 249 / 0.5)` | `rgb(124 58 237 / 0.22)`, `rgb(14 116 144 / 0.2)` |

Also add a soft card shadow in light only (`0 1px 2px rgb(11 20 36 / 0.06)`), because white cards on a near-white page need an edge.

**Step 3 sweep:** grep `site/app`, `site/components` and `site/lib` for any remaining `#hex`, `rgb(` or `white`/`black` colour utility used on the page. Share-card and icon files are exempt. Each one found becomes a token.

### 4.3 How switching works
1. **Setting the theme before paint.** A tiny inline script (under 400 bytes) goes in `<head>` in `site/app/layout.tsx`, so it runs before anything is drawn:
   - it reads `localStorage["theme"]` inside `try/catch`;
   - if the value is `"light"`, it sets `data-theme="light"` on `<html>`;
   - it always adds the class `js` to `<html>`.

   `<html>` gets `suppressHydrationWarning` because the script changes its attributes before React loads.
2. **The button.** A new `site/components/ThemeToggle.tsx` (a `"use client"` component):
   - **Where:** in the header. On desktop it sits between the phone number and "Contact us"; on phones, beside the "Call" pill.
   - **Size and look:** a 44 × 44 px round icon button, styled like the "Call" pill's border.
   - **Icon:** a lucide `Sun` in dark mode and a `Moon` in light mode.
   - **Name:** "Light mode" with `aria-pressed` (false in dark, true in light), and a matching `title` tooltip.
   - **When pressed:** it
     - switches `data-theme`;
     - saves the choice in `localStorage` inside `try/catch` (if storage is blocked, it still switches for the current page);
     - updates `<meta name="theme-color">` (`#090F1C` dark, `#F5F7FB` light).
3. **Browser-drawn parts:** `color-scheme: dark` on `:root` and `color-scheme: light` under `html[data-theme="light"]`, so scrollbars, date pickers and autofill match. In `layout.tsx`, the viewport's `colorScheme` becomes `"dark light"`.
4. **Without JavaScript:** the site is dark and the button can't work, so hide it with `html:not(.js) .theme-toggle { visibility: hidden; }`. Its space is still reserved, so there's no layout shift.

### 4.4 Things that need a look in light mode
- **Header:** `bg-bg/85` with blur already uses tokens. Check the blur still reads well over white cards.
- **Hero:** the portrait keeps its own dark backdrop inside its frame; that's fine as a framed photo. Keep the glow soft (4.2).
- **Phone bar at the bottom** (`StickyCta`): it uses `bg-bg`, so it follows the theme automatically. Check the border shows.
- **The form:** check fields, chips, the error summary, error text and the success message against the new error and success colours.
- **The FAQ open/closed markers, the carousel arrows, the tab bar and the timeline line.**

### 4.5 Where the screenshots go
`printouts/site-preview/light-{home,dui-dwi,contact-errors}-{1440,390}.png`, plus the matching dark ones taken the same way for a side-by-side sheet, `printouts/site-preview/light-vs-dark.png`.

### 4.6 Switches (in `site/lib/site.ts`)
- **`LIGHT_THEME = true`:** when `false`, the button and the head script aren't rendered, and the site is exactly as before this plan.
- **`THEME_DEFAULT: "dark" | "system" = "dark"`:** with `"system"`, the head script also picks light when there's no saved choice and `prefers-color-scheme: light` matches. It stays `"dark"` unless Darren asks.

## 5. Steps

1. **Record the starting point:**
   - the placeholder count (`node scripts/check-placeholders.mjs`; 3 on 25 Sep 2026);
   - the e2e test count (62 on 25 Sep 2026);
   - the total gzipped size of `.next/static/chunks/*.js`;
   - dark screenshots of the pages in 4.5.
2. **Switches:** add `LIGHT_THEME` and `THEME_DEFAULT` (4.6) to `site/lib/site.ts`, with a comment pointing to this plan.
3. **Tokens:** add the light palette (4.1) and the new tokens (4.2) to `globals.css`, and do the sweep in 4.2. The dark values must equal today's exactly.
4. **Switching:** add the head script, `ThemeToggle` and the `color-scheme` rules (4.3). Mount the button in `Header.tsx`.
5. **Look it over:** go through every item in 4.4 at 1440 and 390 px and fix anything that doesn't read well, using tokens only.
6. **Tests:** add the checks in 6.1 to `site/tests/e2e.mjs`.
7. **Run everything:** the commands in 6.2 and the size check in 6.3.
8. **Screenshots:** take the set in 4.5 and build the side-by-side sheet.
9. **Preview:** add a **Light / Dark** pair of buttons to the toolbar in `printouts/site-browser/shell.html`, next to Laptop / Phone. They set `data-theme` on the previewed page's `<html>`. Rebuild with `node printouts/site-browser/build.cjs`, and republish the existing link (https://claude.ai/artifact/HRkufSWZ8TydyinEMhLHNF) from `printouts/site-browser/artifact.html`.
10. **Handoff notes:**
    - Append a section to `site/HANDOFF.md`: the palette, the switches, how to add a colour (always as a token with both values), and the brand note from section 2.
    - Mark idea 7 as built in `plans/polish-ideas.md`.
11. **Commit and push:** commit, with the usual co-author and session lines, and push to `claude/sleepy-clarke-wjlh48`.

## 6. Checks

### 6.1 New automated tests (add to `site/tests/e2e.mjs`)
1. **Dark by default:** in a fresh browser, even with the device set to light (`colorScheme: "light"`), `<html>` has no `data-theme="light"` and the page background is `rgb(9, 15, 28)`.
2. **Switching and remembering:**
   - pressing the button turns the background `rgb(245, 247, 251)` and sets `aria-pressed="true"`;
   - the choice survives a reload and a move to another page;
   - pressing it again returns to dark.
3. **No flash:** with `"light"` saved, an init script records the page background the moment `<body>` first appears. It must already be the light colour. Repeat for dark with `"dark"` saved.
4. **Accessibility in both themes:** axe (WCAG 2.2 AA) finds 0 violations in both themes on:
   - all 12 pages at 1440 px;
   - the home, a practice page and Contact at 390 px;
   - the Contact page with the error summary showing;
   - the Contact page after a successful test send (on the local-test server).
5. **Measured contrast:** in light mode, compute the contrast of each token pair from 4.1 in the browser (from computed styles, not the table):
   - text, muted, action and error/success ≥ 4.5:1 on both bg and surface;
   - border and focus ≥ 3:1;
   - on-action text ≥ 4.5:1 on the action colour.
6. **Keyboard and focus:**
   - the button is reachable with Tab and toggles with both Enter and Space;
   - its focus ring is at least 2 px, with ≥ 3:1 contrast against the header, in both themes;
   - its accessible name is "Light mode".
7. **Storage blocked:** with `localStorage` throwing, the button still switches the current page, and there are no console errors.
8. **Without JavaScript:** the page is dark, the button is `visibility: hidden`, and its box keeps the same size as with JavaScript.
9. **No layout shift:** CLS is 0 on load in both themes. At 320 px there's no horizontal scroll in either theme, and the header fits on one row.
10. **Browser colour:** `<meta name="theme-color">` is `#090F1C` in dark and `#F5F7FB` in light after switching. The computed `color-scheme` matches the theme.
11. **Dark unchanged:** dark screenshots of the home, DUI/DWI and Contact pages at 1440 px match the step-1 baseline pixel for pixel. The one allowed difference is the new button's area in the header, which is masked out.
12. **Switches:**
    - a build-output grep confirms the head script's text comes from `lib/site.ts`;
    - a small unit check confirms that with `LIGHT_THEME` false, `ThemeToggle` renders `null` and the layout renders no head script.

### 6.2 Commands (all must pass)
Run from `site/`.

1. `npx tsc --noEmit`: no errors.
2. `npm run lint`: no errors.
3. `npm run build`: succeeds.
4. `node scripts/check-placeholders.mjs`: the count is unchanged from step 1.
5. **Main test suite:**
   - Restart both servers from that build:
     - `npx next start -p 3000`;
     - `INTAKE_DESTINATION=local-test npx next start -p 3001`.
   - Run `node tests/e2e.mjs`: every existing check passes, plus all the new ones.
6. `node tests/delivery.mjs`: 4/4.
7. **Share cards unchanged:** the six PNGs rendered from the build are byte-identical to `printouts/share-cards/`.

### 6.3 Size check
The total gzipped JavaScript increase, including the inline head script, must be under 1.5 KB.

### 6.4 Visual check
Look at the side-by-side sheet and confirm all of these:
- the light version reads as the same brand (same layout, type and shapes, with a deep-cyan action colour);
- nothing is invisible or washed out: borders, chips, the timeline line, carousel arrows, FAQ markers and form fields;
- the hero photo sits well on the light page;
- the dark version looks exactly as before.

If anything is off, fix it with tokens and re-take the screenshots.

## 7. Finished when

- [ ] The header button switches the whole site between dark and light, is remembered across pages and visits, and never flashes the wrong theme on load.
- [ ] The site opens dark by default, even on devices set to light, and the dark version is unchanged pixel for pixel.
- [ ] Every page passes WCAG 2.2 AA in both themes, including the form's error and success states, with measured contrast meeting 4.1.
- [ ] Without JavaScript or with storage blocked, nothing breaks.
- [ ] Share cards, the icon, the PDF and the email are untouched.
- [ ] Every check in 6.1–6.3 passes, with the placeholder count unchanged and JavaScript under +1.5 KB.
- [ ] The screenshots and side-by-side sheet are saved and pass 6.4.
- [ ] The preview link has the Light / Dark buttons and is republished.
- [ ] `HANDOFF.md` and `polish-ideas.md` are updated, and the commit is pushed to `claude/sleepy-clarke-wjlh48`.
- [ ] The final message to Quinn gives:
  - what changed;
  - the test counts;
  - the side-by-side sheet;
  - one sentence on the switches (`LIGHT_THEME`, `THEME_DEFAULT`) and the brand note.

## 8. If something goes wrong

- **A contrast failure that token changes can't fix:** darken the light value further (4.1). If it's a dark-theme element, leave it as it was and scope the fix to light only.
- **A flash of the wrong theme that can't be removed:** set `LIGHT_THEME = false`, push that, and report it. The site is then exactly as before.
- **A check fails and can't be fixed in a reasonable time:** leave the code as it was before this plan (`git checkout -- site/`). Report the failing check by name, and don't push.
