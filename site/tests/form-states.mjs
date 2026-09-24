// Screenshots of each state of the site form (test data only). Needs :3000 (demo) and :3001 (local-test).
import { chromium } from "playwright-core";

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium" });
for (const width of [390, 1440]) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  const shot = (name) => page.screenshot({ path: `screenshots/intake-${name}-${width}.png`, fullPage: true });
  const fill = async (suffix) => {
    await page.locator("#cf-yourName").fill(`Screenshot Test ${width}-${suffix}`);
    await page.locator("form").getByText("Arrested in Rutherford County").click();
    await page.locator("form").getByText("Call", { exact: true }).click();
    await page.locator("#cf-phone").fill("615-555-0123");
    await page.locator("form").getByText("As soon as possible").click();
    await page.locator("#cf-message").fill("Test inquiry for screenshots, please ignore.");
  };

  await page.goto("http://localhost:3000/intake");
  await page.getByRole("button", { name: "Send message" }).click();
  await page.locator('[aria-labelledby="contact-error-title"]').waitFor();
  await shot("error");

  await page.goto("http://localhost:3000/intake");
  await fill("demo");
  await page.getByRole("button", { name: "Send message" }).click();
  await page.getByText("Not sent: this demo form").waitFor();
  await shot("not-configured");

  await page.goto("http://localhost:3001/intake");
  await fill("send");
  await page.route("**/api/contact/", async (r) => { await new Promise((x) => setTimeout(x, 1500)); await r.continue(); });
  await page.getByRole("button", { name: "Send message" }).click();
  await page.getByRole("button", { name: "Sending…" }).waitFor();
  await shot("submitting");
  await page.getByText("Message received").waitFor();
  await page.unroute("**/api/contact/");
  await shot("success");

  await page.goto("http://localhost:3001/intake");
  await fill("retry");
  await page.route("**/api/contact/", (r) => r.abort("failed"));
  await page.getByRole("button", { name: "Send message" }).click();
  await page.getByText("could not be sent because of a connection problem").waitFor();
  await shot("retry");
  await ctx.close();
}
await browser.close();
console.log("form state screenshots written");
