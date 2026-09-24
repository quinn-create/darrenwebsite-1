import "server-only";
import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import { ABOUT_OPTIONS, CALLBACK_OPTIONS, REACH_OPTIONS } from "./contact-rules";
import type { Inquiry } from "./intake-delivery";

const labelFor = (list: readonly { value: string; label: string }[], values: string[]) =>
  values.map((v) => list.find((o) => o.value === v)?.label ?? v).join(", ");

// The inquiry as label/value rows, shared by the PDF and the email body.
export function inquiryRows(inq: Inquiry): [string, string][] {
  return [
    ["Name", inq.yourName],
    ["Client's name", inq.clientName || "Same as above"],
    ["About", labelFor(ABOUT_OPTIONS, inq.about)],
    ["Reach by", labelFor(REACH_OPTIONS, inq.reach)],
    ["Phone", inq.phone || "Not given"],
    ["Email", inq.email || "Not given"],
    ["Hear back", labelFor(CALLBACK_OPTIONS, [inq.callback])],
    ["Message", inq.message.trim() || "None"],
    ["Received", formatDate(inq.receivedAt)],
    ["Reference", inq.id],
  ];
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "America/Chicago",
    dateStyle: "medium",
    timeStyle: "short",
  }) + " (Central)";
}

// The standard PDF fonts only cover Windows-1252, so anything outside it (emoji, other
// scripts) is replaced rather than failing the whole inquiry.
function printable(text: string, font: PDFFont): string {
  return [...text.replace(/\r\n?/g, "\n")]
    .map((ch) => {
      if (ch === "\n") return ch;
      try {
        font.encodeText(ch);
        return ch;
      } catch {
        return "?";
      }
    })
    .join("");
}

function wrap(text: string, font: PDFFont, size: number, width: number): string[] {
  const lines: string[] = [];
  for (const para of text.split("\n")) {
    let line = "";
    for (const word of para.split(/\s+/)) {
      const next = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(next, size) <= width) line = next;
      else {
        if (line) lines.push(line);
        line = word;
      }
    }
    lines.push(line);
  }
  return lines;
}

export async function buildInquiryPdf(inq: Inquiry): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle("Website inquiry");
  doc.setCreator("Darren Drake Law PLLC website");
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const [W, H, M] = [612, 792, 54]; // US Letter, 0.75 in margins
  const labelW = 110;
  let page = doc.addPage([W, H]);
  let y = H - M;

  page.drawText("Website inquiry", { x: M, y: y - 20, size: 20, font: bold });
  y -= 40;
  page.drawText("Darren Drake Law PLLC  |  (615) 546-5551", { x: M, y, size: 10, font: regular, color: rgb(0.35, 0.35, 0.4) });
  y -= 14;
  page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 1, color: rgb(0.05, 0.45, 0.56) });
  y -= 24;

  for (const [label, value] of inquiryRows(inq)) {
    const lines = wrap(printable(value, regular), regular, 11, W - 2 * M - labelW);
    for (let i = 0; i < lines.length; i++) {
      if (y < M + 40) {
        page = doc.addPage([W, H]);
        y = H - M;
      }
      if (i === 0) page.drawText(label, { x: M, y, size: 11, font: bold });
      page.drawText(lines[i], { x: M + labelW, y, size: 11, font: regular });
      y -= 16;
    }
    y -= 6;
  }

  page.drawText("Sending this inquiry did not create an attorney-client relationship.", {
    x: M,
    y: M,
    size: 9,
    font: regular,
    color: rgb(0.35, 0.35, 0.4),
  });
  return doc.save();
}
