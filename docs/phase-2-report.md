# Phase 2 report: full site build and polish

Run on 26 September 2026 from `docs/PROMPT-PLAN.md`, Phase 2. Nothing was deployed: the firm's Vercel account doesn't exist yet, so the screenshots come from the site running on the build computer.

**Before starting.** D1 (leave WordPress) is answered and Phase 1 is approved, so the phase could run. The work is on `claude/sleepy-clarke-wjlh48`, not `phase-2-build` (conflict C6).

## Where the prompt was followed as Darren later decided
These are recorded decisions, and CLAUDE.md says not to undo them without Quinn:
- **Five practice pages, not three (C2).** The page list, the footer and the "Other practice areas" links all use the five approved pages.
- **"Contact us" on /contact/, not "Start your intake" on /intake/ (C1).** The form's page is /contact/ (two cards on desktop, the form beside the office details). /intake/ redirects there in one hop.
- **No Juvenile page.** D5: juvenile cases aren't taken.
- **The directions link stays.** The address was confirmed on 24 Sep 2026, and there's no embedded map.
- **Navigation.** The site uses always-visible tabs on phones (Home, Practice, About, Contact) instead of a menu button, so the three practice pages aren't listed in a phone menu. The practice pages are one tap away under "Practice", in the footer, and on every practice page.
- **Body text weight.** The prompt and the plan say weight 400. The site uses 460, from the 24 Sep polish pass, and that's the weight in the Phase 1 screenshots Darren approved. It was left as approved; say if you'd rather have 400.

## What was done

| Step | Result |
|---|---|
| 1. Facts in one place | Darren's background (Navy service, community roles, education, admissions, memberships) moved into `lib/site.ts` (`DARREN`). About, the "At a glance" card and the search-engine data all read it. The two phone numbers typed into page descriptions now come from the same file. There was no hard-coded address or email left in the Contact page or footer. |
| 1. `<Pending>` marker | `components/Pending.tsx` shows highlighted "Waiting on the firm:" text on previews and refuses to render in a production build. The placeholder guard also catches every use, so the build stops before it starts. Both layers were tested: `npm run build:production` stops with "Release blocked: 2 unconfirmed placeholder(s)", and a direct production build fails on the privacy page. The privacy notice's two open items now use it. |
| 1. FAQs | An answer marked `pending` never renders. All current answers are approved (D4). |
| 2. Header | The name block is the approved Phase 1 size. The "Contact us" button is 52 px tall. The skip link is now at least 44 px tall when it appears. |
| 2. Buttons | The unused shadcn `ui/button` was deleted, so every button uses the site's own `.btn-primary` / `.btn-secondary`. `.btn-compact` was already 52 px tall; only its padding is smaller. |
| 2. Footer | **License resolved by rewriting.** 21st.dev leaves licensing to each author, and the original author's license couldn't be confirmed. The footer is now the site's own server component (`components/Footer.tsx`), and the third-party file is deleted. It has the name block, the year worked out on the server, no tooltips, underlined links, and Privacy, Accessibility and Legal notice links. |
| 2. Phone bar | Already built as the prompt asks (hidden until the hero button leaves the screen, hidden when another main button is on screen, off below 500 px height, never covering the focused item). Existing tests cover it. |
| 3. Hero entrance | Already built: text visible from the first frame, a 12 px rise over 420 ms with a 60 ms stagger, desktop only, off under reduced motion. |
| 4. Pages | **Practice pages:** "On this page" links, a "Your attorney" card with Darren's round photo (the photo's alt text is empty, since his name is right beside it), the approved FAQs, and "Reviewed by Darren Drake, Attorney at Law, on 24 September 2026." (the date he approved the wording). The home FAQ has the same line. **About:** the "At a glance" card, under the photo. **Not-found:** the title "Page not found", `noindex`, the phone number, and every practice area. **New `global-error` page:** used only if the whole site fails; plain inline styles, the phone number, nothing fetched. **Error page:** uses Next.js 16's `retry()`. |
| 5. Polish | **Tap targets:** every standalone link, button and field is at least 44 × 44 px on every page at 320, 390 and 1440 px. The breadcrumb "Home", the short footer links and the skip link were raised; a new test checks this. **Forced colours:** buttons, cards and panels get real borders, and the glow is hidden. **Also:** the focus ring is 2 px `#67E8F9` with a 2 px offset; text links are underlined; `scroll-padding` keeps focused items clear of the sticky header and bar. |
| 6. Speed | **Removed:** `ui/button`, `input`, `label`, `switch`, `textarea`, `tooltip`, `badge` and `tabs`, plus the `@radix-ui/react-label`, `react-slot`, `react-switch`, `react-tooltip`, `radix-ui`, `@fontsource-variable/manrope` and `tw-animate-css` packages. **Images:** only 75 and 80 quality levels are allowed; no sizes above 1920 px; the hero uses `preload` (`priority` is deprecated in Next.js 16). The font was already `next/font/local`, and the crops were already statically imported (Phase 1). |

## Checks

| Check | Result |
|---|---|
| Lint, typecheck, build | Clean |
| End-to-end (`npm test`) | **96/96**, 5 of them new: tap targets, Pending and the production guard, the practice-page parts, About/not-found, and the footer. axe finds 0 violations on every page in both themes. |
| Cookie consent / delivery | 13/13 / 4/4 |
| Claims, cyan buttons (one per section, 52 px), links | Pass (107 buttons; 12 pages) |
| Production build with placeholders left | Refused, as required |
| Lighthouse (slow phone, 5 pages × 3 runs) | All budgets met: LCP 1.42–1.61 s, CLS ≤ 0.01, JS 160 KB (Contact 176 KB), total 247–262 KB |

## Screenshots
`printouts/Phase-2-Screenshots.pdf` (every page at 390, 768 and 1440 px, one sheet each) and `printouts/phase-2/*.jpg`. They're made by `site/scripts/screenshot-pages.mjs`, which later phases can reuse.

On phone and tablet sheets, the "Ask about…" phone bar can appear partway down a long page. That's a side effect of the full-page capture: on a real phone it sits at the bottom of the screen.

## Waiting on Darren
1. **Privacy notice:** approve the draft, and decide how long inquiries are kept and how someone asks for theirs to be deleted (D8). These are the 2 "Waiting on the firm" items, and they block the live build.
2. **Accounts (D13):** create the Vercel, Postmark and Telegram accounts, name an owner for each, and move the code to a firm GitHub organization.
3. **Photo paperwork:** sign the photo note; name the photographer and the editor.
4. **Conflicts C1–C5** in `docs/DECISIONS.md`. C5, the ad tags, must be settled before any ad IDs are entered.
5. **Optional:** body text weight 400 instead of the approved 460 (see above).
