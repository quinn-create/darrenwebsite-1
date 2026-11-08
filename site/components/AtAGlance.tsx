import { Anchor, Clock, GraduationCap, MapPin, Scale, Users } from "lucide-react";
import { DARREN, FIRM } from "@/lib/site";

// "At a glance": confirmed facts only (24 Sep 2026), from lib/site.ts. On Home ("Meet Darren",
// plan D11) and About.
const FACTS = [
  { icon: Anchor, label: DARREN.navy.short, value: DARREN.navy.role },
  { icon: GraduationCap, label: "Law degree", value: DARREN.lawSchool },
  { icon: Scale, label: "Rutherford County DUI Court", value: "Board member" },
  { icon: Users, label: "Memberships", value: DARREN.memberships.join("; ") },
  { icon: MapPin, label: "Office", value: FIRM.address },
  { icon: Clock, label: "Hours", value: FIRM.hours },
];

// `heading` keeps the outline right: h3 inside Home's "Meet Darren" section, h2 on About.
export function AtAGlance({ className = "", heading: Heading = "h3" }: { className?: string; heading?: "h2" | "h3" }) {
  return (
    <div className={`panel p-6 lg:p-8 ${className}`}>
      <Heading className="text-[14px] font-bold uppercase tracking-[0.1em] text-muted">At a glance</Heading>
      <dl className="mt-5 grid gap-5">
        {FACTS.map(({ icon: Icon, label, value }) => (
          <div key={label} className="relative pl-10">
            <dt className="font-semibold text-text">
              <Icon aria-hidden="true" size={22} strokeWidth={1.75} className="absolute left-0 top-0.5 text-action" />
              {label}
            </dt>
            <dd className="text-[16px] text-muted">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
