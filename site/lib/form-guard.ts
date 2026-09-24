import "server-only";
import { createHash } from "node:crypto";

// Protections for the form API route: per-IP rate limit and short-term de-duplication.
// In-memory limits are per server instance. Replace with a shared store (e.g. Redis) in production.
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const DEDUPE_WINDOW_MS = 2 * 60 * 1000;

export function json(body: unknown, status: number) {
  return Response.json(body, { status, headers: { "cache-control": "no-store" } });
}

export function clientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

export function createGuard() {
  const hits = new Map<string, number[]>();
  const recent = new Map<string, { at: number; id: string }>();

  return {
    rateLimited(ip: string, now: number): boolean {
      const list = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
      list.push(now);
      hits.set(ip, list);
      return list.length > RATE_MAX;
    },
    fingerprint(values: unknown): string {
      return createHash("sha256").update(JSON.stringify(values)).digest("hex");
    },
    // Returns the earlier inquiry's id when the same content was accepted moments ago.
    duplicateOf(fingerprint: string, now: number): string | undefined {
      for (const [key, entry] of recent) if (now - entry.at > DEDUPE_WINDOW_MS) recent.delete(key);
      return recent.get(fingerprint)?.id;
    },
    remember(fingerprint: string, id: string, now: number) {
      recent.set(fingerprint, { at: now, id });
    },
  };
}
