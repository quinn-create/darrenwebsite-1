"use client";

import { openCookieSettings } from "@/lib/consent-open";

// Footer buttons that reopen the cookie settings. Shown only when a tracker ID is set.
export function CookieLinks({ className }: { className: string }) {
  return (
    <>
      <button type="button" className={className} onClick={() => openCookieSettings()}>
        Cookie settings
      </button>
      <button type="button" className={className} onClick={() => openCookieSettings("marketing")}>
        Do Not Sell or Share My Personal Information
      </button>
    </>
  );
}

export function CookieSettingsButton() {
  return (
    <button type="button" className="btn-secondary btn-compact self-start" onClick={() => openCookieSettings()}>
      Open cookie settings
    </button>
  );
}
