// Firm facts and shared copy. Practice wording and FAQs were approved by Darren on
// 24 September 2026; anything unconfirmed carries a bracketed marker until reviewed.
//
// Server-only in practice: browser (client) components import lib/site-basics.ts instead,
// so this file's page wording is never sent twice (plans/speed-check-plan.md).
import { PHONE_DISPLAY } from "./site-basics";
export * from "./site-basics";

// Every firm fact lives here, so each is changed in one place once Darren confirms it.
// Bracketed values are placeholders: scripts/check-placeholders.mjs refuses a
// production release while any remain (candidates from the old site are in
// plans/research/current-site.md and need Darren's confirmation first).
// The address parts feed the search-engine data (lib/structured-data.ts); the visible
// address is built from them, so the two can never disagree.
const ADDRESS = { street: "138 S. Cannon Ave", city: "Murfreesboro", region: "TN", postalCode: "37129" } as const;

export const FIRM = {
  name: "Darren Drake",
  descriptor: "Attorney at Law",
  legalName: "Darren Drake Law PLLC",
  ...ADDRESS,
  address: `${ADDRESS.street}, ${ADDRESS.city}, ${ADDRESS.region} ${ADDRESS.postalCode}`,
  hours: "Monday–Friday, 8am–5pm",
  serviceArea: "Murfreesboro, Rutherford County & Smyrna",
} as const;

// Darren's background, confirmed 24 Sep 2026 (plans/for-darren/answers-2026-09-24.md). Used by
// About, the home page's "At a glance" card and the search-engine data, so they always agree.
export const DARREN = {
  navy: {
    short: "U.S. Navy, 1996–2002",
    role: "Electronics Technician",
    detail:
      "Darren served in the U.S. Navy from 1996 to 2002 as an Electronics Technician. He served aboard the USS Kitty Hawk and the USS Constellation, and completed a tour on Diego Garcia.",
  },
  community: [
    "Board member, Rutherford County DUI Court",
    "Former Assistant Chief, Lascassas Volunteer Fire Department",
    "Helped found the Veterans Legal Assistance Program at Southern Illinois University School of Law",
  ],
  lawSchool: "Southern Illinois University School of Law",
  college: "Southern Illinois University Carbondale",
  education: [
    "Law degree, Southern Illinois University School of Law",
    "B.S. in Electronics Systems, Southern Illinois University Carbondale (2005)",
    "Admitted in Tennessee and the U.S. District Court for the Middle District of Tennessee",
  ],
  memberships: ["Tennessee Association of Criminal Defense Lawyers", "Rutherford & Cannon County Bar Association"],
} as const;

// "Reviewed by" line for legal wording Darren approved (CLAUDE.md). He approved the practice
// pages and the home FAQs as written on 24 Sep 2026 (decision D4).
export const LEGAL_REVIEW = "Reviewed by Darren Drake, Attorney at Law, on 24 September 2026.";

// Link-preview (Open Graph / X) wording. plans/link-previews-plan.md, section 4; Phase 1 layout.
// The plan's alt text says "Murfreesboro and Middle Tennessee"; Darren confirmed Rutherford County
// cases only (24 Sep 2026), so the confirmed service area is used (docs/DECISIONS.md, C7).
export const SHARE_TITLE = "Darren Drake · Attorney at Law · Murfreesboro, TN";
export const SHARE_ALT = "Darren Drake, attorney at law, Murfreesboro and Rutherford County, Tennessee";
export const SHARE_SITE_NAME = "Darren Drake Law PLLC";
export const SITE_DESCRIPTION =
  `Criminal defense attorney in Murfreesboro, TN, serving Rutherford County and Smyrna. First-time offenses, DUI/DWI and domestic assault. Call ${PHONE_DISPLAY}.`;
// Shared Open Graph fields. A page that sets its own openGraph replaces the layout's
// entirely, so pages spread this in rather than repeating it.
export const OPEN_GRAPH_BASE = {
  title: SHARE_TITLE,
  description: SITE_DESCRIPTION,
  siteName: SHARE_SITE_NAME,
  type: "website",
  locale: "en_US",
} as const;

export type PracticeSlug =
  | "first-time-offenders"
  | "dui-dwi"
  | "domestic-assault"
  | "criminal-defense"
  | "expungement";

// FAQ topics for the "Jump to" buttons (components/FaqJumpLinks.tsx), in display order.
// They are navigation labels only; the questions and answers themselves are Darren-approved.
export const FAQ_TOPICS = [
  { id: "getting-started", label: "Getting started" },
  { id: "your-case", label: "Your case" },
  { id: "working-with-us", label: "Working with the office" },
] as const;
export type FaqTopicId = (typeof FAQ_TOPICS)[number]["id"];
// `pending: true` keeps an answer off the site until Darren approves it.
export type FaqItem = { q: string; a: string; topic: FaqTopicId; pending?: true };
// Jump buttons appear only with at least this many FAQs, spread over at least 2 topics.
export const FAQ_JUMP_MIN = 4;

// `featured` areas are the three cards on the home page; the Practice Areas page lists all.
export const PRACTICES: {
  slug: PracticeSlug;
  title: string;
  icon: "briefcase" | "car" | "file" | "flag" | "shield";
  summary: string;
  overview: string[];
  featured?: boolean;
  faq: FaqItem[];
}[] = [
  {
    slug: "first-time-offenders",
    title: "First-Time Offenders",
    icon: "flag",
    featured: true,
    summary: "Help for people in Rutherford County facing a criminal charge for the first time.",
    overview: [
      "Being charged with a crime for the first time is frightening, and it's hard to know what happens next. Darren helps people who have never been through the court system understand the charge, the process and their options.",
      "When you reach out, the office will ask a few questions about what happened and when your next court date is. If the firm can assist, Darren will talk with you about next steps.",
    ],
    faq: [
      {
        q: "I've never been charged before. What should I do first?",
        topic: "your-case",
        a: "Write down your court date and keep any paperwork you were given. Don't discuss what happened with anyone other than a lawyer, and reach out to the office as early as you can so there's time to prepare.",
      },
      {
        q: "What information should I have ready when I reach out?",
        topic: "getting-started",
        a: "Your name, the charge if you know it, where you were arrested, your next court date, and any paperwork you received. It's fine if you don't have all of it.",
      },
    ],
  },
  {
    slug: "criminal-defense",
    title: "Criminal Defense",
    icon: "briefcase",
    summary: "Help for people facing criminal charges in Rutherford County.",
    overview: [
      "A criminal charge raises urgent questions about your freedom, your record and your future. Darren helps people facing criminal charges understand the charge against them, the court process and their options.",
      "When you reach out, the office will ask a few questions about what happened and when your next court date is. If the firm can assist, Darren will talk with you about next steps.",
    ],
    faq: [
      {
        q: "What should I do first if I have been charged?",
        topic: "your-case",
        a: "Keep your court date and any paperwork you were given, don't discuss what happened with anyone other than a lawyer, and reach out to the office as early as you can.",
      },
      {
        q: "What information should I have ready when I reach out?",
        topic: "getting-started",
        a: "Your name, the charge if you know it, where you were arrested, your next court date, and any paperwork you received. It's fine if you don't have all of it.",
      },
    ],
  },
  {
    slug: "dui-dwi",
    title: "DUI/DWI",
    icon: "car",
    featured: true,
    summary: "Help for people charged with driving under the influence in Rutherford County.",
    overview: [
      "A DUI arrest can affect your license, your job and your daily life, and the process moves quickly. Darren helps people understand the charge against them and what to expect in court.",
      "When you reach out, the office will ask a few questions about what happened and when your next court date is. If the firm can assist, Darren will talk with you about next steps.",
    ],
    faq: [
      {
        q: "What happens after a DUI/DWI arrest?",
        topic: "your-case",
        a: "Every case is different. Generally, you'll receive paperwork with a court date, and there may be separate questions about your driver's license. Darren can explain what applies to your situation.",
      },
      {
        q: "Should I contact the office before my first court date?",
        topic: "getting-started",
        a: "Yes. Reaching out early gives more time to review your situation and prepare. Contact the office as soon as you can after an arrest.",
      },
    ],
  },
  {
    slug: "domestic-assault",
    title: "Domestic Assault",
    icon: "shield",
    featured: true,
    summary: "Help for people charged with domestic assault in Rutherford County.",
    overview: [
      "A domestic assault charge can bring immediate conditions, such as limits on contact or where you can stay, on top of the case itself. Darren helps people understand the charge, any conditions they've been given, and the court process.",
      "When you reach out, the office will ask a few questions about what happened and when your next court date is. If the firm can assist, Darren will talk with you about next steps.",
    ],
    faq: [
      {
        q: "What happens after a domestic assault arrest?",
        topic: "your-case",
        a: "Generally, there will be a court date, and there may be bond conditions such as an order not to contact certain people. Follow any conditions exactly, even if the other person reaches out to you. Darren can explain what applies to your case.",
      },
      {
        q: "What should I avoid doing while my case is open?",
        topic: "your-case",
        a: "Don't contact anyone you've been ordered not to contact, don't post about the case on social media, and don't discuss what happened with anyone other than your lawyer.",
      },
    ],
  },
  {
    slug: "expungement",
    title: "Expungement",
    icon: "file",
    summary: "Help finding out whether a record in Rutherford County may be eligible for expungement.",
    overview: [
      "A criminal record can follow you when you apply for jobs, housing or school. Darren helps people find out whether a charge or conviction on their record may be eligible to be removed, and handles the process if it is.",
      "When you reach out, it helps to know which charges are on your record and roughly when they happened. The office will review the details and let you know whether the firm can assist.",
    ],
    faq: [
      {
        q: "How do I know whether my record may be eligible?",
        topic: "your-case",
        a: "Eligibility depends on the charge, how the case ended and how much time has passed. Darren can review your record and tell you whether it may qualify.",
      },
      {
        q: "What documents are useful to have on hand?",
        topic: "getting-started",
        a: "Any court paperwork you have, such as case numbers or the final judgment. If you don't have it, the office can talk with you about how to get it.",
      },
    ],
  },
];

// "What happens next" timeline. Step 3 reuses Darren's approved callback wording
// (lib/contact-rules.ts ASAP_NOTE); nothing here promises the firm will take the matter.
// A practice area from its URL slug, or undefined. Used for the "Ask about …" phone bar
// and the Contact page's ?topic= link, so only real practice areas are ever accepted.
export function practiceBySlug(slug: string | null | undefined) {
  return PRACTICES.find((p) => p.slug === slug);
}

export const STEPS = [
  {
    icon: "send",
    title: "Send a short message",
    detail: "Use the form or call. Say briefly what happened and how you'd like to be reached.",
  },
  {
    icon: "review",
    title: "The office reviews it",
    detail: "Your message goes straight to the office to be looked over.",
  },
  {
    icon: "reply",
    title: "You hear back",
    detail: "By call, text or email, the way you chose.",
  },
  {
    icon: "next",
    title: "Talk through next steps",
    detail: "If the firm can assist, Darren explains your options and what happens next.",
  },
] as const;

export const HOME_FAQ: FaqItem[] = [
  {
    q: "Does submitting the form mean you represent me?",
    topic: "working-with-us",
    a: "No. Sending an inquiry does not create an attorney-client relationship. The office will review it and discuss next steps if the firm can assist.",
  },
  {
    q: "What should I include in my inquiry?",
    topic: "getting-started",
    a: "Your name, how and when you'd like to hear back, and a short overview if you like. Please don't include sensitive documents or detailed confidential information.",
  },
  {
    q: "What areas do you serve?",
    topic: "working-with-us",
    a: "Murfreesboro, Smyrna and the rest of Rutherford County.",
  },
  {
    q: "Can I call instead?",
    topic: "getting-started",
    a: `Yes — ${PHONE_DISPLAY}.`,
  },
];

