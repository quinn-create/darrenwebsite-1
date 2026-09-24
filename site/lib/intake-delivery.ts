import "server-only";
import { appendFile, mkdir, open, writeFile } from "node:fs/promises";
import path from "node:path";
import { buildInquiryPdf, formatDate, inquiryRows } from "./inquiry-pdf";

// One inquiry from the website form (components/ui/form-1.tsx via /api/contact).
export type Inquiry = {
  id: string;
  receivedAt: string;
  // Practice area the visitor came from ("Ask about …" bar), e.g. "DUI/DWI"; "" if none.
  topic: string;
  yourName: string;
  clientName: string;
  about: string[];
  reach: string[];
  phone: string;
  email: string;
  callback: string;
  message: string;
};

export type DeliveryResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "delivery_failed" };

// INTAKE_DESTINATION selects where inquiries go (see .env.example):
//   unset        -> not configured; nothing is accepted and the UI says so
//   "email"      -> Postmark email to INTAKE_EMAIL_TO with the inquiry PDF attached
//   "local-test" -> appends to .data/intake-test.jsonl (testing only, never for live inquiries)
//   https://...  -> POSTs JSON to a webhook; success only on a 2xx reply
// The form reports success only when this primary delivery succeeds. After that, if
// TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are set, the PDF is also sent by Telegram
// (the firm's choice, 24 Sep 2026); a Telegram failure is logged but doesn't undo the email.
export function destination(): string | undefined {
  const value = process.env.INTAKE_DESTINATION?.trim();
  return value ? value : undefined;
}

const env = (name: string) => process.env[name]?.trim() || undefined;

function emailRecipients(): string[] {
  return (env("INTAKE_EMAIL_TO") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function isConfigured(): boolean {
  const dest = destination();
  if (!dest) return false;
  if (dest === "email") {
    return Boolean(env("POSTMARK_SERVER_TOKEN") && env("INTAKE_EMAIL_FROM") && emailRecipients().length > 0);
  }
  return true;
}

export async function deliver(inquiry: Inquiry): Promise<DeliveryResult> {
  const dest = destination();
  if (!dest || !isConfigured()) return { ok: false, reason: "not_configured" };

  let pdf: Uint8Array;
  try {
    pdf = await buildInquiryPdf(inquiry);
  } catch (err) {
    console.error("Inquiry PDF failed:", err instanceof Error ? err.message : "unknown error");
    return { ok: false, reason: "delivery_failed" };
  }

  let ok = false;
  try {
    if (dest === "email") ok = await sendEmail(inquiry, pdf);
    else if (dest === "local-test") ok = await saveLocal(inquiry, pdf);
    else if (dest.startsWith("https://")) ok = await postWebhook(dest, inquiry);
    else console.error("INTAKE_DESTINATION has an unsupported value");
  } catch (err) {
    console.error("Intake delivery failed:", err instanceof Error ? err.message : "unknown error");
  }
  if (!ok) return { ok: false, reason: "delivery_failed" };

  await sendTelegram(inquiry, pdf);
  return { ok: true };
}

function subject(inq: Inquiry): string {
  const base = inq.callback === "asap" ? "New website inquiry: call back as soon as possible" : "New website inquiry";
  return inq.topic ? `${base} (${inq.topic})` : base;
}

function textBody(inq: Inquiry): string {
  const rows = inquiryRows(inq).map(([label, value]) => `${label}: ${value}`);
  return `A new inquiry came in through the website.\n\n${rows.join("\n")}\n\nThe same details are in the attached PDF.\n`;
}

function pdfName(inq: Inquiry): string {
  return `inquiry-${inq.receivedAt.slice(0, 10)}-${inq.id.slice(0, 8)}.pdf`;
}

async function sendEmail(inq: Inquiry, pdf: Uint8Array): Promise<boolean> {
  const base = env("POSTMARK_API_URL") ?? "https://api.postmarkapp.com";
  const res = await fetch(`${base}/email`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "x-postmark-server-token": env("POSTMARK_SERVER_TOKEN")!,
    },
    body: JSON.stringify({
      From: env("INTAKE_EMAIL_FROM"),
      To: emailRecipients().join(","),
      ReplyTo: inq.email || undefined,
      Subject: subject(inq),
      TextBody: textBody(inq),
      MessageStream: "outbound",
      Attachments: [{ Name: pdfName(inq), Content: Buffer.from(pdf).toString("base64"), ContentType: "application/pdf" }],
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    console.error(`Postmark rejected the inquiry email (HTTP ${res.status})`);
    return false;
  }
  const data = (await res.json().catch(() => ({}))) as { ErrorCode?: number };
  return data.ErrorCode === 0;
}

async function saveLocal(inq: Inquiry, pdf: Uint8Array): Promise<boolean> {
  const dir = path.join(process.cwd(), ".data");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, pdfName(inq)), pdf);
  const file = path.join(dir, "intake-test.jsonl");
  await appendFile(file, JSON.stringify(inq) + "\n", "utf8");
  // Flush to disk before reporting acceptance.
  const handle = await open(file, "r+");
  try {
    await handle.sync();
  } finally {
    await handle.close();
  }
  return true;
}

async function postWebhook(url: string, inq: Inquiry): Promise<boolean> {
  const headers: Record<string, string> = { "content-type": "application/json" };
  const secret = env("INTAKE_WEBHOOK_SECRET");
  if (secret) headers.authorization = `Bearer ${secret}`;
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(inq),
    signal: AbortSignal.timeout(10_000),
  });
  return res.ok;
}

async function sendTelegram(inq: Inquiry, pdf: Uint8Array): Promise<void> {
  const token = env("TELEGRAM_BOT_TOKEN");
  const chatId = env("TELEGRAM_CHAT_ID");
  if (!token || !chatId) return;
  try {
    const base = env("TELEGRAM_API_URL") ?? "https://api.telegram.org";
    const form = new FormData();
    form.append("chat_id", chatId);
    form.append("caption", `${subject(inq)} (${formatDate(inq.receivedAt)})`);
    form.append("document", new Blob([Buffer.from(pdf)], { type: "application/pdf" }), pdfName(inq));
    const res = await fetch(`${base}/bot${token}/sendDocument`, {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) console.error(`Telegram rejected the inquiry PDF (HTTP ${res.status})`);
  } catch (err) {
    console.error("Telegram delivery failed:", err instanceof Error ? err.message : "unknown error");
  }
}
