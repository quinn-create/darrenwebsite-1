// Firm facts and shared copy. Practice wording and FAQs were approved by Darren on
// 24 September 2026; anything unconfirmed carries a bracketed marker until reviewed.

export const PHONE_DISPLAY = "(615) 546-5551";
export const PHONE_HREF = "tel:+16155465551";

// Every firm fact lives here, so each is changed in one place once Darren confirms it.
// Bracketed values are placeholders: scripts/check-placeholders.mjs refuses a
// production release while any remain (candidates from the old site are in
// plans/research/current-site.md and need Darren's confirmation first).
export const FIRM = {
  name: "Darren Drake",
  descriptor: "Attorney at Law",
  legalName: "Darren Drake Law PLLC",
  address: "138 S. Cannon Ave, Murfreesboro, TN 37129",
  hours: "Monday–Friday, 8am–5pm",
  serviceArea: "Murfreesboro, Rutherford County & Smyrna",
} as const;

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/practice-areas/", label: "Practice Areas" },
  { href: "/about/", label: "About Darren" },
  { href: "/contact/", label: "Contact" },
] as const;

export const CTA_LABEL = "Start your intake";

export type PracticeSlug =
  | "first-time-offenders"
  | "dui-dwi"
  | "domestic-assault"
  | "criminal-defense"
  | "expungement";

// `featured` areas are the three cards on the home page; the Practice Areas page lists all.
export const PRACTICES: {
  slug: PracticeSlug;
  title: string;
  icon: "briefcase" | "car" | "file" | "flag" | "shield";
  summary: string;
  overview: string[];
  featured?: boolean;
  faq: { q: string; a: string }[];
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
        a: "Write down your court date and keep any paperwork you were given. Don't discuss what happened with anyone other than a lawyer, and reach out to the office as early as you can so there's time to prepare.",
      },
      {
        q: "What information should I have ready when I reach out?",
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
        a: "Keep your court date and any paperwork you were given, don't discuss what happened with anyone other than a lawyer, and reach out to the office as early as you can.",
      },
      {
        q: "What information should I have ready when I reach out?",
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
        a: "Every case is different. Generally, you'll receive paperwork with a court date, and there may be separate questions about your driver's license. Darren can explain what applies to your situation.",
      },
      {
        q: "Should I contact the office before my first court date?",
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
        a: "Generally, there will be a court date, and there may be bond conditions such as an order not to contact certain people. Follow any conditions exactly, even if the other person reaches out to you. Darren can explain what applies to your case.",
      },
      {
        q: "What should I avoid doing while my case is open?",
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
        a: "Eligibility depends on the charge, how the case ended and how much time has passed. Darren can review your record and tell you whether it may qualify.",
      },
      {
        q: "What documents are useful to have on hand?",
        a: "Any court paperwork you have, such as case numbers or the final judgment. If you don't have it, the office can talk with you about how to get it.",
      },
    ],
  },
];

export const STEPS = [
  "Send a brief inquiry",
  "The office reviews it",
  "Discuss next steps if the firm can assist",
] as const;

export const HOME_FAQ = [
  {
    q: "Does submitting the form mean you represent me?",
    a: "No. Sending an inquiry does not create an attorney-client relationship. The office will review it and discuss next steps if the firm can assist.",
  },
  {
    q: "What should I include in my inquiry?",
    a: "Your name, how and when you'd like to hear back, and a short overview if you like. Please don't include sensitive documents or detailed confidential information.",
  },
  {
    q: "What areas do you serve?",
    a: "Murfreesboro, Smyrna and the rest of Rutherford County.",
  },
  {
    q: "Can I call instead?",
    a: `Yes — ${PHONE_DISPLAY}.`,
  },
];

export const INTAKE_SUCCESS =
  "Your inquiry was received. Submitting it does not establish representation.";
