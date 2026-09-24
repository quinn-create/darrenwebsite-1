# ddrakelaw.com live-site audit (read-only, fetched 2026-09-24)

I fetched everything with curl as GET or HEAD requests. I submitted no forms and logged in nowhere. Raw captures are in `/tmp/claude-0/-home-user-darrenwebsite-1/1d991929-4df0-5cc8-84a7-a764a32f1dfc/scratchpad/audit/`.

**What I could not fetch or verify:**
- **Wayback Machine:** the CDX API connection was reset by the proxy twice, so historic URLs could only be found through the sitemaps, the REST API and guessed paths.
- **Google Business Profile:** not checked directly. No Google pages were fetched.
- **Avvo badge:** its rating is drawn by JavaScript and was not rendered.
- **Backlinks and Search Console data:** not available to me.

**Stack:** WordPress 6.9.9 with the Twenty Fourteen theme and leftover references to the old "infocus" theme. It is served through Cloudflare from a CyberPanel / OpenLiteSpeed server.

---

## 1. URL inventory

The new Signal site uses these routes: `/`, `/practice-areas`, `/practice-areas/criminal-defense`, `/practice-areas/dui-dwi`, `/practice-areas/expungement`, `/about`, `/contact`, `/intake`, `/privacy`.

| Current URL | Page title | Purpose | Recommended new route | Redirect (301) | Notes |
|---|---|---|---|---|---|
| `/` (WP page 12, slug `criminal-defense`) | Darren Drake - Criminal Defense Attorney (visible H1 "About") | Home page, which is Darren's full bio | `/` | none (same URL) | The home page holds the bio. Move the bio to `/about`. The nav item "About" also points to `/`. Page has 3 `<h1>` tags, one of them an empty widget title. Last modified 2024-07-11. |
| `/criminal-defense/` | (301 to `/` by WordPress) | Slug of page 12 | `/practice-areas/criminal-defense` | `/criminal-defense/` → `/practice-areas/criminal-defense` | Could go to `/about` instead, because this slug belongs to the bio page. |
| `/areas-of-practice/` | Areas of Practice - Darren Drake | Practice overview and firm philosophy | `/practice-areas` | `/areas-of-practice/` → `/practice-areas` | In nav. Modified 2018-03-12. The og:image points to an old theme file (`infocus/.../shadow_top.png`) and a broken `timthumb.php` image. |
| `/areas-of-practice/criminaldefense/` | Criminal Defense - Darren Drake | Practice page | `/practice-areas/criminal-defense` | yes | In nav. Modified 2022-08-05. |
| `/areas-of-practice/dui/` | DUI / DWI - Darren Drake | Practice page | `/practice-areas/dui-dwi` | yes | In nav. Linked from the home bio. Modified 2016-05-05. |
| `/areas-of-practice/expungement/` | Expungement - Darren Drake | Practice page | `/practice-areas/expungement` | yes | In nav. Modified 2014-09-17. Law content dates from 2012. |
| `/areas-of-practice/juvenile-defense/` | Juvenile Defense Attorney - Darren Drake | Practice page, not in nav | `/practice-areas/criminal-defense` (or a new page if the firm confirms juvenile work) | yes | Indexed and in the sitemap. Juvenile defense is not a confirmed practice area. Modified 2015-07-07. |
| `/areas-of-practice/criminal-defense/` | (301 to `/` by WordPress) | Accidental alias | `/practice-areas/criminal-defense` | yes | |
| `/dui/`, `/expungement/`, `/juvenile-defense/` | (WordPress guess-redirects) | Short aliases | matching practice route | yes, add them explicitly | They work today only because WordPress guesses the target on a 404. |
| `/testimonials/` | Testimonials - Darren Drake | Reviews page | `/about` (or `/`) | yes | In nav. **It shows no testimonials.** Visitors see a plugin error: "REQUEST_DENIED: You must enable Billing on the Google Cloud Project…". |
| `/submit-a-testimonial/` | Submit A Testimonial - Darren Drake | Old testimonial form | `/contact` | yes | Not in nav but indexed. A broken shortcode shows as raw text, including a vendor email (see §2). |
| `/contact/` | Contact - Darren Drake | NAP details (name, address, phone) and a Gravity Forms contact form | `/contact` (primary action `/intake`) | only a trailing-slash normalisation | In nav. Modified 2024-08-30. |
| `/blog/` | Blog - Darren Drake | Empty posts page ("Nothing Found") | `/` | yes | In nav. **No posts exist** (`/wp-json/wp/v2/posts` returns `[]`). The only category, "News", has 0 posts. |
| `/feed/`, `/comments/feed/` | RSS | WordPress feeds | none | 301 to `/` or return 410 | Contain nothing useful. |
| `/areas-of-practice/divorce-2/`, `/areas-of-practice/areas/`, `/areas-of-practice/dui/dui-2/`, `/areas-of-practice/criminaldefense/criminal/`, `/areas-of-practice/expungement/expungement-2/`, `/areas-of-practice/juvenile-defense/juvenile-2/`, `/contact/ruco/`, `/testimonials/thank-you/`, `/criminal-defense/darren_drake/`, `/criminal-defense/john_drake/`, `/criminal-defense/tom_frost/`, `/criminal-defense/quote/`, `/criminal-defense/1005495_10151868677697457_1901419547_n/`, `/criminal-defense/darren-drake-attorney-murfreesboro/`, `/testimonials/darren-drake-attorney-murfreesboro-4/`, `/criminal-defense/darren-drake/`, `/criminal-defense/drake-darren-web_0090a_pp/` | "<filename> - Darren Drake" | Image attachment pages (17 URLs in `attachment-sitemap.xml`, all set to `index, follow`) | parent equivalent | 301 each to its parent's new route (bio images → `/about`) | These are thin pages. `divorce-2` suggests a divorce page existed before 2013. |
| `/sitemap_index.xml`, `/page-sitemap.xml`, `/attachment-sitemap.xml` | Yoast sitemaps | Real sitemaps | `/sitemap.xml` (generated by Next) | 301 to `/sitemap.xml` | `robots.txt` names `sitemap_index.xml`. |
| `/sitemap.xml` | Static file (Last-Modified 2025-02-13, 9.2 MB) | **Spam sitemap**: 41,660 junk URLs like `/6668243_qpkgeeqfkxmexnek_24_come_9021_…`, all dated 2016-09-05 | replaced by the new `/sitemap.xml` | none; do not copy it over | Sampled spam URLs return 404. **Security and SEO flag:** check whether it is submitted in Search Console and remove it. |
| `/?s=` | Search | WordPress search | none | none | |
| `/wp-content/uploads/2024/07/DRAKE-Darren-WEB_0090A_pp.jpg` | Current portrait | og:image and image-search target | new portrait asset | optional 301 | |
| `/wp-content/uploads/2016/09/google061b36be2fc32f66.html` (and `google148d39cafff1f949.html`) | Search Console verification files | Site verification | keep or re-verify | none | A `google-site-verification` meta tag is also on the home page: `97ppyG4Y--JjHZQuFPompEAafNA2SLihVTQGmAtI1jA`. |

**Host rules today:**
- `http://` and `www.` both redirect with 301 to `https://ddrakelaw.com/`.
- `http://www.` takes 2 hops. The new setup should do it in 1.
- Canonical URLs use HTTPS, no www, and a trailing slash.

**Next.js caution:**
- With `trailingSlash: false` (the default), `/areas-of-practice/dui/` would first get a 308 that strips the slash, then the custom redirect. That makes a 2-hop chain.
- Either set `trailingSlash: true`, or match both the slash and no-slash forms in `redirects()`, or do the redirects at the edge (the DNS is on Cloudflare, so Bulk Redirects are an option).
- `permanent: true` sends a 308, which search engines treat like a 301.

---

## 2. Content inventory (every item: **confirm with firm before reuse**)

### Identity, contact and business details

| Claim | Where | Flag |
|---|---|---|
| "Darren Drake – Attorney at Law" | `/` | |
| Address "138 S. Cannon Ave, Murfreesboro, TN 37129" | sidebar on every page, `/contact/` | Address is UNKNOWN in the project; this is a candidate |
| Phone "(615) 546-5551" and "615-546-5551" | sidebar on every page, `/contact/` | Matches the new number |
| "Fax: 615-895-0155" | `/contact/` | |
| "Darren Drake Law PLLC – is located at 138 S.Cannon Ave in Murfreesboro" | `/contact/` | Entity name is UNKNOWN in the project; this is a candidate |
| "We provide a full line of legal services by appointment only" | `/contact/` | "Full line" is broader than the 3 confirmed practice areas |
| "Our offices hours are Monday thru Friday from 8am to 5pm" | `/contact/` | Hours are UNKNOWN in the project. The form offers call times from 7:30 am to 6:30 pm, which does not match. |
| Google Maps link to the place "Drake Drake & Frost Attorneys at Law" at 35.845436,-86.390718 (CID 17313619456704413913) | `/contact/` | The listing appears to still carry the old association name |
| "Submit a Review" link that goes to a Google *search* for "darren drake murfreesboro" | `/contact/` | Asks for reviews |
| Email | none on the firm's pages | Only `biztech@techbravo.net` (a web vendor, "Tech Bravo") appears, inside the broken shortcode on `/submit-a-testimonial/` |

### Biography (home page `/`)

- **Navy service:**
  - "After high school, Darren enlisted in the United States Navy and served for six years primarily as an Electronics Technician."
  - "Between 1996 and 2002… USS Kittyhawk CV-63 in Yokosuka, Japan, and the USS Constellation CV-64 in San Diego." The ship's name is spelled "Kitty Hawk".
  - "one year tour on Diego Garcia"
  - "earned three Navy Achievement Medals"
  - "Enlisted Surface Warfare Specialist and Enlisted Aviation Warfare Specialist qualified." These are military qualifications. Do not let "specialist" read as a legal-specialty claim.
  - "firefighter and performed damage control"
- **Undergraduate:** "Southern Illinois University at Carbondale using the Illinois Veterans Grant and the Montgomery GI Bill… rugby… In May 2005, he received a Bachelors of Science in Electronics Systems."
- **Law school:** "Southern Illinois University School of Law." No graduation year is given. A summer in Ireland studying "Law of European Union… hosted by the University of Missouri School of Law."
- **Law school activities:**
  - "helped found the Veterans Legal Assistance Program at SIU"
  - "certified law clerk… Ventura County District Attorney's Office… **successfully prosecuted felony criminal preliminary hearings**." **Flag:** this reads as a results claim.
  - "Vice President for the SIU Graduate and Professional Student Government"
  - "President of Phi Alpha Delta Law Fraternity International, Stephen Douglas Chapter"
- **Personal:** moved to Murfreesboro with his wife after law school.
- **Community:** "Since 2011… volunteer firefighter in… Lascassas and he is currently the Assistant Chief of Lascassas Volunteer Fire Department." Confirm this is still current.
- **Past associations:**
  - "In 2011… with John Drake and Tom Frost to form: Drake Drake & Frost – An Association of Attorneys."
  - "In 2019 Darren formed an Association with Attorneys John Drake, David Clarke, and Ryan Freeze."
  - Confirm the current status of both.
- **Memberships:** "member of the T.A.C.D.L – Tennessee Association of Criminal Defense Attorneys and the Rutherford & Cannon County Bar Association." The site writes "Attorneys", while the organisation's usual name is "…Defense Lawyers"; confirm the exact name.
- **Bar admissions:** "admitted to practice State law within Tennessee and Federal law in the United States District Court for the Middle District of Tennessee."
- **Service area:** "represents clients in the courts of Rutherford County, Davidson County, Cannon County, Coffee County, Bedford County, Wilson County, and the central Tennessee area." `/areas-of-practice/` also says "I serve all of Middle Tennessee."
- **Practice focus and self-description:** "focuses his practice as a Criminal Defense Attorney, and DUI Attorney." "Darren is a skilled Murfreesboro Attorney," which links out to attorneymurfreesboro.com, a third-party site that advertises "free consultation" and personal injury and family law. **Flag:** self-praise, and an external link that promotes other practice areas.
- **Service promises:** "Client satisfaction is my number one priority… I promptly respond to all correspondence." **Flag:** borderline response promise.

### Practice content

- **`/areas-of-practice/`**
  - Covers cases "whether criminal or civil".
  - "promptly answer and return your phone calls."
  - "a very personal… approach that big firms don't offer… experience the difference." The same text appears as an image, `Quote.png`. **Flag:** comparative claim.
- **`/areas-of-practice/criminaldefense/`**
  - Offenses listed: assault, domestic assault, sexual assault, aggravated assault, rape, drug possession, drug sale, manufacture of narcotics, maintaining a dwelling, theft, robbery, burglary, violation of probation, underage consumption, DUI, implied consent, driving on a suspended license.
  - "**Call me to set up your free consultation.**" **Flag:** free-consultation offer.
- **`/areas-of-practice/dui/`**
  - Specific penalties: 48-hour minimum; 11 months 29 days; one week if BAC over .20; $350–$1,500 fines; 1-year licence loss; interlock device; 24 hours of litter pickup; second offence 45 days, 2-year loss, fines up to $3,500.
  - "**free consultation**." **Flag.**
  - **Flag:** legal content from 2016 needs legal review before any reuse.
- **`/areas-of-practice/expungement/`**
  - Based on "House Bill 2685… effective July 1, 2012", with a $350 filing fee, a 60-day DA response window, and re-petitioning every 2 years.
  - "**free consultation**." **Flag.**
  - "ensure that your right to possess a firearm is restored **on the first attempt**." **Flag:** outcome-style promise.
  - **Flag:** the statute has been amended since 2012; treat this as outdated.
  - Typo: "Governer".
- **`/areas-of-practice/juvenile-defense/`:** general Tennessee juvenile-law explainer. The practice area is unconfirmed.

### Guideline conflicts in the sidebar and meta (site-wide)

- **Meta description:** "Darren is **one of the highest rated** DUI and Criminal Defense Lawyers in Rutherford County." **Flag:** superlative claim.
- **Avvo rating badge:** "Top Attorney Criminal Defense", profile 4098784. **Flag:** rating.
- **NAOPIA "recognized member" badge:** National Academy of Personal Injury Attorneys, loaded over plain HTTP. **Flag:** award or membership seal, for a practice area that is not offered.
- **"The National Trial Lawyers Top 100" badge.** **Flag:** award.

### Legacy media (not shown on current pages but publicly reachable)

- **Old header images:**
  - Files: `/wp-content/uploads/2014/10/DDF-Header.jpg`, `/2017/05/DDF-Header.png`, `/2017/05/DDF-Header-1.png`.
  - Show "Drake Drake & Frost – An Association of Attorneys", **"120 E Main St | Murfreesboro | 615-410-3919"**.
  - Practice lists: "DUI/DWI | Divorce | Juvenile | Criminal | Family" and "DUI/DWI | Criminal | Personal Injury".
- **Group photo:** `DDF1.jpg` shows three attorneys.
- **Family photo:** `DarrenFD.jpg` shows Darren, a woman and a child at a fire truck. **Privacy:** do not reuse without consent.
- **Unused page images:** the media library has images attached to deleted pages, IDs 453 ("family") and 25 ("conservatorship"). This means family law and conservatorship pages existed at some point. They now return 404.

---

## 3. Existing contact form (`/contact/`, not submitted)

**Setup:**
- Gravity Forms 2.10.5, form ID 1, "orbital" theme.
- `<form method='post' enctype='multipart/form-data' id='gform_1' action='/contact/'>`, which posts back to the same WordPress page.
- Anti-spam: Cloudflare Turnstile (Gravity Forms Turnstile add-on 1.5.0) and an Akismet honeypot (`ak_hp_textarea`).
- The WP Mail SMTP plugin is installed, so notifications probably go out by email over SMTP. **The destination address cannot be seen from outside.**

**Fields:**
1. Your Name (required): First (`input_1.3`, autocomplete `given-name`) and Last (`input_1.6`, `family-name`).
2. Preferred Method of Contact: select with Email or Phone (`input_11`, optional).
3. Your Email Address (required): Email and Confirm Email (`input_2`, `input_2_2`).
4. Your Phone (required): `tel`, masked `(999) 999-9999` (`input_5`).
5. Best Time to Call You (required): select with "As Soon As Possible" and 7:30 am to 6:30 pm in 30-minute steps (`input_12`).
6. Your Comments/Questions (required): textarea with helper text "Please let us know what's on your mind… Ask away." (`input_3`).
7. Submit button labelled "Submit".

**Issues:**
- An admin-only section, "Next Steps: Sync an Email Add-On… Delete this tip before you publish the form.", is hidden but still in the HTML.
- The form wrapper starts as `display:none` until JavaScript runs, so visitors without JavaScript get no form.
- There is no attorney-client disclaimer, no privacy link and no sensitive-information warning.
- Contact Form 7 6.1.7 loads its assets on every page but no CF7 form is used.

**Second form:** `/submit-a-testimonial/` shows a raw, unrendered legacy `[contactform email="biztech@techbravo.net" …]` shortcode. It includes consent text naming "Tech Bravo". This form does not work.

---

## 4. Technical notes

- **CMS and hosting:** WordPress 6.9.9 with the Twenty Fourteen theme (old infocus theme assets are still referenced). jQuery 3.7.1 and jquery-migrate, WordPress emoji loader, speculation rules. Server is CyberPanel / OpenLiteSpeed / LiteSpeed behind Cloudflare. Home page HTML is about 35 KB and took about 0.59 s to first byte in one test.
- **Plugins seen in HTML or REST namespaces:**
  - Yoast SEO v28.5
  - Gravity Forms 2.10.5 and its Turnstile add-on
  - Contact Form 7 6.1.7
  - Akismet
  - WP Mail SMTP
  - Duplicator (backup/migration)
  - WP-Optimize (from the `robots.txt` path)
  - A Google Places reviews plugin (`gpr-` classes, `google-block/v1/profile`), which is broken because Google Cloud billing is not enabled
- **Exposed data:** the REST API is public. `/wp-json/wp/v2/users` lists one user, and XML-RPC is advertised.
- **Analytics and tracking:** none found. No GA4, Google Tag Manager, Meta Pixel, call tracking or Cloudflare Insights beacon in the HTML. Third-party scripts are the Avvo badge JS and Cloudflare Turnstile.
- **Search Console:** a `google-site-verification` meta tag plus two `google*.html` verification files from 2016.
- **Schema.org:** only Yoast's default graph (WebPage, WebSite with SearchAction, BreadcrumbList, ImageObject). **No Attorney, LegalService, LocalBusiness or Person markup.** Site name is "Darren Drake", with an empty tagline. Timezone is set to America/Chicago.
- **Meta titles:** follow the pattern "<Page> - Darren Drake". Home is "Darren Drake - Criminal Defense Attorney". Juvenile is "Juvenile Defense Attorney - Darren Drake".
- **Meta descriptions:** only the home page has one, and it contains the flagged claim. All other pages have none.
- **og:image:** several are HTTP URLs, and one points to a theme shadow image.
- **Maps and Google Business Profile:** there are no embedded maps. There is a text link to a Google Maps place named "Drake Drake & Frost Attorneys at Law". GBP ownership and name are not verified. Staff should check that the listing name, NAP details and website match the new site.
- **Images of Darren:**
  - The current home portrait is `/wp-content/uploads/2024/07/DRAKE-Darren-WEB_0090A_pp.jpg` (1000×1400, empty alt text). It is pixel-identical (correlation 0.99996) to the repo's `assets/photos/darren-drake-portrait.jpg`, and so is the source of the new `darren-drake-portrait-signal.webp`.
  - Other portraits: `2022/08/darren-drake.jpg` (1545×2000, grey jacket, not on the live pages); `2013/10/WX3R0045_03-e1381285768808.jpg` (older portrait); `2013/09/Darren-Drake-Attorney-Murfreesboro.jpg`; `2014/08/Darren-Drake-Attorney-Murfreesboro*.jpg`; `2013/09/darren_drake.jpg`.
  - Group and family photos: `DDF1.jpg` and `DarrenFD.jpg`.
  - None of the media items have alt text, except `Murfreesboro1.jpg` ("Attorney Murfreesboro TN").
  - `ruco.jpg` on the contact page is a photo of a courthouse clock tower. Under the guidelines, courthouse images must not imply a court connection.

---

## 5. SEO equity to protect

- **Pages in nav or linked from home (highest priority to redirect):**
  - `/`
  - `/areas-of-practice/`
  - `/areas-of-practice/criminaldefense/`
  - `/areas-of-practice/dui/` (also linked from the bio)
  - `/areas-of-practice/expungement/`
  - `/contact/`
  - `/testimonials/`
  - `/blog/`
- **Indexed but not in nav:**
  - `/areas-of-practice/juvenile-defense/` (in the sitemap, has its own title tag)
  - `/submit-a-testimonial/`
  - the 17 attachment pages
- **Blog posts:** none exist, so no blog equity needs protecting.
- **Phone numbers:**
  - Every current page shows only **(615) 546-5551**, which matches the new number.
  - The **old number 615-410-3919** and **old address 120 E Main St, Murfreesboro** appear only inside the legacy DDF header images in the media library, not in page text.
  - These probably remain in outside directory listings, along with the old "Drake Drake & Frost" name on Google Maps. Recommend a NAP (name, address, phone) clean-up of citations after launch.
  - The fax number 615-895-0155 differs from the main line (it is a fax, not a conflict).
- **Other equity signals:** the Search Console verification (meta tag and files), the Avvo profile link (`rel="me"`), and the outbound link to attorneymurfreesboro.com.
- **Do not carry forward:**
  - the spam `/sitemap.xml` (41,660 junk URLs)
  - attachment pages as indexable URLs
  - the broken testimonials plugin output
  - "free consultation", "highest rated", badges and awards, and the outdated statute and penalty text