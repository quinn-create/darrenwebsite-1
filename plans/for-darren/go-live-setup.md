# Getting a working private website (for Darren)

This takes about an hour. When it's done, Darren has a **private link** to the full working website, which only people he invites can open. Inquiries sent from it reach Kelly (email and Telegram) and Darren (email). Nothing changes on ddrakelaw.com, and the firm's email keeps working as it does now.

Keys and tokens go **only** into Vercel's settings (step 2). Never send them by email, text or chat, including to Claude.

## 1. Hosting: Vercel (about $20/month)
1. Go to vercel.com, sign up with the firm's email, and choose the **Pro** plan. The free plan doesn't allow business use.
2. Click **Add New → Project**, connect GitHub, and import the website repository (`darrenwebsite-1`). Quinn can grant access.
3. Set **Root Directory** to `site`. Leave everything else as it is.
4. Before deploying, open **Environment Variables** and add the settings from `site/.env.example`. Leave the Postmark and Telegram values blank until steps 3 and 4.
5. Go to **Settings → Deployment Protection** and make sure **Vercel Authentication** is on. That's what keeps the link private.
6. **Don't add ddrakelaw.com to the project yet.** That happens on launch day.

## 2. Settings to enter in Vercel

| Name | Value |
|---|---|
| `SITE_ENV` | `preview` (keeps it hidden from Google) |
| `SITE_URL` | `https://ddrakelaw.com` |
| `INTAKE_DESTINATION` | `email` |
| `INTAKE_EMAIL_TO` | `kpittman.lawoffice@gmail.com,darrendrakeattorney@gmail.com` |
| `INTAKE_EMAIL_FROM` | `website@ddrakelaw.com` (after step 3) |
| `POSTMARK_SERVER_TOKEN` | from step 3 |
| `TELEGRAM_BOT_TOKEN` | from step 4 |
| `TELEGRAM_CHAT_ID` | from step 4 |

After changing any setting, open **Deployments** and choose **Redeploy** so the change takes effect.

## 3. Sending inquiry emails: Postmark (about $16.50/month)
1. Sign up at postmarkapp.com and create a **Server** called "Website".
2. Under **Sender Signatures → Domains**, add `ddrakelaw.com`. Postmark shows two DNS records (DKIM and Return-Path).
3. Add those two records in **Cloudflare → DNS**. They're new records; don't change or delete any existing ones, especially the MX records that run the firm's email.
4. Click **Verify** in Postmark. Once it's green, copy the Server's **API token** into Vercel as `POSTMARK_SERVER_TOKEN`.
5. Postmark starts new accounts in test mode. Request approval (**Request approval** button) so it can send to any address.

## 4. The Telegram copy for Kelly (free)
1. In Telegram, message **@BotFather**, send `/newbot`, and name it, for example "Drake Law Inquiries". It replies with a **token**: paste it into Vercel as `TELEGRAM_BOT_TOKEN`.
2. Kelly opens the new bot in Telegram and presses **Start**.
3. In a browser, open `https://api.telegram.org/bot<TOKEN>/getUpdates`, with the token in place of `<TOKEN>`. Find `"chat":{"id":` followed by a number. Paste that number into Vercel as `TELEGRAM_CHAT_ID`.

Reminder: the firm chose this route. Each inquiry's details are then stored on Kelly's phone and in Telegram.

## 5. Tell Quinn it's done
Claude then:
- checks the private link;
- sends a clearly labelled **test** inquiry;
- confirms that Kelly and Darren received the email and PDF, and that Kelly got the Telegram message.

After that, Darren can click through the site and ask for edits.

## Later: launch day (not now)
- Point ddrakelaw.com at Vercel.
- Switch `SITE_ENV` to `production`.

The production build refuses to go live while any unapproved text remains. Right now that's the privacy notice, the accessibility page and the local photo. See the plan, Section 11.
