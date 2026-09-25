# Polish ideas from major company websites

Written 24 September 2026. Each idea names the pattern it borrows from, and whether it's already on the site.

## Done in this round

| Idea | Borrowed from | What changed |
|---|---|---|
| One plain call to action | Apple ("Buy"), Shopify ("Start free trial") | "Start your intake" is now **"Contact us"** everywhere, and it goes to the Contact page. The old intake address redirects there. |
| The phone number as a real button | Apple and Amazon support pages | The number is a rounded button with a phone icon and heavier, evenly spaced digits. It's never underlined or split across lines. |
| Easier-to-read text | Apple's text styles, Microsoft Fluent | Body text is slightly heavier (Manrope 460 instead of 400), secondary text is a lighter grey, text rendering is crisper on the dark background, and headings wrap evenly. |
| Pill buttons that match the menu | Apple, Shopify Polaris | The main and secondary buttons are fully rounded, like the tab bar. They lift slightly on hover and press in slightly when clicked; both effects turn off for people who prefer reduced motion. |
| See-through blurred header | apple.com's top bar | The sticky header blurs the page scrolling under it. |
| Proof strip under the hero | Shopify and Stripe "trusted by" rows | Three confirmed facts: U.S. Navy veteran; board member, Rutherford County DUI Court; office in Murfreesboro. |
| Short label above the headline | Apple product-page labels | "Criminal defense · Murfreesboro, TN" in a small rounded label, replacing a two-line list. |
| Softer cards | Microsoft Fluent, Apple cards | Rounder corners, a lighter border, a faint top sheen, and a cyan border on hover. |
| One heading per page | Every major site | The Contact page has one heading ("Contact us"), with "Send a message" and "Call the office" side by side. |
| Desktop menu without a repeat | Apple and Shopify nav bars | The desktop tabs are Home, Practice Areas and About Darren, with the "Contact us" button beside them. Phones keep all four tabs. |

## Next ideas (not built yet)

1. **Real local photography.** Apple and Airbnb rely on real, high-quality images. A licensed photo of Murfreesboro or the courthouse square would fill the empty "Meet Darren" box. This is the one placeholder left on the home page.
2. **Google rating badge** (Amazon- and Shopify-style social proof). Darren chose the live star rating. It needs his Google Business Profile, a Maps key and his ethics sign-off.
3. **"What happens next" timeline** (Amazon order tracking, Apple support). **Built 24 Sep 2026:** four steps with icons, connected across the page on desktop and down it on phones.
4. **Page-specific call bar on phones** (Amazon's sticky "Buy"). **Built 24 Sep 2026:** "Ask about <area>" plus a call button; the form opens with the topic filled in, and the topic reaches the office in the email and PDF.
5. **"Jump to" buttons for FAQs** (Microsoft support). **Built 25 Sep 2026** (`plans/faq-jump-links-plan.md`): topic buttons appear when a page has 4 or more FAQs in 2 or more topics. Today that's the home page; practice pages get them automatically as questions are added.
6. **Subtle scroll reveals** (Apple product pages). **Built 25 Sep 2026** (`plans/scroll-reveals-plan.md`): sections rise 12 px into place once, on screens 768 px and wider. They move but never fade, nothing moves under reduced motion, and there's an off switch (`SCROLL_REVEALS`).
7. **Light theme option** (Microsoft, GitHub). Some older visitors read dark pages less easily. **Planned 25 Sep 2026:** `plans/light-theme-plan.md` (a header button, dark stays the default).
8. **Speed polish** (Amazon's focus on speed). After launch, check real-phone speed. Keep images in AVIF and JavaScript small; both are already within budget.
9. **Consistent icon set.** One icon family (lucide) with the same stroke width everywhere, which is already mostly true. Review it once the photo is in.
10. **Better link previews.** **Built 25 Sep 2026** (`plans/link-previews-plan.md`): a 1200 × 630 share card for the home page (used by every page without its own), plus one per practice area. The cards are built from `lib/site.ts`, and samples are in `printouts/share-cards/`.
