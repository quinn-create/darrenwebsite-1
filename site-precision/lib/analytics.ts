// Minimal analytics stub. Only event names are recorded: never names, contact
// details, message text or matter details. Wire a real provider here later
// (and keep session replay off for /intake).
export type IntakeEvent =
  | "intake_start"
  | "intake_step_completed"
  | "intake_submit_success"
  | "intake_submit_error";

export function track(event: IntakeEvent): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("dd:analytics", { detail: { event } }));
}
