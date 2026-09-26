import "server-only";

// Cloudflare Turnstile: an invisible "are you a person?" check on the contact form, to keep spam
// out of Kelly's inbox. Off until the firm sets its keys (TURNSTILE_SECRET_KEY here, and
// NEXT_PUBLIC_TURNSTILE_SITE_KEY for the form). Only the one-time token and the visitor's IP go
// to Cloudflare; nothing from the form does.
const VERIFY_URL = () => process.env.TURNSTILE_VERIFY_URL ?? "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type TurnstileResult = { ok: true; checked: boolean } | { ok: false };

export async function verifyTurnstile(token: string | undefined, ip: string): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: true, checked: false };
  if (!token) return { ok: false };
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip && ip !== "local") body.set("remoteip", ip);
    const res = await fetch(VERIFY_URL(), { method: "POST", body, signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`Turnstile answered ${res.status}`);
    const data = (await res.json()) as { success?: boolean };
    return data.success ? { ok: true, checked: true } : { ok: false };
  } catch {
    // Cloudflare's check itself is unreachable: let the inquiry through rather than lose a real
    // person's message. The honeypot and the rate limit still apply.
    return { ok: true, checked: false };
  }
}
