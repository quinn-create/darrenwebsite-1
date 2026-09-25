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

## Update, 24 September 2026: practice areas and contact form

- **Home page practice areas:** First-Time Offenders, DUI/DWI and Domestic Assault (`featured` in `lib/site.ts`). The Practice Areas page lists all five; Criminal Defense and Expungement keep their pages. The two new pages carry placeholder wording.
- **Contact form:** `components/ui/form-1.tsx`, adapted from the prebuiltui "form-1" component and restyled with the Signal tokens. It asks for:
  - your name, and the client's name if different;
  - what it's about: Arrested in Rutherford County and/or Other;
  - how to reach you: Call, Text and/or Email, with phone and email required to match;
  - when to hear back: As soon as possible or Sometime this week;
  - an optional message.
  The rules live in `lib/contact-rules.ts` and are shared with `POST /api/contact/`. Delivery still uses `INTAKE_DESTINATION`. Rate limiting and de-duplication are in `lib/form-guard.ts`.
- **Placement: option B (chosen 24 September 2026).** This is now the site's only form. It is on `/intake/`, where every "Start your intake" button leads (the form's heading is the page heading), and on `/contact/` next to the office details. The old intake form (`components/IntakeForm.tsx`, `lib/intake-rules.ts`, `/api/intake/`) was removed. As a result, the county and the next court date are no longer collected up front; the office asks on the callback. The options are compared in `printouts/Contact-Form-Options.pdf`.
- **Needs confirmation:** the "As soon as possible" note ("We generally return calls within a day.") carries a `[CONFIRM WITH DARREN]` marker, so the placeholder guard blocks release until he approves it. There are now 37 placeholders in total.
- **Tests:** the e2e suite has 24 checks. The form tests (errors, demo mode, test delivery, double-click, network failure, keyboard-only, axe) now run against the new form on `/intake/`, plus one check that `/contact/` uses the same form.

## Update, 24 September 2026: Darren's answers applied

Darren's facts and decisions are recorded in `plans/for-darren/answers-2026-09-24.md`, and the site now uses them:
- the business name, address and hours (no public email);
- "Murfreesboro, Rutherford County & Smyrna" as the service area;
- the About page facts;
- the approved callback note.

The placeholder guard now reports 23 placeholders, down from 37. The remaining ones are the practice-page wording and FAQs, the privacy notice, the accessibility contact and date, and the licensed local photo. At Darren's request, the legal notice shows the office details instead of a "responsible attorney" line.

Inquiries go to Kelly Pittman: set `INTAKE_DESTINATION` to the email adapter when the firm's accounts exist. Backup recipient: Darren. Still open: Telegram or text delivery of the PDF, MyCase, and the live Google rating.

Later the same day, Darren approved the practice-page wording and all FAQs. The placeholder guard now reports 8 placeholders: the privacy notice (5), the accessibility contact and review date (2), and the licensed local photo (1).

## Update, 24 September 2026: real delivery, ready for accounts

- **Delivery** (`lib/intake-delivery.ts`, `lib/inquiry-pdf.ts`). With `INTAKE_DESTINATION=email`, each inquiry is sent through Postmark to `INTAKE_EMAIL_TO`, with a one-page PDF attached (built with pdf-lib).
  - The subject line never contains the visitor's name.
  - Reply-To is set to the visitor's email.
  - Once the email is delivered, the same PDF goes to Telegram if `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are set. A Telegram failure is logged and doesn't affect the visitor.
  - The form reports success only after Postmark accepts the email.
  - `local-test` also saves each PDF in `.data/`. All settings are listed in `.env.example`.
- **Tests:** `node tests/delivery.mjs` runs the real delivery code against stand-ins for Postmark and Telegram on :4010 (4 checks: both recipients plus the PDF, the Telegram copy, a Telegram failure, an email failure). It starts its own server on :3002 from the current build.
- **Placeholder guard:** it now also runs inside `npm run build` whenever `SITE_ENV=production`, so Vercel can't build production with placeholders. It also catches "draft" and "to approve" markers.
- **Privacy notice:** drafted from how the site actually works. It's marked for Darren's approval, and data retention is still to confirm.
- **Accessibility page:** complete. Contact is by phone or the form, and it was reviewed in September 2026.
- **3 placeholders left:** privacy approval (2) and the local photo (1).
- **Setup steps for Darren:** `plans/for-darren/go-live-setup.md` (Vercel, Postmark, Telegram, private previews).

## Update, 24 September 2026: tab navigation

- **Components:** `components/ui/tabs.tsx` and `components/ui/badge.tsx` were added as supplied, using the `radix-ui` package. `tabs.tsx` also exports `tabsListVariants` and `tabsTriggerVariants`.
- **Menu:** `components/NavTabs.tsx` draws the main menu with those tab styles on ordinary links marked with `aria-current`. It doesn't use ARIA tabs, which are only for switching panels within one page.
- **Desktop:** a pill tab bar in the header.
- **Phones:** a full-width four-tab row under the logo, with short labels (Home, Practice, About, Contact) that carry their full names for screen readers. It replaces the ☰ menu sheet, and it works without JavaScript. The header also has a "Call" pill.
- **Header:** `Header.tsx` is now a server component.
- **Scroll padding:** increased to 136px on phones, for the taller header.
- **Not applied:** the CSS snippet supplied with the component. Its `--color-destructive-foreground` line has a typo, and the site already maps that colour.
- **Tests:** the e2e suite has 25 checks. The ☰ menu test was replaced by phone and desktop tab checks.

## Update, 24 September 2026: practice-area carousel

- **Carousel:** the home page shows the three featured cards, then `components/PracticeCarousel.tsx`: "All practice areas", a sideways-scrolling row of every entry in `PRACTICES`. It currently has five cards, and adding an area to `lib/site.ts` adds a card.
- **How it works:** it's a CSS scroll-snap list, so it works by swipe, trackpad or keyboard without JavaScript. The Previous and Next buttons only scroll it; they're disabled at each end, and there's no autoplay. It follows reduced-motion settings.
- **Tests:** e2e has 26 checks, including a carousel check (all areas present, the arrows scroll it, it doesn't move on its own).

## Update, 24 September 2026: polish pass

- **Main button:** "Start your intake" became **"Contact us"** (`CTA_LABEL`, `CTA_HREF` in `lib/site.ts`), pointing to `/contact/`. The `/intake/` page was removed, and `/intake/` redirects to `/contact/` with a 308.
- **Contact page:** it now holds the form under a single heading ("Contact us"). `ContactForm` gained `showIntro={false}`.
- **Phone numbers:** `components/PhoneLink.tsx` gives them one treatment: tabular figures, semibold, a phone icon, and no underline or wrapping. It comes in two styles, a pill button and an inline link.
- **Type:** body weight 460, muted colour `#cad4e2`, antialiased rendering, balanced headings, and cyan eyebrows.
- **Buttons:** pill-shaped. `.btn-secondary` is new, and both lift on hover (not under reduced motion).
- **Header:** see-through with a blur. The desktop tabs leave out Contact because the button covers it.
- **Hero:** a short label above the headline, and a strip of confirmed credentials under the buttons.
- **Cards:** 16 px corners, a softer border and a cyan border on hover. `.panel` is the same look without the hover.
- **Tests:** e2e 26/26 and delivery 4/4. The form tests now run on `/contact/`.
- **Ideas:** the list of design ideas is in `plans/polish-ideas.md`.

## Update, 24 September 2026: "What happens next" timeline

- **Timeline:** `ContactSteps` in `components/Sections.tsx` is now a four-step timeline with icons and connector lines. It runs across the page on desktop and down it on phones, and it's used on the home page and every practice page.
- **Steps:** send a message → the office reviews it → you hear back → talk through next steps.
- **Wording:** the text lives in `STEPS` in `lib/site.ts`. Step 3 reuses Darren's approved callback line, and nothing promises the firm will take the matter.
- **Tests:** e2e 26/26.

## Update, 24 September 2026: "Ask about …" phone bar

- **Phone bar:** on practice pages, the bottom bar on phones (`components/StickyCta.tsx`) reads "Ask about <practice area>" and links to `/contact/?topic=<slug>`. A round call button sits beside it. Other pages still show "Contact us". Long names wrap to two lines on narrow phones (checked at 320, 360 and 390 px).
- **Topic check:** the Contact page reads `?topic=` on the server and accepts it only if it's a real practice area (`practiceBySlug` in `lib/site.ts`). The form then shows "Asking about: …" with a "Remove topic" button.
- **Topic delivery:** `/api/contact/` drops unknown topics. The topic title is saved with the inquiry and appears in the email subject (for example "New website inquiry (DUI/DWI)") and as a "Topic" row in the PDF.
- **New style:** `.btn-icon` (in `globals.css`) is a round 52 px icon button.
- **Tests:** e2e 27/27, including the bar label, the topic carried to the form, the topic saved on delivery, and unknown topics ignored. Delivery 4/4.

## Update, 25 September 2026: FAQ "Jump to" buttons (plans/faq-jump-links-plan.md)

- **Topics:** every FAQ has a `topic`, one of `FAQ_TOPICS` in `lib/site.ts` (Getting started, Your case, Working with the office). The `FaqItem` type makes it required. No question or answer wording changed.
- **Grouping:** `Faq` in `components/Sections.tsx` groups the list by topic and shows "Jump to" buttons (`components/FaqJumpLinks.tsx`), but only when a page has at least `FAQ_JUMP_MIN` (4) FAQs across 2 or more topics.
  - Today that's the home page only.
  - Practice pages (2 FAQs each) render exactly as before, and gain buttons automatically when they reach 4.
- **Behaviour:** the buttons are plain `#faq-faq-<topic>` links that scroll to the group without JavaScript. With JavaScript they also open the group's first question and focus it. Smooth scrolling only happens when the visitor hasn't asked for reduced motion.
- **Styles:** `.chip-link` (44 px minimum, cyan hover) and `.faq-group` in `globals.css`.
- **Tests:** e2e 36/36. The 9 new "FAQ jump" checks include one that compares every question and answer with `lib/site.ts`. Delivery 4/4. The placeholder count is unchanged at 3.

## Update, 25 September 2026: link-preview share cards (plans/link-previews-plan.md)

- **Cards:** `lib/share-card.tsx` draws a 1200 × 630 card with `next/og`. It shows the approved 4:5 portrait, the name, "Attorney at Law · Murfreesboro, TN" and `PHONE_DISPLAY`, all read from `lib/site.ts`. It uses static Manrope `.woff` files from the new `@fontsource/manrope` package, because the card renderer can't read woff2.
- **Where they come from:**
  - `app/opengraph-image.tsx` and `app/twitter-image.tsx` supply the default card, used by the home page and every page without its own.
  - `app/practice-areas/[slug]/opengraph-image.tsx` and `twitter-image.tsx` add the practice title, with per-page alt text via `generateImageMetadata`. Their address is `…/opengraph-image/card`.
- **File size:** the renderer's PNG was about 550 KB. The cards are re-saved in full colour (palette off) at maximum compression with `sharp`, which Next.js already includes, bringing them to about 390 KB each. If `sharp` is ever missing, the original PNG is served instead.
- **Tags:** `OPEN_GRAPH_BASE`, `SHARE_TITLE`, `SHARE_ALT` and `SITE_DESCRIPTION` in `lib/site.ts` supply the tags.
  - The layout sets the defaults, plus `twitter.card` = `summary_large_image`.
  - The home page adds `og:url`.
  - Practice pages set "<Title> · Darren Drake" and their own `og:url`. A page-level `openGraph` replaces the layout's, which is why pages spread in `OPEN_GRAPH_BASE`.
- **Samples:** `printouts/share-cards/` holds all six cards, plus `preview-sheet.png` at phone-preview size.
- **Tests:** e2e 42/42. The 6 new "Share card" checks cover size, file size, uniqueness, tags, fallback and live data. Delivery 4/4. The placeholder count is unchanged at 3.
- **Launch day:** the Facebook, LinkedIn, X and iMessage checks need the public address. They're listed under launch day in `plans/for-darren/go-live-setup.md`.

## Update, 25 September 2026: gentle scroll reveals (plans/scroll-reveals-plan.md)

- **What moves:** marked blocks (`data-reveal`, or `<Container reveal>`) rise 12 px into place once, over 420 ms, as they scroll into view.
  - **Home:** the practice heading, the 3 featured cards (staggered 0/60/120 ms), the carousel, Meet Darren, the timeline, the FAQ and the closing band.
  - **Practice pages:** the overview, the timeline and the FAQ.
  - **Practice Areas:** the card grid, first 3 staggered.
  - **About:** the text column.
  - **Never marked:** the hero, header, page titles, the Contact page, legal pages and forms.
- **How:**
  - `components/ScrollReveal.tsx`, mounted once in `app/layout.tsx`, uses a single IntersectionObserver.
  - It runs only at 768 px and wider, with motion allowed and JavaScript on; otherwise nothing is offset.
  - Blocks already on screen are revealed instantly on load, so nothing animates at page load.
  - The CSS uses the separate `translate` property, so it composes with the cards' hover `transform` without overriding it. It never touches opacity.
- **Off switch:** set `SCROLL_REVEALS = false` in `lib/site.ts`.
- **Brand note:** the Signal spec allows one entrance animation (the hero). These reveals are an extension Quinn requested on 25 Sep 2026, using the spec's own timing. Turn them off with the switch if Darren prefers the strict rule.
- **Cost:** 375 bytes of gzipped JavaScript, and no layout shift (measured CLS 0).
- **Tests:** e2e 52/52. The 10 new "Reveal" checks cover reduced motion, no JavaScript, phones, settling, once-only, no animation on load, opacity always 1, stagger, CLS 0, the off switch and axe. Both hero-motion tests are unchanged and passing. Delivery 4/4. The placeholder count is unchanged at 3.
- **Recording:** `printouts/site-preview/scroll-reveals-1440.webm`, plus `scroll-reveals-frame-{1,2,3}.png`. The stills slowed the transition to 1.4 s only to catch a mid-rise frame.

## Update, 25 September 2026: SEO fixes (plans/seo-fixes-plan.md)
- **Canonicals:** every page sets `alternates.canonical` (its path, with a trailing `/`). `metadataBase` turns it into `https://ddrakelaw.com/...`. Query text such as `?utm_source=` never reaches the canonical. A new page needs its own `alternates.canonical`.
- **Business data:** `lib/structured-data.ts` builds one JSON-LD graph, rendered on every page from `app/layout.tsx`:
  - the firm (`LegalService` + `LocalBusiness`): name, address, phone, Mon–Fri 8–5, area served, portrait, the five practice titles;
  - Darren (`Person`): job title, both SIU schools, both memberships;
  - the website.

  Every value comes from `lib/site.ts`. `FIRM` now holds the address parts (`street`, `city`, `region`, `postalCode`), and `FIRM.address` is built from them, so the visible address and the data can't drift. Confirmed facts only: no ratings, reviews, prices, social links, coordinates, founding date, awards or FAQ data. Add `sameAs` or a rating only once Darren confirms them.
- **Breadcrumbs:** every crumb now carries its `href`, and the last is the current page (shown as plain text). `Breadcrumbs` in `components/Sections.tsx` also renders the matching `BreadcrumbList` data, so the two always agree. There's none on the home page.
- **Search listings:**
  - home title "Darren Drake, Attorney at Law | Murfreesboro, TN" (48 characters);
  - `SITE_DESCRIPTION` shortened to 156 characters (it's shared with link previews).
- **Sitemap dates:** `app/sitemap.ts` reads each page's last git commit date at build time. If the build has no git history it falls back to the build date, which is harmless.
- **Still hidden:** preview builds keep `noindex` and `Disallow: /`. A test-only production build (`SITE_ENV=production npx next build`, never deployed) showed `index, follow`, `Allow: /`, `Disallow: /api/` and the sitemap line, and identical canonicals and JSON-LD. The normal build was restored afterwards.
- **Tests:** e2e 62/62, including the 10 new "SEO" checks: canonicals; firm values; data matching the Contact page; no unconfirmed fields; Darren's node; breadcrumbs; title and description lengths; sitemap; still hidden; script-safety, type allow-list and `@id` references. Delivery 4/4. The placeholder count is unchanged at 3.
- **Report:** `printouts/seo-report.md`. The launch-day search tasks are in `plans/for-darren/go-live-setup.md`.

## Update, 25 September 2026: light theme option (plans/light-theme-plan.md)
- **What visitors see:** a round sun button in the header (moon when light is on), between the phone number and "Contact us" on desktop, and beside "Call" on phones. It switches the whole site to light colours. The choice is saved in the browser and applied before the page is drawn, so there's no flash. The site always **opens dark** unless the visitor has chosen light, even on devices set to light mode.
- **How:**
  - the light palette is in `app/globals.css` under `html[data-theme="light"]`, using the same token names, so every component follows;
  - `lib/theme.ts` holds the tiny `<head>` script (about 270 bytes) and the phone toolbar colours;
  - `components/ThemeToggle.tsx` is the button.
- **Light palette** (measured contrast on the page background):

  | Token | Light value | Contrast |
  |---|---|---|
  | bg / surface | `#f5f7fb` / `#ffffff` | |
  | text | `#0b1424` | 17.2:1 |
  | muted | `#3d4a5e` | 8.4:1 |
  | action | `#0e7490` | 5.0:1 (white on action: 5.4:1) |
  | border | `#7a889d` | 3.4:1 |
  | error | `#b42318` | 6.1:1 |
  | success | `#166534` | 6.7:1 |
- **Adding a colour:** always make it a token with a dark value in `:root` and a light value under `html[data-theme="light"]`, never a fixed hex or rgb in a component. The fixed rgb values that used to be in `globals.css` are now tokens (`--card-border`, `--card-sheen`, `--card-hover-border`, `--card-shadow`, `--tint-action`, `--line-soft`, `--line-strong`, `--glow-violet`, `--glow-cyan`, `--hover-filter`) with exactly their old values in dark.
- **Switches** (in `lib/site.ts`):
  - `LIGHT_THEME = false` removes the button and the script, and the site is dark only;
  - `THEME_DEFAULT = "system"` would start visitors who haven't chosen on their device's setting. It's left on `"dark"` so the Signal design comes first.
- **Brand note:** the Signal spec is a dark design. The light theme is an opt-in extension Quinn requested on 25 Sep 2026 for visitors who find dark pages hard to read. Turn it off with the switch if Darren prefers dark only.
- **Not themed:** the link-preview cards (byte-identical to before), the tab icon, and the inquiry PDF and email.
- **Theme-color tag:** with the light theme on, the `<meta name="theme-color">` tag is rendered in `app/layout.tsx`'s `<head>`, not through Next's `viewport.themeColor`, because Next re-renders that tag after hydration and would undo the switch.
- **Checks:**
  - e2e 74/74, including 12 new "Theme" checks:
    - dark by default;
    - switching and remembering;
    - no flash;
    - axe in both themes on all 12 pages, phones, form errors and form success;
    - measured contrast;
    - keyboard and focus;
    - storage blocked;
    - no JavaScript;
    - no layout shift and a one-row header at 320 px;
    - theme-color;
    - the dark palette unchanged;
    - the switches.
  - Delivery 4/4. Placeholders unchanged at 3. JavaScript +879 bytes gzipped (668 in bundles plus the 211-byte head script).
  - A one-off pixel comparison showed the dark pages identical to before everywhere outside the header's button area.
- **Found in passing (not caused by the theme):** a first-ever visit had a small layout shift when the Manrope web font replaced the fallback. **Fixed 25 Sep 2026** by the speed plan (preloaded font plus a size-matched fallback); first-visit CLS is now 0.
- **Screenshots:** `printouts/site-preview/light-{home,dui-dwi,contact-errors}-{1440,390}.png` and the side-by-side `light-vs-dark.png`. The clickable preview has Light/Dark buttons in its toolbar, and the site's own header button works there too.

## Update, 25 September 2026: speed check and fixes (plans/speed-check-plan.md)
- **Run it:** `npm run build`, stop other servers, then `npm run speed`.
  - It starts its own server on :3006 and loads 5 pages (home, Practice Areas, DUI/DWI, About, Contact) 5 times each, in fresh contexts.
  - It runs a phone profile (4× slower CPU, slow 4G, 412 px) and a desktop profile.
  - It writes `printouts/speed-report.md` and `.json`, and fails if a budget breaks.
  - `--out=before` saves a baseline instead. The run before these fixes is kept in `printouts/speed-report-before.md`.
- **Budgets (phone median):**
  - LCP ≤ 1.8 s; first-visit CLS ≤ 0.01;
  - TBT ≤ 250 ms, and ≤ 152 ms on the home page (see below);
  - each tap response ≤ 200 ms;
  - JavaScript ≤ 175 KB, total ≤ 300 KB, one font file ≤ 30 KB.
  - Desktop: LCP ≤ 1.0 s, CLS ≤ 0.01, TBT ≤ 50 ms.
  - Caching checks too.
- **Font:**
  - Manrope loads through `next/font/local` from `app/fonts/manrope-latin-wght.woff2` (Latin subset, same file and unicode-range as before; licence in `app/fonts/OFL.txt`);
  - it's preloaded, with a size-matched Arial stand-in, so text no longer re-wraps when the font arrives;
  - `@fontsource-variable/manrope` is no longer imported by the site (the share cards use `@fontsource/manrope`).
  - Any character outside the Latin range must be added to `OUTSIDE_FONT` in the e2e test, with a reason. Today that's only "→".
- **Rule for browser code:** client components (`"use client"`) import shared values from `lib/site-basics.ts`, never `lib/site.ts`. Otherwise all the practice and FAQ wording gets bundled into every page's JavaScript. `lib/site.ts` re-exports `site-basics`, so server code is unchanged.
  - The carousel list renders on the server; only `CarouselArrows` runs in the browser.
  - The phone bar gets `{ slug, title }` pairs from the layout.
- **Menu classes:** `components/nav-tab-classes.ts` works out the tab classes on the server, and `NavTabs` receives them as strings. That keeps Radix Tabs, class-variance-authority and tailwind-merge (about 20 KB gzipped) off every page. The tab styles live in `components/ui/tabs-variants.ts`.
- **Contact caching:** `/contact/` is rendered per request. Next marks it `no-store`, which blocks the browser's instant back/forward cache, so `next.config.ts` sets `private, no-cache, max-age=0, must-revalidate` instead. Nothing on the page is personal. Re-check the header on Vercel after deploying, because the host may handle it differently.
- **Results (phone median, before → after):**

  | Page | CLS | TBT | JavaScript |
  |---|---|---|---|
  | Home | 0.008 → 0 | 172 → about 138 ms | 181 → 159 KB |
  | DUI/DWI | 0.048 → 0 | 133 → about 140 ms | 181 → 159 KB |
  | About | 0.080 → 0 | 136 → about 135 ms | 181 → 159 KB |
  | Contact | 0.098 → 0 | 148 → about 145 ms | 187 → 173 KB |

  LCP stays around 0.6–0.8 s. All screenshots are pixel-identical in both themes.
- **Not reached:** the plan asked for home TBT at least 25% below the baseline (≤ 129 ms). Three runs after the fixes gave 131, 138 and 150 ms, about −20%. What remains is one ~180 ms task about 1.4 s in, present on every page including the simplest. That's React/Next starting up, not this site's code. Per the plan's rule, the home budget is set to the middle run + 10% (152 ms). All pages are under Lighthouse's 200 ms "good" line.
- **Tests:** e2e 81/81, including 7 new "Speed" checks:
  - one preloaded font and one font request;
  - the size-matched fallback;
  - character coverage;
  - first-visit CLS ≤ 0.01 on throttled phones;
  - no practice or FAQ wording in client JS;
  - the carousel;
  - the phone bar.

  Delivery 4/4; placeholders unchanged at 3.
