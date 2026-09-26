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
  - `INTAKE_EMAIL_FROM` = the sending address, e.g. `website@ddrakelaw.com`
  - `INTAKE_EMAIL_TO` = the recipients from D8, comma-separated
- **Secret** (choose type **Secret**, so the value can't be read back):
  - the email service's key (e.g. `POSTMARK_SERVER_TOKEN`);
  - `TELEGRAM_BOT_TOKEN`;
  - `TELEGRAM_CHAT_ID`.

Paste keys only into Cloudflare, never into chat or email. Then **Deployments** → **Retry deployment**, so the site picks them up.

## 5. Keep previews private (D17, 5 minutes)
1. Worker → **Settings** → **Domains & Routes** → next to the `workers.dev` address and **Preview URLs**, click **Enable Cloudflare Access**.
2. Add the email addresses allowed to see it: Darren, Kelly and Quinn. Visitors must then sign in with an emailed code.
3. Send Quinn the `workers.dev` address. The session checks every page and the form there.

## Later: launch day (needs Darren's written sign-off)
1. Change `SITE_ENV` to `production`, both in **Build variables** and in **Variables and Secrets**, then redeploy. The build refuses to go live if any unconfirmed "Waiting on the firm" item comes back.
2. Worker → **Settings** → **Domains & Routes** → **Add** → **Custom domain** → `ddrakelaw.com` (and `www.ddrakelaw.com`).
3. **Never** change the MX, SPF, DKIM or DMARC records, the Google verification record, or the mail/ftp entries. Adding the custom domain doesn't touch them.
4. Keep the old WordPress server untouched for 90 days (D15).
