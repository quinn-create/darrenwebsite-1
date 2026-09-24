# Intake delivery and hosting/launch plan: Darren Drake "Signal" site

Research only. No repo files were changed and nothing on ddrakelaw.com was touched. The only things done against the live site were public DNS lookups and anonymous GET requests on 2026-09-24. Files reviewed:
- `/home/user/darrenwebsite-1/site/lib/intake-delivery.ts`
- `/home/user/darrenwebsite-1/site/app/api/intake/route.ts`
- `/home/user/darrenwebsite-1/site/README.md`
- `/home/user/darrenwebsite-1/site/HANDOFF.md`
- `/home/user/darrenwebsite-1/site/next.config.ts`
- `/home/user/darrenwebsite-1/site/app/intake/page.tsx`
- `/home/user/darrenwebsite-1/Darren_Drake_AI_Brand_Guidelines.md` (shared sections and the intake specification)

---

## 0. What exists today

### In the repo
- **`deliver()` adapter.** There are three modes:
  - Unset means demo mode.
  - `local-test` writes to a JSONL file.
  - An `https://` value POSTs JSON to a webhook with an optional bearer token. It only counts as success on a 2xx reply, which meets the guidelines' "durable acceptance" rule.
- **Gap: the webhook sends raw `Inquiry` JSON.** None of the destinations below accept that shape directly, so each one needs its own adapter.
- **Gap: `local-test` won't work on serverless hosts.** On Vercel the filesystem is ephemeral. Production should refuse this mode.
- **Gap: rate limiting and dedupe are in-memory `Map`s.** They are per instance and are lost on cold starts.
- **Gap: IP detection.** The IP comes from the first `x-forwarded-for` entry. That is safe on Vercel, which overwrites the header ([Vercel request headers](https://vercel.com/docs/headers/request-headers)), but it can be spoofed behind other proxies.
- **Gap: honeypot order.** The honeypot is checked after validation, so bots get field-level error hints. It should be checked first.
- **Gap: no body-size cap and no `Origin` check** before `request.json()`.
- **Dynamic routes.** `/intake` is `force-dynamic` and the API is dynamic. Everything else is static, which matters for the CSP choice in section 5.

### About the live site (public DNS and HTTP, observed 2026-09-24)

| Finding | Why it matters |
|---|---|
| DNS is on **Cloudflare** (`nora`/`plato.ns.cloudflare.com`). Apex, `www`, `mail` and `ftp` are **proxied** (Cloudflare anycast IPs, TTL 300). | Cutover is a record edit in Cloudflare. No nameserver change is needed. |
| **MX = Google Workspace** (`aspmx.l.google.com` + 4 alternates) | Must not be touched. |
| SPF = `v=spf1 a mx ip4:172.234.24.142 ~all` | It has no `include:_spf.google.com`. The `a` mechanism will start matching the new host's IP after cutover. No `google._domainkey` DKIM record was found (a custom selector is possible; unverified). Fix this in a **separate** email change, not on launch day. |
| DMARC = `p=none; pct=0`, with reports going to an outside personal Gmail address (see the `_dmarc` TXT record) | Confirm who that is. Move reports to a firm mailbox later. |
| A `google-site-verification` TXT record exists | Someone already owns a Search Console property. Find the owner and keep this record. |
| The site runs WordPress on **CyberPanel/OpenLiteSpeed** (a self-managed VPS; the SPF IP suggests the origin), with Yoast. The contact form is **Gravity Forms with Cloudflare Turnstile**. | The firm, or its web person, probably already has a Cloudflare account with Turnstile set up. Past inquiries are stored in the WordPress database, so they need an export and retention decision before shutdown. |
| **No security headers** (no HSTS, CSP, X-Frame-Options and so on) | Baseline for section 5. |
| **Suspicious `/sitemap.xml`:** a static 9.2 MB file with **41,660 random-string URLs**, all dated 2016-09-05. The file was last modified 13 Feb 2025. Those URLs now return 404. Yoast's real sitemap is `/sitemap_index.xml`. | This looks like leftovers from an SEO-spam injection (**unverified**). Don't migrate it. Check Search Console for **Security issues and Manual actions**. Serve 410 for that URL pattern. |
| Canonical host is `https://ddrakelaw.com`. `www` and `http` redirect there with a 301. | Keep the apex as canonical on the new host. |

Old URL inventory (Yoast `page-sitemap.xml`, navigation, and probes):
- `/`, `/areas-of-practice/`
- `…/criminaldefense/`, `…/dui/`, `…/expungement/`, `…/juvenile-defense/`
- `/contact/`, `/testimonials/`, `/submit-a-testimonial/`, `/blog/` (no posts)
- 17 attachment pages (for example `/criminal-defense/darren_drake/` and `/areas-of-practice/divorce-2/`)
- `/criminal-defense/`, which already 301s to `/`

**Juvenile defense** and **testimonials** fall outside the confirmed facts, so the firm has to decide what happens to those URLs.

---

## 1. Where intake inquiries go

### Comparison

| | (a) **Clio Grow Lead Inbox API** | (b) **Transactional email** to a firm inbox | (c) **Lawmatics** (other legal CRM) | (d) **Secure storage + PII-free notification** |
|---|---|---|---|---|
| **How it works** | Server POSTs JSON to `https://grow.clio.com/inbox_leads` with `Content-Type` and `Accepts: application/json`. The body is `{inbox_lead_token, inbox_lead:{from_first*, from_last*, from_email, from_phone, from_message*, referring_url*, from_source*}}`. It returns **201** on success, 401 for a bad token and 422 for missing fields ([Clio docs](https://docs.developers.clio.com/guides/clio-grow/lead-inbox-api/)). Leads land in the Grow Lead Inbox. Each user can turn on "Email me when a new lead is added to the inbox" ([Clio help](https://support.clio.com/hc/en-us/articles/360009999914-How-to-Turn-On-Off-Lead-Inbox-Notifications-in-Clio-Grow)). | Server calls the provider API. The inquiry arrives as a plain-text email in a dedicated Google Workspace mailbox. | Recreate the form as a matter-type Custom Form in Lawmatics and use its Forms API. Support has to enable Developer Settings first ([Lawmatics help](https://help.lawmatics.com/en/articles/10699870-connecting-your-webform-to-lawmatics-via-api), [Open API](https://help.lawmatics.com/en/articles/10699983-lawmatics-open-api)). Endpoint details sit behind their API docs (**not verified**). | Encrypted-at-rest database (for example Postgres or Upstash) plus an email that says "new inquiry, ref X" with no personal details. Staff read it in a login-protected admin page. |
| **Cost** | $0 extra **if the firm already has Grow**. Clio's pricing page blocked our fetch. Third-party sources give conflicting figures: included in Complete or bundles, or $49–79/user/mo standalone, possibly with an onboarding fee ([aimadefor](https://www.aimadefor.com/blog/clio-pricing-2026/), [costbench](https://costbench.com/software/ai-legal-tools/clio/)). **Unverified.** | See the provider table below. Roughly **$0–$22/mo**. | No public prices. Minimum of 3 users ([Lawmatics pricing](https://www.lawmatics.com/pricing)). Third-party figure is about $199–299/mo ([aiforlawfirms](https://aiforlawfirms.org/lawmatics-crm-review/); unverified). | $0–25/mo in infrastructure, plus a lot of build time. |
| **Confidentiality** | Data goes straight into the firm's existing practice-management vendor. That fits Tennessee's reasonable-care standard for cloud storage ([TN FEO 2015-F-159](https://www.tbpr.org/ethic_opinions/2015-f-159)). Only 7 fields exist, so the matter type, county, court date and message must go into `from_message`. The token travels in the request body, so it must stay server-side. | Stored in the provider for its retention window, then in Gmail. TLS in transit. [ABA 477R](https://www.americanbar.org/products/ecd/chapter/348777154/) allows risk-based use of email. The form's "don't include sensitive details" copy and the 1,000-character cap reduce exposure. Use a neutral subject line so no name or matter shows in lock-screen previews. | A new vendor holding prospective-client data. It needs vendor diligence. | Smallest email exposure, but the firm now runs a database that holds prospective-client data. It needs access control, backups and deletion. |
| **Reliability** | A 201 is a real "durable acceptance" signal. No published rate limits for this endpoint. A Grow outage means lost leads unless there's a fallback. | The API returns 200 once the message is queued (accepted for delivery, not yet in the inbox), so bounces need monitoring. Postmark and Resend are mature providers. | Similar to (a). | The one we'd build ourselves. It's only as good as our code and monitoring. |
| **Effort in the adapter** | Small: one `clio-grow` adapter (about 40 lines). Map `fullName` to first and last name (for a single-word name, put a placeholder in `from_last`). Always send a non-empty `from_message`. Use `referring_url=https://ddrakelaw.com/intake` and `from_source="ddrakelaw.com intake form"`. | Small: one `email` adapter per provider. Plain text only (no HTML injection risk). Reply-To set only when an email was given. Include the inquiry ID. | Medium. Plus buying a new system. | Large: schema, encryption, auth, admin UI, retention jobs. |
| **Firm provides** | Confirmation that the subscription includes Grow. The **Inbox Token**, found in Grow under Settings > Integrations ([Clio help](https://support.clio.com/hc/en-us/articles/360045337313-How-to-Connect-Contact-Form-7-in-WordPress-to-Clio-Grow-Inbox-using-the-Grow-Lead-Inbox-API)), entered directly into the host's secret store. Which staff turn on notifications. | The intake mailbox address (for example `intake@`) and who watches it. Approval to add the provider's DNS records. A provider account owned by the firm. | Contract and users. | A decision to own a database. |

Other notes on (a):
- The Clio **Manage** API (the kind the firm's Clio-connected tool uses) could create contacts and tasks. It requires OAuth and is rate-limited to about 50 requests/min ([Clio rate limits](https://docs.developers.clio.com/api-docs/clio-manage/rate-limits/)). It would also put unscreened prospects into the system of record. **Not recommended.**
- Clio's hosted "Public Intake Form" can be added to a website ([Clio help](https://support.clio.com/hc/en-us/articles/360010336293-Can-Clio-Grow-s-Client-Intake-Forms-be-Embedded-on-my-Website-)). It would replace the tested, accessible Signal form, so it's only an emergency fallback.

Other note on (d): a free variant is a Google Apps Script web app that writes to a restricted Sheet in the firm's Workspace. Apps Script doesn't expose request headers, so the secret would have to travel in the body (**unverified**). It's another thing to maintain, so it's not recommended.

### Email providers for option (b)

| Provider | Price | Retention of message content | DNS needed (doesn't touch MX or root SPF) | Notes |
|---|---|---|---|---|
| **Postmark** | Free: 100 emails/mo, meant for testing. Basic $15, Pro $16.50 for 10k emails ([pricing](https://postmarkapp.com/pricing)). | 45 days by default. A Retention Add-on (Pro/Platform, from $5/mo) cuts this to **7 days** ([support](https://postmarkapp.com/support/article/how-does-the-retention-add-on-work)). | DKIM TXT plus a Return-Path CNAME to `pm.mtasv.net`. SPF passes through the Return-Path, so the root SPF record doesn't change ([support](https://postmarkapp.com/support/article/how-do-i-set-up-spf-for-postmark)). | Transactional only. Best retention control. |
| **Resend** | Free: 3,000/mo, capped at 100/day. Pro $20 ([pricing](https://resend.com/pricing)). | Fixed at 30 days on Free, Pro and Scale ([GDPR page](https://resend.com/security/gdpr)). | DKIM and SPF on a sending subdomain. | Good free fallback. |
| SendGrid | Free plan retired 27 May 2025. Essentials from $19.95 ([sendx](https://www.sendx.io/blog/sendgrid-pricing); third-party). | Not checked | DKIM CNAMEs | No advantage here. |
| AWS SES | $0.10 per 1,000 à la carte, or the new plans from $0.16 per 1,000 ([AWS](https://aws.amazon.com/ses/pricing/)) | Not verified | DKIM CNAMEs | Cheapest, but needs an AWS account, sandbox exit and IAM. Too heavy for this firm. |

### Recommendation

1. **If the Clio subscription includes Grow:** use the **Clio Grow Lead Inbox as primary**. Use **Postmark email to the intake mailbox as fallback**, sent only if Grow returns an error or times out. Show success if either path accepts. If both fail, keep the values, offer retry and show the phone link (already built).
2. **If there's no Grow:** use **Postmark as primary**, sending to a dedicated Workspace mailbox. Use **Resend as fallback**, which runs on separate infrastructure, to the same mailbox. Don't buy Grow or Lawmatics just for the website.
3. Don't build option (d) now.

### Adapter design (for the build)
- **Environment variables:**
  - `INTAKE_PRIMARY=clio-grow|postmark`, `INTAKE_FALLBACK=postmark|resend|none`
  - `CLIO_GROW_INBOX_TOKEN`, `CLIO_GROW_REGION=us`
  - `POSTMARK_SERVER_TOKEN`, `RESEND_API_KEY`
  - `INTAKE_EMAIL_TO`, `INTAKE_EMAIL_FROM`
  - `INTAKE_ALERT_TO` (for a PII-free "fallback used / delivery failed" alert)
- **What counts as acceptance:** Clio `201`; Postmark `200` with `ErrorCode: 0` (unverified detail); Resend `200` with an `id`.
- **Timeouts:** about 8 s for primary and 6 s for fallback, which keeps the whole request under 15 s.
- **Dedupe and duplicates:** a timeout doesn't prove non-delivery, so a duplicate is possible. That's acceptable because the inquiry ID is in the message and in `from_message`.
- **Safe test:** use a Postmark test server/token with no live inquiries (the guidelines require this). For Clio, run one supervised lead clearly marked "TEST – delete" and delete it afterwards. Clio doesn't document a sandbox for this endpoint (**unverified**).
- **Production guard:** `deliver()` must refuse `local-test` when `VERCEL_ENV=production`.

---

## 2. Spam and abuse protection

Several layers, all invisible to most visitors, all compatible with WCAG 2.2 AA:

1. **Cheap server checks, before anything else:**
   - Reject bodies over about 16 KB before parsing.
   - Require `Content-Type: application/json`.
   - Require `Origin`/`Sec-Fetch-Site` to be same-origin.
   - Check the honeypot **before** validation.
2. **Cloudflare Turnstile.**
   - It's free: 20 widgets on the free plan ([plans](https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/turnstile/plans.mdx)). Cloudflare states it is WCAG 2.2 AA ([docs](https://developers.cloudflare.com/turnstile/)).
   - **Use managed mode with `execution:"execute"` and `appearance:"interaction-only"`** rather than pure Invisible mode ([widget config](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/widget-configurations/)). Most people see nothing, and a checkbox appears only when Cloudflare needs one. Pure Invisible mode has no visible way to recover ([modes](https://developers.cloudflare.com/turnstile/concepts/widget/)).
   - Run `turnstile.execute()` on submit, while "Sending…" shows.
   - The server calls `siteverify` with the secret, the token and an `idempotency_key`. Tokens are single-use and expire in 300 s ([server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)). Also check `hostname` and `action`.
   - **If the token is invalid:** return a retryable error that keeps the values and shows the phone link.
   - **If `siteverify` itself is unreachable:** fail open, but apply a tighter rate limit and flag the inquiry "unverified". A real lead shouldn't be lost because of a Cloudflare outage.
   - CSP must allow `https://challenges.cloudflare.com` in `script-src` and `frame-src` ([CSP ref](https://developers.cloudflare.com/turnstile/reference/content-security-policy/)).
   - The firm probably already has Turnstile keys from the WordPress form. Create a new widget for the new hostname anyway.
3. **Shared-store rate limiting:**
   - Use **Upstash Redis** with `@upstash/ratelimit`, set up through the Vercel Marketplace. Vercel KV no longer exists; stores were moved to Upstash in December 2024 ([Vercel Redis](https://vercel.com/docs/redis)).
   - The free tier (500K commands/mo, 256 MB) is ample ([Upstash pricing](https://upstash.com/docs/redis/overall/pricing)).
   - Suggested limits: 5 per 10 min and 20 per day per IP, plus a global breaker of about 100/hour that triggers an alert.
   - Store **HMAC-hashed IPs** with a TTL, because an IP address is personal data.
   - Optional outer layer: a Vercel WAF rate-limit rule on `/api/intake`, now available on Hobby and Pro ([changelog](https://vercel.com/changelog/vercel-waf-rate-limiting-now-generally-available)).
4. **Server-side dedupe:**
   - The client creates a `submissionId` (UUID) when the form mounts and reuses it for retries.
   - The server runs `SET dedupe:{hmac(id)} pending NX EX 86400`:
     - If it already exists as `accepted`, return the original ID. This is truthful because delivery did happen.
     - If it exists as `pending`, return 409 "still sending".
     - On success, set it to `accepted:{inquiryId}`. On failure, delete it.
   - Keep a secondary content-HMAC key for 10 minutes to catch double-posts from different tabs.
   - This also fixes the case where a network failure is followed by a retry.

---

## 3. Hosting

| Option | Cost/mo | Fit for Next.js 16 | Private preview | Domain and SSL | Secrets | Logs and alerts | Rollback and backups |
|---|---|---|---|---|---|---|---|
| **Vercel Pro** (recommended) | $20/seat, including $20 usage credit ([pricing](https://vercel.com/pricing)). **Hobby is non-commercial only** ([Hobby](https://vercel.com/docs/plans/hobby)). | Built by Next.js's maker. No adapter needed. | Vercel Authentication and **Shareable Links** included. Password Protection costs **$20/mo per project** ([pricing table](https://vercel.com/docs/deployment-protection/usage-and-pricing)). Previews automatically get `X-Robots-Tag: noindex`, **except on custom domains** ([KB](https://vercel.com/kb/guide/are-vercel-preview-deployment-indexed-by-search-engines)). | Automatic SSL. **Certificates can be pre-issued before DNS moves** ([docs](https://vercel.com/docs/domains/pre-generating-ssl-certs)). | Encrypted environment variables. "Sensitive" type is write-only ([docs](https://vercel.com/docs/environment-variables/sensitive-environment-variables)). | Runtime logs kept 1 day on Pro. Log drains available. | Instant Rollback to any earlier deployment on Pro ([docs](https://vercel.com/docs/instant-rollback)). |
| Netlify Pro | $20 (credit-based) ([pricing](https://www.netlify.com/pricing/)) | Supported through the OpenNext adapter ([changelog](https://www.netlify.com/changelog/next-js-16-deploy-on-netlify/)) | Site-wide password on Pro ([docs](https://docs.netlify.com/manage/security/secure-access-to-sites/password-protection/)) | Automatic | Yes | 1-day observability | Deploy rollback |
| Cloudflare Workers | $0, or $5 on the paid plan ([pricing](https://developers.cloudflare.com/workers/platform/pricing/)) | Cloudflare now recommends **vinext** over OpenNext. Image optimization is only partly supported ([docs](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)). The portrait uses `next/image`. | Cloudflare Access, free for up to 50 users (third-party) | DNS is already there | Yes | Basic | Versions |
| VPS (DigitalOcean from about $4, Hetzner from about €5.49, third-party) | $5–25 | Runs `next start` | You build it | You manage it | You manage it | You set it up | **The firm owns patching and uptime.** The current self-managed WordPress server shows the risk (stale spam sitemap). |
| **Stay on WordPress** | Current hosting | Not applicable | Staging plugin or host | Existing | Not applicable | Not applicable | Host backups |

Notes:
- **Staying on WordPress** means rebuilding the Signal design as a block theme (`theme.json` tokens, patterns). The guidelines say not to paste React into PHP, and the tested accessible form and performance work would have to be redone. Intake could stay on Gravity Forms using the [Clio Grow WordPress plugin](https://support.clio.com/hc/en-us/articles/360014263253-Setting-up-the-Clio-Grow-WordPress-Plugin) or SMTP through Postmark. This only makes sense if the firm insists on WordPress's editor.
- **Recommended setup:**
  - Vercel Pro, with the team **owned by the firm** (2FA on). A contractor is added as a member.
  - Keep DNS at Cloudflare, but set the web records to **DNS-only (grey cloud)**. Vercel advises against a reverse proxy in front of it ([KB](https://vercel.com/kb/guide/cloudflare-with-vercel)).
  - Previews use Vercel Authentication, plus a Shareable Link for Darren. Skip the $20 password add-on unless a shared password is wanted.
  - Make the layout's `noindex` driven by an environment variable, so a custom staging domain stays out of search engines.
  - **Estimated cost:** about $20 (Vercel), plus $0–22 (email), plus $0 (Upstash, Turnstile, UptimeRobot, Sentry free). Roughly **$20–45/mo**. Traffic-based usage should fit inside the credit (**unverified estimate**).
- **Monitoring:**
  - UptimeRobot free, which allows commercial use ([help](https://help.uptimerobot.com/en/articles/11604710-who-should-use-uptimerobot-s-free-plan)). Check `/`, `/intake` (keyword check), and a new `/api/intake/health` that reports configured or not without sending anything.
  - Sentry Developer (free, 5k errors) or a log drain for error alerts. Set `sendDefaultPii:false`, scrub request bodies in `beforeSend`, and never enable session replay on `/intake`.
  - Postmark bounce webhook, plus the PII-free "fallback used" alert.
- **Backups:**
  - GitHub holds code and content.
  - Vercel keeps previous deployments.
  - Export the Cloudflare DNS zone before any change.
  - Take a full WordPress backup (files and database) and keep the old server running untouched for 90 days.
  - Export Gravity Forms entries (they're confidential) and decide how long to keep them.

---

## 4. Domain cutover for ddrakelaw.com

**How the move works.** URLs change on the same domain, so follow Google's move-with-URL-changes guide ([Google](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)) and its hosting-change guide ([Google](https://developers.google.com/search/docs/crawling-indexing/site-move-no-url-changes)). **Change of Address is not used**, because the domain stays the same.

### Redirect map
Implement in `next.config.ts` `redirects()`. `permanent:true` gives a 308, which Google treats like a 301 ([Next docs](https://nextjs.org/docs/app/api-reference/config/next-config-js/redirects)). Keep redirects **at least 1 year**.

| Old | New |
|---|---|
| `/areas-of-practice/` | `/practice-areas` |
| `/areas-of-practice/criminaldefense/`, `/criminal-defense/` | `/practice-areas/criminal-defense` |
| `/areas-of-practice/dui/` | `/practice-areas/dui-dwi` |
| `/areas-of-practice/expungement/` | `/practice-areas/expungement` |
| `/areas-of-practice/juvenile-defense/` | **Firm decides.** Either a new page (if confirmed) or redirect to criminal defense. |
| `/testimonials/`, `/submit-a-testimonial/` | **Firm decides.** Redirect to `/about`, or 410. No reviews on the new site. |
| `/blog/` | `/` |
| 17 attachment pages (`…/dui-2/`, `/criminal-defense/*`, `/contact/ruco/` and so on) | Redirect to their parent page |
| `/sitemap_index.xml`, `/page-sitemap.xml` | `/sitemap.xml` (new) |
| `/6668243_*` spam pattern, `/wp-login.php`, `/wp-admin/*`, `/xmlrpc.php`, `/feed/` | **410**, no redirect |

`/contact/` becomes `/contact` through Next's default trailing-slash handling. Test each redirect so none chains through more than one hop.

### Before launch (T-14 to T-1)
1. Get access to each of these, and record who owns it:
   - Cloudflare account
   - Registrar (**unknown**)
   - Google Workspace admin
   - Search Console owner (the TXT record exists)
   - WordPress and CyberPanel
2. Export the Cloudflare zone file. Screenshot every record, and every Cloudflare Page, Redirect or WAF rule, because those stop applying when records go DNS-only.
3. Back up WordPress (files and database). Export Gravity Forms entries.
4. Add `ddrakelaw.com` and `www` to the Vercel project, with `www` redirecting to the apex. Add the TXT verification record and **pre-generate the certificate**, then confirm it's valid ([Vercel zero-downtime KB](https://vercel.com/kb/guide/zero-downtime-migration)).
5. **TTL:** proxied records already have a fixed 300 s TTL ([Cloudflare TTL](https://developers.cloudflare.com/dns/manage-dns-records/reference/ttl/)), so no lowering is needed. When the records become DNS-only, set TTL to 60 s (the minimum on non-Enterprise plans), then raise it after about a week.
6. On the preview, run a final QA:
   - redirect-map test script
   - e2e and axe tests
   - Postmark test-mode delivery
   - one supervised Clio test lead
   - real iOS and Android devices
7. Record a Search Console baseline: indexed pages, top queries, top landing pages. Check Security issues and Manual actions.

### Launch day (low-traffic morning, with staff available to answer the phone)
1. Freeze WordPress content. Set production environment variables and remove `noindex`, then deploy to production.
2. In Cloudflare, **change only** the apex A and the `www` record to the values Vercel shows. Set both to DNS-only, TTL 60.
3. **Do not touch** any of these:
   - the 5 MX records
   - the SPF TXT
   - the `google-site-verification` TXT
   - the `_dmarc` TXT
   - `mail` and `ftp` (leave them until the old server is retired)
4. Add the Postmark DKIM TXT and Return-Path CNAME. These are additive only.
5. Verify:
   - HTTPS on the apex and `www`, and HTTP to HTTPS
   - the redirect script against production
   - `/sitemap.xml` and `/robots.txt`
   - a Postmark test inquiry, or a Clio test lead that is then deleted
   - UptimeRobot checks are green
   - send a test email to and from the firm's Workspace to confirm mail still works
6. In Search Console:
   - Submit the new `sitemap.xml` and remove the old submitted sitemaps.
   - Run URL Inspection on the home page, the 3 practice pages, contact and intake.
   - Add a **Domain property** through a DNS TXT record if one doesn't exist yet.

### Rollback
- **App regression:** Vercel Instant Rollback.
- **Platform failure:** restore the previous A and CNAME values from the zone export and turn the proxy back on. It takes effect within about 5 minutes, because the old server is still running.
- **Roll back if any of these happen:** intake can't deliver, sustained 5xx errors, or more than 5% of redirects fail.

### After launch
- Check Search Console's page-indexing (404) report weekly for 4 weeks.
- Watch for spam-URL 404s and confirm they return 410.
- Shut down WordPress and its hosting after 90 days, then remove `mail`/`ftp` if they're unused.
- Then schedule the **separate email-auth cleanup** with the Workspace admin:
  - SPF becomes `include:_spf.google.com` (plus any other sender that's actually used)
  - turn on Google DKIM
  - DMARC reports go to a firm mailbox, then move to `p=quarantine`

---

## 5. Security headers and CSP

**Recommended: a hybrid CSP.** Static pages keep a static policy. The dynamic `/intake` page gets a strict nonce policy through `proxy.ts` limited to `/intake` (the page is already `force-dynamic`). Per the [Next.js CSP guide](https://nextjs.org/docs/app/guides/content-security-policy), nonces force dynamic rendering, which would slow every other page. Experimental SRI is an option to test later.

- **Static pages** (set in `next.config.ts` `headers()`):
  `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests`
- **`/intake`** (in `proxy.ts`):
  `script-src 'self' 'nonce-X' 'strict-dynamic' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; style-src 'self' 'nonce-X'` (the other directives as above)
- Ship as `Content-Security-Policy-Report-Only` for one week on preview, then enforce.

Other headers:
- `Strict-Transport-Security: max-age=31536000`. Add `includeSubDomains` only after confirming every subdomain serves HTTPS (`mail` and `ftp` exist). No preload yet.
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin` (use `no-referrer` on `/intake`)
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()`
- `X-Frame-Options: DENY`
- `Cross-Origin-Opener-Policy: same-origin`
- `Cache-Control: no-store` on `/intake` and the API (the API already has it)
- `poweredByHeader:false` is already set.

API hardening: the section 2 checks, plus an allow-list of hosts, and log only error codes, never form content (current code already follows this).

---

## 6. Ongoing maintenance

**Dependencies**
- Turn on Dependabot security alerts, plus weekly grouped minor and patch updates ([comparison](https://appsecsanta.com/sca-tools/dependabot-vs-renovate)).
- Add a GitHub Actions workflow running lint, typecheck, build and e2e/axe, required to pass before merge. Every pull request gets a Vercel preview.
- Apply Next.js and React security releases **within days**. Example: React2Shell (CVE-2025-55182), CVSS 10, was exploited in the wild ([Datadog](https://securitylabs.datadoghq.com/articles/cve-2025-55182-react2shell-remote-code-execution-react-server-components/)).
- Plan major-version upgrades once a quarter.

**Who can edit content**

| Option | Cost | Fits a non-developer? | Notes |
|---|---|---|---|
| MDX/JSON in the repo, edited in GitHub's web UI | $0 | Poor | Fine for developers |
| **Keystatic, GitHub mode** (recommended) | $0 (Cloud is optional) | Good: an admin page at `/keystatic` with form fields | Every save becomes a commit, then a preview, then a publish. Editors need GitHub logins ([Keystatic](https://keystatic.com/)). Move `lib/site.ts` facts, practice copy, FAQs and bio into content files. Keep the intake form, disclaimers and privacy text under developer control. |
| TinaCMS | Free for 2 users. Team $24/mo ([pricing](https://tina.io/pricing)). | Very good, with visual editing | Editorial workflow is a paid feature |
| Sanity | Free tier; Growth $15/seat (third-party) | Good | Content lives outside the repo, which means more build work |

Guardrail: Darren (or someone he names) approves every publish, because of the rule against invented facts. A pull request or branch review in Keystatic serves as that approval.

**Monthly checks (about 30 minutes)**
- Uptime and error reports
- Upstash, Postmark and Vercel usage and bounces
- Search Console coverage and security
- Merge dependency pull requests
- Send one test-mode intake through the preview
- Confirm the intake mailbox or Grow notifications still reach the right people
- Core Web Vitals

**Quarterly and yearly**
- Rotate secrets: Clio token, Postmark/Resend keys, Turnstile secret, Upstash token
- Review who has access
- Renew the domain (registrar **unknown**)
- Review the privacy notice, which must describe where inquiries go (Clio/Postmark/Google) and how long they're kept
- Retire redirects after at least 1 year, using logs to decide

---

## Consolidated asks for the firm
1. Does the Clio plan include **Grow**? If yes, who enters the Inbox Token into the hosting secret store, and which users get lead notifications?
2. **Intake mailbox** address, and who watches it.
3. Account ownership and access for Cloudflare, the registrar, Google Workspace admin, Search Console, WordPress/CyberPanel, and the new Vercel, Postmark and Upstash accounts. All should be firm-owned with 2FA.
4. Decisions on the juvenile-defense and testimonials URLs, and on retaining old Gravity Forms entries.
5. Privacy notice text. Approval for the later email-authentication cleanup, and who the outside DMARC-report Gmail belongs to.

## Not verified
- Clio Grow price and plan inclusion (Clio's pricing page returned 403)
- Lawmatics Forms API details and prices
- SendGrid, Sanity, Keystatic Cloud, VPS and Sentry prices (third-party sources only)
- Postmark's exact success-response field and test token
- Whether Clio has a sandbox for the Lead Inbox
- Whether the SES provider stores content
- Whether Google DKIM uses a custom selector
- Whether the spam sitemap reflects a past compromise
- Whether Vercel usage stays within the $20 credit
- Details of Apps Script's header handling