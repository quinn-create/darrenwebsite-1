// Minimal analytics stub. Only event names are recorded: never names, contact
// details, message text or matter details. Wire a real provider here later
// (and keep session replay off for /intake).
export type FormEvent =
  | "contact_start"
  | "contact_submit_success"
  | "contact_submit_error";

export type TrackedEvent = { event: FormEvent; handled: boolean };
type QueueWindow = Window & { __ddAnalytics?: TrackedEvent[] };

// Events are also kept in a short queue, because the cookie-consent code loads just after the
// page: a form sent before it arrives is still counted once it does (components/consent/Consent.tsx).
export function track(event: FormEvent): void {
  if (typeof window === "undefined") return;
  const entry: TrackedEvent = { event, handled: false };
  const w = window as QueueWindow;
  w.__ddAnalytics = [...(w.__ddAnalytics ?? []), entry].slice(-20);
  window.dispatchEvent(new CustomEvent("dd:analytics", { detail: entry }));
}

export function queuedEvents(): TrackedEvent[] {
  return typeof window === "undefined" ? [] : ((window as QueueWindow).__ddAnalytics ?? []);
}
