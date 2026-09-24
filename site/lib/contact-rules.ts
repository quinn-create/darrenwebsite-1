// Validation rules shared by the contact form (client) and /api/contact (server),
// so both sides always agree. Kept dependency-free to stay out of the client bundle budget.
// This is the site's only form: it is used on /intake/ and /contact/.

export const ABOUT_OPTIONS = [
  { value: "rutherford-arrest", label: "Arrested in Rutherford County" },
  { value: "other", label: "Other" },
] as const;

export const REACH_OPTIONS = [
  { value: "call", label: "Call" },
  { value: "text", label: "Text" },
  { value: "email", label: "Email" },
] as const;

export const CALLBACK_OPTIONS = [
  { value: "asap", label: "As soon as possible" },
  { value: "week", label: "Sometime this week" },
] as const;

// Shown when "As soon as possible" is chosen. A response-time statement is a promise to
// the public, so it stays marked until Darren confirms it (the placeholder guard blocks release).
export const ASAP_NOTE = "We generally return calls within a day. [CONFIRM WITH DARREN]";

export const CONTACT_MESSAGE_MAX = 1000;

export type ContactValues = {
  yourName: string;
  clientName: string;
  about: string[];
  reach: string[];
  phone: string;
  email: string;
  callback: string;
  message: string;
};

export type ContactField = keyof ContactValues;
export type ContactErrors = Partial<Record<ContactField, string>>;

export const EMPTY_CONTACT: ContactValues = {
  yourName: "",
  clientName: "",
  about: [],
  reach: [],
  phone: "",
  email: "",
  callback: "",
  message: "",
};

// Field order used for the error summary and focus management.
export const CONTACT_FIELD_ORDER: ContactField[] = [
  "yourName",
  "clientName",
  "about",
  "reach",
  "phone",
  "email",
  "callback",
  "message",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function phoneDigits(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
}

const known = (list: readonly { value: string }[], values: string[]) =>
  values.every((v) => list.some((o) => o.value === v));

export function validateContact(v: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  const name = v.yourName.trim();
  if (!name) errors.yourName = "Enter your name.";
  else if (name.length > 120) errors.yourName = "Name must be 120 characters or fewer.";

  if (v.clientName.trim().length > 120) errors.clientName = "Name must be 120 characters or fewer.";

  if (v.about.length === 0 || !known(ABOUT_OPTIONS, v.about)) {
    errors.about = "Choose at least one. Pick “Other” if neither fits.";
  }

  if (v.reach.length === 0 || !known(REACH_OPTIONS, v.reach)) {
    errors.reach = "Choose at least one way to reach you.";
  }

  const needsPhone = v.reach.includes("call") || v.reach.includes("text");
  const phone = v.phone.trim();
  if (phone) {
    if (phoneDigits(phone).length !== 10) errors.phone = "Enter a 10-digit phone number, like 615-555-0123.";
  } else if (needsPhone) {
    errors.phone = "Enter a phone number, since you chose call or text.";
  }

  const email = v.email.trim();
  if (email) {
    if (!EMAIL_RE.test(email) || email.length > 254) errors.email = "Enter an email address like name@example.com.";
  } else if (v.reach.includes("email")) {
    errors.email = "Enter an email address, since you chose email.";
  }

  if (!CALLBACK_OPTIONS.some((o) => o.value === v.callback)) {
    errors.callback = "Choose when you'd like to hear back.";
  }

  if (v.message.length > CONTACT_MESSAGE_MAX) {
    errors.message = `Keep the message to ${CONTACT_MESSAGE_MAX} characters or fewer.`;
  }

  return errors;
}
