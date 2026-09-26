"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Cloudflare Turnstile on the contact form (server side: lib/turnstile.ts). Does nothing unless
// NEXT_PUBLIC_TURNSTILE_SITE_KEY is set. "interaction-only": most visitors never see it; a box
// appears only if Cloudflare needs the visitor to tick it. Cloudflare's script is fetched only here.
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";
export const TURNSTILE_ON = Boolean(SITE_KEY);
const SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type Turnstile = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
type W = Window & { turnstile?: Turnstile };

export function useTurnstile() {
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<string | undefined>(undefined);
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!SITE_KEY) return;
    const w = window as W;
    const render = () => {
      if (!box.current || !w.turnstile || widget.current) return;
      widget.current = w.turnstile.render(box.current, {
        sitekey: SITE_KEY,
        action: "contact",
        appearance: "interaction-only",
        callback: (t: string) => setToken(t),
        "expired-callback": () => setToken(""),
        "error-callback": () => setToken(""),
      });
    };
    if (w.turnstile) render();
    else {
      let s = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT}"]`);
      if (!s) {
        s = document.createElement("script");
        s.src = SCRIPT;
        s.async = true;
        document.head.appendChild(s);
      }
      s.addEventListener("load", render);
    }
    return () => {
      if (widget.current && w.turnstile) w.turnstile.remove(widget.current);
      widget.current = undefined;
    };
  }, []);

  // Each token works once: get a fresh one after any attempt that didn't succeed.
  const reset = useCallback(() => {
    const w = window as W;
    setToken("");
    if (widget.current && w.turnstile) w.turnstile.reset(widget.current);
  }, []);

  return [box, token, reset] as const;
}
