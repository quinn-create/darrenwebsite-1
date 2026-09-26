// Firm facts and shared copy. Only confirmed facts appear unmarked; everything
// else carries a visible [CONFIRM…] / [FIRM TO…] marker for review before launch.

export const PHONE_DISPLAY = "(615) 546-5551";
export const PHONE_HREF = "tel:+16155465551";

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/practice-areas", label: "Practice Areas" },
  { href: "/about", label: "About Darren" },
  { href: "/contact", label: "Contact" },
] as const;

export const CTA_LABEL = "Start your intake";

export type PracticeSlug = "criminal-defense" | "dui-dwi" | "expungement";

export const PRACTICES: {
  slug: PracticeSlug;
  title: string;
  icon: "briefcase" | "car" | "file";
  summary: string;
  faq: { q: string; a: string }[];
}[] = [
  {
    slug: "criminal-defense",
    title: "Criminal Defense",
    icon: "briefcase",
    summary: "Help for people facing criminal charges in Middle Tennessee.",
    faq: [
      { q: "What should I do first if I have been charged?", a: "[FIRM TO SUPPLY]" },
      { q: "What information should I have ready when I reach out?", a: "[FIRM TO SUPPLY]" },
    ],
  },
  {
    slug: "dui-dwi",
    title: "DUI/DWI",
    icon: "car",
    summary: "Help for people charged with driving under the influence.",
    faq: [
      { q: "What happens after a DUI/DWI arrest?", a: "[FIRM TO SUPPLY]" },
      { q: "Should I contact the office before my first court date?", a: "[FIRM TO SUPPLY]" },
    ],
  },
  {
    slug: "expungement",
    title: "Expungement",
    icon: "file",
    summary: "Help understanding whether a record may be eligible for expungement.",
    faq: [
      { q: "How do I know whether my record may be eligible?", a: "[FIRM TO SUPPLY]" },
      { q: "What documents are useful to have on hand?", a: "[FIRM TO SUPPLY]" },
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
    a: "A brief overview, the type of matter, and how to reach you. Please don't include sensitive documents or detailed confidential information.",
  },
  {
    q: "What areas do you serve?",
    a: "Murfreesboro and Middle Tennessee. [CONFIRM COUNTIES]",
  },
  {
    q: "Can I call instead?",
    a: `Yes — ${PHONE_DISPLAY}.`,
  },
];

export const INTAKE_HELPER =
  "Please share a brief overview and your contact details. Do not include sensitive documents or detailed confidential information in this initial inquiry. Sending this form does not create an attorney-client relationship.";

export const INTAKE_SUCCESS =
  "Your inquiry was received. Submitting it does not establish representation.";
