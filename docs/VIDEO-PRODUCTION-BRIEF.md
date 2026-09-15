# Ikhaya: the continuous forest journey

## What to send back
Generate three landscape MP4 clips, roughly 6–8 seconds each, at the highest clean resolution your tool supports (1080p is enough). Send the original MP4s, numbered 01, 02 and 03. Do not add text, music, transitions, slow motion or frame interpolation. You do not need to extract frames: I can do that, tune the scroll timing and integrate them.

We have a working 2D photographic experience. These clips supply genuine camera motion through the setting. Generated video is still rendered footage, not an editable 3D scene. It cannot promise accurate real-world lodge architecture.

## Reference files
- `01-forest-start.png`: the exact starting image for clip 01 and primary architecture reference.
- `02-suite-mood.png`: materials, atmosphere and interior direction only. It is not geometrically matched to the exterior. Do not force it as an exact end frame.
- `03-pool-mood.png`: atmosphere and pool direction only. It has different lighting. Keep the generated journey at the same early-morning time; do not force this photograph as an endpoint.
- `04-canopy-overlay.png`: transparent foreground layer already integrated in the site. Not a video input.

## How to maintain continuity
Generate clip 01 first. Extract its LAST clean frame and use that as the START image for clip 02. Repeat between clips 02 and 03. If your tool can extend an existing shot, extend that shot instead. A last-frame image is more important than a clever prompt.

Use one model and consistent aspect ratio, resolution and style throughout. Do not generate all three clips independently. Match camera direction, speed, lighting and architecture at each join. A prompt alone cannot guarantee continuity; reject visible warping or redesigns. If the available tool cannot continue a shot or accept image references, stop after clip 01 and send that for review before spending more credits.

## Shared direction — append to every shot
Create photorealistic architectural travel cinematography for a fictional secluded forest lodge in the Eastern Cape, South Africa. Preserve the input image's dark timber construction, glazing, roof geometry, warm practical lamps, indigenous coastal forest, mist and natural material textures. It is one physical place and one continuous early-morning visit. Restrained luxury, natural exposure, realistic perspective, moderate depth of field, stable gimbal camera at approximately human eye level when near the building, approximately 28–35 mm lens feel. Slow, even forward travel with gentle turns only. Architecture and trees are rigid, persistent objects. Leaves and distant mist may move subtly. No people, vehicles, signs, logos, subtitles, text, fake interface, lens flares, speed ramps, abrupt zooms, cuts, transitions, camera shake, flicker, melting geometry, moving walls, multiplying windows, or changes in weather or time of day. Keep the centre composition usable for a mobile crop. Deliver clean video without an added soundtrack.

## Clip 01 — Forest to the deck
Use `01-forest-start.png` as the starting image.

Prompt:
Starting exactly from the supplied forest-lodge photograph, make one uninterrupted, smooth forward camera approach toward the warm timber lodge on the right. The lodge must remain the same building with the same roofline, windows, deck and location. The camera gently approaches and descends toward deck height; nearby forest leaves naturally pass outside the frame faster than the distant trees. The misty valley stays spatially consistent. End with the lodge's open deck and an already open doorway prominent ahead, establishing the entrance for the next shot. Prioritise plausible camera travel and intact architecture over covering a huge distance. No passing through solid objects or glass. No sudden turn, fast flight or dramatic drone orbit. Finish with steady forward motion that can be continued, without a fade or a stop.

If a clean single approach cannot reach the deck within the tool's duration, extend the shot. Do not ask it to teleport to the doorway.

Save as `01-forest-approach.mp4`.

## Clip 02 — Through the open doorway
Use the LAST clean frame of clip 01 as the starting image. Use suite photograph only as a secondary material reference if the tool supports it.

Prompt:
Continue the exact preceding camera movement from this frame at the same speed and height. Move naturally along the timber deck and through the existing open doorway into the same lodge. Do not travel through glass or alter the building to make room for the camera. Reveal a calm suite with warm dark timber, understated natural linen, a bed arranged on the right, and floor-to-ceiling forest-facing windows. Interior exposure adapts gently and realistically. Keep the forest and deck outside in their established direction. Continue slowly across the room toward another open terrace exit, with a plausible glimpse of a pool beyond. The room must remain stable as the camera moves. End facing the terrace opening, ready for a continuous outward movement. No cuts, crossfades, rearranged furniture, new architecture replacing old architecture, or change in daylight.

Save as `02-enter-suite.mp4`.

## Clip 03 — Out to the pool, then settle
Use the LAST clean frame of clip 02 as the starting image. Pool photograph is mood guidance only; preserve the morning lighting of clips 01 and 02.

Prompt:
Continue the exact camera movement from the supplied frame. Pass through the existing open terrace exit onto the timber pool deck. Gently reveal a secluded, still pool framed by indigenous coastal forest, keeping the lodge behind and to one side in a physically consistent position. Morning light and mist match the previous shot. Move a little closer to the water and allow the view to open naturally, then ease gradually to an almost stationary composition during the final two seconds. Subtle water ripples and faint foliage motion only. Keep a calm darker area toward the centre-left suitable for website text later, but do not generate any text. No day-to-night change, aerial orbit, new distant resort buildings, jump in camera height or abrupt stop. End on a clean frame that can hold beneath a booking invitation.

Save as `03-pool-arrival.mp4`.

## Review before sending
Watch without sound. Keep clips only if the lodge, doorways and perspective remain stable; camera motion continues naturally; and the final frame of each clip matches the start of the next. Check tree edges and window frames for warping. All text and UI will be HTML on the site, not burnt into the footage.

## What I do after receiving the clips
1. Inspect continuity and pick clean join frames, trimming duplicates or artifacts.
2. Assemble a continuous master; use a short overlap only if it disguises a genuinely small mismatch. I cannot repair an entirely different building through editing.
3. Export desktop and mobile WebP frames, measure weight and trim the frame rate if needed.
4. Enable the existing canvas player, align camera progress with the four text chapters and add short visual holds for reading.
5. Keep chapter navigation, accessible text, booking controls and reduced-motion fallback.
6. Rebuild and publish the same private website.

## Implementation already supplied
`components/scroll-film.tsx` reads `public/sequence/manifest.json`. The shipped manifest is disabled, so the live site uses the existing photographs. The player limits loading to three in-flight images and eight decoded frames, uses a mobile sequence at 700px or below, caps canvas pixel density at 1.5, and leaves imagery visible if configuration or initial loading fails. Frames can be scrubbed in either direction. It is compiled but awaits real footage for end-to-end frame-playback verification.

After an approved continuous master is available:

```bash
python scripts/prepare-sequence.py path/to/ikhaya-master.mp4
```

The helper requires FFmpeg and FFprobe, outputs 12fps WebP at 1280px and 768px widths, checks matching frame counts, and enables the manifest only after extraction succeeds. Its initial scroll stops include reading holds and must be tuned to the actual shot boundaries. Rebuild after conversion. Aim for roughly 5–10MB for the mobile sequence; measure the output rather than assuming it meets the budget. If heavier, reduce duration, resolution, quality or frame rate based on a visual check.

## Optional true 3D path
True interactive 3D needs a coherent model (`.glb`), texture maps and a planned camera route. A video generator does not provide those. That would be a separate Blender/3D modelling step and is unnecessary for the scroll-controlled film version above.
