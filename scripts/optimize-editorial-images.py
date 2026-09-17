#!/usr/bin/env python3
"""
Convert raw 2K editorial images into web-optimized WebP format for fast loading and smooth 60fps parallax scrollytelling.
"""
import os
from PIL import Image

SRC_DIR = os.path.join("public", "images", "new-generated-images")
DEST_DIR = os.path.join("public", "images", "editorial")

MAPPING = {
    "outdoor_wedding_chapel_2K.jpeg": "wedding-chapel-2k.webp",
    "Banquet_hall_with_timber_ceiling_2K_20260916152604.jpeg": "emthombeni-banquet-2k.webp",
    "Safari_lodge_restaurant_at_twilight_2K_20260916150905.jpeg": "sunset-lapa-twilight-2k.webp",
    "Safari_tent_suite_with_bathtub_2K_20260916151305.jpeg": "valley-camp-suite-2k.webp",
    "Luxury_safari_tent_on_hill_2K_20260916151542.jpeg": "bush-camp-hilltop-2k.webp",
    "White_lions_resting_on_grass_2K_20260916152652.jpeg": "white-lions-pride-2k.webp",
    "Canoe_in_tidal_estuary_landscape_2K_20260916152707.jpeg": "estuary-canoe-2k.webp",
}

def optimize():
    os.makedirs(DEST_DIR, exist_ok=True)
    total_orig = 0
    total_opt = 0

    print(f"Converting 2K assets from {SRC_DIR} -> {DEST_DIR}...")
    for src_name, dest_name in MAPPING.items():
        src_path = os.path.join(SRC_DIR, src_name)
        dest_path = os.path.join(DEST_DIR, dest_name)

        if not os.path.exists(src_path):
            print(f"[SKIP] {src_name} not found!")
            continue

        orig_size = os.path.getsize(src_path)
        total_orig += orig_size

        im = Image.open(src_path)
        # Convert RGBA or CMYK to RGB if necessary
        if im.mode in ("RGBA", "P"):
            im = im.convert("RGB")

        # Resize to max 1920 width to match viewport while keeping sharp details
        max_w = 1920
        if im.width > max_w:
            new_h = int(im.height * (max_w / im.width))
            im = im.resize((max_w, new_h), Image.Resampling.LANCZOS)

        im.save(dest_path, "WEBP", quality=84, method=6)
        opt_size = os.path.getsize(dest_path)
        total_opt += opt_size

        savings = (1 - (opt_size / orig_size)) * 100
        print(f"[OK] {dest_name}: {orig_size/1024:.0f}KB -> {opt_size/1024:.0f}KB ({savings:.1f}% savings) [{im.size[0]}x{im.size[1]}]")

    print("\n--- Summary ---")
    print(f"Total original: {total_orig / 1024 / 1024:.2f} MB")
    print(f"Total optimized: {total_opt / 1024 / 1024:.2f} MB")
    print(f"Net savings: {(1 - total_opt / total_orig) * 100:.1f}%")

if __name__ == "__main__":
    optimize()
