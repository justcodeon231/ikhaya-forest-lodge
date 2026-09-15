# Ikhaya Forest Lodge — frame-based version

This is the version immediately BEFORE the native-video optimisation change (source d84dd76ed9f15b385fca810d76cac4f069c21490). Its original look and canvas frame playback are preserved, including the earlier smoothness limitations. It is not the later native-video version.

## Open in Antigravity
1. Extract the entire ZIP. Open this `ikhaya-forest-lodge` folder in Antigravity.
2. Install Node.js 22.13 or newer and pnpm 11.25.0.
3. Open a terminal in this folder and run:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open http://localhost:5173 in your browser. No API keys, database or paid service is needed for the demo. First install needs internet. Node dependencies are intentionally not bundled.

To build:

```sh
pnpm build
```

This is a Next.js static export. The generated `out/` directory can be hosted on a static host. Do not use `next start` for this export. Use `pnpm dev` for local editing. The old Sites-specific `start` script was removed from this handoff because it targeted a different server output.

## How it is connected
| File or folder | Purpose |
|---|---|
| app/page.tsx | Page content, scroll progress, animation layers, stay-planner demo |
| app/globals.css | Layout, typography, transitions, responsive and reduced-motion styling |
| components/scroll-film.tsx | Canvas image-sequence player and small frame cache |
| public/sequence/manifest.json | Enabled frame configuration and scroll-to-frame timing stops |
| public/sequence/desktop/ | 302 landscape WebP frames, 1280×720 |
| public/sequence/mobile/ | 302 portrait WebP frames, 480×852 |
| public/images/ | All backgrounds, transparent canopy, and film-derived stills |
| media/originals/ | Your three original 1080p MP4 uploads, unchanged |
| media/ikhaya-master.mp4 | Edited approximately 25-second master used for extraction |
| scripts/assemble-journey.py | Rebuild the edited master with trims and overlaps |
| scripts/prepare-sequence.py | Convert a master into responsive WebP sequences |
| docs/ | Earlier creative direction and production reference kit |

The page emits an `ikhaya-progress` event with a number from zero to one. The player maps that progress through the manifest stops, requests nearby images, and draws the selected frame to the canvas. The image layers remain the loading/error fallback; reduced motion presents static chapters.

## Media workflow (optional)
The site is already wired to the supplied frames. You do not need to regenerate them to run it. Python, FFmpeg and FFprobe are needed only if you change the footage.

```sh
python scripts/assemble-journey.py
python scripts/prepare-sequence.py media/ikhaya-master.mp4
```

The assembly trims clip 2 to 8 seconds and starts clip 3 at 2.25 seconds, avoiding the repeated walk through the suite. The joins use 0.25-second and 0.35-second overlaps. Extraction is 12 fps; tune the manifest if you change timing or frame count.

## Scope and notes
The lodge, room details and booking flow are fictional. The planner sends nothing and does not reserve a room. Old starter utilities are included for completeness but the site uses normal Next.js `dev` and `build` commands. There is no `.git` history, `node_modules`, credentials, production build cache or live-site identity in this ZIP.

For improvements, keep this version as your baseline. Evaluate cache/preload size, decode scheduling and frame resolution one change at a time. Verify on the actual phone and desktop before replacing the working baseline.
