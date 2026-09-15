# Ikhaya asset and motion guide

This is a fictional lodge, with concept amenities and generated photography, not a listing for an actual property. The stay planner is a local demo and sends nothing.

## Stack
Next.js App Router, React, TypeScript and CSS. Real Next.js static export (`next build`). No animation framework or WebGL required. The current motion is 2D parallax, not a rendered 3D scene.

## Current continuous scene
One sticky viewport spans a 650svh scroll runway (580svh on mobile). Scroll updates layers in requestAnimationFrame without hijacking native scrolling. app/page.tsx contains the timeline; app/globals.css contains the stage and responsive layout.

| Scroll progress | Transformation |
|---|---|
| 0–19% | Forest pushes in; opening headline scales and drifts out |
| 14–42% | A tilted suite photograph enters, grows and opens to full-screen |
| 29–55% | Suite details fade through; giant typography travels behind them |
| 47–72% | Suite rotates and slides out; pool appears through an expanding circular mask |
| 47–77% | A floating forest postcard layers over the scene, then rolls off-screen |
| 77–100% | Forest wipes back in and settles into the closing invitation |

| Asset | Placement |
|---|---|
| public/images/forest-lodge.webp | Opening forest, floating postcard, closing forest |
| public/images/forest-suite.webp | Expanding suite layer |
| public/images/forest-pool.webp | Pool reveal layer |

All three photographs are generated concept imagery. Current motion is composited 2D photography, not 3D or video. The animations reverse when scrolling back. Chapter navigation jumps to readable moments. Hidden text layers become inert and leave the accessibility tree; reduced motion shows all four chapters in a static reading layout. The planner remains a local demonstration.

## Image generation prompts
Hero (16:9, 1920px or larger): Photorealistic editorial travel photograph of a fictional luxury timber and glass lodge in indigenous coastal forest near East London, Eastern Cape, South Africa. Warm amber windows, layered misty canopy and deep greens, lodge on the right, open darker landscape on the left for white headline text. Sunrise. No typography, logos or people. Natural architecture, no tropical palm resort.

Forest suite (4:3): Interior of the same timber-and-glass forest lodge, king bed with natural linen, dark wood, a private deck through floor-to-ceiling windows, soft morning light, dense indigenous forest outside. Architectural travel photography, believable proportions, no text or people.

Canopy retreat (4:3): Wider two-bedroom forest retreat, timber lounge with comfortable linen seating and glass walls, lush Eastern Cape forest beyond the deck, late afternoon light. Match the same building materials and quiet luxury aesthetic. No text or people.

## Optional video-to-frame upgrade
Placement: replace one `.scene-image` layer inside the sticky `.stage` with a canvas. Retain the poster and text overlay. A video generator must create the source footage; the current site does not contain generated video.

Video prompt: Starting from the supplied lodge still, a single slow stabilized 6-second camera push through the forest toward the lodge deck. Gentle mist movement, subtle leaf motion, unchanged architecture and lighting. No cuts, morphing, new objects or text. Smooth continuous motion at 24fps, 16:9.

Extract frames locally with FFmpeg:

```bash
mkdir -p public/frames/forest
ffmpeg -i forest-push.mp4 -vf "fps=12,scale=1280:-2" -q:v 80 public/frames/forest/frame-%03d.webp
```

At 6 seconds this produces about 72 frames. Confirm the actual count. In a client component, map clamped section scroll progress to `Math.round(progress * (frameCount - 1))`; requestAnimationFrame draws that frame to a canvas with a cover crop. Load the poster first, then a bounded nearby frame window; do not decode the entire sequence at once on mobile. Limit canvas device pixel ratio to 1.5. Use a ResizeObserver for the canvas, clean up listeners, and keep the static poster for reduced motion, load failures and smaller devices. Budget 5–8 MB total, reducing resolution or frame count if needed.

For actual 3D, replace that same visual layer with a lazy-loaded GLB scene via React Three Fiber. The supplied image is a visual placeholder, not a 3D model. Keep the current poster fallback. A real lodge model or a commissioned GLB is needed before claiming accurate 3D architecture.


## Production update
A generated RGBA canopy overlay now adds a foreground depth layer. Scroll updates use a short exponential easing pass and reading holds. The optional canvas sequence player, disabled manifest and responsive frame converter are included. See `docs/VIDEO-PRODUCTION-BRIEF.md` for current production instructions and `docs/IKHAYA-PRODUCTION-KIT.zip` for prompts and all reference images. The film is not enabled until source video is supplied and converted.


## Live film integration
The three supplied MP4s are now the source of a 25.15-second edited sequence. The repeated suite movement is trimmed: clip 1 uses 0–10s, clip 2 uses 0–8s, clip 3 uses 2.25–10s, with 0.25s and 0.35s overlaps. The enabled manifest provides 302 frames per variant at 12fps. Desktop is 1280×720; mobile is a moving portrait crop at 480×852. Scroll holds at the suite and pool align with text chapters. The original supplied videos remain unchanged. Film-active mode hides the unrelated postcard and passing-word layers. Production instructions in the original kit remain reference material.
