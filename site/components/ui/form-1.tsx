"use client";

// Adapted from the prebuiltui "form-1" contact form: same layout (badge, large heading,
// icons inside rounded fields, full-width button), restyled with the Signal tokens and
// connected to /api/contact. Success is shown only after the server accepts the inquiry.
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Check, Phone } from "lucide-react";
import { track } from "@/lib/analytics";
import {
  ABOUT_OPTIONS,
  ASAP_NOTE,
  CALLBACK_OPTIONS,
  CONTACT_FIELD_ORDER,
  CONTACT_MESSAGE_MAX,
  EMPTY_CONTACT,
  REACH_OPTIONS,
  validateContact,
  type ContactErrors,
  type ContactField,
  type ContactValues,
} from "@/lib/contact-rules";
import { INTAKE_SUCCESS, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";
import { cn } from "@/lib/utils";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "not_configured" }
  | { kind: "failed"; message: string };

const LABELS: Record<ContactField, string> = {
  yourName: "Your name",
  clientName: "Client's name",
  about: "What this is about",
  reach: "How to reach you",
  phone: "Phone",
  email: "Email",
  callback: "When to hear back",
  message: "Message",
};

// Where focus goes when the error summary links to a field.
function targetId(field: ContactField): string {
  if (field === "about") return `about-${ABOUT_OPTIONS[0].value}`;
  if (field === "reach") return `reach-${REACH_OPTIONS[0].value}`;
  if (field === "callback") return `callback-${CALLBACK_OPTIONS[0].value}`;
  return `cf-${field}`;
}

const fieldShell =
  "mt-2 flex min-h-12 items-center gap-2 overflow-hidden rounded-full border bg-bg pl-4 transition-shadow focus-within:ring-2 focus-within:ring-focus";

export function ContactForm({
  configured,
  headingLevel = "h2",
}: {
  configured: boolean
  headingLevel?: "h1" | "h2"
}) {
  const Heading = headingLevel;
  const [values, setValues] = useState<ContactValues>(EMPTY_CONTACT);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [honeypot, setHoneypot] = useState("");
  const started = useRef(false);
  const inFlight = useRef(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const errorList = CONTACT_FIELD_ORDER.filter((f) => errors[f]);
  const needsPhone = values.reach.includes("call") || values.reach.includes("text");
  const needsEmail = values.reach.includes("email");

  useEffect(() => {
    if (status.kind === "success") successRef.current?.focus();
    else if (status.kind === "failed" || status.kind === "not_configured") statusRef.current?.focus();
  }, [status]);

  function update<K extends ContactField>(field: K, value: ContactValues[K]) {
    if (!started.current) {
      started.current = true;
      track("contact_start");
    }
    const next = { ...values, [field]: value };
    setValues(next);
    if (attempted) setErrors(validateContact(next));
  }

  function toggle(field: "about" | "reach", value: string) {
    const list = values[field];
    update(field, list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  async function submit(e?: FormEvent) {
    e?.preventDefault();
    if (inFlight.current) return; // blocks double submission
    setAttempted(true);

    const found = validateContact(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus({ kind: "idle" });
      track("contact_submit_error");
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    inFlight.current = true;
    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, website: honeypot }),
      });
      const data = (await res.json().catch(() => ({}))) as { status?: string; errors?: ContactErrors };

      if (res.ok && data.status === "accepted") {
        track("contact_submit_success");
        setStatus({ kind: "success" });
        return;
      }

      track("contact_submit_error");
      if (data.status === "invalid" && data.errors && Object.keys(data.errors).length > 0) {
        setErrors(data.errors);
        setStatus({ kind: "idle" });
        requestAnimationFrame(() => summaryRef.current?.focus());
      } else if (data.status === "not_configured") {
        setStatus({ kind: "not_configured" });
      } else if (data.status === "rate_limited") {
        setStatus({ kind: "failed", message: "Too many attempts in a short time. Please wait a few minutes and try again, or call." });
      } else {
        setStatus({ kind: "failed", message: "Your message could not be sent." });
      }
    } catch {
      track("contact_submit_error");
      setStatus({ kind: "failed", message: "Your message could not be sent because of a connection problem." });
    } finally {
      inFlight.current = false;
    }
  }

  if (status.kind === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rounded-card border-2 border-success bg-surface p-6 outline-none lg:p-8"
      >
        <p className="h3 text-success">Message received</p>
        <p className="mt-3">{INTAKE_SUCCESS}</p>
        <p className="mt-3 text-muted">
          If you need to reach the office, call{" "}
          <a href={PHONE_HREF} className="link-action font-semibold">
            {PHONE_DISPLAY}
          </a>
          .
        </p>
      </div>
    );
  }

  const submitting = status.kind === "submitting";
  const describe = (field: ContactField, ...extra: (string | false | undefined)[]) =>
    [...extra, errors[field] ? `cf-${field}-error` : undefined].filter(Boolean).join(" ") || undefined;
  const remaining = CONTACT_MESSAGE_MAX - values.message.length;

  return (
    <form
      noValidate
      onSubmit={submit}
      aria-labelledby="contact-form-title"
      aria-describedby={configured ? undefined : "contact-demo-note"}
      className="flex flex-col items-center text-text"
    >
      <p className="rounded-full bg-action/15 px-3 py-1 text-[13px] font-semibold uppercase tracking-[0.08em] text-action">
        Contact us
      </p>
      <Heading id="contact-form-title" className="h2 py-4 text-center">
        Let&apos;s get in touch.
      </Heading>
      <p className="pb-8 text-center text-muted">
        Or call the office at{" "}
        <a href={PHONE_HREF} className="link-action font-semibold">
          {PHONE_DISPLAY}
        </a>
      </p>
      {!configured && (
        <p id="contact-demo-note" className="mb-6 w-full max-w-xl rounded-card border-2 border-action bg-bg p-4 text-[16px]">
          <span className="font-bold">Demo form, not connected.</span>{" "}
          <span className="text-muted">Nothing you enter will be sent yet.</span>
        </p>
      )}

      <div className="w-full max-w-xl">
        {errorList.length > 0 && (
          <div
            ref={summaryRef}
            tabIndex={-1}
            role="alert"
            aria-labelledby="contact-error-title"
            className="mb-8 rounded-card border-2 border-error bg-bg p-5 outline-none"
          >
            <p id="contact-error-title" className="text-[18px] font-bold text-error">
              Please fix {errorList.length === 1 ? "1 item" : `${errorList.length} items`} to continue
            </p>
            <ul className="mt-3 flex flex-col gap-1">
              {errorList.map((f) => (
                <li key={f}>
                  <a
                    href={`#${targetId(f)}`}
                    className="link-action inline-flex min-h-11 items-center"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(targetId(f))?.focus();
                    }}
                  >
                    {LABELS[f]}: {errors[f]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col gap-6">
          <TextField
            field="yourName"
            label="Your name"
            required
            error={errors.yourName}
            icon={<PersonIcon />}
            input={{ type: "text", autoComplete: "name", placeholder: "Enter your full name" }}
            value={values.yourName}
            onChange={(v) => update("yourName", v)}
            describedBy={describe("yourName")}
          />

          <TextField
            field="clientName"
            label="Client's name, if different from yours"
            error={errors.clientName}
            icon={<PersonIcon />}
            input={{ type: "text", autoComplete: "off", placeholder: "For example, a family member" }}
            value={values.clientName}
            onChange={(v) => update("clientName", v)}
            describedBy={describe("clientName")}
          />

          <ChoiceGroup
            name="about"
            legend="What is this about?"
            hint="Choose one or both."
            type="checkbox"
            options={ABOUT_OPTIONS}
            selected={values.about}
            error={errors.about}
            onToggle={(v) => toggle("about", v)}
          />

          <ChoiceGroup
            name="reach"
            legend="How can we reach you?"
            hint="Choose any that work for you."
            type="checkbox"
            options={REACH_OPTIONS}
            selected={values.reach}
            error={errors.reach}
            onToggle={(v) => toggle("reach", v)}
          />

          <TextField
            field="phone"
            label="Phone"
            required={needsPhone}
            error={errors.phone}
            icon={<Phone aria-hidden="true" size={20} strokeWidth={1.75} />}
            input={{ type: "tel", inputMode: "tel", autoComplete: "tel", placeholder: "615-555-0123" }}
            value={values.phone}
            onChange={(v) => update("phone", v)}
            describedBy={describe("phone")}
          />

          <TextField
            field="email"
            label="Email address"
            required={needsEmail}
            error={errors.email}
            icon={<MailIcon />}
            input={{ type: "email", autoComplete: "email", placeholder: "Enter your email address" }}
            value={values.email}
            onChange={(v) => update("email", v)}
            describedBy={describe("email")}
          />

          <div>
            <ChoiceGroup
              name="callback"
              legend="When would you like to hear back?"
              type="radio"
              options={CALLBACK_OPTIONS}
              selected={values.callback ? [values.callback] : []}
              error={errors.callback}
              onToggle={(v) => update("callback", v)}
            />
            <p aria-live="polite" className="mt-3 text-[16px] text-muted empty:hidden">
              {values.callback === "asap" ? ASAP_NOTE : ""}
            </p>
          </div>

          <div>
            <label htmlFor="cf-message" className="label block">
              Message <span className="font-normal text-muted">(optional)</span>
            </label>
            <p id="cf-message-hint" className="mt-1 text-[15px] text-muted">
              A short overview only. Please don&apos;t include detailed confidential information.
            </p>
            <textarea
              id="cf-message"
              name="message"
              rows={4}
              maxLength={CONTACT_MESSAGE_MAX}
              placeholder="Enter your message"
              className={cn(
                "mt-2 min-h-[132px] w-full resize-none rounded-[20px] border bg-bg p-4 text-[16px] outline-none placeholder:text-muted/80 focus:ring-2 focus:ring-focus",
                errors.message ? "border-error" : "border-border",
              )}
              value={values.message}
              onChange={(e) => update("message", e.target.value)}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={describe("message", "cf-message-hint", "cf-message-count")}
            />
            <p id="cf-message-count" className="mt-2 text-[15px] text-muted" aria-live={remaining <= 100 ? "polite" : "off"}>
              {remaining} of {CONTACT_MESSAGE_MAX} characters remaining
            </p>
            <FieldError field="message" error={errors.message} />
          </div>

          {/* Honeypot for bots. Hidden from people and assistive technology. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="cf-website">Leave this field empty</label>
            <input
              id="cf-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>
        </div>

        <div ref={statusRef} tabIndex={-1} aria-live="polite" className="outline-none">
          {status.kind === "not_configured" && (
            <div className="mt-8 rounded-card border-2 border-action bg-bg p-5">
              <p className="font-bold">Not sent: this demo form isn&apos;t connected yet.</p>
              <p className="mt-1 text-muted">
                Your answers are still here. To reach the office now, call{" "}
                <a href={PHONE_HREF} className="link-action font-semibold">
                  {PHONE_DISPLAY}
                </a>
                .
              </p>
            </div>
          )}
          {status.kind === "failed" && (
            <div className="mt-8 rounded-card border-2 border-error bg-bg p-5">
              <p className="font-bold text-error">{status.message}</p>
              <p className="mt-1 text-muted">
                Your answers are still here. Try again, or call{" "}
                <a href={PHONE_HREF} className="link-action font-semibold">
                  {PHONE_DISPLAY}
                </a>
                .
              </p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          aria-disabled={submitting}
          className="btn-primary mt-8 w-full rounded-full"
        >
          {submitting ? "Sending…" : "Send message"}
          <svg aria-hidden="true" width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="m18.038 10.663-5.625 5.625a.94.94 0 0 1-1.328-1.328l4.024-4.023H3.625a.938.938 0 0 1 0-1.875h11.484l-4.022-4.025a.94.94 0 0 1 1.328-1.328l5.625 5.625a.935.935 0 0 1-.002 1.33"
              fill="currentColor"
            />
          </svg>
        </button>
        <p className="mt-4 text-center text-[15px] text-muted">
          Sending this form does not create an attorney-client relationship.{" "}
          <Link href="/privacy/" className="link-action">
            Read the privacy notice
          </Link>
          .
        </p>
      </div>
    </form>
  );
}

function TextField({
  field,
  label,
  required,
  error,
  icon,
  input,
  value,
  onChange,
  describedBy,
}: {
  field: ContactField
  label: string
  required?: boolean
  error?: string
  icon: ReactNode
  input: React.InputHTMLAttributes<HTMLInputElement>
  value: string
  onChange: (value: string) => void
  describedBy?: string
}) {
  const id = `cf-${field}`;
  return (
    <div>
      <label htmlFor={id} className="label block">
        {label} <span className="font-normal text-muted">{required ? "(required)" : "(optional)"}</span>
      </label>
      <div className={cn(fieldShell, error ? "border-error" : "border-border")}>
        <span className="shrink-0 text-muted">{icon}</span>
        <input
          {...input}
          id={id}
          name={field}
          className="h-12 w-full bg-transparent pr-4 text-[16px] outline-none placeholder:text-muted/80"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-required={required ? "true" : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        />
      </div>
      <FieldError field={field} error={error} />
    </div>
  );
}

function FieldError({ field, error }: { field: ContactField; error?: string }) {
  if (!error) return null;
  return (
    <p id={`cf-${field}-error`} className="mt-2 text-[15px] font-semibold text-error">
      {error}
    </p>
  );
}

// Pill-shaped toggle buttons: checkboxes (pick any) or radios (pick one).
function ChoiceGroup({
  name,
  legend,
  hint,
  type,
  options,
  selected,
  error,
  onToggle,
}: {
  name: "about" | "reach" | "callback"
  legend: string
  hint?: string
  type: "checkbox" | "radio"
  options: readonly { value: string; label: string }[]
  selected: string[]
  error?: string
  onToggle: (value: string) => void
}) {
  const describedBy =
    [hint ? `${name}-hint` : undefined, error ? `cf-${name}-error` : undefined].filter(Boolean).join(" ") || undefined;
  return (
    <fieldset aria-describedby={describedBy}>
      <legend className="label">
        {legend} <span className="font-normal text-muted">(required)</span>
      </legend>
      {hint && (
        <p id={`${name}-hint`} className="mt-1 text-[15px] text-muted">
          {hint}
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-3">
        {options.map((opt) => {
          const id = `${name}-${opt.value}`;
          const checked = selected.includes(opt.value);
          return (
            <label
              key={opt.value}
              htmlFor={id}
              className={cn(
                "inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full border px-5 text-[16px] font-semibold transition-colors duration-150 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus",
                checked ? "border-action bg-action/15 text-text" : error ? "border-error bg-bg" : "border-border bg-bg",
              )}
            >
              <input
                id={id}
                type={type}
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => onToggle(opt.value)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-5 items-center justify-center border",
                  type === "radio" ? "rounded-full" : "rounded-[6px]",
                  checked ? "border-action bg-action text-on-action" : "border-border",
                )}
              >
                {checked && <Check size={14} strokeWidth={3} />}
              </span>
              {opt.label}
            </label>
          );
        })}
      </div>
      <FieldError field={name} error={error} />
    </fieldset>
  );
}

function PersonIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18.311 16.406a9.64 9.64 0 0 0-4.748-4.158 5.938 5.938 0 1 0-7.125 0 9.64 9.64 0 0 0-4.749 4.158.937.937 0 1 0 1.623.938c1.416-2.447 3.916-3.906 6.688-3.906 2.773 0 5.273 1.46 6.689 3.906a.938.938 0 0 0 1.622-.938M5.938 7.5a4.063 4.063 0 1 1 8.125 0 4.063 4.063 0 0 1-8.125 0"
        fill="currentColor"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.5 3.438h-15a.937.937 0 0 0-.937.937V15a1.563 1.563 0 0 0 1.562 1.563h13.75A1.563 1.563 0 0 0 18.438 15V4.375a.94.94 0 0 0-.938-.937m-2.41 1.874L10 9.979 4.91 5.313zM3.438 14.688v-8.18l5.928 5.434a.937.937 0 0 0 1.268 0l5.929-5.435v8.182z"
        fill="currentColor"
      />
    </svg>
  );
}

export default ContactForm;
