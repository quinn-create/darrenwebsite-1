"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CTA_LABEL, NAV, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";
import { Wordmark } from "./Wordmark";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
}

export function Header() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const sheet = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    menuButton.current?.focus();
  }, []);

  // Close the sheet on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const root = sheet.current;
    const focusables = () =>
      Array.from(root?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, close]);

  return (
    <header className="relative z-40 border-b border-border/50 bg-surface lg:sticky lg:top-0">
      <a
        href="#main"
        className="sr-only-focusable absolute left-4 top-3 z-50 rounded-card bg-action px-4 py-2 font-semibold text-on-action"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 w-full max-w-site items-center justify-between gap-6 px-5 sm:px-6 lg:h-24 lg:px-8">
        <Link href="/" className="rounded-sm py-2" aria-label="Darren Drake, Attorney at Law — home">
          <span className="hidden lg:inline-flex">
            <Wordmark />
          </span>
          <span className="lg:hidden">
            <Wordmark size="sm" />
          </span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex h-24 items-stretch gap-2">
            {NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href} className="flex">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative inline-flex items-center px-4 text-[16px] transition-colors duration-150 ${
                      active ? "font-semibold text-text" : "text-muted hover:text-text"
                    }`}
                  >
                    {item.label}
                    {active && (
                      <span aria-hidden="true" className="absolute inset-x-4 bottom-0 h-[3px] bg-action" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <a href={PHONE_HREF} className="link-action inline-flex min-h-11 items-center text-[16px] font-semibold">
            {PHONE_DISPLAY}
          </a>
          <Link href="/intake" className="btn-primary btn-compact">
            {CTA_LABEL}
          </Link>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <a
            href={PHONE_HREF}
            className="inline-flex size-11 items-center justify-center rounded-lg text-text"
            aria-label={`Call ${PHONE_DISPLAY}`}
          >
            <Phone aria-hidden="true" size={22} strokeWidth={1.5} />
          </a>
          <button
            ref={menuButton}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-lg text-text"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            <Menu aria-hidden="true" size={24} strokeWidth={1.5} />
            <span className="sr-only">Open menu</span>
          </button>
        </div>
      </div>

      {open && (
        <div
          ref={sheet}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 flex flex-col bg-surface lg:hidden"
        >
          <div className="flex h-16 items-center justify-between px-5 sm:px-6">
            <Wordmark size="sm" />
            <button
              type="button"
              onClick={close}
              className="inline-flex size-11 items-center justify-center rounded-lg text-text"
            >
              <X aria-hidden="true" size={24} strokeWidth={1.5} />
              <span className="sr-only">Close menu</span>
            </button>
          </div>
          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 pb-8 pt-4 sm:px-6">
            <ul className="border-t border-border/50">
              {NAV.map((item) => (
                <li key={item.href} className="border-b border-border/50">
                  <Link
                    href={item.href}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    className="flex min-h-14 items-center text-[20px] font-semibold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-4">
              <Link href="/intake" className="btn-primary w-full">
                {CTA_LABEL}
              </Link>
              <a href={PHONE_HREF} className="link-action inline-flex min-h-11 items-center justify-center text-[17px] font-semibold">
                Call {PHONE_DISPLAY}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
