# Website Prompt Plan: ddrakelaw.com (Signal 1A)

Rev. 1 · September 25, 2026 · Claude Code prompts for Darren Drake's new website, built from the quinnrodriguezlegal.com plan

This is the copy-and-paste prompt set for Darren's new site, the one in the cloud project `darrenwebsite-1`. It turns the 45-page build and launch plan (September 24, 2026) into one Claude Code prompt per phase, and adds the polish, phone, Google and tracking checks from the quinnrodriguezlegal.com plan. It is also reusable: change Part 3 (the site profile) and the same prompts work for another site.

## Part 1: How to use this plan

1. Put this file in the project as `docs/PROMPT-PLAN.md`. Easiest way: on GitHub, open the darrenwebsite-1 repository → Add file → Upload files → drop this file into a `docs` folder → Commit. Then tell the cloud session `git pull`.
2. Open the Claude Code cloud session for darrenwebsite-1.
3. Type the short trigger for each phase, for example: `Run Phase 1 from docs/PROMPT-PLAN.md exactly as written.` If the file isn't in the project, paste that phase's full prompt box instead.
4. Keep the order. Each phase ends with a plain-English summary for you and screenshots at phone, tablet and desktop sizes. Online preview links start only after Darren's written OK for private previews (decision D17).
5. When Darren answers a decision, tell the session in one line, for example: `Darren decided D9: Plausible, yes.` It records the answer in `docs/DECISIONS.md`, and the prompts that were waiting on it can run.

> The rule on conflicts: Darren's build and launch plan and `Darren_Drake_AI_Brand_Guidelines.md` win over this file. These prompts carry out the plan; they never override it.

## Part 2: What's different from the quinnrodriguezlegal.com prompts

The optimization goals are the same: polished UI, working buttons, phone-first, found on Google, compliant. Darren's plan already made several choices differently, and these prompts follow his plan.

| Topic | quinnrodriguezlegal.com | ddrakelaw.com (Darren's plan) |
|---|---|---|
| Tracking | GA4, Meta Pixel, TikTok Pixel and Microsoft Clarity, behind a cookie banner | Plausible (D9). Plausible says it uses no cookies, so a banner is likely unnecessary; Darren's plan marks that point unverified. No ad pixels. Pixels come only with Darren's written OK, and never on the intake page (optional module, Part 6). |
| Counting leads | A /thank-you page | No thank-you page (anyone could open it without sending anything). A "sent" event fires only after the firm's inbox accepts the inquiry. |
| Buttons | 44px tap targets | Cyan buttons at least 52px tall, one per section, always reading "Start your intake" |
| Hosting | Cloudflare (already live) | Vercel Pro, owned by the firm (D1, D13). Domain settings stay at Cloudflare. |
| Previews | Preview link on every change | Screenshots only until Darren's written OK (D17) |
| Old site | Same site, polished | WordPress to Next.js move, with a redirect for every old address and "gone" for junk addresses |
| Phone bar | Call · Text · Directions | "Start your intake" bar on phones. The phone number is a text link. No texting at launch. |
| Reviews | Reviews page with a disclaimer | No reviews or testimonials until the firm has a written policy |
| Copy checks | Banned-phrase list | Placeholder guard (unconfirmed facts can't go live) plus a risky-claims list |

## Part 3: Site profile (the only part you change to reuse this plan)

Every prompt reads this profile. For another website, replace this table and leave the rest alone.

| Item | Value for ddrakelaw.com |
|---|---|
| Site and domain | ddrakelaw.com, replacing the current WordPress site |
| Owner / responsible lawyer | Darren Drake, Attorney at Law. The exact business name is waiting on the facts sheet. |
| Phone | (615) 546-5551, the only phone number on the site, shown as a text link |
| Address | 138 S. Cannon Ave, Murfreesboro, TN 37129. Unconfirmed until Darren signs the facts sheet. |
| Practice areas | Criminal Defense, DUI/DWI, Expungement (Juvenile only if D5 says so) |
| Main button | "Start your intake". The form's button reads "Send inquiry". |
| Design | Signal 1A: navy #090F1C, Manrope, cyan #67E8F9 action color, violet-to-cyan glow behind the photo only, DARREN / DRAKE name block |
| Stack | Next.js 16.3 (App Router), React 19.3, TypeScript, Tailwind CSS 4, Zod 4, Lucide; Node 22; project root `site/`; `site-precision/` excluded |
| Hosting | Vercel Pro, firm-owned (D1, D13). Domain settings at Cloudflare. Firm email on Google Workspace, untouched. |
| Intake | /intake/ → POST /api/intake/. Primary per D7 (Clio Grow only if it's the firm's own, otherwise Postmark), backup Resend. Cloudflare Turnstile spam check, Upstash rate limits. |
| Statistics | Plausible (D9). Events: intake_start, intake_submit_success, intake_submit_error. call_click and not_found only with Darren's written OK (D10). |
| Previews | Screenshots only until D17 is recorded as approved |
| Project files | /home/user/darrenwebsite-1: `Darren_Drake_AI_Brand_Guidelines.md`, `prompts/signal-website-build-prompt.md`, `site/HANDOFF.md`, `site/lib/site.ts`, `site/lib/analytics.ts`, `site/next.config.ts`, `plans/`, `archive/` |
| Not at launch | Reviews or testimonials, blog, thank-you page, city pages, live chat or chatbot, texting, fees or payments |

## Part 4: Guardrails (Phase 0 puts these into CLAUDE.md)

```
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
```

## Part 5: The phases

The phase numbers match Darren's build and launch plan, so you can read the two side by side.

### Phase 0: Status check, safety net and decision log

What happens: Claude Code reads everything, reports what's already done, writes the guardrails into CLAUDE.md, starts the decision log, and sets up the automatic checks that protect every later phase. No site content changes.

Trigger: `Run Phase 0 from docs/PROMPT-PLAN.md exactly as written.`

```
Read docs/PROMPT-PLAN.md, Darren_Drake_AI_Brand_Guidelines.md,
prompts/signal-website-build-prompt.md, site/HANDOFF.md and the build and
launch plan in plans/ (Darren-Drake-Website-Plan). If you can't find the plan,
tell me and I'll upload the PDF. This is Phase 0. Do not change page content.
Branch: phase-0-safety-net.

1. Status report in plain English. For each item in the plan's "What Claude
   does first" and Phase 0 lists, say done / partly done / not done, with the
   file that proves it (for example archive/ddrakelaw.com-2026-09-24/, the
   facts sheet and review pack, account-setup-guide.md).
2. Create or update CLAUDE.md at the repo root with Part 4 "Guardrails" of
   docs/PROMPT-PLAN.md. Merge; keep anything already there. Point to the plan
   and guidelines rather than copying them.
3. Create docs/DECISIONS.md: a table of D1-D17 from the plan (decision,
   recommended default, status: open/answered, Darren's answer, date, where
   the written OK is filed). Fill it from what's already recorded; everything
   else stays open.
4. Safety net (plan Appendix A, "Testing and CI"), as GitHub Actions required
   before merge:
   - fix npm test; declare axe-core; remove the hard-coded browser path
   - lint, typecheck, build
   - Playwright end-to-end tests (the current 17)
   - axe at 390, 768 and 1440px, with the menu open, plus a 320px reflow check
   - Lighthouse CI budgets: LCP 2.5s or less, CLS 0.1 or less, initial
     compressed JS 200KB or less, first load 1MB or less
   - placeholder guard (fails on [CONFIRM, [FIRM TO, to confirm], [TO BE
     SUPPLIED, [Office)
   - risky-claims word list from the guardrails (checks visible text, meta,
     JSON-LD and alt text only; ignores class names, CSS and hex colors)
   - a check that every cyan button is at least 52px and no section has more
     than one, besides the header
   - link check
   - Dependabot security alerts and weekly grouped updates
5. Create scripts/archive-site.mjs: saves a full-page PDF and a 1440px
   screenshot of every page of a given URL (the old site, a preview or the
   live site) into archive/<site>-YYYY-MM-DD/ with index.md (URL, capture
   date, git commit). For the firm's 2-year advertising record. The archive
   folder is never served publicly.
6. Run everything. Report pass/fail and list what's waiting on Darren, in
   order of what blocks launch. Commit. Nothing is deployed.
```

You check: the status report matches what you and Darren have already done, and `docs/DECISIONS.md` lists every open decision.

### Phase 1: Design lock and assets

What happens: the new photo goes into the design, the hero is tuned to match the 1A concept, one of each page type is mocked up, and the icons and link-preview image are made.

Trigger: `Run Phase 1 from docs/PROMPT-PLAN.md exactly as written.`

```
Read CLAUDE.md and the plan's Section 5 (The new photo), Phase 1, and
Appendix C (Asset register). This is Phase 1. Branch: phase-1-design-lock.
If D2 (photo approval) is still open, label every screenshot "photo pending
Darren's approval".

1. scripts/make-portrait-crops.mjs (sharp): cut A2-a (4:5, 900x1125 at
   x 548-1448) and A2-b (1:1, 800x800 at x 600-1400, y 40-840) from the
   genuine middle strip only. Record origin, size, use and approval status of
   every asset in assets/photos/PROVENANCE.md. Keep the original portrait
   untouched as master, add the PORTRAIT_VARIANT switch, and delete the
   downloadable full-size public/images/darren-drake-portrait.jpg.
2. Home hero: place the photo, tune the glow (layered radial gradients at
   35-45% opacity, no blur filter) so it continues the photo's own light,
   enlarge the DARREN / DRAKE name block, and tighten spacing so "How Darren
   can help" shows on the first 1440x900 screen. On phones the headline and
   button come before the photo. No text on the glow.
3. Mock up one of each page type in Signal 1A: Home, a practice page, About,
   Contact, Intake.
4. Icons: the outlined "DD" mark as vector shapes (no scales, shields or
   seals). Produce icon.svg, favicon.ico (16/32/48), apple-icon.png (180,
   opaque #090F1C), 192/512 and maskable icons, and manifest.webmanifest.
5. Link-preview image (1200x630, navy, typed by code, not by an image model):
   the 4:5 crop in the centre square so square previews keep the face,
   "DARREN / DRAKE" and "Attorney at Law" on the left, practice areas and
   "Murfreesboro & Middle Tennessee" on the right. Under 300KB. Alt text:
   "Darren Drake, attorney at law, Murfreesboro and Middle Tennessee".
6. Deliver side-by-side screenshots with brand-concepts/01-signal.png at
   390, 768 and 1440px for all five page types, as one PDF for Darren to
   approve. Nothing is deployed unless D17 is approved in docs/DECISIONS.md.
```

You check: the side-by-side PDF looks like the 1A concept. Send it to Darren with the headline question ("Your next step starts with a conversation.") and the About-crop question (D3).

### Phase 2: Full site build and polish

What happens: every launch page is built in Signal 1A, the shared parts are fixed (header, footer, phone bar, buttons), the placeholder guard goes in, and the site gets its speed clean-up.

Trigger: `Run Phase 2 from docs/PROMPT-PLAN.md exactly as written.` (Needs Phase 1 approved and D1 answered.)

```
Read CLAUDE.md, docs/DECISIONS.md and the plan's Sections 4 and 7, Phase 2,
and Appendix A. This is Phase 2. Branch: phase-2-build. Stop and tell me if
D1 (leave WordPress) is not answered.

1. Facts: move every firm fact and shared line into site/lib/site.ts. Remove
   the hard-coded address and email in contact/page.tsx and
   footer-section.tsx. Build <Pending kind="..."> that shows marked text on
   previews and throws in production builds. FAQ items render only with
   approved answers.
2. Shared parts:
   - Header: the larger name block; the phone menu lists the three practice
     pages; a 52px header button.
   - Buttons: merge ui/button into .btn-primary; raise .btn-compact (header,
     "Try again") to 52px or remove it.
   - Footer: check and record the 21st.dev/shadcn footer-section license;
     make it a server component; remove the tooltips; restore the name
     block; compute the year on the server; delete Footerdemo; add Privacy,
     Accessibility and Legal notice links.
   - Phone "Start your intake" bar: render it hidden where a hero button
     exists and show it only once that button is off screen (no flash before
     JavaScript); hide it whenever another "Start your intake" button is on
     screen and below 500px viewport height; never cover what a keyboard
     user is on.
3. Hero entrance: text fully visible from the first frame (12px rise, 420ms,
   60ms stagger, CSS only, desktop home only), or remove it. Everything off
   under prefers-reduced-motion.
4. Build every Section 4 page with trailing-slash URLs:
   - / and /practice-areas/
   - /practice-areas/criminal-defense/, /dui-dwi/ and /expungement/:
     "On this page" links, "Your attorney" card, approved-only FAQ,
     "Reviewed by" line
   - /about/ with "At a glance"
   - /contact/ with two cards; no embedded map; directions link only once
     the address is confirmed
   - /intake/: two columns on desktop, demo notice until delivery is proven
   - /privacy/, /accessibility/ and /legal-notice/: drafts, marked Pending
     where the firm must supply facts
   - not-found (title plus noindex), error and global-error pages, each with
     the phone number
   - Add the Juvenile page only if D5 says so.
5. Polish (from the quinnrodriguezlegal.com plan):
   - Design tokens only, with no one-off values. 17-18px body text at
     weight 400.
   - Underlined links. 2px #67E8F9 focus ring with a 2px offset.
   - Forced-colors support.
   - scroll-padding for the sticky header and bar (WCAG 2.4.11).
   - Consistent section rhythm; 60-75 characters per line.
   - 44px minimum on every standalone tap target (menu items, icon links,
     footer links), not only buttons.
   - No hover-only features.
6. Speed:
   - Remove @radix-ui/react-tooltip, react-label and react-switch, and the
     unused ui/input, ui/textarea, ui/label and ui/switch.
   - Load Manrope with next/font/local (one variable file, preload,
     fallback metrics).
   - images.formats AVIF/WebP; statically imported crops; the hero uses
     preload with sizes="(min-width:1024px) 420px, 256px".
7. Acceptance, then report:
   - every page works at 320, 390, 768 and 1440px
   - no more than one cyan button per section
   - a test build with one placeholder left is refused
   - axe passes
   - about 200KB of initial JS or less
   - update site/HANDOFF.md
   Screenshots of every page (or preview links if D17 is approved).
```

You check: on your phone, every page reads cleanly and nothing overlaps. Send Darren one feedback list per round.

### Phase 3: Intake connection

What happens: the form is connected to an inbox the firm owns, with a backup, spam protection, sending limits and alerts that never contain personal details, and it's proven with test data.

Trigger: `Run Phase 3 from docs/PROMPT-PLAN.md exactly as written.` (Needs D7 and D8 answered, and the firm's Postmark, Turnstile and Upstash accounts created, with keys entered in Vercel by the firm.)

```
Read CLAUDE.md, docs/DECISIONS.md and the plan's Section 8 and Appendix A
("Intake API order of checks", "Delivery details", "Environment
variables"). This is Phase 3. Branch: phase-3-intake. Stop if D7 or D8 is
open, or if any required env var is missing. Never ask me for a key; tell
me which variable names the firm must enter in Vercel.

1. POST /api/intake/, checks in this exact order:
   - body over 16KB -> 413
   - not application/json -> 415
   - not same-origin -> 403
   - honeypot filled -> quiet reject, checked BEFORE validation
   - Zod plus lib/intake-rules.ts -> 422 with field errors
   - Turnstile siteverify (hostname, action, idempotency key). If
     Cloudflare is unreachable, accept, flag "unverified" and apply a
     tighter limit.
   - Upstash rate limit on an HMAC-hashed IP with a 24h TTL: 5 per 10
     minutes and 20 per day, plus a global breaker at about 100 per hour
     that alerts. Use the platform-supplied IP (replace the in-memory map).
   - dedupe on the client submissionId (SET NX, 24h) plus a 10-minute
     content hash
   - primary delivery (8s timeout), then fallback (6s), under 15s total,
     with an Idempotency-Key
2. "Received" only on Clio 201, Postmark 200 with ErrorCode 0, or Resend 200
   with an id (confirm Postmark's exact field in testing). If both fail, keep
   the answers on screen with "Try again" and the phone number.
3. Email format: plain text; subject "New website inquiry - ref {id}"; first
   line "New website inquiry. Please open on a secure device."; Reply-To
   only if an email was given.
4. Clio Grow mapping only if D7 = the firm's own Clio with Grow (plan
   Appendix A). Never Clio Manage, never someone else's Clio.
5. Alerts: "backup used", "delivery failed" and "bounced", with no personal
   details, to the named firm person and to Quinn. Add the Postmark bounce
   webhook. Logs carry error codes only. GET /api/intake/health/ reports
   configured status and sends nothing.
6. local-test delivery works only when SITE_ENV=development. The build fails
   if SITE_ENV=production has no intake destination.
7. Turnstile client: managed mode, appearance "interaction-only", execute()
   on submit. Use the new widget's keys, not the WordPress ones.
8. Run the plan's tests 1-10 (Section 8) on the preview. For test 2, tell me
   when to have the named recipient watch the inbox; the test data is marked
   "TEST - please delete". Write docs/intake-test-log.md for the named
   recipient to sign.
9. Update the privacy notice draft with the real setup: vendors, retention
   (Postmark 45 days by default or 7 with the add-on, Resend 30, Vercel
   logs 1 day with no form content) and the Turnstile and Upstash notes.
```

You check: the named intake recipient confirms the test inquiry arrived with a neutral subject line, then deletes it and signs the test log.

### Phase 4: Google, redirects and statistics

What happens: page titles, the Google labels, the sitemap and robots rules, every old WordPress address redirected in one step (or marked gone), cookie-free statistics, and the security headers in "report only" mode.

Trigger: `Run Phase 4 from docs/PROMPT-PLAN.md exactly as written.`

```
Read CLAUDE.md, docs/DECISIONS.md and the plan's Section 10, Phase 4,
Appendix A (Security headers, Search engine setup, Analytics) and
Appendix B. This is Phase 4. Branch: phase-4-search.

1. Titles from Section 10 (Darren approves them with the copy), 60
   characters or fewer; a unique 140-155 character description per page,
   with no claims; metadataBase; a self-referencing canonical with a
   trailing slash; openGraph and twitter summary_large_image.
2. sitemap.ts and robots.ts driven by SITE_ENV. Only production on
   ddrakelaw.com is indexable. Previews, custom staging domains and
   *.vercel.app get noindex. Remove the hard-coded noindex in app/layout.tsx.
3. JSON-LD in @graph (escape <):
   - LegalService #firm (telephone +1-615-546-5551, areaServed, knowsAbout;
     address, geo and hours only once confirmed, otherwise Organization)
   - Person about#darren-drake (confirmed properties only)
   - BreadcrumbList on inner pages
   No review, aggregateRating or FAQ markup. Zero errors in Google's Rich
   Results Test.
4. Redirects: next.config.ts redirects() sends the 308s; proxy.ts returns
   410 for WordPress paths, /?s=, feeds, /submit-a-testimonial/, the
   digits-underscore junk pattern and every other "gone" row in Appendix B.
   Never copy the old 41,660-URL junk sitemap. Juvenile rows follow D5.
   Write a redirect test covering every Appendix B row: one request gives
   308 then 200, or a single 410. Test http:// and www in one hop.
5. Rollback companions: prepare (don't switch on) matching 302 rules from
   each new address back to its old page, as Cloudflare rules or old-site
   rules, in docs/rollback-kit.md.
6. Statistics (only if D9 is answered): the Plausible script; events
   intake_start (entry), intake_submit_success (only after acceptance) and
   intake_submit_error (kind). call_click (placement) only if D10 = yes;
   not_found (path, no query) only if approved. Strip query strings from
   /intake/ page views. Add web-vitals for real-visitor speed. No session
   replay, no personal data.
7. Security headers per Appendix A, with the /intake/ nonce through proxy.ts
   and Cache-Control no-store on /intake/ and the API. Run the CSP in
   report-only mode on the preview for one week; switch it on in Phase 5.
8. Write for the firm: docs/old-server-checklist.md (the WordPress security
   check for the server admin), docs/directory-cleanup.md (the listings in
   Section 10, in order, watching for the old names), and an optional
   temporary sitemap of legitimate old addresses for launch day.
```

You check (with the firm): Search Console access, a saved baseline of current search numbers, and who owns the Google Business Profile (and the old "Drake Drake & Frost" listing).

### Phase 5: Quality checks

What happens: the full test pass (accessibility, speed, copy, security) with a report, plus a 30-minute checklist for you to run on real phones.

Trigger: `Run Phase 5 from docs/PROMPT-PLAN.md exactly as written.` (Needs final copy in place.)

```
Read CLAUDE.md, docs/DECISIONS.md and the plan's Phase 5 and Section 9.
This is Phase 5. Branch: phase-5-qa. Act as a senior designer, accessibility
specialist, front-end engineer and technical SEO. Fix what you find, then
report.

1. Automatic checks:
   - axe at 390, 768 and 1440px, with the menu open, and in every form
     state (success, error, retry)
   - 320px reflow
   - Lighthouse CI budgets on every page
   - the placeholder guard (zero left)
   - link check
   - redirect test
   - the button-size and one-cyan-button check
   - all end-to-end tests
2. Hands-on checks:
   - keyboard only
   - 200% zoom
   - reduced motion and forced colors
   - back button
   - double-clicking Send
   - network failure mid-send
   - slow 3G
3. Copy-risk scan of every page, meta description, alt text and JSON-LD
   against the guardrail word list and the Section 9 "not carried over"
   list. Output docs/copy-risk-list.md for Darren: each hit with page,
   sentence and a suggested neutral rewrite. Don't change legal statements
   yourself.
4. Switch the CSP from report-only to enforced once the week is clean, then
   confirm zero console errors on every page.
5. npm audit (fix high and critical). Next.js and React at the latest
   security release.
6. Write docs/real-phone-checklist.md: a 30-minute checklist for Quinn on
   iPhone Safari and Android Chrome, including a basic VoiceOver and
   TalkBack pass, the intake form, the phone link and the menu.
7. docs/test-report.md: every check with pass/fail, and Lighthouse and axe
   numbers per page.
```

You check: run the real-phone checklist (about 30 minutes). Darren signs the Section 9 legal checklist and approves the privacy, accessibility and legal notice text. Darren also checks tncourts.gov for any advertising-rule changes since 2021.

### Phase 6: Final preview and sign-off packet

Trigger: `Run Phase 6 from docs/PROMPT-PLAN.md exactly as written.`

```
Read CLAUDE.md and the plan's Phase 6. This is Phase 6. Branch:
phase-6-release.

1. Publish the final private preview (only if D17 is approved; otherwise
   produce a full screenshot set and a screen recording of the phone flow).
2. docs/sign-off-packet.md: a one-page walkthrough for Darren (what to tap,
   in order), every change since the demo, open items with the default for
   each, and a sign-off block (content, photo, legal checklist, launch
   window D16, staff on phones).
3. Tag the approved version (release tag). Run scripts/archive-site.mjs on
   the final preview for the 2-year archive, and tell me the folder the
   archive owner should copy into firm storage.
```

You check: walk Darren through it on his phone and a computer. Send one test inquiry together, marked "TEST, please delete". Get his written "go."

### Phase 7A: Launch prep (the week before)

Trigger: `Run Phase 7A from docs/PROMPT-PLAN.md exactly as written.`

```
Read CLAUDE.md and the plan's Section 11. This is Phase 7A. Change nothing
live.

1. Write docs/launch-runbook.md with exact clicks for the Cloudflare owner:
   export all Cloudflare settings and screenshot every rule; add
   ddrakelaw.com and www to Vercel and pre-issue HTTPS; which two entries
   change on launch day (apex A and www, DNS-only, TTL 60); and the entries
   that must NOT change (MX, SPF, DKIM, DMARC, Google verification, mail,
   ftp).
2. Confirm with me that a full WordPress backup (files and database) exists
   after the old-server check, and that old form entries were exported.
3. Production settings in Vercel (SITE_ENV=production, SITE_URL,
   destinations), listed by variable name only.
4. Rollback kit: Vercel one-click previous version; saved Cloudflare values
   to restore; the 302 companion rules from Phase 4; rollback triggers
   (inquiries can't be delivered, repeated server errors, more than 5% of
   old addresses failing, firm email affected). Rehearse it on paper with
   me, changing nothing live.
5. Final preview run: the redirect test, axe, form tests and one test
   delivery.
```

### Phase 7B: Launch morning checks

Run this right after the Cloudflare owner switches the two website entries.

Trigger: `Run Phase 7B from docs/PROMPT-PLAN.md exactly as written.`

```
Read CLAUDE.md and docs/launch-runbook.md. This is Phase 7B. The two
website entries now point to Vercel. Against https://ddrakelaw.com:

1. HTTPS on both addresses; http and www reach https://ddrakelaw.com/ in
   one hop.
2. The full redirect test (every Appendix B row) and the junk 410s.
3. sitemap.xml and robots.txt load; production is indexable; previews are
   not.
4. The security headers and CSP are live, with zero console errors.
5. The test inquiry marked "TEST, please delete": tell me when to have the
   named recipient confirm and delete it.
6. Uptime checks green on /, /intake/ (keyword) and /api/intake/health/.
7. Remind me to send a test email in and out of the firm, and to submit
   sitemap.xml in Search Console and remove the old sitemap submissions.
8. If any rollback trigger fires, say so at the top in capitals and give me
   the rollback steps.
9. Run scripts/archive-site.mjs on the live site. Write
   docs/launch-report.md.
```

### After launch: Day 1, 7, 14, 30 and 90

Trigger: `Run the Day N check from docs/PROMPT-PLAN.md.` (replace N with 1, 7, 14, 30 or 90)

```
Read CLAUDE.md and the plan's "After launch" and Section 10 "Measurement".
Run the Day N check against https://ddrakelaw.com and write
docs/reports/day-N.md in plain English.

Day 1-2: the not-found list; intake success and failure counts; bounces;
uptime and errors; old addresses still redirect.
Day 7: Search Console indexing (I'll paste screenshots if you can't read
it); statistics look sensible; remind the Cloudflare owner to raise the two
entries' TTL.
Day 14: one live "TEST, please delete" inquiry at a time agreed with the
named recipient; real-visitor speed data.
Day 30: the first one-page monthly report (visitors and top pages; search
clicks split into Darren-by-name and everything else; Google profile calls,
clicks and directions; intake starts, successes and errors by phone and
desktop; phone taps by placement if D10 = yes; speed; broken links; new
review count only) plus recommended next steps.
Day 90: repeat the search checks. Then give the firm the list of what still
depends on the old WordPress server (mail and ftp addresses, the server
address in SPF, other sites or mailboxes) before it's retired.
```

### Every month

```
Monthly check for ddrakelaw.com. Read CLAUDE.md. Against production:
- Lighthouse on the key pages, axe on every page, the link check and the
  redirect test.
- npm audit, and Next.js/React security releases (apply within days).
- The placeholder and risky-claims checks.
- One live "TEST, please delete" inquiry at a time agreed with the named
  recipient.
- The one-page monthly report.
Fix what's safe on a branch and list anything that needs Darren. Run the
archive script if anything shipped. Every 12 months, and whenever Tennessee
law changes, remind me that Darren re-reviews each practice page and the
"Reviewed on" date is updated.
```

## Part 6: Optional module: advertising pixels (only with Darren's written OK)

Darren's plan uses Plausible, which says it sets no cookies, and no ad pixels, so a cookie banner is likely unnecessary (the plan marks this unverified). If Darren later wants Meta, TikTok or Google ad measurement, record his written OK in `docs/DECISIONS.md` first, then run this.

Trigger: `Run the optional pixels module from docs/PROMPT-PLAN.md.`

```
Read CLAUDE.md and docs/DECISIONS.md. Stop unless Darren's written OK for
advertising pixels is recorded there, naming which ones.

1. Build a Signal-styled consent banner: Accept all, Reject non-essential
   and Choose, equally prominent. Categories: Necessary and Marketing
   (Plausible stays on; it uses no cookies). Marketing is off until Accept.
   Global Privacy Control is honored. A "Cookie settings" link in the footer.
   Google Consent Mode v2 defaults with ad_user_data and ad_personalization
   denied unless Darren runs Google Ads.
2. Load the approved pixels only after Marketing consent, and NEVER on
   /intake/ or /api/*. No advanced matching, and no form values in any
   event. The pixels count visits and taps on "Start your intake" only.
3. Update the CSP for those hosts only, the privacy notice, and the vendor
   list.
4. Playwright tests: no pixel requests before Accept, after Reject, on
   /intake/, or with GPC on.
```

## Part 7: Reusing this plan for another website

1. Copy this file into the new project's `docs/` folder.
2. Replace Part 3 (site profile) with the new site's facts, stack, design, intake and statistics choice.
3. Adjust Part 4 (guardrails): keep the Never and Always lists; change the file names under "What wins" to the new project's plan and brand guide.
4. Phase 4: if there is no old site, delete the redirect and rollback-companion steps. If there is one, build its redirect map first.
5. Statistics: cookie-free statistics mean no banner. Ad pixels mean running Part 6 (or the quinnrodriguezlegal.com Phases 7–8 pattern) before the pixels go in.
6. Keep Phase 0's safety net and the archive script on every site. For a lawyer's site, keep the Tennessee RPC 7.1 rules: truthful claims, a responsible lawyer's name and contact information, and 2-year copies of every version.

## Part 8: What's waiting on Darren (from his plan)

| Decision | Unlocks |
|---|---|
| D1 Leave WordPress (keep Next.js on Vercel) | Phase 2 |
| D2 and D3 Photo approval and About crop | Photo going live; Phase 1 sign-off |
| D4 and D5 Who writes practice pages; Juvenile page | Phase 2 copy |
| D7 and D8 Intake destination; named recipients and retention | Phase 3 |
| D9 and D10 Plausible; counting phone taps | Phase 4 statistics |
| D13 Firm-owned accounts (GitHub organization, Vercel, Postmark and others) | Phases 1–3 |
| D16 Launch window | Phase 7 |
| D17 Written OK for private online previews | Preview links in every phase |

Sources: Darren Drake website build and launch plan (September 24, 2026), account-setup-guide.md, and the quinnrodriguezlegal.com Website Upgrade Prompt Plan (Rev. 1, September 25, 2026).
