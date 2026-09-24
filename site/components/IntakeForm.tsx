"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { track } from "@/lib/analytics";
import {
  CONTACT_METHODS,
  EMPTY_VALUES,
  FIELD_ORDER,
  MATTER_TYPES,
  MESSAGE_MAX,
  validateIntake,
  type IntakeErrors,
  type IntakeField,
  type IntakeValues,
} from "@/lib/intake-rules";
import { INTAKE_SUCCESS, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "not_configured" }
  | { kind: "failed"; message: string };

const LABELS: Record<IntakeField, string> = {
  fullName: "Full name",
  matterType: "Type of matter",
  contactMethod: "Preferred contact method",
  phone: "Phone",
  email: "Email",
  county: "County or court",
  courtDate: "Next court date",
  message: "Brief message",
};

// Where focus goes when the error summary links to a field.
function fieldTargetId(field: IntakeField): string {
  if (field === "matterType") return `matterType-${MATTER_TYPES[0].value}`;
  if (field === "contactMethod") return `contactMethod-${CONTACT_METHODS[0].value}`;
  return field;
}

export function IntakeForm({ configured }: { configured: boolean }) {
  const [values, setValues] = useState<IntakeValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<IntakeErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [honeypot, setHoneypot] = useState("");
  const started = useRef(false);
  const inFlight = useRef(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const errorList = FIELD_ORDER.filter((f) => errors[f]);

  useEffect(() => {
    if (status.kind === "success") successRef.current?.focus();
    else if (status.kind === "failed" || status.kind === "not_configured") statusRef.current?.focus();
  }, [status]);

  function markStarted() {
    if (!started.current) {
      started.current = true;
      track("intake_start");
    }
  }

  function update(field: IntakeField, value: string) {
    markStarted();
    const next = { ...values, [field]: value };
    setValues(next);
    if (attempted) setErrors(validateIntake(next));
  }

  async function submit(e?: FormEvent) {
    e?.preventDefault();
    if (inFlight.current) return; // blocks double submission
    setAttempted(true);

    const found = validateIntake(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus({ kind: "idle" });
      track("intake_submit_error");
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    inFlight.current = true;
    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/intake/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, website: honeypot }),
      });
      const data = (await res.json().catch(() => ({}))) as { status?: string; errors?: IntakeErrors };

      if (res.ok && data.status === "accepted") {
        track("intake_submit_success");
        setStatus({ kind: "success" });
        return;
      }

      track("intake_submit_error");
      if (data.status === "invalid" && data.errors && Object.keys(data.errors).length > 0) {
        setErrors(data.errors);
        setStatus({ kind: "idle" });
        requestAnimationFrame(() => summaryRef.current?.focus());
      } else if (data.status === "not_configured") {
        setStatus({ kind: "not_configured" });
      } else if (data.status === "rate_limited") {
        setStatus({ kind: "failed", message: "Too many attempts in a short time. Please wait a few minutes and try again, or call." });
      } else {
        setStatus({ kind: "failed", message: "Your inquiry could not be sent." });
      }
    } catch {
      track("intake_submit_error");
      setStatus({ kind: "failed", message: "Your inquiry could not be sent because of a connection problem." });
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
        className="mt-8 rounded-card border-2 border-success bg-surface p-6 outline-none lg:p-8"
      >
        <h2 className="h3 text-success">Inquiry received</h2>
        <p className="mt-3">{INTAKE_SUCCESS}</p>
        <p className="mt-3 text-muted">
          If you need to reach the office, call{" "}
          <a href={PHONE_HREF} className="link-action font-semibold">
            {PHONE_DISPLAY}
          </a>
          .
        </p>
        <Link href="/" className="link-secondary mt-6 inline-flex min-h-11 items-center">
          Return to the homepage
        </Link>
      </div>
    );
  }

  const submitting = status.kind === "submitting";
  const describe = (field: IntakeField, hint?: string) =>
    [hint, errors[field] ? `${field}-error` : undefined].filter(Boolean).join(" ") || undefined;
  const remaining = MESSAGE_MAX - values.message.length;

  return (
    <form noValidate onSubmit={submit} className="mt-8" aria-describedby={configured ? undefined : "demo-note"}>
      {!configured && (
        <p id="demo-note" className="sr-only">
          Demo form, not connected. Nothing will be sent.
        </p>
      )}

      {errorList.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          aria-labelledby="error-summary-title"
          className="mb-8 rounded-card border-2 border-error bg-surface p-5 outline-none"
        >
          <h2 id="error-summary-title" className="text-[18px] font-bold text-error">
            Please fix {errorList.length === 1 ? "1 item" : `${errorList.length} items`} to continue
          </h2>
          <ul className="mt-3 flex flex-col gap-1">
            {errorList.map((f) => (
              <li key={f}>
                <a
                  href={`#${fieldTargetId(f)}`}
                  className="link-action inline-flex min-h-11 items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(fieldTargetId(f))?.focus();
                  }}
                >
                  {LABELS[f]}: {errors[f]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-7">
        <Field id="fullName" label="Full name" required error={errors.fullName}>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            className="field-input"
            value={values.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            aria-required="true"
            aria-invalid={errors.fullName ? true : undefined}
            aria-describedby={describe("fullName")}
          />
        </Field>

        <RadioGroup
          name="matterType"
          legend="Type of matter"
          options={MATTER_TYPES}
          value={values.matterType}
          error={errors.matterType}
          onChange={(v) => update("matterType", v)}
        />

        <RadioGroup
          name="contactMethod"
          legend="Preferred contact method"
          hint="We'll only require the contact detail for the method you choose."
          options={CONTACT_METHODS}
          value={values.contactMethod}
          error={errors.contactMethod}
          onChange={(v) => update("contactMethod", v)}

        />

        <Field id="phone" label="Phone" required={values.contactMethod === "phone"} error={errors.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className="field-input"
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            aria-required={values.contactMethod === "phone" ? "true" : undefined}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={describe("phone")}
          />
        </Field>

        <Field id="email" label="Email" required={values.contactMethod === "email"} error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="field-input"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            aria-required={values.contactMethod === "email" ? "true" : undefined}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describe("email")}
          />
        </Field>

        <Field id="county" label="County or court" hint="“Not sure” is fine." error={errors.county}>
          <input
            id="county"
            name="county"
            type="text"
            autoComplete="off"
            className="field-input"
            value={values.county}
            onChange={(e) => update("county", e.target.value)}
            aria-invalid={errors.county ? true : undefined}
            aria-describedby={describe("county", "county-hint")}
          />
        </Field>

        <Field id="courtDate" label="Next court date" hint="Leave blank if you don't have one or aren't sure." error={errors.courtDate}>
          <input
            id="courtDate"
            name="courtDate"
            type="date"
            className="field-input"
            value={values.courtDate}
            onChange={(e) => update("courtDate", e.target.value)}
            aria-invalid={errors.courtDate ? true : undefined}
            aria-describedby={describe("courtDate", "courtDate-hint")}
          />
        </Field>

        <Field
          id="message"
          label="Brief message"
          hint="A short overview only. Please don't include detailed confidential information."
          error={errors.message}
        >
          <textarea
            id="message"
            name="message"
            className="field-input"
            maxLength={MESSAGE_MAX}
            value={values.message}
            onChange={(e) => update("message", e.target.value)}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={describe("message", "message-hint message-count")}
          />
          <p id="message-count" className="mt-2 text-[15px] text-muted" aria-live={remaining <= 100 ? "polite" : "off"}>
            {remaining} of {MESSAGE_MAX} characters remaining
          </p>
        </Field>

        {/* Honeypot for bots. Hidden from people and assistive technology. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="website">Leave this field empty</label>
          <input
            id="website"
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
          <div className="mt-8 rounded-card border-2 border-action bg-surface p-5">
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
          <div className="mt-8 rounded-card border-2 border-error bg-surface p-5">
            <p className="font-bold text-error">{status.message}</p>
            <p className="mt-1 text-muted">
              Your answers are still here. Try again, or call{" "}
              <a href={PHONE_HREF} className="link-action font-semibold">
                {PHONE_DISPLAY}
              </a>
              .
            </p>
            <button type="button" className="btn-primary btn-compact mt-4" onClick={() => submit()}>
              Try again
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
        <button type="submit" className="btn-primary w-full px-8 sm:w-auto" disabled={submitting} aria-disabled={submitting}>
          {submitting ? "Sending…" : "Send inquiry"}
        </button>
        <a href={PHONE_HREF} className="link-secondary inline-flex min-h-11 items-center justify-center">
          Or call {PHONE_DISPLAY}
        </a>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  required,
  hint,
  error,
  children,
}: {
  id: IntakeField;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="label block">
        {label} <span className="font-normal text-muted">{required ? "(required)" : "(optional)"}</span>
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-[15px] text-muted">
          {hint}
        </p>
      )}
      <div className="mt-2">{children}</div>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-[15px] font-semibold text-error">
          {error}
        </p>
      )}
    </div>
  );
}

function RadioGroup({
  name,
  legend,
  hint,
  options,
  value,
  error,
  onChange,

}: {
  name: "matterType" | "contactMethod";
  legend: string;
  hint?: string;
  options: readonly { value: string; label: string }[];
  value: string;
  error?: string;
  onChange: (value: string) => void;

}) {
  const describedBy = [hint ? `${name}-hint` : undefined, error ? `${name}-error` : undefined].filter(Boolean).join(" ") || undefined;
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
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {options.map((opt) => {
          const id = `${name}-${opt.value}`;
          const checked = value === opt.value;
          return (
            <label
              key={opt.value}
              htmlFor={id}
              className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-[16px] font-semibold transition-colors duration-150 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus ${
                checked ? "border-action bg-bg" : error ? "border-error bg-bg" : "border-border bg-bg"
              }`}
            >
              <input
                id={id}
                type="radio"
                name={name}
                value={opt.value}
                checked={checked}
                required
                onChange={() => onChange(opt.value)}
                className="size-5 accent-[var(--color-action)]"
              />
              {opt.label}
            </label>
          );
        })}
      </div>
      {error && (
        <p id={`${name}-error`} className="mt-2 text-[15px] font-semibold text-error">
          {error}
        </p>
      )}
    </fieldset>
  );
}
