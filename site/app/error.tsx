"use client";

import { useEffect } from "react";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/site-basics";

// Shown if a page fails to load. Keeps the phone number reachable.
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log only the error id, never form content or visitor details.
    console.error("Page error", error.digest ?? "");
  }, [error]);

  return (
    <section className="py-24">
      <div className="mx-auto w-full max-w-site px-5 sm:px-6 lg:px-8">
        <h1 className="h1">Something went wrong</h1>
        <p className="measure mt-5 text-muted">
          This page didn&apos;t load. Please try again. To reach the office now, call{" "}
          <a href={PHONE_HREF} className="link-action font-semibold">
            {PHONE_DISPLAY}
          </a>
          .
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <button type="button" className="btn-primary" onClick={() => reset()}>
            Try again
          </button>
          <a href={PHONE_HREF} className="link-secondary inline-flex min-h-11 items-center text-[18px]">
            Call {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </section>
  );
}
