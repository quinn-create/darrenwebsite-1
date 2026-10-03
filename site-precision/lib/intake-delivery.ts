import "server-only";
import { appendFile, mkdir, open } from "node:fs/promises";
import path from "node:path";

export type Inquiry = {
  id: string;
  receivedAt: string;
  fullName: string;
  matterType: string;
  contactMethod: string;
  phone: string;
  email: string;
  county: string;
  courtDate: string;
  message: string;
};

export type DeliveryResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "delivery_failed" };

// INTAKE_DESTINATION selects where inquiries go:
//   unset        -> not configured; nothing is accepted and the UI says so
//   "local-test" -> appends to .data/intake-test.jsonl (for testing only, never for live inquiries)
//   https://...  -> POSTs JSON to a webhook (email service, CRM, etc.); success only on a 2xx reply
// Add further adapters here when the firm chooses a destination.
export function destination(): string | undefined {
  const value = process.env.INTAKE_DESTINATION?.trim();
  return value ? value : undefined;
}

export function isConfigured(): boolean {
  return destination() !== undefined;
}

export async function deliver(inquiry: Inquiry): Promise<DeliveryResult> {
  const dest = destination();
  if (!dest) return { ok: false, reason: "not_configured" };

  try {
    if (dest === "local-test") {
      const dir = path.join(process.cwd(), ".data");
      await mkdir(dir, { recursive: true });
      const file = path.join(dir, "intake-test.jsonl");
      await appendFile(file, JSON.stringify(inquiry) + "\n", "utf8");
      // Flush to disk before reporting acceptance.
      const handle = await open(file, "r+");
      try {
        await handle.sync();
      } finally {
        await handle.close();
      }
      return { ok: true };
    }

    if (dest.startsWith("https://")) {
      const headers: Record<string, string> = { "content-type": "application/json" };
      const secret = process.env.INTAKE_WEBHOOK_SECRET;
      if (secret) headers.authorization = `Bearer ${secret}`;
      const res = await fetch(dest, {
        method: "POST",
        headers,
        body: JSON.stringify(inquiry),
        signal: AbortSignal.timeout(10_000),
      });
      return res.ok ? { ok: true } : { ok: false, reason: "delivery_failed" };
    }

    console.error("INTAKE_DESTINATION has an unsupported value");
    return { ok: false, reason: "delivery_failed" };
  } catch (err) {
    console.error("Intake delivery failed:", err instanceof Error ? err.message : "unknown error");
    return { ok: false, reason: "delivery_failed" };
  }
}
