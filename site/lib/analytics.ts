// Minimal analytics stub. Only event names are recorded: never names, contact
// details, message text or matter details. Wire a real provider here later
// (and keep session replay off for /intake).
export type FormEvent =
  | "contact_start"
  | "contact_submit_success"
  | "contact_submit_error";

export function track(event: FormEvent): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("dd:analytics", { detail: { event } }));
}
