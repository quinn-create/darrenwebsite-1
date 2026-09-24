"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { tabsListVariants, tabsTriggerVariants } from "@/components/ui/tabs";
import { NAV } from "@/lib/site";
import { cn } from "@/lib/utils";

// Compare without trailing slashes, so "/about" and "/about/" both count.
const trim = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p);

export function isActive(pathname: string, href: string) {
  const path = trim(pathname);
  const target = trim(href);
  return target === "/" ? path === "/" : path === target || path.startsWith(target + "/");
}

// The site's main navigation, drawn with the tabs component's styles (components/ui/tabs.tsx).
// Each tab is an ordinary link with aria-current, so it works without JavaScript and reads as
// navigation to screen readers; ARIA tabs are only for switching panels within one page.
export function NavTabs({ compact = false, className }: { compact?: boolean; className?: string }) {
  const pathname = usePathname() ?? "/";
  return (
    <nav aria-label={compact ? "Main (phone)" : "Main"} className={className}>
      <ul
        className={cn(
          tabsListVariants({ variant: "default", shape: "pill", size: compact ? "sm" : "lg" }),
          "border border-border/60 bg-surface",
          compact && "grid w-full grid-cols-4",
        )}
      >
        {NAV.filter((item) => compact || !("desktop" in item && item.desktop === false)).map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href} className="flex">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                aria-label={compact && item.short !== item.label ? item.label : undefined}
                data-state={active ? "active" : "inactive"}
                className={cn(
                  tabsTriggerVariants({ variant: "default", size: compact ? "sm" : "lg" }),
                  "min-h-11 rounded-full font-semibold text-muted data-[state=active]:bg-bg data-[state=active]:text-text data-[state=active]:ring-1 data-[state=active]:ring-action/70",
                  compact ? "w-full px-2 text-[15px]" : "px-5 text-[16px]",
                )}
              >
                {compact ? item.short : item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
