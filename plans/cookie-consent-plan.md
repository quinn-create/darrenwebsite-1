# Cookie consent and ad measurement: what was built

Built 25 September 2026 at Quinn's request ("only cookie and other ones"), after confirming that Darren runs Google and Facebook/Instagram ads.

It's adapted from the consent plan Quinn supplied. That plan was written for a different site (quinnrodriguezlegal.com: other colours, page names, CMS and host, and a privacy contact email). This file records what was actually built here and why it differs.

## What it does

| | |
|---|---|
| **Tags supported** | Google Analytics 4 (statistics), Google Ads conversion tracking and the Meta Pixel (advertising) |
| **When they load** | Only after the visitor turns that category on. Nothing from Google or Meta loads before a choice. |
| **When there's a banner** | Only once at least one ID is set in Vercel (`site/.env.example`). With no IDs, which is how the site stands today, there's no banner, no footer cookie links and no tracking code. The privacy notice keeps saying the site uses no tracking cookies. |
| **Banner** | "Accept all", "Reject non-essential" and "Manage choices", styled identically. It sits above the phone call bar and never covers it or shifts the page. It never takes focus, and closing the settings never accepts. |
| **Footer** | "Cookie settings" and "Do Not Sell or Share My Personal Information". Both open the settings; the second goes straight to the advertising choice. |
| **Global Privacy Control** | Advertising stays off, and the banner isn't shown. Even "Accept all" can't turn advertising on while the browser sends the signal. |
| **Choice stored** | The first-party cookie `dd_consent` holds the choice (statistics on/off, advertising on/off, GPC, date) for 182 days. Bump `CONSENT_REVISION` in `site/lib/consent.ts` to ask everyone again. |
| **Turning a category off** | Deletes its cookies (`_ga*`, `_gid`; or `_gcl_*`, `_fbp`, `_fbc`), updates Google's consent state and revokes Meta's. |
| **Conversions** | "Form sent" (only after the server accepts it) and "phone number tapped". GA4 gets `generate_lead` and `phone_tap`, Google Ads gets its two conversion labels, and Meta gets `Lead` and `Contact`. Only the event name is sent. |

## Safeguards for a criminal-defense site
These go further than the supplied plan, because page visits here can reveal a possible criminal charge. A test covers each one (`site/tests/consent.mjs`).
1. **Nothing from the form reaches Google or Meta:** no names, numbers, emails, topics or message text. Meta's automatic form scanning ("autoConfig") and advanced matching are switched off before the pixel starts.
2. **No details in page addresses:** `?topic=dui-dwi` is removed from the address bar before any tag can read it. Google also receives addresses without query strings. The page itself (for example `/practice-areas/dui-dwi/`) is still reported, and the privacy notice says so.
3. **No remarketing:** Google is always told `ad_personalization: denied` and `allow_ad_personalization_signals: false`, and GA4 Google signals are off. Google's personalised-advertising policy doesn't allow advertiser-built audiences for crime-related legal services anyway.
4. **Consent Mode v2, basic mode:** the default is "denied" for everything, and gtag.js isn't downloaded until something is granted.

## Deliberately left out
Recommended against in the research (25 Sep 2026). Each would need Darren's explicit decision, and ideally ethics counsel.
- **Retargeting audiences:** Google prohibits them for this category; Meta flags sensitive-topic sites.
- **Sending enquirers' details to ad platforms,** such as Google's enhanced conversions or Meta's Conversions API.
- **Session recording, heatmaps, chat widgets and chatbots,** which are the main targets of wiretap lawsuits.
- **Visitor-identification tools.**
- **Call-tracking numbers.** These need a CallRail (or similar) account. Calls must never be recorded.

## How it differs from the supplied plan
- **No vanilla-cookieconsent package.** The banner and tags are about 450 lines of the site's own code. They match the site's design in both themes and pass its accessibility checks. While no ID is set, the only code that loads is the footer-button helper, a few hundred bytes. Page totals measured by `npm run speed` are unchanged: 159 KB, and 173 KB on Contact. The banner itself loads in its own chunk, only when an ID is set.
- **Names and places:** the cookie is `dd_consent` (not `qr_consent`), the page is `/privacy/` (not `/privacy-policy`), and the host is Vercel.
- **Privacy contact is phone and post**, as on the rest of the notice. Darren chose not to publish an email address.
- **The privacy notice lists only the tags that are actually configured,** so it never describes something the site doesn't do.
- **Tests use the site's own Playwright setup** (`npm run test:consent`) instead of adding `@playwright/test`.

## Files
- `site/lib/tracking.ts`: the IDs (from `NEXT_PUBLIC_*` settings, validated).
- `site/lib/consent.ts`: reading and writing the choice, GPC, and cookie clean-up.
- `site/lib/consent-open.ts`: the tiny "open cookie settings" helper used by the buttons.
- `site/components/consent/Consent.tsx`: the banner, the settings dialog, and loading the tags.
- `site/components/consent/ConsentLoader.tsx`: loads that code in its own chunk, in the browser only (React `lazy`).
- `site/components/consent/CookieLinks.tsx`: the footer and privacy-page buttons.
- `site/app/privacy/page.tsx`: the "Cookies and advertising measurement" section.
- `site/tests/consent.mjs`: 13 checks against a test build with dummy IDs (`.next-consent/`, not committed). Requests to Google and Meta are intercepted.

## Rules for later
- **Never add a tag, pixel or embed any other way,** including YouTube, Calendly, chat, review widgets or Google Tag Manager. Route it through `Consent.tsx` under the right category, add its cookies to the clean-up in `lib/consent.ts`, add a row to the privacy notice, bump `CONSENT_REVISION`, and extend `tests/consent.mjs`.
- **Run `npm run test:consent` before any deploy that changes tracking.**
- **Re-review the privacy notice** every 6 months, and whenever a tag changes.
