"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/site-basics";

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
// The class names come from navTabClasses() (components/nav-tab-classes.ts), worked out on the
// server by the header, so the class-merging code never reaches the browser.
export function NavTabs({
  compact = false,
  className,
  classes,
}: {
  compact?: boolean;
  className?: string;
  classes: { list: string; trigger: string };
}) {
  const pathname = usePathname() ?? "/";
  return (
    <nav aria-label={compact ? "Main (phone)" : "Main"} className={className}>
      <ul className={classes.list}>
        {NAV.filter((item) => compact || !("desktop" in item && item.desktop === false)).map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href} className="flex">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                aria-label={compact && item.short !== item.label ? item.label : undefined}
                data-state={active ? "active" : "inactive"}
                className={classes.trigger}
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
