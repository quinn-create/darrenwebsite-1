"""Cuts the site's portrait crops from the approved Signal portrait.

Every crop stays inside the genuine middle strip of the source (x 493-1503),
where only the background and colors were changed; the areas added by the
editing tool (left sleeve/shoulder, lower-right strip) are never used.
Run from the repo root: python3 site/scripts/make-photo-crops.py
"""
from PIL import Image

SRC = "assets/photos/darren-drake-portrait-signal.webp"
OUT = "site/public/images"
GENUINE = (493, 1503)

src = Image.open(SRC).convert("RGB")
assert src.size == (2000, 1125), src.size

crops = {
    # 4:5 hero / About crop, full height, centred on the face (x centre ~998)
    "darren-drake-signal-4x5.jpg": (548, 0, 1448, 1125),
    # square for small circles (cards) and profile listings, head and shoulders
    "darren-drake-signal-square.jpg": (673, 110, 1323, 760),
}
for name, box in crops.items():
    assert GENUINE[0] <= box[0] and box[2] <= GENUINE[1], (name, box)
    src.crop(box).save(f"{OUT}/{name}", quality=92, optimize=True, progressive=True)
    print(name, box)
