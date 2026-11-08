# Printable design handouts

Letter-size, landscape PDFs for showing Darren the design options. Darren's supplied portrait is placed into every concept's photo frame; nothing about his likeness is generated.

| File | What it contains |
|---|---|
| `00-Darren-Drake-Design-Options-All.pdf` | Everything in one booklet: cover, overview of all nine concepts, a page and a details page for each concept, then both demo websites (44 pages) |
| `1A-Signal-Concept-A.pdf` … `5C-Precision-Variation-C.pdf` | One handout per concept: the homepage image and a details page (colors, type, headline, button, strengths, notes) |
| `Signal-Demo-Website.pdf`, `Precision-Demo-Website.pdf` | The built demo sites: the full homepage, other pages, phone views, how the intake form responds, and what's still needed from the firm |

## Rebuilding

1. From the repo root, run `python3 printouts/tools/composite.py <workdir>`. It writes `<workdir>/concepts/*.png`, the concepts with the portrait placed in the frame.
2. Capture the demo screenshots with `node tests/print-shots.mjs <workdir>/site` in `site/`, and `node tests/print-shots.mjs <workdir>/site-precision` in `site-precision/`. Each needs its servers running on :3000 and :3001; see that site's README.
3. Run `python3 printouts/tools/make_pdfs.py <workdir> printouts`. It needs `reportlab` and the Liberation Sans fonts.
