import { Phone } from "lucide-react";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";
import { cn } from "@/lib/utils";

// One consistent treatment for the phone number: evenly spaced digits (tabular figures),
// semibold, never underlined or wrapped, with a phone icon. "button" is the outlined pill
// that sits beside the main "Contact us" button; "inline" is for headers and lists.
export function PhoneLink({
  variant = "button",
  label = "Call",
  className,
}: {
  variant?: "button" | "inline";
  label?: string;
  className?: string;
}) {
  if (variant === "inline") {
    return (
      <a href={PHONE_HREF} className={cn("phone-link", className)}>
        <Phone aria-hidden="true" size={17} strokeWidth={2} className="shrink-0 text-action" />
        <span className="phone-num">{PHONE_DISPLAY}</span>
      </a>
    );
  }
  return (
    <a href={PHONE_HREF} className={cn("btn-secondary", className)}>
      <Phone aria-hidden="true" size={18} strokeWidth={2} className="shrink-0" />
      <span>
        {label} <span className="phone-num">{PHONE_DISPLAY}</span>
      </span>
    </a>
  );
}
