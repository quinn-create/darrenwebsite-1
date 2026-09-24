# Signal build: handoff

The build follows `prompts/signal-website-build-prompt.md` and the reference concept `brand-concepts/01-signal.png` (Higgsfield job `f3f33b0f-cd9c-49c3-98f5-bafb3626dacc`). It's a local preview only: nothing is deployed or published, and ddrakelaw.com is unchanged.

## What was built

- **Pages:**
  - Home, Practice Areas, and one page each for Criminal Defense, DUI/DWI and Expungement (all from one template).
  - About Darren, Contact, Intake, Privacy (placeholder) and 404.
- **Homepage sequence:**
  1. Hero: a 7/5 split with Darren's real portrait and a static violet-to-cyan glow.
  2. Three practice cards.
  3. Attorney introduction.
  4. The three contact steps, always visible.
  5. FAQ.
  6. Intake band.
  7. Footer.
- **Mobile:**
  - A 64 px header with a phone link and a menu sheet (focus trap, Esc closes it, focus returns to the button).
  - The headline and CTA come before the portrait, which is capped at 320 px.
  - An opaque bottom intake bar that stays hidden on `/intake`, while the hero CTA is visible, and while any form field has focus.
- **Intake:**
  - A single-page form covering every required and optional field from the specification.
  - Validation shared by the client and the server, an error summary that takes focus, inline errors, "Sending…" with double-submit protection, and a success message only after the server accepts the inquiry.
  - Retry with values kept, a demo banner, a honeypot, rate limiting and dedupe.
  - Analytics events are stubbed and carry no personal data.

## Verification (all run on this build)

| Check | Result |
|---|---|
| `npm run lint` | pass (0 warnings) |
| `npm run typecheck` | pass |
| `npm run build` | pass (11 routes; intake page and API dynamic, everything else static) |
| `./tests/run-e2e.sh` | **17/17 passed** (list below) |
| axe-core, WCAG 2.0/2.1/2.2 A+AA, all 8 pages + intake with errors shown | **0 violations** |
| Lab performance, home, 390 px, 4× CPU and ~1.6 Mbps throttling (`tests/perf.mjs`) | LCP ≈ 0.8 s, CLS 0.022, **218 KB total transfer**, 145 KB JS, 25 KB image, 25 KB font, 17 requests |

The lab numbers are a launch proxy, not field (real-user) data.

End-to-end checks:
- required-field errors and focus;
- the error-summary link moves focus to the field;
- only the chosen contact method is required;
- invalid email and phone are rejected;
- demo mode never claims success and keeps values;
- configured mode shows "Sending…" and a success message only after acceptance;
- a double click sends once;
- a network failure keeps values and retry succeeds;
- keyboard-only completion;
- the mobile menu traps focus and closes with Esc;
- on mobile the CTA sits before the portrait and the sticky bar logic works;
- no horizontal scroll at 320 px;
- no horizontal scroll at 200% zoom;
- reduced motion removes all animation;
- the entrance runs once at 420 ms;
- the skip link is first;
- the axe scans pass.

## Contrast (tokens as used in the build)

| Pair | Ratio |
|---|---|
| text `#F4F7FC` / bg `#090F1C` | 17.83:1 |
| text / surface `#131F31` | 15.42:1 |
| muted `#BCC7D8` / bg | 11.21:1 |
| muted / surface | 9.70:1 |
| on-action `#07111F` / action `#67E8F9` | 13.06:1 |
| action / bg (links, focus ring) | 13.21:1 |
| border `#718199` / bg (field borders, non-text) | 4.83:1 |
| error `#FF9A9A` / surface | 8.16:1 |
| success `#86EFAC` / surface | 11.79:1 |

## Screenshots (`site/screenshots/`)

- `home|practice|about|contact|intake-{390,768,1440}.png` (full page) and `-fold.png` (first screen)
- `menu-390.png`
- `intake-{error,not-configured,submitting,success,retry}-{390,1440}.png`
- `compare-concept-vs-build.png`: the concept and the 1440 px build side by side

## Intentional differences from the concept and prompt

1. **Criminal Defense icon:** the shield became a briefcase (Lucide `Briefcase`), because Signal forbids shield- and badge-like marks.
2. **Card copy:** cards use neutral one-line descriptions marked `[CONFIRM WITH FIRM]` instead of marketing taglines.
3. **FAQ component:** built with native `<details>`/`<summary>` instead of the shadcn Accordion. It's keyboard- and screen-reader-accessible, works without JavaScript and adds no dependencies. Form fields are also hand-built rather than shadcn, with the same label, hint and error behavior. shadcn/ui is set up (`components.json`, `lib/utils.ts`, `components/ui/`) and currently used for the footer only.
4. **Font:** Manrope is self-hosted with `@fontsource-variable/manrope` (one 25 KB variable woff2 covering weights 400–800) instead of `next/font`. The effect is the same, it needs no build-time Google fetch, and only one font file loads.
5. **Border beam:** the optional single-pass border beam was not added. The glow fades in once (900 ms) on desktop and is static on mobile and under reduced motion.
6. **Sticky mobile CTA:** it also hides while the hero's own CTA is on screen, so there are never two identical buttons side by side.
7. **Entrance animation:** it starts text at 0.01 opacity. During those 420 ms, contrast is briefly below target; it reaches full contrast once the animation ends (axe measures after it). Reduced motion shows the text instantly.
8. **Back navigation:** leaving `/intake` mid-form and returning clears the answers. The form deliberately doesn't write personal details to browser storage. Values *are* kept through validation errors, network failures and "not configured" replies.
9. **`noindex`:** the preview sets `robots: noindex, nofollow`. Remove it at launch.

## Still needed before launch

- [ ] **Intake delivery destination** (email service, CRM or webhook), plus a verified test delivery. Move rate limiting and dedupe to a shared store.
- [ ] Office **address**, **hours** and **email**.
- [ ] **Legal entity name** for the footer.
- [ ] Confirmed **biography**: Navy service details, community involvement, education and bar admissions.
- [ ] **Practice-page copy** and **FAQ answers** (everything marked `[FIRM TO SUPPLY]` / `[FIRM TO REVIEW]`), and the **counties served**.
- [ ] The **privacy notice** (required).
- [ ] Optional licensed **local architecture photo** for the "Meet Darren" section (a placeholder is shown).
- [ ] Final approval of the proposed headlines and helper copy, and confirmation that (615) 546-5551 is final and the portrait is approved for web use.
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


## Update, 24 September 2026: first work round from the plan

This round follows `plans/signal-website-plan.md` ("What Claude does first").

**Photo**
- The Home and About pages use the new Signal portrait (pending Darren's written approval). The crops come from `site/scripts/make-photo-crops.py`, which only cuts from the genuine middle strip of the photo.
- The glow is softened so it continues the photo's own light.
- The downloadable full-size original was removed from `public/`. The master stays in `assets/photos/`.

**Home page design**
- The first desktop screen now matches concept 1A: the "How Darren can help" heading is visible at 1440×900. The name block in the header is larger.
- The headline entrance no longer hides text. It only moves 12 px, as the guidelines require.
- Every cyan button is now at least 52 px tall, including the header button and "Try again".
- The phone's bottom bar no longer flashes on slow phones, and it stays clear of whatever a keyboard user has focused.

**Footer and new pages**
- The footer is now a server component: the tooltips (about 31 KB of JavaScript) are gone, and it shows the DARREN / DRAKE name block. The year is set on the server. It links to Privacy, Accessibility and Legal notice.
- New pages: `/accessibility/` and `/legal-notice/`, both drafts for the firm to approve. There's also an error page that keeps the phone number reachable.

**Addresses and search engines**
- Every address now ends in `/`, in the old site's style.
- `next.config.ts` redirects every old address in Appendix B in one step. `proxy.ts` returns 410 ("gone") for WordPress and junk addresses.
- Addresses typed without the ending `/` take two steps. The old site behaved the same way.
- `sitemap.xml` and `robots.txt` are added. Search engines can index the site only when `SITE_ENV=production`; previews stay hidden.

**Safety checks**
- All firm facts are now in `lib/site.ts` (`FIRM`).
- `npm run build:production` refuses to build while any placeholder remains. `npm run check:placeholders` lists them; there are 32 today, all waiting on Darren.
- Basic security headers are on (nosniff, Referrer-Policy, frame DENY, Permissions-Policy, HSTS). The full CSP is still to come (plan, Phase 4–5).

**Tests:** 21/21 pass. The new checks cover:
- the redirect map and "gone" addresses;
- the sitemap and search-engine settings;
- 52 px buttons;
- an axe scan at 390 and 768 px, including the open menu.

Lab speed test: LCP about 0.78 s, 228 KB total.

**Still open:** everything that needs Darren's answers (see `plans/for-darren/`), the license check of the 21st.dev footer component, practice-page "Your attorney" cards, structured data, the link-preview image and the intake connection.
