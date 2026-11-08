# Setting up the private preview, step by step (Quinn)

Do the parts in order. At the end of each part, send the Claude session the line under **"Send Claude"**. It checks the result and gives you the next part.

**Never paste a password, key or token into the chat.** Keys go only into the Cloudflare boxes named below.

The new website's address is **darrendrakelaw.com** (decided 3 Oct 2026, C10). Quinn buys it and owns the Cloudflare account (D13). Nothing here touches the old ddrakelaw.com website or its email settings.

Time: about 1 to 1½ hours, including waiting for things to build.

**Have ready:**
- Quinn's Cloudflare login (or create one at dash.cloudflare.com → **Sign up**);
- Quinn's GitHub login (the code lives in Quinn's GitHub);
- a payment card for the domain (a .com costs about $10–11 a year on Cloudflare);
- Darren's and Kelly's Gmail addresses (where inquiries go);
- Kelly's phone, for Part 8 (can be done later).

---

## Part 1: Two-step login on Cloudflare (5 minutes)
Do this first: the account will hold the firm's website and domain.
1. Log in at **dash.cloudflare.com**.
2. Profile icon (top right) → **My Profile** → **Authentication** → **Two-Factor Authentication** → set it up with an authenticator app on your phone.
3. Save the backup codes somewhere safe, such as a password manager. Not in the chat.

**Send Claude:** "Part 1 done."

## Part 2: Buy darrendrakelaw.com (10 minutes)
1. Cloudflare left menu → **Domain Registration** → **Register Domains**.
2. Type `darrendrakelaw.com` and click **Search**. It should show as available (checked 3 Oct 2026).
3. Click **Purchase**. Choose **1 year** (or more), and keep **Auto renew** **on**, so the address never lapses.
4. Fill in the contact details. Use the firm's details or yours as the registrant; Cloudflare hides them from the public lookup for free.
5. Pay. The domain appears on **Account Home** within a few minutes and is already set up to use Cloudflare. There's nothing else to set.

**Send Claude:** "Part 2: darrendrakelaw.com is [Active / pending]."

## Part 3: Create the website on Cloudflare (15 minutes, mostly waiting)
1. Cloudflare left menu → **Compute (Workers)** (or **Workers & Pages**) → **Create** → **Import a repository**.
2. **Connect GitHub.** A GitHub window opens: sign in and allow Cloudflare to access the repository **quinn-create/darrenwebsite-1** only ("Only select repositories").
3. Pick **darrenwebsite-1** and fill in:
   - **Project name:** `darrendrakelaw`
   - **Production branch:** `claude/sleepy-clarke-wjlh48`
   - **Advanced settings** → **Root directory (path):** `site`
   - **Build command:** `npx opennextjs-cloudflare build`
   - **Deploy command:** `npx opennextjs-cloudflare deploy`
   - **Build variables** → **Add variable:** `SITE_ENV` = `preview`, and `NODE_VERSION` = `22`
4. Click **Create and deploy**, then wait for the build to finish (about 5 minutes).
5. When it says **Success**, copy the address it shows, ending in `.workers.dev`. **Don't share it yet:** Part 4 locks it.

**Send Claude:** "Part 3: build [succeeded / failed]. Address: https://….workers.dev". If it failed, open the build, copy the last 30 lines of the log and paste them (logs contain no passwords).

## Part 4: Lock the preview behind a login (5 minutes)
1. Open the `darrendrakelaw` worker → **Settings** → **Domains & Routes**.
2. Next to **workers.dev**, click **Enable Cloudflare Access**. If it offers the same for **Preview URLs**, turn that on too.
3. Click **Manage Cloudflare Access** and set the allowed emails: Darren's, Kelly's and yours.
4. Test: open the `.workers.dev` address in a private/incognito window. You should get a sign-in page, not the website.

**Send Claude:** "Part 4 done. Sign-in page shows: [yes / no]."

## Part 5: Resend, the email service (15 minutes)
The website sends each inquiry from `website@darrendrakelaw.com` to Darren's and Kelly's Gmail. Resend needs to prove it may send for the new domain.
1. Go to **resend.com** → **Sign up**. Turn on two-step login under **Settings** → **Account**.
2. **Domains** → **Add Domain** → enter `darrendrakelaw.com` → region **North Virginia (us-east-1)** → **Add**.
3. Resend lists DNS records to add. Click its **Auto configure** / **Sign in to Cloudflare** button, or add them by hand in Cloudflare → `darrendrakelaw.com` → **DNS** → **Records** → **Add record**.
   - Add **only** the records Resend lists: a TXT record named `resend._domainkey`, plus an MX and a TXT record named `send`.
   - If Resend suggests a DMARC record, skip it for now.
   - Do this on **darrendrakelaw.com only**. Don't change anything on ddrakelaw.com.
4. Back in Resend, click **Verify DNS Records**. It can take a few minutes, sometimes an hour.

**Send Claude:** "Part 5: Resend domain status is [Verified / Pending / Failed]." If it isn't verified, a screenshot of Resend's records list is fine to share: it holds no secrets.

## Part 6: Connect the email to the website (10 minutes)
1. In Resend → **API Keys** → **Create API Key**. Name it "darrendrakelaw website", set **Permission** to **Sending access** and **Domain** to `darrendrakelaw.com`. Copy the key; it's shown only once.
2. In Cloudflare → `darrendrakelaw` worker → **Settings** → **Variables and Secrets** → **Add**:
   - `RESEND_API_KEY`: type **Secret**, paste the key.
   - `INTAKE_DESTINATION`: type **Text**, `email`
   - `INTAKE_EMAIL_FROM`: type **Text**, `Darren Drake Website <website@darrendrakelaw.com>`
   - `INTAKE_EMAIL_TO`: type **Text**, Kelly's Gmail address, then a comma, then Darren's Gmail address
   - `SITE_ENV`: type **Text**, `preview`
   - `SITE_URL`: type **Text**, `https://darrendrakelaw.com`
3. Click **Deploy** (or **Save and deploy**).

**Send Claude:** "Part 6 done." Don't send the key.

## Part 7: Spam protection for the form (5 minutes)
1. Cloudflare left menu → **Turnstile** → **Add widget**.
   - **Name:** Contact form
   - **Hostnames:** your `….workers.dev` address (without https://) and `darrendrakelaw.com`
   - **Widget mode:** **Managed** → **Create**
2. Copy the **Site key** and the **Secret key**.
3. Worker → **Settings**:
   - **Build** → **Variables and secrets** → add `NEXT_PUBLIC_TURNSTILE_SITE_KEY` = the Site key.
   - **Variables and Secrets** → add `TURNSTILE_SECRET_KEY`, type **Secret**, = the Secret key.

**Send Claude:** "Part 7 done."

## Part 8: Telegram copy for Kelly (10 minutes; can wait for another day)
1. On any phone with Telegram, message **@BotFather** → send `/newbot` → name it "Drake Law Inquiries" → pick a username ending in `bot`. BotFather replies with a **token**.
2. Cloudflare → worker → **Settings** → **Variables and Secrets** → add `TELEGRAM_BOT_TOKEN`, type **Secret**, = the token.
3. Kelly opens the new bot in Telegram and presses **Start**.
4. In a browser, open `https://api.telegram.org/bot<TOKEN>/getUpdates`, putting the token where `<TOKEN>` is. Find `"chat":{"id":` and the number after it.
5. Add `TELEGRAM_CHAT_ID`, type **Secret**, = that number.

**Send Claude:** "Part 8 done" or "Part 8 skipped for now."

## Part 9: Rebuild and test (15 minutes)
1. Worker → **Deployments** → on the latest one, **⋯** → **Retry deployment** (or **Builds** → **Retry build**). This picks up the build settings from Part 7. Wait for **Success**.
2. On a phone, open the `.workers.dev` address, sign in with the emailed code, and look through every page: Home, each practice area, About, Contact, Privacy.
3. On the Contact page, send a test:
   - **Your name:** `TEST – please ignore`
   - pick any options, and **Call** with the office number;
   - **Message:** `Test from the website setup.`
4. Check:
   - the page says **"Message received"**;
   - Kelly **and** Darren each get an email in Gmail, subject starting "New website inquiry", with a PDF attached (check the Spam folder too the first time);
   - Kelly gets the Telegram message (if Part 8 was done).

**Send Claude:** "Part 9: message received [yes/no]; Kelly email [yes/no]; Darren email [yes/no]; PDF opens [yes/no]; Telegram [yes/no/skipped]. Anything that looked wrong: …"

---

## Later (not today)
- **Where ddrakelaw.com lives:** find which account holds the old domain (Cloudflare or another company, maybe the old web designer's). It's needed at launch to forward it to darrendrakelaw.com.
- **Visitor statistics:** Cloudflare Web Analytics, set up at launch on `darrendrakelaw.com` (steps in `cloudflare-setup.md`, step 7).
- **Firm GitHub organization (D13):** move the code out of Quinn's GitHub, then reconnect Cloudflare to it.
- **Launch day:** the steps are in `cloudflare-setup.md`, "Later: launch day". They include connecting darrendrakelaw.com, forwarding ddrakelaw.com, Google Search Console, a www redirect, the AI-search crawler choice and a free uptime alert.
