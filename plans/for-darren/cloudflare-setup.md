# Putting the website on Cloudflare (free plan)

Hosting decision C8 (26 September 2026): the site runs on **Cloudflare Workers, free plan**, instead of Vercel. This replaces sections 1 and 2 of `go-live-setup.md`. The email and Telegram sections there still apply.

Address decision C10 (3 October 2026): the new site lives at **darrendrakelaw.com**, bought and managed on Cloudflare by Quinn, who owns and pays for the account (D13). The old **ddrakelaw.com** forwards to it at launch.

The step-by-step version for setting up the private preview is `launch-steps.md`. This page is the reference, plus the launch-day steps.

**What's already done in the project:**
- The site is converted for Cloudflare and tested in Cloudflare's own runtime: all website tests pass.
- It fits the free plan's size limit: about 2.9 MB of the 3 MB allowed. GitHub's automatic checks now fail if it ever grows past 3 MB.
- Every link, the sitemap, the search data and the link previews use `https://darrendrakelaw.com`.

**What the free plan means in practice:**
- **Visits:** up to 100,000 a day, far more than a law firm website needs.
- **Computer time per visit:** at most 10 thousandths of a second. Normal pages use much less. Sending the form builds a PDF, which took 4–8 ms in testing, so it's close.
  - If Cloudflare ever reports "exceeded CPU" on the form, switch to **Workers Paid ($5/month)**: Workers & Pages → Plans → Workers Paid.
  - A visitor is never told the form was sent unless it really was. If a send fails, they see the phone number.
- **Photo resizing:** the site uses Cloudflare Images to resize Darren's photo, within its free monthly allowance.

## 1. The account and the domain
1. Two-step login on: profile icon (top right) → **My Profile** → **Authentication** → **Two-Factor Authentication**.
2. Buy the domain: left menu → **Domain Registration** → **Register Domains** → `darrendrakelaw.com` → **Purchase**, with **Auto renew** on.

## 2. Move the code to a firm GitHub organization (D13, later, 10 minutes)
1. On github.com: **+** (top right) → **New organization** → **Free** → name it (for example "darren-drake-law").
2. In the current repository: **Settings** → scroll to **Danger Zone** → **Transfer** → choose the new organization.
3. In Cloudflare, reconnect the worker to the moved repository: worker → **Settings** → **Build** → **Git repository** → **Manage**.

## 3. Connect Cloudflare to the code (10 minutes)
1. Cloudflare dashboard → **Workers & Pages** (left menu) → **Create** → **Import a repository** → **Connect GitHub** → allow access to the repository.
2. Pick the repository, then set:
   - **Project name:** `darrendrakelaw`
   - **Root directory (Advanced settings):** `site`
   - **Build command:** `npx opennextjs-cloudflare build`
   - **Deploy command:** `npx opennextjs-cloudflare deploy`
3. Under **Build variables**, add `SITE_ENV` = `preview` and `NODE_VERSION` = `22`. `preview` keeps the site hidden from Google until launch.
4. Click **Create and deploy**. The first build takes a few minutes.

## 4. Settings and secrets (5 minutes)
Worker → **Settings** → **Variables and Secrets** → **Add**.
- **Plain text:**
  - `SITE_ENV` = `preview`
  - `SITE_URL` = `https://darrendrakelaw.com`
  - `INTAKE_DESTINATION` = `email`
  - `INTAKE_EMAIL_FROM` = `Darren Drake Website <website@darrendrakelaw.com>`
  - `INTAKE_EMAIL_TO` = Kelly's and Darren's Gmail addresses (D8), comma-separated
- **Secret** (choose type **Secret**, so the value can't be read back):
  - `RESEND_API_KEY`, the email service's key (Resend, chosen 26 Sep 2026; its domain is darrendrakelaw.com);
  - `TELEGRAM_BOT_TOKEN`;
  - `TELEGRAM_CHAT_ID`.

Paste keys only into Cloudflare, never into chat or email. Then **Deployments** → **Retry deployment**, so the site picks them up.

## 5. Keep previews private (D17, 5 minutes)
1. Worker → **Settings** → **Domains & Routes** → next to the `workers.dev` address and **Preview URLs**, click **Enable Cloudflare Access**.
2. Add the email addresses allowed to see it: Darren, Kelly and Quinn. Visitors must then sign in with an emailed code.
3. Send the session the `workers.dev` address. It checks every page and the form there.

## 6. Spam protection for the form: Turnstile (free, 5 minutes)
1. Cloudflare dashboard → **Turnstile** (left menu) → **Add widget**.
2. **Widget name:** "Contact form". **Hostnames:** `darrendrakelaw.com` (and your `workers.dev` preview address). **Widget mode:** **Managed**. Click **Create**.
3. Copy the two keys it shows:
   - the **Site key** goes in **Settings → Build → Variables** as `NEXT_PUBLIC_TURNSTILE_SITE_KEY`;
   - the **Secret key** goes in **Settings → Variables and Secrets** as `TURNSTILE_SECRET_KEY`, type **Secret**.
4. Redeploy. Most visitors never see anything. Now and then Cloudflare asks someone to tick a box.

## 7. Visitor statistics: Cloudflare Web Analytics (free, 5 minutes, no cookies)
1. Cloudflare dashboard → **Analytics & Logs** → **Web Analytics** → **Add a site** → choose `darrendrakelaw.com` → **Automatic setup**. No code or cookie banner is needed.
2. On that site's **Manage site** page, under **Rules**, add a rule to **exclude** the paths `/contact*` and `/intake*`. That keeps statistics off the form page, like every other tag.

## About logs (nothing to do)
The site's settings file switches Cloudflare's Workers Logs to keep only the site's own error notes, such as "the inquiry email was rejected". These never include anything from the form. Per-visit request logs, which would hold visitors' IP addresses and page addresses, are switched off. If an inquiry ever fails, the notes are under worker → **Observability** for 3 days.

## Later: launch day
1. **Go live on the new name.** Change `SITE_ENV` to `production`, both in **Build variables** and in **Variables and Secrets**, then redeploy. The build refuses to go live if any unconfirmed "Waiting on the firm" item comes back.
2. Worker → **Settings** → **Domains & Routes** → **Add** → **Custom domain** → `darrendrakelaw.com`. Add only the bare domain, not `www`.
3. **www → darrendrakelaw.com.** Cloudflare → `darrendrakelaw.com` → **DNS** → **Records** → **Add record** → type **A**, name `www`, IPv4 `192.0.2.1`, **Proxied** (orange cloud on). That placeholder address is the standard one for a proxy-only record. Then **Rules** → **Redirect Rules** → **Create rule** → template **"Redirect from WWW to root"** → **301**, keep the path and the query string → **Deploy**.
4. **Forward the old address: ddrakelaw.com → darrendrakelaw.com.** This keeps old links, bookmarks and Google results working, each old page landing on its match.
   - If ddrakelaw.com is in a Cloudflare account you can open: Cloudflare → `ddrakelaw.com` → **Rules** → **Redirect Rules** → **Create rule**.
     - **Rule name:** "Move to darrendrakelaw.com".
     - **If incoming requests match:** **Custom filter expression** → **Hostname** **is in** `ddrakelaw.com`, `www.ddrakelaw.com`.
     - **Then:** **Dynamic** → expression `concat("https://darrendrakelaw.com", http.request.uri.path)` → status **301** → tick **Preserve query string** → **Deploy**.
     - It only works if both names go through Cloudflare: in `ddrakelaw.com` → **DNS** → **Records**, the cloud next to the `ddrakelaw.com` and `www` records must be orange (**Proxied**). If one is grey, click **Edit** and switch it to Proxied (change nothing else).
     - Before this, screenshot that zone's **Rules**, **Speed** and **Scrape Shield** pages and ask the session about any old rules there.
   - If ddrakelaw.com is with another company, tell the session where; it gives the steps for that company.
   - The old pages' addresses (for example `/areas-of-practice/dui/`) are already set up on the new site to land on the right new page.
5. **Never** change ddrakelaw.com's MX, SPF, DKIM or DMARC records, the Google verification record, or the mail/ftp entries. The forwarding rule doesn't touch them.
6. **Google Search Console** (search.google.com/search-console):
   - **Add property** → **Domain** → `darrendrakelaw.com` → it shows a TXT record; Cloudflare can add it for you (**Verify with Cloudflare**), or add it in **DNS** → **Records**. Then **Sitemaps** → submit `https://darrendrakelaw.com/sitemap.xml`.
   - In the old **ddrakelaw.com** property (whoever owns it, an open item since Phase 0): **Settings** → **Change of address** → choose darrendrakelaw.com → **Validate & update**. This tells Google the site moved, so it carries the old ranking over. It needs the forwarding in step 4 working first.
7. **Google Business Profile** (when it exists): set its website to `https://darrendrakelaw.com/`.
8. **AI search and crawlers (Darren's choice; recommended: allow search, block training).** Cloudflare → `darrendrakelaw.com` → **Security** → **Settings** (or **AI Crawl Control**):
   - check whether **"Block AI bots"**, **"Manage your robots.txt"** or **"Bot Fight Mode"** is on. Cloudflare turns some of these on by default, and they can stop ChatGPT, Perplexity and similar tools from reading the site to answer questions about local lawyers;
   - recommended: allow AI search crawlers (they cite and link the site) and block only AI training crawlers. Tell the session what was chosen, so it's recorded.
9. **Free uptime alert (optional, 5 minutes):** at uptimerobot.com, add two "Keyword" monitors: `https://darrendrakelaw.com/` (keyword `Darren Drake`) and `https://darrendrakelaw.com/contact/` (keyword `Send message`), alerting Kelly and Darren. This catches the site or the form page going down.
10. Keep the old WordPress server untouched for 90 days (D15), then retire it. Keep ddrakelaw.com itself (renewing it) for at least a few years, so the forwarding keeps working.
