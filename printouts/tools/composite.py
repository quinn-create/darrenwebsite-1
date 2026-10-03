# Places Darren's real portrait into each concept's placeholder frame (no generation).
import numpy as np
from PIL import Image, ImageDraw, ImageOps
import sys
W = sys.argv[1]
photo = Image.open("assets/photos/darren-drake-portrait.jpg").convert("RGB")
S = 2688 / 2000  # display -> original scale
# approx placeholder boxes in 2000-wide display coords, plus corner radius (original px)
APPROX = {
    "01-signal":   ((1309, 161, 1732, 704), 14),
    "01-signal-b": ((1286, 195, 1701, 707), 6),
    "01-signal-c": ((1374, 129, 1786, 640), 14),
    "02-chambers": ((1313, 153, 1726, 657), 0),
    "03-monument": ((1086, 109, 2000, 762), 0),
    "04-counsel":  ((1254, 155, 1737, 731), 20),
    "05-precision":   ((1390, 184, 1694, 542), 0),
    "05-precision-b": ((1326, 144, 1747, 638), 6),
    "05-precision-c": ((1439, 172, 1723, 539), 12),
}
def refine(a, box):
    x0, y0, x1, y1 = [int(v * S) for v in box]
    h, w = a.shape[:2]
    x1 = min(x1, w - 1); y1 = min(y1, h - 1)
    sy = y0 + int((y1 - y0) * 0.82)   # scan row below the label text
    sx = x0 + int((x1 - x0) * 0.12)   # scan column left of the label text
    cx = (x0 + x1) // 2; cy = (y0 + y1) // 2
    def walk(getpix, start, step, limit):
        prev = getpix(start); p = start
        while p != limit:
            n = p + step
            cur = getpix(n)
            if np.abs(cur - prev).sum() > 24:
                return p
            prev = cur; p = n
        return p
    row = lambda x: a[sy, x].astype(int)
    col = lambda y: a[y, sx].astype(int)
    L = walk(row, cx, -1, max(0, x0 - 40))
    R = walk(row, cx, 1, min(w - 1, x1 + 40))
    T = walk(col, cy + (y1 - y0) // 4, -1, max(0, y0 - 40))
    B = walk(col, cy + (y1 - y0) // 4, 1, min(h - 1, y1 + 40))
    return L, T, R + 1, B + 1
for name, (box, radius) in APPROX.items():
    im = Image.open(f"brand-concepts/{name}.png").convert("RGB")
    a = np.asarray(im)
    L, T, R, B = refine(a, box)
    w, h = R - L, B - T
    p = ImageOps.fit(photo, (w, h), Image.LANCZOS, centering=(0.5, 0.22))
    m = Image.new("L", (w, h), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, w - 1, h - 1], radius=radius, fill=255)
    im.paste(p, (L, T), m)
    im.save(f"{W}/concepts/{name}.png")
    print(f"{name}: approx={[int(v*S) for v in box]} refined={(L,T,R,B)} size={w}x{h}")
