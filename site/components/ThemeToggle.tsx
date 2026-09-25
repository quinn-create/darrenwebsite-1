"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { LIGHT_THEME } from "@/lib/site";
import { THEME_COLOR, THEME_STORAGE_KEY } from "@/lib/theme";

// Header button that switches the site between the dark Signal colours and the light
// version (plans/light-theme-plan.md). The head script in app/layout.tsx applies a saved
// choice before paint; this only changes it. Both icons are rendered and CSS shows the
// right one, so the icon is correct even before this script loads.
function Toggle() {
  const [light, setLight] = useState(false);

  // The header has one button for phones and one for desktop; both follow <html>.
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => {
      const isLight = root.dataset.theme === "light";
      setLight(isLight);
      setThemeColor(isLight);
    };
    sync();
    const watch = new MutationObserver(sync);
    watch.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => watch.disconnect();
  }, []);

  const flip = () => {
    const next = !light;
    const root = document.documentElement;
    if (next) root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next ? "light" : "dark");
    } catch {
      // Storage blocked: the switch still applies to this page.
    }
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label="Light mode"
      aria-pressed={light}
      title={light ? "Switch to dark mode" : "Switch to light mode"}
      onClick={flip}
    >
      <Sun aria-hidden="true" className="theme-icon-sun" size={20} strokeWidth={1.75} />
      <Moon aria-hidden="true" className="theme-icon-moon" size={20} strokeWidth={1.75} />
    </button>
  );
}

function setThemeColor(light: boolean) {
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", light ? THEME_COLOR.light : THEME_COLOR.dark);
}

export function ThemeToggle() {
  return LIGHT_THEME ? <Toggle /> : null;
}
