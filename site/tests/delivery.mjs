// Delivery check with stand-ins for Resend, Postmark, Telegram and Cloudflare Turnstile (no real
// accounts, no network).
// Starts its own server from the current build on :3002, pointed at a mock on :4010.
// Usage (after `next build`): node tests/delivery.mjs
import { spawn } from "node:child_process";
import { createServer } from "node:http";

const received = { email: [], postmark: [], telegram: [] };
let failEmail = false;
let failTelegram = false;
let turnstileDown = false;
const turnstileSeen = [];

const mock = createServer((req, res) => {
  const chunks = [];
  req.on("data", (c) => chunks.push(c));
  req.on("end", () => {
    const body = Buffer.concat(chunks);
    if (req.url === "/emails") {
      // Resend
      if (req.headers.authorization !== "Bearer re_test_key") {
        res.writeHead(401).end("{}");
        return;
      }
      if (failEmail) {
        res.writeHead(500).end("{}");
        return;
      }
      received.email.push(JSON.parse(body.toString()));
      res.writeHead(200, { "content-type": "application/json" }).end('{"id":"test-email-id"}');
    } else if (req.url === "/email") {
      // Postmark (the fallback option)
      if (req.headers["x-postmark-server-token"] !== "test-token") {
        res.writeHead(401).end("{}");
        return;
      }
      received.postmark.push(JSON.parse(body.toString()));
      res.writeHead(200, { "content-type": "application/json" }).end('{"ErrorCode":0,"Message":"OK"}');
    } else if (req.url === "/turnstile") {
      const form = new URLSearchParams(body.toString());
      turnstileSeen.push(Object.fromEntries(form));
      if (turnstileDown) {
        res.writeHead(503).end();
        return;
      }
      const ok = form.get("secret") === "test-turnstile-secret" && form.get("response") === "good-token";
      res.writeHead(200, { "content-type": "application/json" }).end(JSON.stringify({ success: ok }));
    } else if (req.url === "/bottest-bot/sendDocument") {
      received.telegram.push({ type: req.headers["content-type"], body: body.toString("latin1") });
      res.writeHead(failTelegram ? 500 : 200).end('{"ok":true}');
    } else res.writeHead(404).end();
  });
});
await new Promise((r) => mock.listen(4010, r));

const server = spawn("npx", ["next", "start", "-p", "3002"], {
  env: {
    ...process.env,
    INTAKE_DESTINATION: "email",
    RESEND_API_URL: "http://localhost:4010",
    RESEND_API_KEY: "re_test_key",
    INTAKE_EMAIL_FROM: "website@example.com",
    INTAKE_EMAIL_TO: "first@example.com, second@example.com",
    TELEGRAM_API_URL: "http://localhost:4010",
    TELEGRAM_BOT_TOKEN: "test-bot",
    TELEGRAM_CHAT_ID: "12345",
    TURNSTILE_SECRET_KEY: "test-turnstile-secret",
    TURNSTILE_VERIFY_URL: "http://localhost:4010/turnstile",
  },
  stdio: "ignore",
  detached: true,
});

const results = [];
const check = async (name, fn) => {
  try {
    results.push({ name, ok: true, note: await fn() });
  } catch (err) {
    results.push({ name, ok: false, note: err.message });
  }
};
const assert = (cond, msg) => {
  if (!cond) throw new Error(msg);
};
const post = (body, turnstileToken = "good-token") =>
  fetch("http://localhost:3002/api/contact/", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": `10.0.0.${Math.floor(Math.random() * 250)}` },
    body: JSON.stringify({ ...body, turnstileToken }),
  });
const valid = (message) => ({
  yourName: "Test Person",
  clientName: "Test Client",
  about: ["rutherford-arrest"],
  reach: ["call", "email"],
  phone: "615-555-0123",
  email: "test@example.com",
  callback: "asap",
  message,
});

try {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch("http://localhost:3002/")).ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }

  await check("Email (Resend) goes to both recipients with the PDF attached; success reported", async () => {
    const res = await post(valid("Test inquiry — émoji 🚓 and accents é should not break the PDF."));
    const data = await res.json();
    assert(res.status === 200 && data.status === "accepted", `got ${res.status} ${JSON.stringify(data)}`);
    const mail = received.email.at(-1);
    assert(mail.to.join(",") === "first@example.com,second@example.com", `to was ${mail.to}`);
    assert(mail.from === "website@example.com", `from was ${mail.from}`);
    assert(mail.reply_to === "test@example.com", "reply-to should be the visitor's email");
    assert(/as soon as possible/.test(mail.subject), `subject: ${mail.subject}`);
    assert(!mail.subject.includes("Test Person"), "the visitor's name must not be in the subject line");
    assert(/Client's name: Test Client/.test(mail.text), "body missing client name");
    const pdf = Buffer.from(mail.attachments[0].content, "base64");
    assert(/\.pdf$/.test(mail.attachments[0].filename) && pdf.subarray(0, 5).toString() === "%PDF-", "no PDF");
    return `${pdf.length} byte PDF`;
  });

  await check("Telegram gets the same PDF with a caption", async () => {
    const tg = received.telegram.at(-1);
    assert(tg && /multipart\/form-data/.test(tg.type), "no Telegram upload");
    assert(tg.body.includes('name="chat_id"') && tg.body.includes("12345"), "chat id missing");
    assert(tg.body.includes("%PDF-"), "PDF missing from Telegram upload");
  });

  await check("A Telegram failure doesn't undo a delivered email", async () => {
    failTelegram = true;
    const res = await post(valid("Telegram failure test."));
    failTelegram = false;
    assert(res.status === 200, `expected 200, got ${res.status}`);
  });

  await check("An email failure is reported as not sent (no false success)", async () => {
    failEmail = true;
    const before = received.telegram.length;
    const res = await post(valid("Email failure test."));
    failEmail = false;
    const data = await res.json();
    assert(res.status === 502 && data.status === "delivery_failed", `got ${res.status} ${JSON.stringify(data)}`);
    assert(received.telegram.length === before, "Telegram must not send when the email failed");
  });
  await check("Spam check (Turnstile): a missing or failed token is refused and nothing is sent", async () => {
    const before = received.email.length;
    for (const token of ["", "bad-token"]) {
      const res = await post(valid(`Turnstile ${token || "missing"} test.`), token);
      const data = await res.json();
      assert(res.status === 403 && data.status === "challenge_failed", `token "${token}": got ${res.status} ${JSON.stringify(data)}`);
    }
    assert(received.email.length === before, "an inquiry was delivered without passing the check");
    const last = turnstileSeen.at(-1);
    assert(last && !JSON.stringify(last).includes("Test Person"), "form content was sent to Turnstile");
  });

  await check("Spam check (Turnstile): if Cloudflare can't be reached, the inquiry still gets through", async () => {
    turnstileDown = true;
    const res = await post(valid("Turnstile outage test."));
    turnstileDown = false;
    const data = await res.json();
    assert(res.status === 200 && data.status === "accepted", `got ${res.status} ${JSON.stringify(data)}`);
  });
  await check("Postmark still works as the fallback email service", async () => {
    const pm = spawn("npx", ["next", "start", "-p", "3003"], {
      env: { ...process.env, INTAKE_DESTINATION: "email", POSTMARK_API_URL: "http://localhost:4010", POSTMARK_SERVER_TOKEN: "test-token", INTAKE_EMAIL_FROM: "website@example.com", INTAKE_EMAIL_TO: "first@example.com" },
      stdio: "ignore",
      detached: true,
    });
    try {
      for (let i = 0; i < 60; i++) {
        try {
          if ((await fetch("http://localhost:3003/")).ok) break;
        } catch {}
        await new Promise((r) => setTimeout(r, 500));
      }
      const res = await fetch("http://localhost:3003/api/contact/", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(valid("Postmark fallback test.")) });
      assert(res.status === 200, `got ${res.status}`);
      const mail = received.postmark.at(-1);
      assert(mail && mail.To === "first@example.com" && mail.Attachments?.[0]?.ContentType === "application/pdf", "Postmark email missing or wrong");
    } finally {
      process.kill(-pm.pid);
    }
  });
} finally {
  process.kill(-server.pid);
  mock.close();
}

let failed = 0;
for (const r of results) {
  if (!r.ok) failed++;
  console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.note ? ` — ${r.note}` : ""}`);
}
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
