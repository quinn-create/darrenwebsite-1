import { createHash, randomUUID } from "node:crypto";
import { z } from "zod";
import { deliver, type Inquiry } from "@/lib/intake-delivery";
import { EMPTY_VALUES, validateIntake, type IntakeValues } from "@/lib/intake-rules";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Shape check only; the business rules live in validateIntake so client and server match.
const Body = z.object({
  fullName: z.string().max(500),
  matterType: z.string().max(50),
  contactMethod: z.string().max(20),
  phone: z.string().max(50),
  email: z.string().max(500),
  county: z.string().max(500),
  courtDate: z.string().max(20),
  message: z.string().max(5000),
  website: z.string().max(500).optional(), // honeypot: must stay empty
});

// In-memory limits are per server instance. Replace with a shared store (e.g. Redis) in production.
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const DEDUPE_WINDOW_MS = 2 * 60 * 1000;
const hits = new Map<string, number[]>();
const recent = new Map<string, { at: number; id: string }>();

function rateLimited(ip: string, now: number): boolean {
  const list = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  return list.length > RATE_MAX;
}

function json(body: unknown, status: number) {
  return Response.json(body, { status, headers: { "cache-control": "no-store" } });
}

export async function POST(request: Request) {
  const now = Date.now();
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";

  if (rateLimited(ip, now)) {
    return json({ status: "rate_limited" }, 429);
  }

  let parsed: z.infer<typeof Body>;
  try {
    parsed = Body.parse(await request.json());
  } catch {
    return json({ status: "invalid", errors: {} }, 400);
  }

  const { website, ...rest } = parsed;
  const values: IntakeValues = { ...EMPTY_VALUES, ...rest };

  const errors = validateIntake(values);
  if (Object.keys(errors).length > 0) {
    return json({ status: "invalid", errors }, 422);
  }

  // Honeypot filled: likely a bot. Reject without delivering.
  if (website) {
    return json({ status: "invalid", errors: {} }, 400);
  }

  const fingerprint = createHash("sha256").update(JSON.stringify(values)).digest("hex");
  for (const [key, entry] of recent) if (now - entry.at > DEDUPE_WINDOW_MS) recent.delete(key);
  const duplicate = recent.get(fingerprint);
  if (duplicate) {
    return json({ status: "accepted", id: duplicate.id, duplicate: true }, 200);
  }

  const inquiry: Inquiry = {
    id: randomUUID(),
    receivedAt: new Date(now).toISOString(),
    ...values,
    fullName: values.fullName.trim(),
    phone: values.phone.trim(),
    email: values.email.trim(),
    county: values.county.trim(),
  };

  const result = await deliver(inquiry);
  if (!result.ok) {
    return json({ status: result.reason }, result.reason === "not_configured" ? 503 : 502);
  }

  recent.set(fingerprint, { at: now, id: inquiry.id });
  return json({ status: "accepted", id: inquiry.id }, 200);
}
