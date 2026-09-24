import { randomUUID } from "node:crypto";
import { z } from "zod";
import { EMPTY_CONTACT, validateContact, type ContactValues } from "@/lib/contact-rules";
import { clientIp, createGuard, json } from "@/lib/form-guard";
import { deliver, type Inquiry } from "@/lib/intake-delivery";
import { practiceBySlug } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Shape check only; the business rules live in validateContact so client and server match.
const Body = z.object({
  yourName: z.string().max(500),
  clientName: z.string().max(500),
  about: z.array(z.string().max(50)).max(5),
  reach: z.array(z.string().max(20)).max(5),
  phone: z.string().max(50),
  email: z.string().max(500),
  callback: z.string().max(20),
  message: z.string().max(5000),
  topic: z.string().max(60).optional(), // practice-area slug from "Ask about …"; unknown values are dropped
  website: z.string().max(500).optional(), // honeypot: must stay empty
});

const guard = createGuard();

export async function POST(request: Request) {
  const now = Date.now();

  if (guard.rateLimited(clientIp(request), now)) {
    return json({ status: "rate_limited" }, 429);
  }

  let parsed: z.infer<typeof Body>;
  try {
    parsed = Body.parse(await request.json());
  } catch {
    return json({ status: "invalid", errors: {} }, 400);
  }

  const { website, topic, ...rest } = parsed;
  const topicTitle = practiceBySlug(topic)?.title ?? "";
  const values: ContactValues = { ...EMPTY_CONTACT, ...rest };

  const errors = validateContact(values);
  if (Object.keys(errors).length > 0) {
    return json({ status: "invalid", errors }, 422);
  }

  // Honeypot filled: likely a bot. Reject without delivering.
  if (website) {
    return json({ status: "invalid", errors: {} }, 400);
  }

  const fingerprint = guard.fingerprint({ ...values, topicTitle });
  const duplicate = guard.duplicateOf(fingerprint, now);
  if (duplicate) {
    return json({ status: "accepted", id: duplicate, duplicate: true }, 200);
  }

  const inquiry: Inquiry = {
    id: randomUUID(),
    topic: topicTitle,
    receivedAt: new Date(now).toISOString(),
    ...values,
    yourName: values.yourName.trim(),
    clientName: values.clientName.trim(),
    phone: values.phone.trim(),
    email: values.email.trim(),
  };

  const result = await deliver(inquiry);
  if (!result.ok) {
    return json({ status: result.reason }, result.reason === "not_configured" ? 503 : 502);
  }

  guard.remember(fingerprint, inquiry.id, now);
  return json({ status: "accepted", id: inquiry.id }, 200);
}
