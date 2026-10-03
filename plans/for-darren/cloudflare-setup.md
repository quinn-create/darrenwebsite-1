# Putting the website on Cloudflare (free plan)

Hosting decision C8 (26 September 2026): the site runs on **Cloudflare Workers, free plan**, instead of Vercel. This replaces sections 1 and 2 of `go-live-setup.md`. The email and Telegram sections there still apply.

**What's already done in the project:**
- The site is converted for Cloudflare and tested in Cloudflare's own runtime: all 96 website tests pass.
- It fits the free plan's size limit: about 2.9 MB of the 3 MB allowed. GitHub's automatic checks now fail if it ever grows past 3 MB.

**What the free plan means in practice:**
- **Visits:** up to 100,000 a day, far more than a law firm website needs.
- **Computer time per visit:** at most 10 thousandths of a second. Normal pages use much less. Sending the form builds a PDF, which took 4–8 ms in testing, so it's close.
  - If Cloudflare ever reports "exceeded CPU" on the form, switch to **Workers Paid ($5/month)**: Workers & Pages → Plans → Workers Paid.
  - A visitor is never told the form was sent unless it really was. If a send fails, they see the phone number.
- **Photo resizing:** the site uses Cloudflare Images to resize Darren's photo, within its free monthly allowance.

Nothing here puts the site on ddrakelaw.com. Switching the live domain needs Darren's written sign-off, and it's a separate step (the end of this guide).

## 1. Who owns it (5 minutes)
The firm's Cloudflare account already holds the domain. Use that account.
1. Make sure two-step login is on: profile icon (top right) → **My Profile** → **Authentication** → **Two-Factor Authentication**.
2. Name the account's owner and billing owner in `docs/DECISIONS.md` (D13). Tell Quinn, and the session records it.

## 2. Move the code to a firm GitHub organization (D13, 10 minutes)
1. On github.com: **+** (top right) → **New organization** → **Free** → name it (for example "darren-drake-law").
2. In the current repository: **Settings** → scroll to **Danger Zone** → **Transfer** → choose the new organization.

## 3. Connect Cloudflare to the code (10 minutes)
1. Cloudflare dashboard → **Workers & Pages** (left menu) → **Create** → **Import a repository** → **Connect GitHub** → allow access to the firm's repository.
2. Pick the repository, then set:
   - **Project name:** `ddrakelaw`
   - **Root directory (Advanced settings):** `site`
   - **Build command:** `npx opennextjs-cloudflare build`
   - **Deploy command:** `npx opennextjs-cloudflare deploy`
3. Under **Build variables**, add `SITE_ENV` = `preview`. This keeps the site hidden from Google until launch.
4. Click **Create and deploy**. The first build takes a few minutes.

## 4. Settings and secrets (5 minutes)
Worker → **Settings** → **Variables and Secrets** → **Add**.
- **Plain text:**
  - `SITE_ENV` = `preview`
  - `SITE_URL` = `https://ddrakelaw.com`
  - `INTAKE_DESTINATION` = `email`
  - `INTAKE_EMAIL_FROM` = the sending address, e.g. `Darren Drake Website <website@ddrakelaw.com>`
  - `INTAKE_EMAIL_TO` = the recipients from D8, comma-separated
- **Secret** (choose type **Secret**, so the value can't be read back):
  - `RESEND_API_KEY`, the email service's key (Resend, chosen 26 Sep 2026);
  - `TELEGRAM_BOT_TOKEN`;
  - `TELEGRAM_CHAT_ID`.

Paste keys only into Cloudflare, never into chat or email. Then **Deployments** → **Retry deployment**, so the site picks them up.

## 5. Keep previews private (D17, 5 minutes)
1. Worker → **Settings** → **Domains & Routes** → next to the `workers.dev` address and **Preview URLs**, click **Enable Cloudflare Access**.
2. Add the email addresses allowed to see it: Darren, Kelly and Quinn. Visitors must then sign in with an emailed code.
3. Send Quinn the `workers.dev` address. The session checks every page and the form there.

## 6. Spam protection for the form: Turnstile (free, 5 minutes)
1. Cloudflare dashboard → **Turnstile** (left menu) → **Add widget**.
2. **Widget name:** "Contact form". **Hostnames:** `ddrakelaw.com` (and your `workers.dev` preview address). **Widget mode:** **Managed**. Click **Create**.
3. Copy the two keys it shows:
   - the **Site key** goes in **Settings → Build → Variables** as `NEXT_PUBLIC_TURNSTILE_SITE_KEY`;
   - the **Secret key** goes in **Settings → Variables and Secrets** as `TURNSTILE_SECRET_KEY`, type **Secret**.
4. Redeploy. Most visitors never see anything. Now and then Cloudflare asks someone to tick a box.

## 7. Visitor statistics: Cloudflare Web Analytics (free, 5 minutes, no cookies)
1. Cloudflare dashboard → **Analytics & Logs** → **Web Analytics** → **Add a site** → choose `ddrakelaw.com` → **Automatic setup**. No code or cookie banner is needed.
2. On that site's **Manage site** page, under **Rules**, add a rule to **exclude** the paths `/contact*` and `/intake*`. That keeps statistics off the form page, like every other tag.

## About logs (nothing to do)
The site's settings file switches Cloudflare's Workers Logs to keep only the site's own error notes, such as "the inquiry email was rejected". These never include anything from the form. Per-visit request logs, which would hold visitors' IP addresses and page addresses, are switched off. If an inquiry ever fails, the notes are under worker → **Observability** for 3 days.

## Later: launch day (needs Darren's written sign-off)
1. **Before switching:** in Cloudflare → `ddrakelaw.com` → **Rules**, and in **Speed** and **Scrape Shield**, write down (screenshot) any old rules left from the WordPress site, such as page rules, cache rules, Rocket Loader or Email Address Obfuscation. Ask the session before removing any, because they would sit in front of the new site.
2. Change `SITE_ENV` to `production`, both in **Build variables** and in **Variables and Secrets**, then redeploy. The build refuses to go live if any unconfirmed "Waiting on the firm" item comes back.
3. Worker → **Settings** → **Domains & Routes** → **Add** → **Custom domain** → `ddrakelaw.com`. Add only the bare domain, not `www`.
4. **One address for Google: www → ddrakelaw.com.** Cloudflare → `ddrakelaw.com` → **Rules** → **Redirect Rules** → **Create rule** → template **"Redirect from WWW to root"**. Choose **301**, keep the path and the query string, then **Deploy**.
   - The old site already does this today, so it keeps the same behaviour and avoids Google seeing two copies of the site.
   - The rule only works if `www` goes through Cloudflare: in **DNS** → **Records**, the `www` record's cloud must be orange (**Proxied**). If it's grey, click **Edit** and switch it to Proxied (change nothing else).
   - If `www` has no DNS record, add one first: **DNS** → **Records** → **Add record** → type **A**, name `www`, IPv4 `192.0.2.1`, **Proxied** (orange cloud on). That placeholder address is the standard one for a proxy-only record. Don't change any other record.
5. **AI search and crawlers (Darren's choice; recommended: allow search, block training).** Cloudflare → `ddrakelaw.com` → **Security** → **Settings** (or **AI Crawl Control**):
   - check whether **"Block AI bots"**, **"Manage your robots.txt"** or **"Bot Fight Mode"** is on. Cloudflare turns some of these on by default, and they can stop ChatGPT, Perplexity and similar tools from reading the site to answer questions about local lawyers;
   - recommended: allow AI search crawlers (they cite and link the site) and block only AI training crawlers. Tell the session what was chosen, so it's recorded.
6. **Never** change the MX, SPF, DKIM or DMARC records, the Google verification record, or the mail/ftp entries. Adding the custom domain and the redirect rule doesn't touch them.
7. **Free uptime alert (optional, 5 minutes):** at uptimerobot.com, using the firm's email, add two "Keyword" monitors: `https://ddrakelaw.com/` (keyword `Darren Drake`) and `https://ddrakelaw.com/contact/` (keyword `Send message`), alerting Kelly and Darren. This catches the site or the form page going down.
8. **Search Console:** the new site keeps the old Google verification tag, so the firm's existing Search Console property stays verified. Find out who owns it (an open item since Phase 0), then submit `https://ddrakelaw.com/sitemap.xml` there.
9. Keep the old WordPress server untouched for 90 days (D15).
