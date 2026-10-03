// Validation rules shared by the intake form (client) and /api/intake (server),
// so both sides always agree. Kept dependency-free to stay out of the client bundle budget.

export const MATTER_TYPES = [
  { value: "criminal-defense", label: "Criminal defense" },
  { value: "dui-dwi", label: "DUI/DWI" },
  { value: "expungement", label: "Expungement" },
  { value: "other", label: "Other or not sure" },
] as const;

export const CONTACT_METHODS = [
  { value: "phone", label: "Phone" },
  { value: "email", label: "Email" },
] as const;

export const MESSAGE_MAX = 1000;

export type IntakeValues = {
  fullName: string;
  matterType: string;
  contactMethod: string;
  phone: string;
  email: string;
  county: string;
  courtDate: string;
  message: string;
};

export type IntakeField = keyof IntakeValues;
export type IntakeErrors = Partial<Record<IntakeField, string>>;

export const EMPTY_VALUES: IntakeValues = {
  fullName: "",
  matterType: "",
  contactMethod: "",
  phone: "",
  email: "",
  county: "",
  courtDate: "",
  message: "",
};

// Field order used for the error summary and focus management.
export const FIELD_ORDER: IntakeField[] = [
  "fullName",
  "matterType",
  "contactMethod",
  "phone",
  "email",
  "county",
  "courtDate",
  "message",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function phoneDigits(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
}

export function validateIntake(v: IntakeValues): IntakeErrors {
  const errors: IntakeErrors = {};
  const name = v.fullName.trim();
  if (!name) errors.fullName = "Enter your full name.";
  else if (name.length > 120) errors.fullName = "Name must be 120 characters or fewer.";

  if (!MATTER_TYPES.some((m) => m.value === v.matterType)) {
    errors.matterType = "Choose the type of matter. Pick “Other or not sure” if you're unsure.";
  }

  if (!CONTACT_METHODS.some((m) => m.value === v.contactMethod)) {
    errors.contactMethod = "Choose how you'd like to be contacted.";
  }

  const phone = v.phone.trim();
  if (phone) {
    if (phoneDigits(phone).length !== 10) errors.phone = "Enter a 10-digit phone number, like 615-555-0123.";
  } else if (v.contactMethod === "phone") {
    errors.phone = "Enter a phone number, since you chose phone.";
  }

  const email = v.email.trim();
  if (email) {
    if (!EMAIL_RE.test(email) || email.length > 254) errors.email = "Enter an email address like name@example.com.";
  } else if (v.contactMethod === "email") {
    errors.email = "Enter an email address, since you chose email.";
  }

  if (v.county.trim().length > 120) errors.county = "County or court must be 120 characters or fewer.";

  if (v.courtDate && !/^\d{4}-\d{2}-\d{2}$/.test(v.courtDate)) {
    errors.courtDate = "Enter the date as month, day and year, or leave it blank.";
  }

  if (v.message.length > MESSAGE_MAX) {
    errors.message = `Keep the message to ${MESSAGE_MAX} characters or fewer.`;
  }

  return errors;
}
