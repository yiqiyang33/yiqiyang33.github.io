#!/usr/bin/env python3
"""Regenerate the favicon set from images/selfie.jpg.

Every size is resampled from the full-resolution photo rather than from a
smaller icon, so nothing is upscaled. Re-run this after replacing the photo;
adjust CROP if the new one frames the head differently.

Usage:
    python3 tools/make_favicons.py
"""

from PIL import Image

SOURCE = "images/selfie.jpg"

# Square region of the source photo to use, as (left, top, side). Chosen to run
# from just above the hair down to the shoulders.
CROP = (224, 166, 2242)

PNG_SIZES = {
    "images/favicon-16x16.png": 16,
    "images/favicon-32x32.png": 32,
    "images/apple-touch-icon.png": 180,
    "images/android-chrome-192x192.png": 192,
    "images/android-chrome-512x512.png": 512,
}

# Browsers request /favicon.ico on their own, and older ones only read .ico.
ICO_PATH = "images/favicon.ico"
ICO_SIZES = [(16, 16), (32, 32), (48, 48)]


def main():
    left, top, side = CROP
    square = Image.open(SOURCE).convert("RGB").crop(
        (left, top, left + side, top + side)
    )

    for path, size in sorted(PNG_SIZES.items(), key=lambda kv: kv[1]):
        square.resize((size, size), Image.LANCZOS).save(path, optimize=True)
        print(f"{size:>4}px  {path}")

    square.resize((256, 256), Image.LANCZOS).save(ICO_PATH, sizes=ICO_SIZES)
    print(f"{'ico':>6}  {ICO_PATH}  {', '.join(f'{w}x{h}' for w, h in ICO_SIZES)}")


if __name__ == "__main__":
    main()
