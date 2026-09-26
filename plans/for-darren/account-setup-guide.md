# Account setup guide for the firm

This guide lists the accounts the new website needs. Each one is **owned by the firm**, with two-step login turned on, and its password is kept in the firm's shared password manager. You don't need to do anything technical beyond creating the accounts and adding people. Claude uses only the access you give this project, and the firm can remove that access at any time.

Do these in order. Check current prices before signing up; the figures below come from the plan's research on 24 September 2026.

## 1. Find what the firm already has (Phase 0)

| Account | What to find out | Who usually knows |
|---|---|---|
| Domain registrar (where ddrakelaw.com was bought) | Login owner, expiry date. Turn on **auto-renew** and **registrar lock**. | Whoever set up the website, or the firm's IT contact |
| Cloudflare (runs the domain's settings today) | Login owner. Add yourself as a member. | Same |
| Google Workspace admin (firm email) | Who the admin is. **Nothing in email changes at launch.** | Office manager or IT contact |
| Google Search Console | Who owns the ddrakelaw.com property. Add yourself. | Same as the website |
| Google Business Profile | Whether one exists, who owns it, and whether the old "Drake Drake & Frost" listing is still live | Darren or office manager |
| WordPress site and its server | Who administers them (the old site mentions a vendor, "Tech Bravo"). They need to run the security check in the plan (Phase 4). | Darren |
| Case-management system (for example Clio) | Which one the firm itself uses, and whether it includes an intake or leads module | Office manager |

## 2. Create new accounts (Phases 1–3)

| Account | Why it's needed | Plan / cost (approximate) |
|---|---|---|
| **GitHub organization** for the firm | Holds the website's code. The code currently sits under a personal account; move it into the firm's organization. | Free |
| **Vercel** (hosting) | Runs the new website and its private previews | Pro, about $20 per paid member a month |
| **Postmark** (sending inquiry emails) | Delivers website inquiries to the firm's inbox, reliably | About $16.50 a month, plus about $5 for 7-day message retention |
| **Resend** (backup sender, optional) | Takes over if Postmark fails | Free plan |
| **Cloudflare Turnstile** widget (in the existing Cloudflare account) | Stops spam without a puzzle for most people. Create a **new** widget for the new site. | Free |
| **Upstash** (rate-limit store) | Stops repeated or automated sends | Free tier |
| **Plausible** (visitor statistics, cookie-free) | Counts visits and form starts, with no personal details | Small monthly fee |
| **UptimeRobot** (alerts) | Emails the firm if the site goes down | Free tier |

Expect about **$40–70 a month** in total. The firm decides whose card pays (the "billing owner").

## 3. Rules for secret keys

- Some services give you a secret key or "token". **Paste it straight into Vercel's settings** (Project → Settings → Environment Variables).
- **Never** send a key by email, text or chat, including to Claude.
- Rotate keys every three months, and whenever someone with access leaves.

## 4. People and access

- Name **at least two people** who will read website inquiries. They also confirm test inquiries and delete them.
- Name one person to receive alerts (site down, delivery failed, security updates).
- Agree who removes someone's access when they leave the firm.
- Name an **archive owner** who keeps a copy of each version of the website for 2 years, in firm storage. That includes the old-site copy in `archive/ddrakelaw.com-2026-09-24/`.

## 5. What does *not* change

- Firm email (Google Workspace) keeps working exactly as it does now.
- On launch day only the two domain entries that point visitors to the website change. The rest of the steps are in the plan, Section 11.
