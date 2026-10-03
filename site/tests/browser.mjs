// Which Chromium the tests use, found automatically (no hard-coded path):
// 1. CHROMIUM_PATH, if set;
// 2. Playwright's own browser, if installed (CI runs `npx playwright-core install chromium`);
// 3. any Chromium under PLAYWRIGHT_BROWSERS_PATH (for machines with a pre-installed set).
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

export function chromiumPath() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  try {
    if (existsSync(chromium.executablePath())) return undefined; // Playwright finds it itself
  } catch {}
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH;
  if (root && existsSync(root)) {
    const candidates = [path.join(root, "chromium")];
    for (const d of readdirSync(root).filter((n) => /^chromium-\d+$/.test(n)).sort().reverse()) {
      candidates.push(path.join(root, d, "chrome-linux64", "chrome"), path.join(root, d, "chrome-linux", "chrome"));
    }
    const found = candidates.find((c) => existsSync(c));
    if (found) return found;
  }
  return undefined; // Playwright will explain how to install a browser
}

export const launchBrowser = (options = {}) => chromium.launch({ executablePath: chromiumPath(), ...options });
