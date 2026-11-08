# Darren Drake website: finish and go-live runbook

**darrendrakelaw.com · Signal 1A (the blue one) · Rev. 1, 8 November 2026 · for Quinn Rodriguez**

This is the one list of everything left between today and Darren's site being live. It is 12 parts and about 90 steps. It picks up from the 3 November decisions, which Darren made in person (`docs/qa-answers-2026-11-03.md`). It builds on the existing guides (`plans/for-darren/launch-steps.md`, `cloudflare-setup.md`, `go-live-setup.md`, `docs/PROMPT-PLAN.md`), which stay as reference. Where they differ, this runbook is newer, but the repo rules in `CLAUDE.md` and the build plan still win.

**Target launch:** Tuesday 8 December 2026, 8:30 AM Central. Backups: Wednesday 9 or Thursday 10 December. Earliest, if Darren reads fast: Tuesday 1 December.

---

## How this works

**You:** open any Claude chat and say **"Run Darren's launch plan"** (or "next Darren step", or "Darren step 5.3"). Claude opens this file, finds the first step not marked done in the tracker at the bottom, and shows you **one pop-up at a time**. Each pop-up says exactly what to click, and you answer by tapping a button:

- **Done** — it worked.
- **Done, but it looked different** — you'll get a box to say what you saw.
- **Stuck / error** — Claude helps. Paste the error text or attach a screenshot.
- **Not now** — Claude marks it "parked" and moves to the next step that doesn't depend on it.

Steps marked **[Claude]** are ones Claude does itself in the chat: building, checking, taking screenshots. When it finishes, it shows you the result and asks **Looks right / Change something**. Steps marked **[You]** are clicks only you can do (accounts, payments, logins). **[Darren]** and **[Kelly]** steps go through you.

**Three rules that never bend:**
1. **Never paste a password, key, token or backup code into the chat.** Keys go straight into the Cloudflare box the step names. Claude never asks for one. Account IDs that show on every page of the site, like `G-…` or a Facebook dataset number, are not secrets and are fine to send.
2. **Nothing goes public until Darren's written "go" is on file.** That means an email or text from Darren (step 9.3). Spoken OKs count for decisions, not for switching the live address on.
3. **Every sentence about Tennessee law is Darren's.** Claude drafts it and Darren approves it word for word. A page whose wording he hasn't approved stays hidden: the site refuses to build for the public while any unapproved text is switched on.

### For Claude (how to run this file)
- Read `CLAUDE.md` first. Then read this file's **Tracker** and start at the first step not marked `done`, unless Quinn names a step. If a step's "Needs" item isn't done yet, say so and offer the next step that is free.
- **One step per AskUserQuestion pop-up.** The question carries the step number and the exact clicks, short enough to read on a phone. Use the options above (Done / Done, but it looked different / Stuck / Not now). Where a step has its own choices, use those options instead and put the recommended one first. Quinn often dictates, so read his typed answers for meaning.
- Long click lists: send the full list with SendUserMessage, then ask the pop-up. Never more than about 8 clicks in one step. Split anything longer.
- **[Claude] steps:** do the work, run the checks the step lists, commit, and push to `claude/sleepy-clarke-wjlh48`. Each push rebuilds the private preview by itself once Part 2 is done. Send screenshots at 390, 768 and 1440 px (SendUserFile), then ask Looks right / Change something.
- After each step, update the **Tracker** row (status, date, one-line note), commit (`runbook: step N.N done`) and push. That is how the next chat knows where you are.
- If an answer changes a decision, record it in `docs/DECISIONS.md` first. If it conflicts with the build plan or the brand guidelines, stop and ask (CLAUDE.md "What wins").
- When a part finishes, file a Logbook entry (Quinn's standing rule) and end with the next step.

---

## Where it stands (checked 8 November 2026)

| Item | State |
|---|---|
| The site | Built and working: Home, five practice pages, About, Contact, Privacy, Accessibility, Legal notice, 404. A full build ran cleanly today. Last change: 3 Oct 2026. |
| The 3 Nov decisions | Made with Darren in person. Saved as `docs/qa-answers-2026-11-03.md`. **Not yet entered in the decision log** (step 1.2). |
| darrendrakelaw.com | **Not registered.** A registry lookup today found no record, so anyone can buy it. **Buy it today** (step 2.2). |
| ddrakelaw.com (old site) | Registered since 2011 with Tucows, a wholesale registrar that sells through resellers. Its DNS is on Cloudflare (nameservers `nora` and `plato`), and the site already runs through Cloudflare's proxy. **Expires 13 March 2027.** Which Cloudflare account holds it is still unknown (step 3.4). |
| Online | Nothing deployed. The old WordPress site is unchanged. |
| Where the work happens | This chat can build, test and screenshot the site, and save it to GitHub. You don't need Claude Code. |

## Calendar

| Dates | Parts | What you do | What Claude does |
|---|---|---|---|
| **Sun 8 – Tue 10 Nov** | 1, 2, 3 | Buy the domain; set up the private preview (about 90 min); send Darren the "what I need" text | Records the decisions; checks each setup part with you |
| Wed 11 – Fri 13 Nov | 4, 5.1–5.3 | Pick the courthouse picture with Darren; attach the logo files if Claude can't find them | Logo, picture, form changes, home layout, template; **Review Pack 1 to Darren by Fri 13** |
| Mon 16 – Fri 20 Nov | 5.4–5.6, 7 | Ads and statistics accounts (about 45 min); hand Darren Packs 2 and 3 | The 12 new pages (**Pack 2 by Thu 19**), the Guides (**Pack 3 by Fri 20**) |
| Mon 23 – Wed 25 Nov | 6 | Collect Darren's marked-up packs (Thanksgiving is Thu 26) | Puts his edits in; records each approval |
| Mon 30 Nov – Fri 4 Dec | 8, 9, 10 | 30-minute phone test; walkthrough with Darren; **Darren's written "go" by Thu 3 Dec**; launch prep | Full quality pass; sign-off packet; rollback kit |
| **Tue 8 Dec, 8:30 AM** | 11 | Launch morning, about 90 minutes, Kelly on the phones | Live checks after every click |
| Wed 9 Dec → Mon 8 Mar 2027 | 12 | A few clicks on Day 2 and Day 7; renew ddrakelaw.com | Day 1, 2, 7, 14, 30 and 90 checks |

**Any page Darren hasn't approved by Fri 4 Dec stays hidden at launch.** It goes live later, the day he signs it. Launch doesn't wait for it.

---

## Part 1 — Lock in the 3 November decisions (10 minutes)

### 1.1 [You] Confirm what Darren approved
Claude shows the 24 decisions from 3 November in one short list:
- **Kept as is:** the Modern Precision (D3) logo; the AI courthouse picture; 12 new practice pages plus a Guides section; three new form fields; the tap-to-text button; the "Pay an invoice" and "Schedule a call" links; the Facebook and Google links; the Google, Meta and Analytics tags; all AI crawlers allowed; the Cloudflare free plan; one launch with everything; Kelly on the phones.
- **Turned down:** Spanish; the Smyrna/La Vergne page; the "just arrested" page.

**Pop-up:** "Are these still Darren's final answers?"
- **Yes, all of them** (recommended)
- **One or more changed — I'll tell you**
- **Darren wants to see the list again first**

### 1.2 [Claude] Record them
Claude updates the repo's records. **Nothing on the site changes in this step.**
- **`docs/DECISIONS.md`:**
  - D9/C5: Darren's in-person OK for the three tags, 3 Nov.
  - D11: superseded by the courthouse picture (new conflict C11: the brand guide says real photos only).
  - D13: reaffirmed.
  - D16: one launch, target Tue 8 Dec.
  - The icons are approved.
  - New rows for the logo (new conflict C12: the Phase 1 design lock used the wordmark), the 12 pages, the Guides, the form fields, tap-to-text (new conflict C13: the plan said no texting at launch), the pay/schedule links, the social links, AI crawlers, uptime alerts, and the declined items.
- **`CLAUDE.md`:** C11–C13, one line each.
- **`site/HANDOFF.md`:** a "3 Nov 2026 plan" section.

Commit and push.
**Pop-up:** "Recorded. Ready for Part 2 (buy the domain)?" → **Go** / **Not now**

---

## Part 2 — Buy the domain and make the private preview (about 90 minutes)

**Have ready:** your Cloudflare login, your GitHub login, a card (about $10–11 a year), Kelly's and Darren's Gmail addresses (kpittman.lawoffice@gmail.com, darrendrakeattorney@gmail.com), and your phone with an authenticator app (Google Authenticator, Microsoft Authenticator or 1Password).

After this part, a working private copy of the site lives at a `….workers.dev` address. Only you, Darren and Kelly can open it, after signing in with an emailed code. **From then on, every change Claude makes shows up there by itself about 5 minutes later.**

### 2.1 [You] Two-step login on Cloudflare (5 min)
1. Go to **dash.cloudflare.com** and log in. If you have no account: **Sign up** with quinn@mborolegal.com.
2. Profile icon (top right) → **Profile** → **Authentication**.
3. **Two-Factor Authentication** → **Set up** → scan the code with your authenticator app → type the 6 digits.
4. Save the backup codes in your password manager. **Not in the chat.**

### 2.2 [You] Buy darrendrakelaw.com (10 min) — do this today
1. Left menu → **Domain Registration** → **Register Domains**.
2. Type `darrendrakelaw.com` → **Search**. It should say **Available**.
   - If it says **taken**, stop and tap **Stuck**. Claude finds out who bought it, and the step changes.
3. **Purchase** → term **1 year** (or more) → **Auto renew: On**.
4. Contact details: the firm's (Darren Drake Law PLLC, 138 S. Cannon Ave) or yours. Cloudflare hides them from public lookups for free.
5. Pay. Within a few minutes the domain shows on **Account Home** as **Active**. Nothing else needs setting.

**Pop-up options:** **Active** / **Pending** / **Taken by someone else** / **Stuck**

### 2.3 [You] Look for ddrakelaw.com in your account (1 min)
On **Account Home**, look at the list of domains.
**Pop-up:** "Is **ddrakelaw.com** in your list?"
- **Yes** — great: launch day happens all in your account.
- **No** — normal. Part 3 finds who has it.
- **I have more than one Cloudflare account**

### 2.4 [You] Create the website on Cloudflare (15 min, mostly waiting)
1. Left menu → **Compute (Workers)** (it may say **Workers & Pages**) → **Create** → **Import a repository**.
2. **Connect GitHub** → sign in → **Only select repositories** → choose **quinn-create/darrenwebsite-1** → **Install & Authorize**.
3. Pick **darrenwebsite-1**, then fill in:
   - **Project name:** `darrendrakelaw`
   - **Production branch:** `claude/sleepy-clarke-wjlh48`
   - **Advanced settings → Root directory (path):** `site`
   - **Build command:** `npx opennextjs-cloudflare build`
   - **Deploy command:** `npx opennextjs-cloudflare deploy`
   - **Build variables → Add variable:** `SITE_ENV` = `preview`, then `NODE_VERSION` = `22`
4. **Create and deploy** → wait about 5 minutes for **Success**.
5. Copy the address it shows, ending in **`.workers.dev`**. **Don't share it yet.**

**Pop-up options:** **Succeeded — here's the address** / **Failed**. If it failed: open the build, copy the last 30 lines of the log and paste them. Logs hold no passwords.

### 2.5 [You] Lock the preview behind a login (5 min)
1. Open the **darrendrakelaw** worker → **Settings** → **Domains & Routes**.
2. Next to **workers.dev** → **Enable Cloudflare Access**. If **Preview URLs** offers the same, turn that on too.
   - The first time, Cloudflare may ask you to pick a "team name" and a Zero Trust plan. Choose **Free**. It costs $0 for up to 50 people.
3. **Manage Cloudflare Access** → allowed emails: yours, Darren's and Kelly's.
4. Test it: open the `.workers.dev` address in a **private / incognito** window. You should see a **sign-in page**, not the site.

**Pop-up options:** **Sign-in page shows** / **Site shows with no sign-in** / **Stuck**

### 2.6 [You] Resend: the service that emails each inquiry (15 min)
1. **resend.com** → **Sign up** with quinn@mborolegal.com → **Settings** → **Account** → turn on two-step login.
2. **Domains** → **Add Domain** → `darrendrakelaw.com` → region **North Virginia (us-east-1)** → **Add**.
3. Resend lists DNS records. Click its **Auto configure** / **Sign in to Cloudflare** button. Or add them by hand in Cloudflare → **darrendrakelaw.com** → **DNS** → **Records** → **Add record**:
   - **only** the records Resend lists: a TXT named `resend._domainkey`, plus an MX and a TXT named `send`;
   - skip any DMARC record it suggests;
   - **darrendrakelaw.com only. Touch nothing on ddrakelaw.com.**
4. Back in Resend → **Verify DNS Records**. It takes minutes, sometimes an hour.

**Pop-up options:** **Verified** / **Pending** (Claude moves on and comes back) / **Failed** (attach a screenshot of Resend's records list; it holds no secrets)

### 2.7 [You] Connect the email to the website (10 min)
1. Resend → **API Keys** → **Create API Key**:
   - **Name:** `darrendrakelaw website`
   - **Permission:** **Sending access**
   - **Domain:** `darrendrakelaw.com`

   **Copy the key.** Resend shows it only once.
2. Cloudflare → **darrendrakelaw** worker → **Settings** → **Variables and Secrets** → **Add**. Add each of these:

| Name | Type | Value |
|---|---|---|
| `RESEND_API_KEY` | **Secret** | the key you just copied |
| `INTAKE_DESTINATION` | Text | `email` |
| `INTAKE_EMAIL_FROM` | Text | `Darren Drake Website <website@darrendrakelaw.com>` |
| `INTAKE_EMAIL_TO` | Text | `kpittman.lawoffice@gmail.com,darrendrakeattorney@gmail.com` |
| `SITE_ENV` | Text | `preview` |
| `SITE_URL` | Text | `https://darrendrakelaw.com` |

3. **Deploy** (or **Save and deploy**).

**Pop-up:** **Done** (don't send the key) / **Stuck**

### 2.8 [You] Spam protection for the form: Turnstile (5 min)
1. Cloudflare left menu → **Turnstile** → **Add widget**:
   - **Name:** `Contact form`
   - **Hostnames:** your `….workers.dev` address (without `https://`), then `darrendrakelaw.com`
   - **Widget mode:** **Managed**

   Then **Create**.
2. It shows a **Site key** and a **Secret key**.
3. Worker → **Settings** → **Build** → **Variables and secrets** → add `NEXT_PUBLIC_TURNSTILE_SITE_KEY` = the **Site key**. (This box is the build one.)
4. Worker → **Settings** → **Variables and Secrets** → add `TURNSTILE_SECRET_KEY`, type **Secret**, = the **Secret key**. (This box is the runtime one.)

### 2.9 [You + Kelly] Telegram copy of each inquiry for Kelly (10 min; can wait)
1. On a phone with Telegram: message **@BotFather** → send `/newbot` → name it `Drake Law Inquiries` → pick a username ending in `bot`. BotFather replies with a **token**.
2. Cloudflare → worker → **Settings** → **Variables and Secrets** → add `TELEGRAM_BOT_TOKEN`, type **Secret**, = the token.
3. **Kelly** opens the new bot in Telegram and taps **Start**.
4. In a browser, open `https://api.telegram.org/bot<TOKEN>/getUpdates`, with the token where `<TOKEN>` is. Find `"chat":{"id":` and copy the number after it.
5. Add `TELEGRAM_CHAT_ID`, type **Secret**, = that number.

**Pop-up options:** **Done** / **Skip for now** (inquiries still go by email) / **Stuck**

### 2.10 [You] Rebuild and send the first test (15 min)
1. Worker → **Deployments** → on the newest one, **⋯** → **Retry deployment** (or **Builds** → **Retry build**). Wait for **Success**. This picks up the Turnstile key.
2. On your phone: open the `.workers.dev` address → enter your email → type the code → tap through every page.
3. **Contact** page → send a test:
   - **Name:** `TEST – please ignore`
   - **Phone:** the office number
   - **Reply by:** Call
   - **Message:** `Test from the website setup.`
4. Check:
   - the page says **"Message received"**;
   - **Kelly and Darren each got an email**, subject starting "New website inquiry", with a PDF (check Spam the first time);
   - Kelly got the Telegram message, if 2.9 was done.

**Pop-up** (one question per item): Message received? / Kelly email? / Darren email? / PDF opens? / Telegram? — each **Yes / No / Skipped**.
If anything says No, Claude walks through the fix before going on.

---

## Part 3 — Get the missing pieces from Darren (one text, then 15 minutes)

### 3.1 [You] Send Darren the "what I need" text
Claude puts the text from **Appendix A1** in a pop-up, ready to copy. It asks Darren for six things:
1. His Facebook page link.
2. His Google Business Profile link, and whether it shows the exact name, address, phone and hours.
3. His MyCase payment link.
4. A scheduling link, or "none".
5. Whether he can log into a Cloudflare account, or knows who built the old site.
6. To add you as an **Owner** on the old ddrakelaw.com Search Console.

**Pop-up options:** **Sent** / **I'll ask him in person** / **Not now**

### 3.2 [You] Pass on his answers
Paste or dictate what Darren sends. Links aren't secrets.
**[Claude]** saves the links into the site settings list (step 5.1 uses them) and notes anything missing.
**Pop-up:** "Anything he didn't have?" → **All six answered** / **Some missing** (Claude parks those, and the matching link stays hidden until it arrives) / **Still waiting**

### 3.3 [Darren] Check the Google Business Profile matches exactly
It must read:
- **Darren Drake Law PLLC**
- **138 S. Cannon Ave, Murfreesboro, TN 37129**
- **(615) 546-5551**
- **Monday–Friday, 8am–5pm**

To fix anything: Darren signs into Google → searches **Darren Drake Law** → **Edit profile** → change it. **Don't change the website field yet.** That happens on launch day (11.10).
**Pop-up options:** **Matches** / **Darren fixed it** / **Doesn't match and he can't fix it** (Claude gives the steps)

### 3.4 [You] Find who holds ddrakelaw.com
The domain's DNS sits in some Cloudflare account. Launch day's forwarding rule has to be added there. Go down this list and stop at the first **yes**:
1. Is it in **your** Cloudflare account? (Step 2.3.)
2. Can **Darren** log into Cloudflare with darrendrakeattorney@gmail.com, or his old email, and see it?
3. Darren searches his Gmail for **"ddrakelaw.com"** together with any of: "renewal", "Tucows", "Hover", "OpenSRS", "Cloudflare". The renewal notice for **13 March 2027** names the company.
4. Ask the **old web designer** who set up the WordPress site.

When the account is found, its owner adds you as a member: **Manage Account** → **Members** → **Invite** → quinn@mborolegal.com → role **Administrator**. If they'd rather not, they do step 11.7 themselves on launch morning while you read the clicks to them.
**Pop-up options:** **In my account** / **In Darren's — I've been added** / **In Darren's — he'll click on launch day** / **Old designer has it** / **Still can't find it**
If it can't be found by **Fri 27 Nov**, Claude gives the backup plan: launch on darrendrakelaw.com anyway, and add the forward later. Old Google links keep working the whole time.

### 3.5 [You + Kelly] Make sure the office line takes texts (2 min)
From your cell, text **(615) 546-5551**: "Test – website text button."
**Pop-up:** "Did Kelly see it?" → **Yes** / **The line can't take texts** (the text button stays off; recorded) / **Not checked yet**

### 3.6 [Darren] Search Console access
On the **ddrakelaw.com** property, Darren clicks **Settings** → **Users and permissions** → **Add user** → quinn@mborolegal.com → **Owner** → **Add**. This lets you file Google's "change of address" on Day 2 (12.2).
**Pop-up options:** **I'm an Owner now** / **Darren will do the change of address himself** / **Not yet**

---

## Part 4 — Logo and courthouse picture

### 4.1 [Claude] Find the Modern Precision (D3) logo files
Claude looks for the D3 vector files (SVG) in two places: the brand gallery (artifact `GVrsVBW3sqRwxTHQXENbQv`) and the Higgsfield project "Darren Drake Brand Studio".
**Pop-up only if they aren't there:**
- **I'll attach the Designer 3 zip from my Downloads** (delivered in chat on 28–29 Sep)
- **Rebuild the mark as clean vectors from the gallery picture** (Claude shows it next to the original for you to compare)
- **Not now**

### 4.2 [Claude] Put the logo on the site
The D3 mark goes beside the DARREN / DRAKE name in the header and footer, plus:
- browser-tab icons (16, 32 and 48 px), the phone home-screen icons, and every link-preview card;
- the header stays one row on the smallest phone;
- checks: the 3 MB size limit, all tests, claims, buttons and links.

Screenshots in both themes at 320, 390, 768 and 1440 px, plus the tab icon enlarged.
**Pop-up options:** **Looks right** / **Change something** / **Show Darren first**

### 4.3 [Claude → You + Darren] Make and pick the courthouse picture
Claude makes **6 options** with Higgsfield: the Rutherford County Courthouse on the Murfreesboro square, scene only, **no people**, morning light, colours that sit with the site's navy and cyan. They come as one picture sheet, numbered.
**Pop-up options:** **Number 1–6** / **Make 6 more** / **Change the look: [your words]** / **Darren picks later**
Show Darren on your phone. **His pick is the one that goes up.**

### 4.4 [Claude] Place the picture
The picture goes in **"Meet Darren"** on Home, beside the facts card:
- on phones it sits above the card, capped at 320 px tall;
- it loads only when scrolled to;
- captioned **"Illustration"**, with alt text "The Rutherford County Courthouse on the Square in Murfreesboro, Tennessee (illustration)";
- its source is recorded in `assets/photos/PROVENANCE.md` (AI-made, chosen by Darren, date);
- the speed checks still pass.

**Pop-up options:** **Looks right** / **Change something**

---

## Part 5 — Build the new features [Claude]

After each step Claude pushes the work, the private preview updates about 5 minutes later, and you get screenshots plus one pop-up.

### 5.1 Form fields, text button, payment and social links
- **Three optional fields** on the Contact form, after "What it's about":
  - **Next court date**;
  - **What were you charged with?** (each practice area, plus "Not sure");
  - **Who arrested you?** (Murfreesboro Police, Rutherford County Sheriff's Office, La Vergne Police, Smyrna Police, Tennessee Highway Patrol, MTSU Police, Other / not sure).

  They go in the PDF and the email body, and never to statistics.
- **Tap-to-text** to (615) 546-5551, on phones only, as an outline button beside Call:
  - on the phone bar and the Contact page;
  - with the line: "Texting isn't secure. Send your name and number; save the details for the call."
  - it stays off if 3.5 said the line can't take texts.
- **"Pay an invoice"** and **"Schedule a call"** in the footer and on Contact, from Darren's links. Under Schedule: "Booking a call doesn't create an attorney-client relationship." It is never called a "free consultation".
- **Footer links:** "Facebook" and "Reviews on Google". These are also added to the search-engine data.
- **Any link Darren hasn't sent yet stays hidden.** It is not shown broken.

**Pop-up 1:** "Should the charge type appear in the email **subject line**?"
- **No — only inside the email and PDF** (recommended: subject lines show on lock screens and in notifications)
- **Yes**

The 3 Nov notes say subject, but the build prompt said not in the subject. You decide.

**Pop-up 2:** **Looks right** / **Change something**

### 5.2 Home and Practice Areas layout for 17 areas
- **Home:** the three featured cards stay (First-Time Offenders, DUI/DWI, Domestic Assault). The sliding carousel goes. Below the cards comes a grouped list:
  - **DUI:** DUI/DWI, DUI with priors, Underage DUI, Drug DUI
  - **Assault & protection:** Domestic Assault, Assault, Orders of protection, Harassment & stalking
  - **Drugs & property:** Drug charges, Theft & shoplifting, Vandalism & property crimes
  - **Court, probation & records:** First-Time Offenders, Criminal Defense, Probation violations, Traffic & license, Resisting / evading arrest, Expungement

  Then a "See all practice areas" button.
- **Practice Areas page:** the same four groups.
- A page that isn't approved yet doesn't appear in any list.

**Pop-up options:** **Looks right** / **Change something**

### 5.3 New sections on the five existing pages → Review Pack 1
Each of the five live pages gets:
- **"What to do right now":** a 3–5 step checklist;
- **"What this charge means in Tennessee":** class of offense, range of consequences, licence and record effects, in plain English;
- **4–5 FAQs.** The two approved FAQs stay word for word.

Every new sentence is marked **waiting for Darren**. Every legal statement carries a note giving the Tennessee Code section or court rule it rests on, checked against the official text. Anything Claude couldn't confirm is flagged for Darren, never guessed.

Claude also builds **Review Pack 1** (step 6.1).
**Pop-up options:** **Looks right — make the pack** / **Change something**

### 5.4 The 12 new practice pages → Review Pack 2 (four batches of three)

| Batch | Pages |
|---|---|
| 5.4a | DUI with priors (2nd/3rd/4th), Underage DUI, Drug DUI. All three link to and from DUI/DWI. |
| 5.4b | Assault, Orders of protection, Harassment & stalking |
| 5.4c | Drug charges, Theft & shoplifting, Vandalism & property crimes |
| 5.4d | Probation violations, Traffic & license (driving on revoked, reckless driving), Resisting / evading arrest |

Each page gets:
- the full template: overview, checklist, "what it means in Tennessee", 4–5 FAQs, what happens next, Your attorney, related areas;
- a new icon in the same style. No police, gavel, badge, handcuff or people imagery;
- a link-preview card, a sitemap entry and a Google title such as "Drug Charges Attorney in Murfreesboro, TN | Darren Drake".

**All of the wording waits for Darren.** After each batch: screenshots of one page from the batch, plus the new icons.
**Pop-up after each batch:** **Looks right — next batch** / **Change something**
After 5.4d, Claude builds **Review Pack 2**.

### 5.5 The Guides section → Review Pack 3
- A `/guides/` page with eight guides of 500–900 words each, each with a "Reviewed by Darren Drake, Attorney at Law, on [date]" line:
  1. What happens after an arrest in Rutherford County
  2. Your first court date in Rutherford County General Sessions
  3. Do I have to talk to the police? Your rights in Tennessee
  4. How expungement works in Tennessee, and how long it takes
  5. A first DUI in Tennessee: what it can mean
  6. Orders of protection: what the respondent needs to know
  7. Judicial diversion in Tennessee: who may qualify
  8. How to prepare for court: what to bring and what to expect
- **"Guides" appears in the footer and on the Practice Areas page.** The header stays as approved.
- `docs/guides-monthly.md`: the plan for the monthly new-guide task. It starts after launch (12.5) and never publishes without Darren's recorded OK.

**Pop-up options:** **Looks right — make the pack** / **Drop or swap a guide** / **Change something**

### 5.6 Statistics, AI crawlers and uptime (behind the scenes)
- A test run with dummy tag numbers confirms:
  - the cookie banner works;
  - nothing from Google or Meta loads before **Accept**, after **Reject**, or ever on the Contact page;
  - the privacy notice lists exactly the three tags.
- `robots.txt` blocks no AI crawler.
- The launch-day guide gets the "allow all AI crawlers" settings and the uptime monitors.
- The speed checks are re-run with the tags switched on.

**Pop-up options:** **OK** / **Questions**

---

## Part 6 — Darren's reading (three packs, about 40 pages in all)

**The rule:** Darren reads every new sentence. **Edits are fine. Silence is not approval.** A page goes live only after Claude records his OK and the date.

### 6.1 [Claude → You] Pack 1 goes to Darren (by Fri 13 Nov)
Claude sends `Review-Pack-1.pdf`:
- large print (14 pt text, 20 pt headings);
- one section per page, each with an **OK / Edits** box and a date line;
- a cover page listing what's inside.

Print it for Darren, or send him the PDF.
**Pop-up options:** **Printed / sent to Darren** / **Change the pack first**

### 6.2 [You] Bring back Pack 1 (target Wed 18 Nov)
Tell Claude any of these:
- "Pack 1 approved as written";
- "approved except page 3: [his edit]";
- or **attach photos** of the marked-up pages. Claude reads his handwriting and reads it back to you for confirmation.

**[Claude]** puts in his edits, then for each page:
- records the approval date in `docs/DECISIONS.md`;
- adds the "Reviewed by Darren Drake, Attorney at Law, on [date]" line;
- switches that page's text from "waiting" to live.

**Pop-up:** Claude reads back each edit → **That's what he wrote** / **Fix one**

### 6.3 Pack 2: the 12 new pages (hand over Thu 19 Nov, back by Wed 25 Nov)
Same as 6.1 and 6.2.

### 6.4 Pack 3: the Guides (hand over Fri 20 Nov, back by Fri 4 Dec at the latest)
Same as 6.1 and 6.2. **Anything still unapproved on Fri 4 Dec stays hidden at launch.**

---

## Part 7 — Ads and statistics accounts (about 45 minutes; any time before launch)

These IDs show in every page's code, so they are **not secrets**. Paste them into the chat so Claude can check them. Cloudflare's own menus may be named slightly differently from what's below. If so, tap **Done, but it looked different** and say what you see.

### 7.1 [You] Google Analytics 4
1. **analytics.google.com** → **Admin** (gear, bottom left) → **Create** → **Property**:
   - **Name:** `Darren Drake Law – darrendrakelaw.com`
   - **Time zone:** United States, Central
   - **Currency:** USD
2. Business details → **Web** → website `https://darrendrakelaw.com` → stream name `Website` → **Create stream**. Copy the **Measurement ID** (`G-…`).
3. **Admin** → **Data collection and modification** → **Data collection** → **Google signals: off**.
4. **Admin** → **Data retention** → **2 months** → **Save**.

### 7.2 [You] Google Ads: two conversions
1. **ads.google.com** → **Goals** → **Conversions** → **Summary** → **+ New conversion action** → **Website** → `darrendrakelaw.com` → **Scan**.
2. **+ Add a conversion action manually**:
   - **Category:** Submit lead form
   - **Name:** `Form sent`
   - **Value:** Don't use a value
   - **Count:** One

   Then **Done**.
3. Repeat with **Category: Contact**, **Name: `Phone tapped`**.
4. **Save and continue** → **Use Google Tag Manager** or **Set up the tag yourself** → copy the **Conversion ID** (`AW-…`) and each conversion's **label**.
5. **Enhanced conversions: off.** **Don't create remarketing audiences.**

### 7.3 [You] Meta Pixel
1. **business.facebook.com** → **Events Manager** → **Connect data** → **Web** → name `darrendrakelaw.com` → **Create**.
2. Choose to install the code manually. Claude does the code, so you only need the **Dataset ID** (a long number).
3. **Settings** → **Automatic advanced matching: off**. **Don't** set up the Conversions API. **Don't** build "website visitor" audiences.

### 7.4 [You] Put the IDs into Cloudflare
Worker → **Settings** → **Build** → **Variables and secrets**. This is the **build** box, because these are baked into the pages. Add:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_GA_ID` | `G-…` |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | `AW-…` |
| `NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL` | the "Form sent" label |
| `NEXT_PUBLIC_GOOGLE_ADS_CALL_LABEL` | the "Phone tapped" label |
| `NEXT_PUBLIC_META_PIXEL_ID` | the dataset number |

Then **Deployments** → **Retry deployment**.

### 7.5 [You + Claude] Check the banner
- **[Claude]** runs the consent test with your real IDs.
- **[You]** open the preview in a private window:
  - the cookie banner appears;
  - tap **Reject**: nothing changes;
  - open **Contact**: no banner and no tags there.

**Pop-up options:** **Banner shows and Contact is clean** / **Something's off**

---

## Part 8 — Final quality checks (Mon 30 Nov – Wed 2 Dec)

### 8.1 [Claude] The full test pass
- **Accessibility:** checked at phone, tablet and desktop widths, with the menu open and every form state; smallest phone (320 px); keyboard only; 200% zoom; reduced motion; high contrast.
- **Speed and size:** speed scores on every page; the 3 MB limit.
- **Text:**
  - no leftover "waiting" text on any page that goes live;
  - every link works;
  - every old ddrakelaw.com address lands on the right new page;
  - button sizes are right;
  - a banned-words scan of every page, description and image label ("specialist", "free consultation", "best" and the rest).
- **The form:** a double tap on Send; the network dropping mid-send.
- **Security:** the security rules switched from "report" to "enforce"; zero console errors; security updates applied.
- **Write-ups:** `docs/test-report.md`, plus `docs/copy-risk-list.md` for Darren. Claude never rewrites a legal sentence itself.

**Pop-up:** a plain-English summary → **OK** / **Questions**

### 8.2 [You] The 30-minute real-phone test
Use an **iPhone (Safari)** and, if you can borrow one, an **Android (Chrome)**. Claude asks about each line in turn, each answered **Pass / Problem**:
1. Home loads quickly on cell data (Wi-Fi off). The headline and **Contact us** button show without scrolling.
2. The menu opens, every link works, and it closes with the X.
3. The **Call** button dials (615) 546-5551 (hang up).
4. The **Text** button opens Messages to the office number.
5. Every practice page opens; "Other practice areas" works; the back button returns where you were.
6. The **Contact** form: send with everything empty. The errors read clearly and the first box is highlighted.
7. Send a real test ("TEST – please delete") with a court date, a charge and an agency. You get "Message received". Kelly and Darren get the email and PDF, and the three new fields are in the PDF.
8. Pay an invoice / Schedule a call / Facebook / Reviews on Google open the right pages.
9. Turn the phone sideways: nothing is cut off.
10. **iPhone:** Settings → Accessibility → Display & Text Size → Larger Text up two notches. Nothing overlaps.
11. **VoiceOver** (iPhone: triple-click the side button if it's set up, or Settings → Accessibility → VoiceOver). Swipe through Home. It reads the headline, the buttons and the courthouse picture's label.
12. The light/dark theme button switches, and the choice sticks.
13. Share the home page link to yourself by text. The preview card shows the new logo.
14. The address and hours are right everywhere you see them.
15. Anything that felt slow, odd or ugly: say it in your own words.

### 8.3 [Darren] Legal and ethics checklist (about 20 minutes)
Claude makes a 3-page printout of the checklist in `plans/signal-website-plan.md`, Section 9. It covers:
- RPC 7.1 truthfulness and the 2-year copies;
- no specialist wording, results or comparisons;
- the RPC 1.18 prospective-client warning beside the form;
- the texting note;
- no tags on the form page;
- whether the advertising rules changed since 2021 (Darren checks tncourts.gov).

Darren ticks each line and signs it. Optional: an informal call to the Board's Ethics Counsel, 1-800-486-5714.
**Pop-up options:** **Signed — I'll attach a photo** / **He has questions on: …**

### 8.4 [Claude] Fix and re-check
Anything from 8.1–8.3 gets fixed, and the checks run again.
**Pop-up options:** **All clear** / **Still open: …**

---

## Part 9 — Darren's sign-off and the launch date (by Thu 3 Dec)

### 9.1 [Claude] The sign-off packet
- `docs/sign-off-packet.md` and a PDF. Page 1 is a "tap these, in this order" walkthrough. After that:
  - every change since the September design lock;
  - which pages go live and which stay hidden (and why);
  - a sign-off block: content, logo, picture, legal checklist, launch date and time, who's on the phones.
- The approved version gets a release tag in GitHub.
- An archive copy of the final preview is saved for the 2-year advertising record.

### 9.2 [You + Darren] 20-minute walkthrough
On Darren's phone (he signs into the preview with his emailed code) and on a computer: follow page 1 of the packet. Then send **one test inquiry together**: "TEST, please delete".
**Pop-up options:** **He's happy** / **He wants changes: …** (Claude makes them, and you repeat this step)

### 9.3 [Darren] His written "go"
Darren emails or texts you the line in **Appendix A2**, naming the launch date and time.
**[Claude]** finds it in your Gmail, if it came by email (or you paste the text), and records it in `docs/DECISIONS.md` as D16, with the date and where it's filed.
**Pop-up options:** **Sent — it's in my email** / **He texted it — here it is** / **Not yet**
**No written go means no Part 11.**

### 9.4 [You] Heads-up to Kelly and the calendar
Send Kelly the **Appendix A3** text. Then pick the morning:
**[Claude]** checks your Clio calendar for court settings that morning and suggests the slot. You put a 2-hour block on the calendar.
**Pop-up options:** **Tue 8 Dec 8:30** / **Wed 9 Dec 8:30** / **Thu 10 Dec 8:30** / **Other**

---

## Part 10 — Launch prep, the week before (Mon 30 Nov – Fri 4 Dec)

### 10.1 [You] Photograph the old site's settings (15 min)
In whichever Cloudflare account holds **ddrakelaw.com** (from 3.4):
1. **DNS** → **Records** → **Import and Export** → **Export**. A text file downloads. Attach it in the chat; Claude saves it in the repo's launch folder.
2. Screenshot each of these pages and attach them:
   - **Rules** → **Overview** (and **Page Rules**, if there are any);
   - **SSL/TLS** → **Overview**;
   - **Speed** → **Optimization**;
   - **Scrape Shield**.

   **[Claude]** reads them and flags any old rule that would fight the forward.
3. In **DNS** → **Records**, check that `ddrakelaw.com` and `www` show an **orange** cloud (Proxied). They should already: today the site answers through Cloudflare.

### 10.2 [You / old designer] Back up WordPress (15 min, or one email)
- If you or Darren can log into **ddrakelaw.com/wp-admin**: **Tools** → **Export** → **All content** → **Download Export File**. Attach it. If the old site's form saved entries, export those too.
- Ask whoever hosts it for a **full backup (files and database)**. Claude drafts the email for you.
- The old server stays untouched for 90 days after launch (D15).

### 10.3 [You] Make a safe path for changes after launch (10 min)
Before launch, every change Claude saves goes straight to the preview. **After launch it would go straight to the public site**, so set up a "live" lane:
1. **GitHub** → **quinn-create/darrenwebsite-1** → branch dropdown (top left) → type `live` → **Create branch live from claude/sleepy-clarke-wjlh48**.
2. Cloudflare → worker → **Settings** → **Build** → **Branch control** → **Production branch:** `live` → **Save**. Turn on **Builds for non-production branches**.

After this:
- Claude's changes land on a private preview first.
- Making them public = a **pull request into `live`** that you merge with one click. Claude walks you through it each time.

**Pop-up options:** **Set up** / **Skip — I'd rather changes go straight live**

### 10.4 [Claude] Production settings check
Claude lists, **by name only**, every variable the live site needs and asks you to confirm each one is present in Cloudflare. It also confirms that the production build passes with zero waiting text.

### 10.5 [You + Claude] Rehearse the rollback (10 min, changes nothing)
Claude walks you through the **Rollback card** below, one pop-up per line. You find each button, but don't click it.

### 10.6 [Darren or you] Search Console baseline (5 min)
In the **ddrakelaw.com** property:
1. **Performance** → **Last 3 months** → **Export** → **Download CSV**. Attach it.
2. Check **Security & Manual actions** → both say **No issues**.

### 10.7 [Claude + You] Final preview run
Claude runs the old-address test, accessibility and the form tests one more time. You send one more test inquiry, and Kelly confirms she got it.
**Pop-up options:** **All green — ready for launch morning** / **Something failed**

---

## Part 11 — Launch morning (about 90 minutes; Kelly on the phones)

Have open: the Cloudflare account that holds darrendrakelaw.com, the one that holds ddrakelaw.com (if different), this chat, and your phone.

### 11.0 [You] Go / no-go (one pop-up, five checks — every one must be yes)
1. Darren's written go is on file (9.3).
2. Kelly is at the office, on the phones.
3. You have 2 clear hours, with no court.
4. Claude's final production build passed this morning.
5. The rollback card is open in another tab.

Any **no** = stop. Pick another morning.

### 11.1 [Claude] Last build check
Claude:
- builds the production version from the `live` branch;
- confirms zero waiting text, all tests green, the size under the limit;
- confirms that every unapproved page is switched off.

### 11.2 [You] Turn on production (10 min)
1. Worker → **Settings** → **Build** → **Variables and secrets** → `SITE_ENV` → change to `production`.
2. Worker → **Settings** → **Variables and Secrets** → `SITE_ENV` → change to `production` → **Deploy**.
3. **Deployments** → **Retry deployment** → wait for **Success**.

### 11.3 [You] Attach darrendrakelaw.com (5 min)
Worker → **Settings** → **Domains & Routes** → **+ Add** → **Custom domain** → `darrendrakelaw.com` → **Add domain**. Wait until it says **Active** (usually 1–5 minutes). Add only the bare name, not `www`.

### 11.4 [You] Send www to the bare address (5 min)
1. Cloudflare → **darrendrakelaw.com** → **DNS** → **Records** → **Add record**:
   - **Type:** A
   - **Name:** `www`
   - **IPv4:** `192.0.2.1`
   - **Proxy:** **Proxied** (orange)

   Then **Save**.
2. **Rules** → **Redirect Rules** (or **Rules** → **Overview** → **Create rule** → **Redirect Rule**) → **Create rule**:
   - template **"Redirect from WWW to root"**
   - **301**
   - keep the path and the query string

   Then **Deploy**.

### 11.5 [Claude] Live checks on the new address
- **https://darrendrakelaw.com** shows the padlock.
- `http://` and `www.` reach it in one hop.
- Every page loads, with no waiting text.
- `sitemap.xml` and `robots.txt` load, and Google is allowed in.
- The security rules are live; zero errors.
- The search-engine data is valid.

**Pop-up options:** **All green** / **RED: …** (with what to do)

### 11.6 [You + Kelly] Live test inquiry
From your phone, on **darrendrakelaw.com/contact/**, send "TEST, please delete".
**Pop-up** (one question each, Yes/No): "Message received" on screen? / Kelly's email with PDF? / Darren's email? / Telegram?
**Any No = rollback trigger.** Claude tells you which line of the card to use.

### 11.7 [You or the ddrakelaw.com owner] Forward the old address (10 min)
In the account that holds **ddrakelaw.com**: **Rules** → **Redirect Rules** → **Create rule**:
- **Rule name:** `Move to darrendrakelaw.com`
- **If incoming requests match:** **Custom filter expression** → **Hostname** · **is in** · `ddrakelaw.com` `www.ddrakelaw.com`
- **Then:** URL redirect · **Type: Dynamic** · **Expression:** `concat("https://darrendrakelaw.com", http.request.uri.path)`
- **Status code: 302 (temporary) for now.** This keeps a rollback clean, because browsers don't memorise a 302. It changes to 301 on Day 2 (12.2).
- Tick **Preserve query string**

Then **Deploy**.
**Never touch** ddrakelaw.com's MX, SPF, DKIM, DMARC, the Google verification record, or the `mail` / `ftp` records.

### 11.8 [Claude] Old addresses check
Claude tests every old address in the redirect map (`plans/signal-website-plan.md`, Appendix B), for example `ddrakelaw.com/areas-of-practice/dui/`. Each one must land on the matching new page, and the junk addresses must return "gone".
**Pop-up options:** **All land correctly** / **RED: X of Y failed** (more than 5% = rollback trigger)

### 11.9 [You] Google Search Console for the new address (10 min)
1. **search.google.com/search-console** → property menu → **+ Add property** → **Domain** → `darrendrakelaw.com` → **Continue**.
2. **Verify with Cloudflare** (it signs you in and adds the record for you) → **Verify**.
3. **Sitemaps** → `sitemap.xml` → **Submit**.
4. **URL inspection** → paste `https://darrendrakelaw.com/` → **Request indexing**. Claude gives you the 5 most important pages to do the same.

### 11.10 [Darren] Google Business Profile website field (2 min)
Darren searches **Darren Drake Law** while signed in → **Edit profile** → **Contact** → **Website** → `https://darrendrakelaw.com/` → **Save**. Same on his **Facebook page**: **Edit details** → **Website**.

### 11.11 [You] Let AI search tools read the site (5 min)
Cloudflare → **darrendrakelaw.com** → **Security** → **Settings** (or **AI Crawl Control**):
- **Block AI bots:** **off**
- **Manage robots.txt** (Cloudflare's version): **off**
- **Bot Fight Mode:** **off**

### 11.12 [You] Free visitor statistics (5 min)
Cloudflare → **Analytics & Logs** → **Web Analytics** → **Add a site** → `darrendrakelaw.com` → **Automatic setup**. Then **Manage site** → **Rules** → exclude paths `/contact*` and `/intake*`.

### 11.13 [You] Uptime alerts (10 min)
1. **uptimerobot.com** → free account → **My Settings** → **Alert contacts** → add Kelly's and your email. Each of you clicks the confirmation email.
2. **+ New monitor** → **Keyword**:
   - **URL:** `https://darrendrakelaw.com/`
   - **Keyword:** `Darren Drake`
   - **Alert when:** keyword **not exists**
   - **Interval:** 5 min
   - **Alert contacts:** both

   Then **Create**.
3. Repeat for `https://darrendrakelaw.com/contact/` with keyword `Send message`.

### 11.14 [You] Link-preview cards (5 min)
Paste the home page and one practice page into the **Facebook Sharing Debugger** (developers.facebook.com/tools/debug) → **Scrape Again**. Then text the home link to yourself. Each should show the navy card with the logo and Darren's photo.

### 11.15 [Claude] Launch record
Claude:
- saves a dated archive (PDF and screenshots of every live page) for the firm's 2-year advertising record (RPC 7.1(c)), and uploads a copy to Drive;
- writes `docs/launch-report.md`;
- records the launch time.

**Pop-up:** "Live. Tell Darren and Kelly?" → **Done** (the Appendix A4 text is ready)

---

## Rollback card (keep it open on launch morning)

**Roll back if any of these happen:**
- inquiries can't be delivered;
- the site keeps showing errors;
- more than 5% of old addresses fail;
- anything about the firm's phones or email is affected.

| What broke | Do this | How fast |
|---|---|---|
| A problem on the new site | Worker → **Deployments** → the previous good one → **⋯** → **Rollback** | Under a minute |
| The forward from ddrakelaw.com | ddrakelaw.com → **Rules** → **Redirect Rules** → toggle **Move to darrendrakelaw.com** **off**. The old WordPress site answers again, because it was never changed. | Under a minute (it's a 302 on day 1) |
| The form fails | Leave the site up (the form shows the phone number when it can't send). Kelly watches the phone. Claude fixes it, then you re-test with step 11.6. | — |
| Everything | Do both of the first two rows, then tell Claude. darrendrakelaw.com can be detached: worker → **Domains & Routes** → **⋯** → **Remove**. | A few minutes |

---

## Part 12 — After launch

| When | Step | Who | What |
|---|---|---|---|
| Wed 9 Dec (Day 1) | 12.1 | Claude | Old addresses still forward; uptime green; any "not found" pages (you send a screenshot of Search Console → **Pages** if asked); inquiries arriving |
| **Thu 10 Dec (Day 2)** | **12.2** | **You** | If Day 1 was clean: ddrakelaw.com → **Rules** → edit **Move to darrendrakelaw.com** → status **301** → **Save**. Then, in Search Console, open the **ddrakelaw.com** property → **Settings** → **Change of address** → choose **darrendrakelaw.com** → **Validate & update**. This carries the old site's Google standing over. |
| Tue 15 Dec (Day 7) | 12.3 | Claude + you | Indexing in Search Console; statistics look sensible; worker → **Observability** / **Metrics**: any **"exceeded CPU"** errors? If more than 0 → **Workers & Pages** → **Plans** → **Workers Paid ($5/month)**. Update directory listings (Avvo, Justia, FindLaw, Martindale, BBB) to the new address. |
| Tue 22 Dec (Day 14) | 12.4 | Claude + Kelly | CPU check again; one live "TEST, please delete" inquiry; PageSpeed Insights on Home, DUI/DWI and Contact |
| Thu 7 Jan 2027 (Day 30) | 12.5 | Claude | First one-page monthly report; **set up the monthly guide task** (Claude creates the scheduled task with your OK: it drafts one guide a month for Darren's sign-off) |
| Every month | 12.6 | Claude | Speed, accessibility, links, security updates, banned-words scan, one test inquiry; an archive copy if anything changed |
| **By Fri 5 Mar 2027** | **12.7** | **Darren / domain holder** | **Renew ddrakelaw.com.** It expires **13 Mar 2027**, and if it lapses every old link breaks. Turn on auto-renew and keep it for at least 2–3 years. |
| Mon 8 Mar 2027 (Day 90) | 12.8 | Claude + Darren | Search checks again; list what still uses the old WordPress server; then retire it (D15) |
| Through Dec 2028 | 12.9 | Archive owner | Keep the old site's archive (`archive/ddrakelaw.com-2026-09-24/`) and every release archive for 2 years after last use (RPC 7.1(c)) |
| Later, not part of launch | 12.10 | — | The live Google star rating (after Darren signs the review policy); moving the code to a firm GitHub organization (D13) |

---

## Appendix A — Messages, ready to send

**A1. To Darren: what I need (step 3.1)**
> Darren, getting your new site ready to go live early December. I need six things when you get a minute:
> 1. Link to your Facebook page
> 2. Link to your Google Business Profile, and check it says exactly: Darren Drake Law PLLC, 138 S. Cannon Ave, Murfreesboro TN 37129, (615) 546-5551, Mon–Fri 8–5
> 3. Your MyCase payment link (for a "Pay an invoice" button)
> 4. A link people can use to schedule a call, or "none"
> 5. Can you log into a Cloudflare account, or do you know who built the old ddrakelaw.com site? I need whoever controls it to forward it to the new address on launch day
> 6. In Google Search Console for ddrakelaw.com: Settings → Users and permissions → Add user → quinn@mborolegal.com → Owner
> Thanks — Quinn

**A2. Darren's written go (step 9.3) — he sends this to you**
> I've reviewed the new website at the private preview and approve it to go live at darrendrakelaw.com on [Tuesday, December 8, 2026] at [8:30 AM], with ddrakelaw.com forwarding to it. Pages I haven't approved stay hidden until I do. — Darren Drake

**A3. To Kelly (step 9.4)**
> Kelly, Darren's new website goes live [Tuesday Dec 8] around 8:30. Can you be on the phones 8:30–10:30? You'll get a test inquiry email (and Telegram) from me marked TEST: just tell me it arrived, then delete it. If anyone calls saying the site looks different, that's expected. Thanks!

**A4. Live (step 11.15)**
> We're live: https://darrendrakelaw.com — the old ddrakelaw.com forwards to it. Test inquiry came through. If you see anything off, text me a screenshot.

## Appendix B — Every setting the site uses (names only, never values)

| Name | Where in Cloudflare | Type | Set in step |
|---|---|---|---|
| `SITE_ENV` | Build variables **and** Variables and Secrets | Text: `preview`, then `production` on launch morning | 2.4, 2.7, 11.2 |
| `NODE_VERSION` | Build variables | Text: `22` | 2.4 |
| `SITE_URL` | Variables and Secrets | Text | 2.7 |
| `INTAKE_DESTINATION`, `INTAKE_EMAIL_FROM`, `INTAKE_EMAIL_TO` | Variables and Secrets | Text | 2.7 |
| `RESEND_API_KEY` | Variables and Secrets | **Secret** | 2.7 |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Build variables | Text | 2.8 |
| `TURNSTILE_SECRET_KEY` | Variables and Secrets | **Secret** | 2.8 |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Variables and Secrets | **Secret** | 2.9 |
| `NEXT_PUBLIC_PAY_URL`, `NEXT_PUBLIC_SCHEDULE_URL`, `NEXT_PUBLIC_FACEBOOK_URL`, `NEXT_PUBLIC_GOOGLE_PROFILE_URL` | Build variables (Claude may build these into the site instead) | Text | 5.1 |
| `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GOOGLE_ADS_ID`, `NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL`, `NEXT_PUBLIC_GOOGLE_ADS_CALL_LABEL`, `NEXT_PUBLIC_META_PIXEL_ID` | Build variables | Text | 7.4 |

---

## Tracker

Claude updates this table after every step and saves it to GitHub. Status: `todo`, `doing`, `done`, `parked` (with the reason) or `skipped`.

| Step | What | Who | Status | Date | Note |
|---|---|---|---|---|---|
| 1.1 | Confirm the 3 Nov decisions | You | todo | | |
| 1.2 | Record them in DECISIONS.md | Claude | todo | | |
| 2.1 | Cloudflare two-step login | You | todo | | |
| 2.2 | Buy darrendrakelaw.com | You | todo | | Unregistered on 8 Nov — buy first |
| 2.3 | Is ddrakelaw.com in your account? | You | todo | | |
| 2.4 | Create the website on Cloudflare | You | todo | | |
| 2.5 | Lock the preview (Access) | You | todo | | |
| 2.6 | Resend domain | You | todo | | |
| 2.7 | Email settings and key | You | todo | | |
| 2.8 | Turnstile | You | todo | | |
| 2.9 | Telegram for Kelly | You + Kelly | todo | | Optional now |
| 2.10 | Rebuild and first test | You | todo | | |
| 3.1 | Text Darren the six asks | You | todo | | |
| 3.2 | Pass on his answers | You → Claude | todo | | |
| 3.3 | Google profile matches | Darren | todo | | |
| 3.4 | Who holds ddrakelaw.com | You | todo | | Deadline Fri 27 Nov |
| 3.5 | Office line takes texts | You + Kelly | todo | | |
| 3.6 | Search Console Owner access | Darren | todo | | |
| 4.1 | Find the D3 logo files | Claude | todo | | |
| 4.2 | Logo on the site | Claude | todo | | |
| 4.3 | Courthouse picture options and pick | Claude → Darren | todo | | |
| 4.4 | Place the picture | Claude | todo | | |
| 5.1 | Form fields, text button, links | Claude | todo | | Subject-line question |
| 5.2 | Home and Practice Areas layout | Claude | todo | | |
| 5.3 | New sections on the 5 pages + Pack 1 | Claude | todo | | |
| 5.4a | DUI with priors, Underage DUI, Drug DUI | Claude | todo | | |
| 5.4b | Assault, Orders of protection, Harassment & stalking | Claude | todo | | |
| 5.4c | Drug charges, Theft, Vandalism | Claude | todo | | |
| 5.4d | Probation, Traffic & license, Resisting/evading + Pack 2 | Claude | todo | | |
| 5.5 | Guides + Pack 3 | Claude | todo | | |
| 5.6 | Statistics, AI crawlers, uptime settings | Claude | todo | | |
| 6.1 | Pack 1 to Darren | Claude → You | todo | | By Fri 13 Nov |
| 6.2 | Pack 1 back and recorded | You → Claude | todo | | |
| 6.3 | Pack 2 out and back | You → Claude | todo | | Back by Wed 25 Nov |
| 6.4 | Pack 3 out and back | You → Claude | todo | | Back by Fri 4 Dec |
| 7.1 | GA4 | You | todo | | |
| 7.2 | Google Ads conversions | You | todo | | |
| 7.3 | Meta Pixel | You | todo | | |
| 7.4 | IDs into Cloudflare | You | todo | | |
| 7.5 | Banner check | You + Claude | todo | | |
| 8.1 | Full test pass | Claude | todo | | |
| 8.2 | 30-minute phone test | You | todo | | |
| 8.3 | Legal checklist signed | Darren | todo | | |
| 8.4 | Fix and re-check | Claude | todo | | |
| 9.1 | Sign-off packet | Claude | todo | | |
| 9.2 | Walkthrough with Darren | You + Darren | todo | | |
| 9.3 | Darren's written go | Darren | todo | | Required before Part 11 |
| 9.4 | Kelly heads-up and the morning picked | You | todo | | |
| 10.1 | Old site settings exported | You | todo | | |
| 10.2 | WordPress backup | You | todo | | |
| 10.3 | "live" branch | You | todo | | |
| 10.4 | Production settings check | Claude | todo | | |
| 10.5 | Rollback rehearsal | You + Claude | todo | | |
| 10.6 | Search Console baseline | Darren / You | todo | | |
| 10.7 | Final preview run | Claude + You | todo | | |
| 11.0 | Go / no-go | You | todo | | |
| 11.1 | Last build check | Claude | todo | | |
| 11.2 | Production on | You | todo | | |
| 11.3 | Attach darrendrakelaw.com | You | todo | | |
| 11.4 | www redirect | You | todo | | |
| 11.5 | Live checks | Claude | todo | | |
| 11.6 | Live test inquiry | You + Kelly | todo | | |
| 11.7 | Forward ddrakelaw.com (302) | You / owner | todo | | |
| 11.8 | Old addresses check | Claude | todo | | |
| 11.9 | Search Console new property | You | todo | | |
| 11.10 | Google profile and Facebook website field | Darren | todo | | |
| 11.11 | AI crawlers allowed | You | todo | | |
| 11.12 | Web Analytics | You | todo | | |
| 11.13 | UptimeRobot | You | todo | | |
| 11.14 | Link-preview cards | You | todo | | |
| 11.15 | Launch record and archive | Claude | todo | | |
| 12.1 | Day 1 check | Claude | todo | | Wed 9 Dec |
| 12.2 | 301 + change of address | You | todo | | Thu 10 Dec |
| 12.3 | Day 7 check, CPU, directories | Claude + You | todo | | Tue 15 Dec |
| 12.4 | Day 14 check | Claude + Kelly | todo | | Tue 22 Dec |
| 12.5 | Day 30 report, monthly guide task | Claude | todo | | Thu 7 Jan 2027 |
| 12.7 | Renew ddrakelaw.com | Darren / holder | todo | | Before 13 Mar 2027 |
| 12.8 | Day 90; retire WordPress | Claude + Darren | todo | | Mon 8 Mar 2027 |
