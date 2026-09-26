# Decision log: ddrakelaw.com (D1–D17)

The record of Darren's answers. Claude acts only on decisions recorded here as **answered** (CLAUDE.md). The decisions and their recommended defaults come from the build plan, Section 3 (`plans/signal-website-plan.md`).

**How to record an answer:** tell the session in one line, for example "Darren decided D9: Plausible, yes." It updates this table with the date and where the written OK is filed.

**About "where the written OK is filed":** Darren's 24 September 2026 answers (and his 26 September Phase 1 approval, in `answers-2026-09-26.md`) were given in person, relayed by Quinn in the Claude Code session, and written up in `plans/for-darren/answers-2026-09-24.md`. That file is the record. No signed copy is filed yet. If the firm wants signatures (recommended for D2, the photo), file the signed page and add its location here.

| # | Decision | Recommended default (plan) | Status | Darren's answer | Date | Where the written OK is filed |
|---|---|---|---|---|---|---|
| D1 | Leave WordPress for the new platform | (a) Keep the Next.js site, hosted on Vercel | **Answered** | Yes, leave WordPress. The old server stays untouched for 90 days, then is retired. | 24 Sep 2026 | `plans/for-darren/answers-2026-09-24.md` |
| D2 | Approve the edited photo, and where it's used | Approve for the site, link previews, Google profile and directories | **Answered** | Approved for all uses: website, Google Business Profile and link previews. | 24 Sep 2026 | `answers-2026-09-24.md` (photo paperwork closed by Quinn, 26 Sep 2026; `answers-2026-09-26.md`) |
| D3 | About-page photo shape | (a) The same upright crop, from the genuine part of the photo | **Answered** | (a), the upright crop, as shown in the Phase 1 design check | 26 Sep 2026 | `plans/for-darren/answers-2026-09-26.md` |
| D4 | Who writes the practice pages | Claude drafts general wording; Darren writes or approves every statement about Tennessee law | **Answered** | Claude drafted; Darren approved all five practice pages and the home FAQs as written. | 24 Sep 2026 | `answers-2026-09-24.md` ("Practice-page wording") |
| D5 | Juvenile defense | (b) Point the old page to Criminal Defense until Darren answers | **Answered** | Juvenile cases are not taken. The old page redirects to Criminal Defense. | 24 Sep 2026 | `answers-2026-09-24.md` |
| D6 | Old testimonials pages; reviews | Testimonials → About; remove "Submit a testimonial"; no reviews until a written policy | **Answered** (see conflict C4) | Show the live Google star rating and review count, with a link to Google. No quotes. (Old pages redirect or return "gone" as the plan says.) | 24 Sep 2026 | `answers-2026-09-24.md` |
| D7 | Intake destination | Firm's own Clio Grow if it has one; otherwise email with a backup | **Answered** | The firm uses MyCase (8am). Until MyCase can take website leads, inquiries go by email (**Resend**, chosen 26 Sep 2026; Postmark was the first choice), with a Telegram copy for Kelly. | 24 and 26 Sep 2026 | `answers-2026-09-24.md`; `answers-2026-09-26.md` |
| D8 | Who receives inquiries; how long they're kept | At least two named staff, each with two-step login; the firm sets retention | **Answered** | Recipients: Kelly Pittman, with Darren as backup (personal Gmail addresses, the firm's choice). Retention: **10 years** from the date sent, then deleted; a person can ask by phone for theirs to be deleted sooner (26 Sep 2026). | 24 and 26 Sep 2026 | `answers-2026-09-24.md`; `answers-2026-09-26.md` |
| D9 | Visitor statistics tool | Plausible (cookie-free, no banner) | **Answered** (C5) | **Cloudflare Web Analytics** (cookie-free, no banner, excluding the Contact page); Microsoft Clarity declined (26 Sep 2026). The built cookie banner stays (GA4, Google Ads, Meta Pixel, off until IDs are set), with **no tag on the Contact/form page**. Darren's written OK naming each tag is still needed before any ID is entered. | 26 Sep 2026 | `answers-2026-09-26.md` |
| D10 | Count taps on the phone number | Yes, with Darren's written OK | Open | — | — | — |
| D11 | Photo in "Meet Darren" on Home | The facts card at launch; a licensed photo later | Open (default in use) | — | — | The "At a glance" facts card went in on 25 Sep 2026 (`site/app/page.tsx`) |
| D12 | Optional ethics review (Tennessee BPR Ethics Counsel) | Ask, if Darren is comfortable | Open | — | — | — |
| D13 | Who owns and pays for the accounts | The firm owns every account, with two-step login and a named billing owner; move the code to a firm GitHub organization | **Partly answered** | Darren sets up and pays for the accounts. Still open: a named owner for each account, and moving the code repository to a firm-owned GitHub organization. | 24 Sep 2026 | `answers-2026-09-24.md` |
| D14 | How edits happen after launch | Ask Claude, with a private preview first | Open (after launch) | — | — | — |
| D15 | Old WordPress server | Keep it 90 days, then retire | **Answered** | 90 days, untouched, then retired (given with D1). | 24 Sep 2026 | `answers-2026-09-24.md` |
| D16 | Launch window | A quiet weekday morning with staff on the phones | Open | — | — | — |
| D17 | Private online previews | (a) Private previews on the firm's own Vercel account, behind a login | **Answered** | Private previews behind a login are allowed, on accounts Darren sets up and pays for. **Hosting changed to Cloudflare (free plan)** on 26 Sep 2026 (conflict C8); previews would sit behind Cloudflare Access. (Nothing is deployed yet: the firm's Vercel account doesn't exist yet.) | 24 Sep 2026 | `answers-2026-09-24.md` |

## Other answers Darren gave (not numbered in the plan)

| Topic | Answer | Date | Record |
|---|---|---|---|
| Business name | Darren Drake Law PLLC | 24 Sep 2026 | `answers-2026-09-24.md` |
| Office address | 138 S. Cannon Ave, Murfreesboro, TN 37129 (shown in full; clients visit) | 24 Sep 2026 | same |
| Hours | Monday–Friday, 8am–5pm | 24 Sep 2026 | same |
| Public email | None shown | 24 Sep 2026 | same |
| Service area | Murfreesboro, Rutherford County and Smyrna; Rutherford County cases only | 24 Sep 2026 | same |
| Callback line | "We generally return calls within a day." (see conflict C3) | 24 Sep 2026 | same |
| "Responsible attorney" line on the legal notice | Leave it off; show the firm's name, address and phone instead | 24 Sep 2026 | same |
| Privacy notice | Approved as drafted, including the cookie section | 26 Sep 2026 | `answers-2026-09-26.md` |
| Photo paperwork | Quinn: approved, no further action (no signed note or names filed) | 26 Sep 2026 | `answers-2026-09-26.md` |
| Phase 1 design | Approved: the look of the five page types, the headline and supporting line, and the link-preview image (`printouts/Phase-1-Design-Lock.pdf`) | 26 Sep 2026 | `answers-2026-09-26.md` |
| About-page facts | Navy, education, admissions, community and memberships as listed | 24 Sep 2026 | same |

## Still open (not a numbered decision)
- **MyCase:** whether the firm's plan can receive website leads directly.
- **Live Google rating (D6):** needs the firm's Google Business Profile, a Google Maps key and Darren's ethics review.

## Conflicts to resolve

Later decisions differ from the plan or from `docs/PROMPT-PLAN.md`. Nothing has been changed to "fix" them. Quinn and Darren decide.

| # | Conflict | What the site does now | Source of the later decision | Suggested resolution |
|---|---|---|---|---|
| C1 | Main button text: the plan and prompt plan say "Start your intake"; the form is at /intake/ | "Contact us", going to /contact/; /intake/ redirects there | Quinn's request, 24 Sep 2026 (session) | **Resolved 26 Sep 2026:** keep "Contact us" on /contact/ (Quinn, going with the recommendation; `answers-2026-09-26.md`) |
| C2 | Practice areas: the prompt plan lists three | Five: First-Time Offenders, Criminal Defense, DUI/DWI, Domestic Assault, Expungement | Quinn's request, and Darren's approval of all five pages, 24 Sep 2026 | **Resolved 26 Sep 2026:** five practice areas stand; Darren approved all five pages (`answers-2026-09-26.md`) |
| C3 | The guardrails bar response-time promises | "We generally return calls within a day." is on the site | Darren approved it, 24 Sep 2026 | **Resolved 26 Sep 2026:** softened to "The office will contact you about next steps." and the old line retired (`answers-2026-09-26.md`) |
| C4 | Reviews: the prompt plan says none until a written policy | Nothing built yet; D6 asks for a live Google rating | D6 answer, 24 Sep 2026 | **Decided 26 Sep 2026:** a written review policy first (`plans/for-darren/review-policy-draft.md`), then the rating; needs Darren's OK, his Google Business Profile and a Maps key (`answers-2026-09-26.md`) |
| C5 | Statistics: the plan's default is Plausible with no pixels; the guardrails forbid pixels on the intake page | A cookie banner with GA4, Google Ads and the Meta Pixel is built but **switched off** (no IDs set). If switched on, the tags could load on /contact/, which holds the form, after consent. | Quinn's request, 25 Sep 2026 (session); Darren's written OK not recorded | **Decided 26 Sep 2026:** tags allowed on every page except the Contact/form page (built and tested); Darren's written OK naming each tag still needed before IDs are entered (`answers-2026-09-26.md`) |
| C6 | Prompt plan: one branch per phase | All work is on `claude/sleepy-clarke-wjlh48` with one draft pull request | This cloud session may only push to its assigned branch | Keep one branch, or ask for per-phase branches to be allowed |
| C7 | Link-preview wording: the plan (Section 5 and Appendix C, A3) and the Phase 1 prompt say "Murfreesboro & Middle Tennessee", with the alt text "…Murfreesboro and Middle Tennessee" | The image says "Murfreesboro, Rutherford County & Smyrna"; the alt text is "Darren Drake, attorney at law, Murfreesboro and Rutherford County, Tennessee" | Darren's service-area answer, 24 Sep 2026: Rutherford County cases only (`answers-2026-09-24.md`). "Middle Tennessee" would be an unconfirmed claim. | **Resolved 26 Sep 2026:** Darren approved the link preview with the confirmed wording (`answers-2026-09-26.md`) |
| C8 | Hosting: the plan and D17 say the firm's Vercel account | Moving to Cloudflare (free Workers plan), where the domain already is | Quinn, 26 Sep 2026 (`answers-2026-09-26.md`) | **Decided; built 26 Sep 2026.** 2.86 MB of the 3 MB free-plan limit (checked in CI); all e2e tests pass in Cloudflare's runtime. The form's PDF takes 4–8 ms of the 10 ms free-plan limit, so the $5/month plan is the fallback. Setup: `plans/for-darren/cloudflare-setup.md` |
