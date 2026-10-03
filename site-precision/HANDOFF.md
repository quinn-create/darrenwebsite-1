# Precision build: handoff

The build follows `prompts/precision-website-build-prompt.md` and the reference concept `brand-concepts/05-precision-b.png` (Higgsfield job `962a61fb-5cd3-4ee4-8ed5-261cfb7d0a6c`). It's a local preview only: nothing is deployed or published, and ddrakelaw.com is unchanged. It's a separate project from the Signal site in `site/`; the two share no code at runtime.

## What was built

- **Pages:**
  - Home, Practice Areas, and one page each for Criminal Defense, DUI/DWI and Expungement (all from one template).
  - About Darren, Contact, Intake, Privacy (placeholder) and 404.
- **Homepage sequence (concept B):**
  1. Hero: a 7/5 split with the headline, cobalt CTA and phone link. The numbered next-step row sits under the CTA, and Darren's real portrait with its caption is on the right.
  2. Practice cards on a pale blue `#D8E6FF` band.
  3. "Meet Darren Drake".
  4. "What happens after you reach out" (three numbered cards, always visible).
  5. FAQ.
  6. Intake CTA card.
  7. Footer.
- **Header:**
  - White and sticky on desktop only, with the cobalt "DD" square, name and descriptor.
  - The active nav item gets a 3 px cobalt underline.
  - The phone link and "Start your intake" sit on the right.
  - On mobile: a compact 64 px header that isn't sticky, a phone icon, and a menu sheet (focus trap, Esc closes it, focus returns to the button).
- **Mobile:** the CTA comes first, then the steps stack vertically, then the portrait. There are no sticky or fixed elements on mobile.
- **Intake:**
  - The same fields, validation, states, demo mode and server handling as the Signal build.
  - Desktop has a "Prefer to call?" panel beside the form.
  - On mobile, the phone link sits directly above the submit button.
- **Motion:** none. Only 160 ms color and border transitions, which reduced motion removes.

## Verification (all run on this build)

| Check | Result |
|---|---|
| `npm run lint` | pass (0 warnings) |
| `npm run typecheck` | pass |
| `npm run build` | pass (11 routes; intake page and API dynamic, everything else static) |
| `./tests/run-e2e.sh` | **18/18 passed** |
| axe-core, WCAG 2.0/2.1/2.2 A+AA, all 8 pages + intake with errors shown | **0 violations** |
| Lab performance, home, 390 px, 4× CPU and ~1.6 Mbps throttling (`tests/perf.mjs`) | LCP ≈ 0.7 s, CLS 0.03, **253 KB total transfer**, 145 KB JS, 37 KB image, 47 KB font, 17 requests |

The lab numbers are a launch proxy, not field data.

The end-to-end checks are the same as Signal's form, keyboard, mobile menu, reflow, zoom, skip-link and axe tests, plus:
- on mobile the order is CTA, then steps, then portrait, and nothing is sticky;
- no animations on any page;
- reduced motion removes transitions;
- **every page renders and works without JavaScript**, including the nav, the FAQ disclosure and the intake fields. Only form submission needs JavaScript.

## Contrast (tokens as used in the build)

| Pair | Ratio |
|---|---|
| text `#142238` / bg `#F8FAFD` | 15.27:1 |
| text / surface `#FFFFFF` | 15.96:1 |
| text / band `#D8E6FF` | 12.68:1 |
| muted `#526278` / bg | 5.95:1 |
| muted / surface | 6.22:1 |
| muted / band | 4.94:1 |
| white / action `#1746C4` (buttons) | 7.75:1 |
| action / bg (links) | 7.41:1 |
| action / band | 6.16:1 |
| border `#74839A` / surface (non-text) | 3.85:1 |
| error `#A12732` / surface | 7.36:1 |
| success `#226345` / surface | 7.15:1 |

## Screenshots (`site-precision/screenshots/`)

- `home|practice|about|contact|intake-{390,768,1440}.png` (full page) and `-fold.png` (first screen)
- `menu-390.png`
- `intake-{error,not-configured,submitting,success,retry}-{390,1440}.png`
- `header-no-dd-{1440,390}.png`: the header with the DD square turned off
- `compare-concept-vs-build.png`: the concept and the 1440 px build side by side

## Decision needed: header "DD" square

Concept B shows a cobalt "DD" square beside the name. The guidelines reserve the monogram for the favicon and ask for an understated wordmark. It's **on by default** because you chose this concept. To turn it off, build with `NEXT_PUBLIC_SHOW_DD_MARK=false`; see `header-no-dd-*.png`. The favicon uses the DD mark either way.

## Intentional differences from the concept and prompt

1. **Spelling:** fixed "Tennesse" to "Tennessee".
2. **Icon:** the scales-of-justice icon became a briefcase (Lucide `Briefcase`).
3. **Step wording:** step 3 uses the full wording "Discuss next steps if the firm can assist", not the concept's shortened "Discuss next steps".
4. **Card copy:** cards use neutral one-line descriptions marked `[CONFIRM WITH FIRM]`, not taglines.
5. **"Meet Darren" layout:** it repeats the portrait at a smaller size, because no separate office photo was supplied. The guidelines prefer quality over quantity, so no placeholder image is shown there.
6. **FAQ and form components:** native `<details>`/`<summary>` and hand-built fields rather than shadcn/ui, so they work without JavaScript and add no dependencies. shadcn/ui is set up (`components.json`, `lib/utils.ts`, `components/ui/`) and currently used for the footer only.
7. **Font:** Inter is self-hosted with `@fontsource-variable/inter` (one variable woff2, 47 KB) instead of `next/font`.
8. **Back navigation:** leaving `/intake` mid-form and returning clears the answers. Nothing personal is stored in the browser.
9. **`noindex`:** the preview sets `robots: noindex, nofollow`. Remove it at launch.

## Still needed before launch

- [ ] **Intake delivery destination** plus a verified test delivery. Move rate limiting and dedupe to a shared store.
- [ ] Office **address**, **hours** and **email**.
- [ ] **Legal entity name**.
- [ ] Confirmed **biography**: Navy service, community involvement, education and bar admissions.
- [ ] **Practice-page copy**, **FAQ answers** and the **counties served**.
- [ ] The **privacy notice** (required).
- [ ] **DD header mark** decision (above).
- [ ] Optional genuine office photo.
- [ ] Final approval of the proposed headlines and helper copy, and confirmation of (615) 546-5551 and web use of the portrait.
- [ ] Hosting choice, removal of `noindex`, and a real-device check (iOS Safari and Android Chrome).

## Footer (shadcn/ui footer-section)

The footer is `components/ui/footer-section.tsx`, adapted from the supplied 21st.dev component. It uses the shadcn Button and Tooltip, mapped onto this site's tokens in `app/globals.css`. The Input, Label, Switch and Textarea primitives are also in `components/ui/`, but the footer doesn't use them yet.

Changes from the demo component, per the brand guidelines:
- **Newsletter sign-up:** replaced with the intake call to action. No marketing consent workflow exists.
- **Fake address and email:** replaced with the real phone number and marked placeholders.
- **Social links:** removed until the firm confirms real profiles.
- **Dark-mode switch:** removed, because each design has a single approved palette.
- **Glow:** the decorative glow blob was removed.
- **Links and targets:** "Terms" and "Cookie Settings" were removed because those pages don't exist. Links and icon buttons are enlarged to 44 px targets.

