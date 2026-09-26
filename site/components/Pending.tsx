import type { ReactNode } from "react";
import { IS_PRODUCTION } from "@/lib/env";

// Anything the firm hasn't confirmed yet (plan Section 7, Appendix A). On previews it shows as
// clearly marked text; a production build (SITE_ENV=production) refuses to render it, and
// scripts/check-placeholders.mjs stops the build before it starts. `kind` names what's missing.
export function Pending({ kind, children }: { kind: string; children: ReactNode }) {
  if (IS_PRODUCTION) {
    throw new Error(`Unconfirmed content can't go live: <Pending kind="${kind}">. See docs/DECISIONS.md.`);
  }
  return (
    <mark className="pending" data-pending={kind}>
      <span className="pending-label">Waiting on the firm:</span> {children}
    </mark>
  );
}
