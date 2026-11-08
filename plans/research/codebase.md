# Signal site audit: what it takes to go from demo to production

I didn't modify anything in the repo. I ran every check on a copy of `site/` in my scratchpad folder. The only thing I fetched from the live site was `robots.txt` and its sitemaps, all read-only. While I was auditing, someone else committed the new photo as `4150c10` ("pending Darren's approval of the edited version").

**Effort key:** S = half a day or less · M = 1–3 days · L = more than 3 days, or waiting on the firm or a vendor. **B** = blocks launch.

## 1. Current state

| Area | State (checked today) |
|---|---|
| Stack | Next.js 16.3.6 (App Router, Turbopack), React 19.3, TypeScript 6.0.3, Tailwind 4.3.3, Zod 4, Lucide, Manrope through `@fontsource-variable` (one 25 KB woff2), shadcn/Radix Button and Tooltip. `npm audit` finds 0 vulnerabilities. The only outdated packages are the ESLint 10 and TypeScript 7 major versions. |
| Pages (11 routes) | `/`, `/practice-areas`, three practice pages built from one template (`criminal-defense`, `dui-dwi`, `expungement`), `/about`, `/contact`, `/intake` (rendered on every request), `/privacy` (placeholder), 404, `icon.svg`, and `POST /api/intake`. Every unconfirmed fact shows a visible `[CONFIRM…]` or `[FIRM TO…]` marker. |
| Components | `Header` (client-side; mobile menu with focus trap), `StickyCta` (client-side), `Footer` wrapping the shadcn `footer-section` (client-side), `Portrait` (next/image, still the original JPEG), `Sections` (practice cards, contact steps, FAQ using native `<details>`, intake band, breadcrumbs, page intro), `IntakeForm`, `Wordmark`, `PracticeIcon`, `Container`. `ui/input`, `ui/label`, `ui/switch` and `ui/textarea` are never used. |
| Intake flow | The browser and server share one set of validation rules (`lib/intake-rules.ts`), plus a Zod shape check, a honeypot field, an in-memory rate limit (5 per IP per 10 minutes) and in-memory duplicate blocking (2 minutes). `INTAKE_DESTINATION` picks the mode: unset is the demo banner and a "not configured" reply; `local-test` writes to a JSONL file; an `https://` value posts to a webhook. Success is shown only after an "accepted" reply. |
| Tests | `tests/e2e.mjs` runs 17 checks and all 17 passed again today. The axe accessibility scan finds 0 WCAG 2.2 AA violations, but it only runs at 1440 px. There's also a lab performance script and screenshot scripts. There is no CI, and `npm test` is broken (see section 4). |
| Performance (lab, today) | LCP 788 ms, CLS 0.022, 249 KB total, **174 KB JS**, 25 KB image, 25 KB font, 18 requests. HANDOFF.md still says 218 KB total and 145 KB JS. Those numbers were measured before the shadcn footer was added. |
| SEO and security | Each page has its own title and description. The whole site is hard-coded `noindex`. There's no sitemap, robots file, canonical tag, `metadataBase`, social-share (OG) image or structured data (JSON-LD). `poweredByHeader: false` is the only security setting, and there's no CSP. |
| Live site | WordPress with Yoast SEO, running on CyberPanel/OpenLiteSpeed behind Cloudflare. Its page URLs are `/`, `/areas-of-practice/`, `/areas-of-practice/criminaldefense/`, `/areas-of-practice/dui/`, `/areas-of-practice/expungement/`, **`/areas-of-practice/juvenile-defense/`**, **`/testimonials/`**, **`/submit-a-testimonial/`**, `/contact/`, plus 17 image attachment pages. |

## 2. What's missing before production

**Pages and content**

| Gap | Now | Needed | Effort |
|---|---|---|---|
| Firm facts **B** | Placeholders in `contact/page.tsx:37-45` and `footer-section.tsx:69-70,107` | Address, hours, email, legal entity name and counties. Move them all into `lib/site.ts`; the address and email are currently typed into two separate components. | S dev, L waiting on firm |
| Biography **B** | `[CONFIRM]` text on `/about` and the homepage "Meet Darren" section | Approved bio, verified Navy and community details, education and bar admissions | S dev, L firm |
| Practice copy and FAQ answers **B** | All `[FIRM TO SUPPLY]` | Copy written or reviewed by Darren. Nothing invented about Tennessee law. | M |
| **Juvenile Defense** **B** (decision) | On the live site, missing from the new one | The firm decides: add a fourth practice page (one entry in `PRACTICES` and `MATTER_TYPES`, plus an icon) or redirect the old URL | S |
| Testimonials pages | On the live site, missing from the new one | This is an ethics and firm decision; the build rules forbid adding reviews. Until then, redirect both URLs to `/`. | S |
| Privacy notice **B** | Placeholder | Notice covering intake data, where it goes, how long it's kept, and analytics | M (firm) |
| "Meet Darren" image | Dashed placeholder at `page.tsx:76-86` | A licensed local photo, or a card listing only confirmed facts | S |
| Copy approval and advertising rules | Proposed | Darren signs off the headlines and helper text, and checks them against Tennessee's lawyer-advertising rules (RPC 7.x) | S |

**Components**

| Gap | Now | Needed | Effort |
|---|---|---|---|
| New photo | `Portrait.tsx` imports the original JPEG | The crops in section 3 | S |
| Footer | The whole footer runs in the browser, the wordmark is gone, the tooltip icon buttons repeat links already in the footer, and the footer CTA sits directly under the intake band's CTA | Make it a server component, restore the wordmark (required by the build prompt, section 7.1 item 8), remove the tooltips and remove the duplicate CTA | S |
| Unused shadcn parts | Input and textarea use 14 px text (the rule is 16 px); the label and switch packages are dead weight | Delete them, or restyle them to the site's tokens | S |
| Font loading | fontsource CSS import | `next/font/local` with the same woff2, which adds preloading and fallback sizing (the build prompt asked for `next/font`) | S |
| Optional additions | – | Small avatar on `/intake`, a confirmed-facts card, a fourth practice icon if Juvenile Defense is kept | S |

**Intake and backend**

| Gap | Now | Needed | Effort |
|---|---|---|---|
| Where inquiries go **B** | Not configured | The firm picks an email service (Postmark, Resend, SES) or a CRM (Clio Grow, Lawmatics). Show success only after that service replies 2xx or the record is saved. Keep sensitive details out of notification emails. Set a retention policy. | M, plus firm decision |
| Shared rate limit and duplicate check | In memory, per server instance | Upstash Redis or Cloudflare KV. Use the IP the hosting platform supplies. | M |
| Request hardening | Accepts any content type and any origin, with no size cap | Require JSON, check that the Origin header is our own site, cap bodies at about 16 KB | S |
| Duplicate protection when sending | No idempotency key | Send `inquiry.id` as an `Idempotency-Key` header | S |
| `local-test` mode | Allowed in production | Refuse it in production | S |
| Failure alerting | Only `console.error` | Alert when deliveries fail, with no personal details in logs | S–M |
| Verified test delivery **B** | Local test only | A staging test with test data, which the guidelines' release checks require | S |
| Answers lost on back navigation | Cleared | Optional: keep a draft in memory only, never in browser storage | S |

**SEO and metadata**, all S unless marked:
- `metadataBase`, plus a canonical URL on every page (**B**).
- `app/sitemap.ts`, and an `app/robots.ts` that depends on the environment. Replace the hard-coded `noindex` at `layout.tsx:15` with a `SITE_ENV` switch (**B**).
- A social-share image with an alt-text file, plus `openGraph` and `twitter` metadata.
- JSON-LD structured data: `LegalService` and `Person` (confirmed facts only: name, phone, area served; the address once confirmed; no ratings), plus `BreadcrumbList` on practice pages.
- **Permanent (301) redirects (B):**
  - `/areas-of-practice/` → `/practice-areas`
  - `/areas-of-practice/criminaldefense/` → `/practice-areas/criminal-defense`
  - `/areas-of-practice/dui/` → `/practice-areas/dui-dwi`
  - `/areas-of-practice/expungement/` → `/practice-areas/expungement`
  - Juvenile Defense and the two testimonials URLs depend on the firm's decisions.
  - Attachment pages and feeds go to `/` or return 410.
- `apple-icon.png` and a `favicon.ico` fallback. Convert the "DD" text in `icon.svg` to outlines.
- After launch (M, can be done by non-developers): verify Google Search Console, submit the sitemap, and update Google Business Profile and the directory listings with the **new** phone number so the firm's name, address and phone match everywhere.

**Analytics:**
- `lib/analytics.ts` is a stub. Connect a cookieless provider (Plausible, Fathom or Vercel Web Analytics) with only the four approved event names and no session replay (S).
- Add real-user Web Vitals measurement (S).
- An optional `phone_click` event, with the firm's approval (S).
- Track conversion as submit successes ÷ intake starts, plus error rate and mobile abandonment.
- Mention analytics in the privacy notice and allow it in the CSP.

**Security headers and CSP:**
- Add `headers()` in `next.config.ts` (S): HSTS (without `preload` at first), `nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `frame-ancestors 'none'`, COOP.
- CSP (M): the Next 16 docs (`node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md`) say per-request nonces require **every** page to render on demand. Start with a policy of `'self'` plus `'unsafe-inline'` for scripts, strict everywhere else, in report-only mode first. Then evaluate the experimental SRI option, which keeps pages static.
- Turn on Dependabot or Renovate (S).

**Error pages (all S):**
- `app/error.tsx` (a retry button plus the phone link) is missing.
- `app/global-error.tsx` (needs its own `<html>` and inline styles) is missing.
- The 404 page needs a proper title and `noindex`.

**Performance (all S unless marked):**
- Remove the Radix Tooltip. Its chunk is about 31 KB gzipped and loads on every page, and it's why JS grew from 145 to 174 KB against a 200 KB budget.
- Switch to `next/font/local` to reduce layout shift.
- Use pre-cropped photos and trim the image sizes Next generates (it currently offers widths up to 3840 for a 900 px source).
- Update the numbers in HANDOFF.md.
- Add performance budgets to CI with Lighthouse CI (M).

**Accessibility:**
- Add `scroll-padding-bottom` for the mobile sticky bar (S). Without it, a keyboard user's focused link can land fully under the 84 px bar, which fails WCAG 2.2 criterion 2.4.11.
- Run axe at 390 px as well, with the menu open, on all three practice pages and in the success and failure states (S).
- Test by hand with VoiceOver, NVDA and TalkBack on real iOS and Android phones (M).

**Testing and CI:**
- Fix `npm test` (S).
- Declare `axe-core` as a direct dependency (S).
- Move to `@playwright/test` with `playwright install` instead of the hard-coded browser path (M).
- Add a GitHub Actions workflow (M) that runs:
  - lint, typecheck and build;
  - the end-to-end tests and axe;
  - Lighthouse CI;
  - a **placeholder guard** that fails a production build if `[CONFIRM`, `[FIRM TO`, `to confirm]` or `[TO BE SUPPLIED` is still present;
  - redirect tests and a link check.

**Deployment:**
- Choose a host, set the project root to `site/`, and pin Node 22 with `engines` and `.nvmrc` (S).
- Set the environment variables (S): `SITE_URL`, `SITE_ENV`, `INTAKE_DESTINATION`, the secrets, the rate-limit store and the analytics domain.
- Password-protect preview deployments and keep them `noindex` (S).
- Write a DNS cutover runbook for Cloudflare (M): lower the DNS time-to-live first, don't touch the email records (MX, SPF, DKIM, DMARC), follow the host's advice on Cloudflare proxying, keep a full WordPress backup and the old server for at least 30 days as a rollback, and watch for 404s afterwards.
- Keep `site-precision/` out of deployment.

## 3. Plan for the new photo

**What the file is (measured):**
- `darren-drake-portrait-signal.webp`: 2000×1125, sRGB, 165 KB, no EXIF.
- The original photo sits inside it at offset x+497, y−2 (face-region correlation 0.93). So the **real photograph is the column x≈497–1497**.
- Outside that column everything is edited:
  - The background was replaced everywhere, including inside the column.
  - About 130 px of left sleeve and shoulder were synthesized (x≈370–497, lower part of the image).
  - About 30 px were added on the right edge at the bottom.
- The backdrop runs from violet (about `#4F47BE`) on the left to blue (about `#155397`) on the right. The corners are about `#040A1F`; the page background is `#090F1C`.

**Rule: every crop stays inside x 497–1497.** The one exception is the social-share image.

| Use | Crop box (source pixels) | Output | How it's displayed |
|---|---|---|---|
| Hero, desktop | (548,0)–(1448,1125), 4:5, 900×1125 | Source file for next/image, served as AVIF and WebP | 440×550 CSS px. The eyes land about 33% from the top, in the upper third as specified. 2× screens need 880 px, so there's no upscaling. |
| Hero, phones | Same file | – | 256×320 (the 320 px cap), `sizes="(min-width:1024px) 440px, 256px"`. 3× screens need 768 px, which is fine. **No separate `<picture>` art direction is needed.** |
| About page | Same 4:5 file | – | Up to 440 px wide on desktop. On phones, cap it at about 300 px wide so 3× screens don't upscale. Lazy-load it. |
| Social share | (0,0)–(2000,1050) scaled to 1200×630 | JPEG at about q82, under about 300 KB, as `app/opengraph-image.jpg` and `twitter-image.jpg` with an `.alt.txt` file | His face stays centered, so it survives the square crops some apps apply. This crop uses the edited background and sleeve, so it needs Darren's approval. A branded version (wordmark on the left, the 4:5 crop at 504×630 on the right) would lose his face in square previews. |
| Small avatar | (600,0)–(1400,800), 1:1 | Export at 192 and 96 px | 48–96 px circle, for example on `/intake` and Google Business Profile |

**How to build it:**
- Make the crops once with a checked-in script, `scripts/make-portrait-crops.mjs`, using `sharp` (already installed with Next). Save them as JPEG q92 or lossless WebP in `site/assets/portrait/`, not in `public/`.
- Import them statically so next/image fills in the dimensions and the blurred placeholder.
- Use `preload` on the hero; `priority` is deprecated in Next 16.
- Keep `formats: ["image/avif","image/webp"]`. Add `qualities: [75, 85]` only if skin tones show banding.
- **Don't** place the 16:9 master in the 4:5 frame with `object-position`. The frame's height drives the scaling, so the browser downloads a variant about 2.2× wider than it shows, and the `sizes` math breaks.
- If art direction via `getImageProps` and `<picture>` is ever added, use `fetchPriority="high"` instead of `preload`.

**Glow:** keep the CSS halo and don't add a second one. I rendered the build with the new crop in my scratchpad at 390, 1024, 1280 and 1440 px:
- The photo's own violet-to-blue light carries on into the halo.
- Without the halo, the frame looks pasted on and loses Concept A's signature.
- Keep it static and hero-only, in the brand colors `#8B5CF6` → `#67E8F9` at the specified 35–45% opacity. That keeps it the page's single allowed gradient edge.
- At 1024–1280 px, the glow's box (plus its 44 px blur) reaches the end of the supporting sentence. It's nearly transparent there, but tighten `inset` to about `-12% -16%` to follow the "never behind text" rule strictly.
- A frameless cut-out look isn't recommended: it departs from Concept A and relies more on the edited background.

**Alt text:**
- Hero and About: "Darren Drake, attorney at law", as specified; the e2e test looks for this exact text.
- Avatar: `alt=""` when it sits next to his name.
- Social image: "Darren Drake, attorney at law, Murfreesboro and Middle Tennessee".
- Never describe the background.

**Keeping the original and recording approval:**
- Leave `assets/photos/darren-drake-portrait.jpg` untouched as the archived original.
- Ask whoever made the edit for the lossless master.
- Add `assets/photos/PROVENANCE.md` (or a manifest) recording, per the guidelines: each file's purpose, source, the edits made (background replaced, colors adjusted, sleeve extended), dimensions, crop boxes, mobile treatment, alt text, and the approval (who approved it and when).
- Remove `site/public/images/darren-drake-portrait.jpg`. Anyone can currently download it at full size from `/images/darren-drake-portrait.jpg`.
- Add a one-line `PORTRAIT_VARIANT` switch in `lib/site.ts` so we can revert to the original, and tag the commit before the swap.

The build prompt says "Never generate, retouch or substitute his likeness" (line 22), and the guidelines say to keep genuine attorney photography separate from generated backgrounds. This photo is a retouched composite, so before launch we need **Darren's written approval** of:
- the replaced background, the color changes and the extended sleeve;
- each place it will be used (site, social, Google Business Profile);
- confirmation that the photographer's license allows edited versions.

Then update prompt line 22, `brand-concepts/README.md` and HANDOFF.md to record the approved exception.

## 4. Technical debt and risks

1. `lib/intake-delivery.ts:41-54`: **`local-test` works in production.** If someone sets it on a live server, visitors see "received" while inquiries are written to disk that may be wiped. That breaks the truthful-confirmation rule.
2. `app/api/intake/route.ts:42`: the rate limit trusts the first `x-forwarded-for` value, which a visitor can fake unless the host overwrites it. Lines 26-34: the `hits` map never removes other IPs, so memory grows without limit. Line 50: `request.json()` ignores the content type and has no size cap, so any website can post plain-text spam across origins without a CORS check.
3. `lib/intake-delivery.ts:56-66`: the webhook sends no idempotency key and doesn't retry. If it succeeds slowly after the 10 s timeout, the visitor retries and the inquiry is delivered twice.
4. `components/ui/footer-section.tsx:1`: the whole footer runs in the browser only for the tooltips at 72-101, which cost about 31 KB gzipped on every page. Line 21 computes the year in the browser, which can mismatch the server's year. Line 30 duplicates the intake band's CTA. The wordmark is missing. `Footerdemo` at 121-124 is dead code. The screenshots and printed handouts show the older footer.
5. `components/StickyCta.tsx:18,51-58`: on the homepage the server renders the sticky bar, and it only hides after JavaScript loads. On slow phones there are two "Start your intake" buttons for about the first second.
6. `app/globals.css:69`: there's `scroll-padding-top` but no `scroll-padding-bottom`, so the sticky bar can hide a focused element (WCAG 2.4.11).
7. `app/layout.tsx:15`: `noindex` is hard-coded, so it's easy to launch without search indexing (or to leave previews indexable once it's removed). Lines 8-16 have no `metadataBase`, OG or canonical settings. Line 19 has a raw hex color outside the token file.
8. `components/Portrait.tsx:2`: imports from `public/`. Line 24 uses the deprecated `priority`. Line 26's `object-[50%_18%]` was tuned for the old photo.
9. `package.json:11`: `npm test` fails right away with `MODULE_NOT_FOUND`. `tests/e2e.mjs:12` needs `axe-core`, which is only present because the linter's accessibility plugin happens to install it. Line 15 hard-codes the browser path, and line 16 leaves out two practice pages.
10. `components/ui/input.tsx:14` and `textarea.tsx:13` use 14 px text, which breaks the 16 px rule if anyone uses them. `@radix-ui/react-label` and `@radix-ui/react-switch` (`package.json:15,17`) are unused. `button.tsx:8` sets different focus and hover styles from `.btn-primary`, so the site has two button systems.
11. `app/intake/page.tsx:9`: `force-dynamic` only to read one environment variable. That forces the page to render per request and blocks a fully static export.
12. `lib/analytics.ts:10-13`: events go nowhere. `intake_step_completed` is defined but never sent (fine for a one-step form).
13. `site/HANDOFF.md`: its performance numbers and screenshots predate the footer change.

## 5. Keep Next.js, or go back to WordPress?

The guidelines say moving off WordPress is not authorized automatically, so Darren has to approve it.

| | Next.js as built (recommended) | Signal as a WordPress block theme | Next.js front end with WordPress behind it |
|---|---|---|---|
| Build effort | Mostly done. 17/17 tests pass, axe finds 0 violations, lab LCP is 0.8 s. | L: rebuild every component and the intake form's states in PHP and blocks, then retest accessibility | L+: two systems |
| Content edits by staff | Staff ask for a change and Claude Code opens a pull request (preview first). A free, git-based editor like Keystatic or Tina can be added later if needed. | Staff edit directly in the WordPress editor | WordPress editor |
| Maintenance | Dependency updates via Renovate plus CI. Next.js/React have had critical security advisories, so patching isn't optional. | WordPress core and plugin updates, plugin security risk, heavier pages | Both |
| Hosting cost (verify current prices) | Vercel Pro about $20/month (the free plan doesn't allow commercial use). Netlify or Cloudflare (via the OpenNext adapter; the firm already uses Cloudflare) have free or low-cost tiers. | The existing server: no new cost | Both |
| Meeting the rules (budgets, truthful intake, accessibility) | Already met | Harder, especially with form plugins | Harder |

**My recommendation:** keep Next.js on managed hosting.
- Put the site at `site/` with protected preview deployments.
- Keep content in `lib/site.ts`, edited through pull requests. The live sitemap shows no blog or frequent content, only about nine pages.
- Point the Cloudflare DNS at the new host, add the redirects, keep the WordPress backup and server for 30 days, then retire WordPress. That also ends plugin maintenance.

**Switch to a WordPress block theme instead** if any of these is true:
- staff must publish often without help;
- the firm wants everything to stay on its current server;
- an outside vendor maintains WordPress under contract.

A headless setup (Next.js front end with WordPress behind it) isn't recommended.