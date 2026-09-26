// Light theme option (plans/light-theme-plan.md). The colours themselves live in
// app/globals.css under html[data-theme="light"]; this file holds what scripts need.
import { THEME_DEFAULT } from "./site-basics";

export const THEME_STORAGE_KEY = "theme";
// Browser toolbar colour on phones: each theme's page background.
export const THEME_COLOR = { dark: "#090F1C", light: "#F5F7FB" } as const;

// Runs in <head> before anything is drawn, so a saved choice never flashes the other theme.
// Adds `js` to <html> (the header button is hidden without JavaScript) and, when the visitor
// chose light, sets data-theme="light" and the phone toolbar colour. The theme-color tag is
// rendered by app/layout.tsx just before this script (not through Next's viewport export,
// which re-renders it after hydration). Storage can throw (private mode, blocked cookies).
export function themeScript() {
  const system = THEME_DEFAULT === "system";
  return (
    `(function(){var d=document.documentElement;d.classList.add("js");try{` +
    `var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});` +
    (system ? `if(t!=="light"&&t!=="dark"&&matchMedia("(prefers-color-scheme: light)").matches)t="light";` : "") +
    `if(t==="light"){d.setAttribute("data-theme","light");` +
    `var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",${JSON.stringify(THEME_COLOR.light)})}` +
    `}catch(e){}})()`
  );
}
