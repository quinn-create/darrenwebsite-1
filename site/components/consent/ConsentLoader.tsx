"use client";

import { lazy, Suspense, useSyncExternalStore } from "react";
import type { Trackers } from "@/lib/tracking";

// The banner and tags live in their own chunk, fetched only in the browser after the page
// is interactive, so they never delay the first paint. Rendered only when a tracker ID is set
// (app/layout.tsx). React's own lazy() keeps this wrapper to a few bytes.
const Consent = lazy(() => import("./Consent"));
const noop = () => () => {};

export function ConsentLoader({ trackers }: { trackers: Trackers }) {
  const inBrowser = useSyncExternalStore(noop, () => true, () => false);
  if (!inBrowser) return null;
  return (
    <Suspense fallback={null}>
      <Consent trackers={trackers} />
    </Suspense>
  );
}
