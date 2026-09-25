# Phase 0 report: status check, safety net and decision log

Run 25 September 2026 from `docs/PROMPT-PLAN.md`, Phase 0. No page content was changed, and nothing was deployed.

**Branch:** the prompt plan asks for a `phase-0-safety-net` branch. This cloud session may only push to its assigned branch, `claude/sleepy-clarke-wjlh48`, so the work is there, in the same draft pull request. Conflict C6 in `docs/DECISIONS.md` covers this.

## 1. Status report

### The plan's "What Claude does first"

| # | Item | Status | Proof |
|---|---|---|---|
| 1 | Facts sheet and decision pack for Darren | **Done** | `plans/for-darren/Darren-Drake-Website-Review-Pack.pdf` (and `review-pack.html`); his answers in `plans/for-darren/answers-2026-09-24.md` |
| 2 | New photo in the demo, with side-by-side screenshots against the concept | **Partly done** | The photo and crops are live (`site/public/images/darren-drake-signal-4x5.jpg`, `-square.jpg`; cut by `site/scripts/make-photo-crops.py`), and Darren approved it (D2). No side-by-side PDF against the 1A concept was found; that's Phase 1, step 6. |
| 3 | Dated, read-only copy of the current ddrakelaw.com | **Done** (in the project) | `archive/ddrakelaw.com-2026-09-24/`: HTML, PDF and screenshot of each page, plus `README.md`. It isn't in the firm's own storage yet (it needs an archive owner). |
| 4a | Footer cleanup | **Partly done** | A server component with the tooltips removed and the name block in place (`site/components/ui/footer-section.tsx`). The 21st.dev license check is still marked "pending" in that file. |
| 4b | Cyan buttons at least 52 px | **Done** | `site/scripts/check-buttons.mjs` passes: 107 buttons at 390, 768 and 1440 px |
| 4c | Placeholder guard | **Done** | `site/scripts/check-placeholders.mjs`, run by `npm run build` when `SITE_ENV=production`; a self-test was added today |
| 4d | Phone-bar and focus fixes; a hero entrance that never hides text | **Done** | `site/components/StickyCta.tsx`; the e2e checks for sticky-bar behaviour, reduced motion and the hero entrance |
| 4e | Speed clean-up | **Mostly done** | `plans/speed-check-plan.md`, `printouts/speed-report.md`. The unused `ui/tooltip`, `ui/label`, `ui/switch`, `ui/input` and `ui/textarea` files and their Radix packages remain in the project (they aren't sent to browsers); removing them is Phase 2. |
| 4f | Practice template with "On this page" links | **Not done** | Nothing found; Phase 2 |
| 4g | Accessibility, Legal notice and error pages | **Done** | `site/app/accessibility/`, `legal-notice/`, `not-found.tsx`, `error.tsx` |
| 5a | Safety net (automatic checks on every change) | **Done today** | See section 4 below |
| 5b | Setup guide for the firm (GitHub organization, Vercel) | **Done** | `plans/for-darren/account-setup-guide.md`, `plans/for-darren/go-live-setup.md` |

### The plan's Phase 0 task list

| Task | Who | Status | Proof, or what's missing |
|---|---|---|---|
| Facts sheet pre-filled from the old site | Claude | **Done** | The review pack |
| Copy request pack (practice outlines and FAQs) | Claude | **Done** | The review pack; the wording is now approved (D4) |
| Archive of the current ddrakelaw.com | Claude | **Done** | `archive/ddrakelaw.com-2026-09-24/` |
| Send the pack to Darren and collect his answers | Quinn | **Done** | `plans/for-darren/answers-2026-09-24.md` |
| Darren confirms facts, decides D1–D5, D13 and D17, and signs the photo note | Darren | **Mostly done** | D1, D2, D4, D5 and D17 answered. **D3 open; D13 partly** (account owners not named; code not yet in a firm GitHub organization). The photo approval is recorded, but **no signed note is filed**. |
| Name each account's owner and a billing owner; check the domain's expiry, auto-renew and registrar lock | Darren/firm | **Not done** | No record. The domain is moving to Cloudflare (Quinn). |
| Shared password manager and an offboarding rule | Darren/firm | **Not done** | No record |
| Name an archive owner for the 2-year advertising record | Darren/firm | **Not done** | No record |
| Find the Search Console owner; check "Security issues" and "Manual actions" | Quinn with the firm | **Not done** | No record. It matters because of the suspicious sitemap on the old site. |
| Biography and practice-page copy | Darren | **Done** | Approved 24 Sep 2026; in `site/lib/site.ts` |

## 2. CLAUDE.md
Created at the repository root. It holds the prompt plan's Part 4 guardrails word for word, plus pointers to the plan, the guidelines and the decision log (nothing is copied). It also carries a short "Known conflicts" list, so no later session "fixes" a decision Darren or Quinn already made.

## 3. docs/DECISIONS.md
D1–D17, each with its default, status, answer, date and where it's recorded:
- **Answered:** D1, D2, D4, D5, D6, D7, D15, D17.
- **Partly answered:** D8 (retention is open) and D13.
- **Open:** D3, D9, D10, D11, D12, D14, D16.

It also records Darren's other answers, what's still open, and **six conflicts to resolve** (C1–C6).

## 4. The safety net
`.github/workflows/ci.yml` ("Site checks") runs on every pull request and push. `.github/dependabot.yml` adds weekly grouped updates.

| Plan item | How it's covered | Result today |
|---|---|---|
| Fix `npm test` | `npm test` now builds, starts both servers and runs the e2e suite (`tests/run-e2e.sh`); before, it ran `node --test` over files that need servers | 87/87 |
| Declare axe-core | Added to devDependencies (it was only there indirectly) | Done |
| Remove the hard-coded browser path | `site/tests/browser.mjs` finds Chromium itself (the `CHROMIUM_PATH` setting, Playwright's own install, or a pre-installed set). All tests and the preview builder use it. CI installs Playwright's browser. | Done |
| Lint, typecheck, build | CI steps | Clean |
| End-to-end tests (the plan's "current 17") | The suite has grown to **87**: pages, form states, redirects, SEO, themes, consent-off, speed and review checks | 87/87 |
| axe at 390, 768 and 1440 px, plus 320 px reflow | In the e2e suite: every page, both themes, error and success states. There's no "menu open" state any more: the site uses always-visible tabs, not a menu button. | 0 violations |
| Lighthouse budgets (LCP ≤ 2.5 s, CLS ≤ 0.1, JS ≤ 200 KB, first load ≤ 1 MB) | `site/lighthouserc.json`, 5 pages × 3 runs. It uses Lighthouse's real slow-phone throttling, because the default *simulated* method put the home page at 2.64 s on a local server (a known overestimate: every script finished before the first paint, so all got counted). | Pass: LCP 1.45–1.62 s, CLS 0, JS 159–173 KB, total ≤ 261 KB |
| Placeholder guard | CI runs a self-test (it must catch `[CONFIRM`, `[FIRM TO`, `to confirm]`, `[TO BE SUPPLIED`, `[Office`) and then lists what's left. It lists rather than fails until launch, because 2 known placeholders remain on purpose. The hard stop stays where it was: a production build refuses to run. | Self-test passes; 2 left (privacy notice) |
| Risky-claims word list | `site/scripts/check-claims.mjs`: 14 rules from the Never list. It reads visible text, titles, meta, alt text and JSON-LD only. Approved exceptions are in `site/scripts/claims-allowlist.json` (one: the callback line, C3). It has its own self-test. | Pass |
| Cyan buttons at least 52 px, one per section | `site/scripts/check-buttons.mjs`, every page including the not-found page, at 390, 768 and 1440 px | Pass (107 buttons) |
| Link check | `site/scripts/check-links.mjs`: every internal link answers 200, and unknown addresses give 404. External links are listed, not fetched. | Pass (1 external link: Google Maps directions) |
| Redirect test | Already in the e2e suite: every Appendix B row, one hop, then 200 or 410 | Pass |
| Inquiry delivery | `tests/delivery.mjs`, against stand-ins for Postmark and Telegram | 4/4 |
| Cookie consent | `tests/consent.mjs`, a separate build with dummy IDs; nothing leaves the machine | 13/13 |
| Dependabot | Weekly grouped npm and GitHub Actions updates | Config added |

**One real bug found and fixed:** the cookie-consent code loads just after the page, so a form sent before it arrived would not count as a lead. The form now queues its events until that code arrives. The consent test also checks that each lead is counted exactly once. This doesn't change any page content, and it matters only once ad IDs are set.

## 5. The archive script
`site/scripts/archive-site.mjs` (`npm run archive -- <address>`, run from `site/`):
- **What it saves:** a full-page PDF and a 1440 px screenshot of every page, plus `index.md` with the address, capture time and git commit, in `archive/<site>-YYYY-MM-DD/` at the repository root.
- **Public access:** it refuses to write inside `site/public`, so an archive is never served.
- **Finding pages:** it follows links rather than a sitemap by default, because the old WordPress sitemap lists 41,660 junk addresses.
- **Tested:** on the local site, it captured all 12 pages.

## 6. What you need to do in GitHub (about 5 minutes)
These are settings on github.com, and Claude can't change them. They make the checks required, as the plan asks.
1. **Let the checks run:** repository → **Settings** → **Actions** → **General** → "Allow all actions and reusable workflows" → **Save**.
2. **Security alerts:** **Settings** → **Code security** (or "Code security and analysis") → turn on **Dependabot alerts** and **Dependabot security updates**.
3. **Make the checks required:** wait until "Site checks" has run once on the pull request. Then **Settings** → **Branches** → **Add branch ruleset** (or "Add rule"). Target the branch the pull request merges into (`graphical-email-program1` today, or your main branch), tick **Require status checks to pass**, search for and add **Site checks** → **Create**/**Save**.

## 7. Waiting on Darren and the firm (in order of what blocks launch)
1. **Approve the privacy notice** (including the cookie section) and **decide how long inquiries are kept** (D8). These are the 2 placeholders; a production build refuses to run until they're done.
2. **Accounts (D13).**
   - Create the Vercel, Postmark and Telegram accounts, and add the Postmark DNS records in Cloudflare (`plans/for-darren/go-live-setup.md`).
   - Name an owner for each account.
   - Move the code to a firm GitHub organization.

   Nothing can go online, and no real inquiry can be delivered, until this is done.
3. **Resolve conflicts C1–C5** in `docs/DECISIONS.md`: the button text, five practice areas, the callback line, reviews, and the ad tags. **C5 must be settled before any ad IDs are entered.**
4. **Before launch:** name who runs the old WordPress server (for its security check), and find the Search Console owner, checking "Security issues" and "Manual actions".
5. **Archive owner:** someone at the firm who copies `archive/` folders into firm storage and keeps them for 2 years.
6. **The rest:**
   - D16 (launch window);
   - D3 (About-page crop; the default is in use);
   - D9 and D10 (statistics and phone-tap counting);
   - D11 (a licensed photo, optional);
   - D12 (ethics review, optional);
   - a signed photo note;
   - the footer component's license check;
   - the domain's expiry, auto-renew and registrar lock;
   - a password manager and an offboarding rule.
