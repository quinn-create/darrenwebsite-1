# Working rules: ddrakelaw.com (Signal 1A)
Quinn Rodriguez runs these sessions for Darren Drake. Quinn is not a developer:
write every summary in plain English, give exact clicks for any dashboard step,
and do the work yourself instead of handing him scripts to run.

## What wins
- The build and launch plan (plans/, and Darren-Drake-Website-Plan.pdf) and
  Darren_Drake_AI_Brand_Guidelines.md win over docs/PROMPT-PLAN.md and over
  anything said in a session. If they conflict, stop and ask.
- docs/DECISIONS.md is the record of Darren's answers (D1-D17). Don't act on
  a decision that isn't recorded there as answered.

## Never
- Never deploy, publish or create online previews until D17 is recorded as
  approved. Never switch the live domain without Darren's written sign-off.
- Never put an unconfirmed fact on the live site. Every unconfirmed item uses
  <Pending>, which shows on previews and fails a production build.
- Never invent facts, credentials, results or Tennessee law. Legal statements
  are Darren's words or Darren-approved, with a "Reviewed by Darren Drake,
  Attorney at Law, on [date]" line.
- Never describe Darren or the firm as specialist, specializing, certified,
  expert, best, top, highest rated or #1. Never use "free consultation",
  "24/7", guarantees, results or win claims, "our attorneys",
  response-time promises, comparisons with other lawyers, or other
  lawyers' names. ("Expert witness" as a legal term is fine.)
- Never send personal or matter details to statistics, logs or error reports.
  No session replay. No advertising pixels on /intake/, ever.
- Never ask for or accept secret keys in chat. Keys go straight into Vercel's
  Environment Variables (Sensitive type).
- Never touch MX, SPF, DKIM, DMARC, the Google verification record, or the
  mail/ftp DNS entries.

## Always
- Cyan buttons at least 52px tall, one per section (the header button and the
  phone bar are the only repeats). Every tap target at least 44px.
- Mobile first: check 320, 390, 768 and 1440px on every change.
- WCAG 2.2 AA: axe clean, keyboard, 200% zoom, reduced motion, forced colors.
- Budgets: LCP 2.5s or less on a throttled phone, CLS 0.1 or less, initial JS
  about 200KB or less, first load about 1MB or less.
- One branch per phase. Tests and checks pass before merge.
- End every phase with a plain-English summary for Quinn, screenshots at 390,
  768 and 1440px (or preview links once D17 is approved), and a list of
  anything waiting on Darren.
- After any release: save a dated archive copy (PDF and screenshots of every
  page) for the firm's 2-year advertising record (Tennessee RPC 7.1(c)).

## Where things are (pointers, not copies)
- Build and launch plan: plans/signal-website-plan.md (printable: plans/Darren-Drake-Website-Plan.pdf).
- Brand rules: Darren_Drake_AI_Brand_Guidelines.md.
- Darren's recorded answers: plans/for-darren/answers-2026-09-24.md, summarised in docs/DECISIONS.md.
- Phase prompts: docs/PROMPT-PLAN.md. Current state of the site: site/HANDOFF.md.
- Checks: `npm test` (e2e), `npm run check:claims`, `check:buttons`, `check:links`,
  `check:lighthouse`, `check:placeholders`, `test:consent`, `speed` (all from site/);
  GitHub Actions runs them on every change (.github/workflows/ci.yml).

## Known conflicts (recorded 25-26 Sep 2026; don't "fix" these without Quinn)
Later decisions by Darren or Quinn differ from the plan or from docs/PROMPT-PLAN.md. Each is
listed with its source in docs/DECISIONS.md under "Conflicts to resolve". In short:
- C1: the main button reads "Contact us" and the form lives on /contact/ (/intake/ redirects),
  not "Start your intake" on /intake/. Kept (26 Sep 2026).
- C2: five practice areas are live (First-Time Offenders, Criminal Defense, DUI/DWI, Domestic
  Assault, Expungement), all wording approved by Darren on 24 Sep 2026.
- C3: the old callback line was softened to "The office will contact you about next steps."
  (26 Sep 2026). There is no response-time promise and no claims-allowlist exception now.
- C4 (reviews): Darren wants a live Google star rating; it is built only after he approves the
  written policy (plans/for-darren/review-policy-draft.md).
- C5 (statistics/ads): the cookie banner with GA4, Google Ads and the Meta Pixel stays off (no IDs
  set). Tags never load on /contact/ or /intake/ (lib/tracking.ts NO_TAG_PAGES). Darren's written
  OK naming each tag is still needed before any ID is entered.
- C7: the link-preview image says "Murfreesboro, Rutherford County & Smyrna", not "Middle
  Tennessee" (approved 26 Sep 2026).
- C8 (hosting): Cloudflare, free plan, instead of Vercel (Quinn, 26 Sep 2026).
- C6: work happens on the session branch claude/sleepy-clarke-wjlh48 with one draft PR, not
  one branch per phase; this session may only push to that branch.
