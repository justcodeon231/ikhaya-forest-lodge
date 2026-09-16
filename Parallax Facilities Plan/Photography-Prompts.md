# Inkwenkwezi Private Game Reserve: Photography Prompts & 3D Beveled Motion Mechanics

This document provides:
1. **Editorial Photography Prompts** to upscale, re-imagine, and transform raw facility shots into world-class luxury safari visuals using modern generative tools (Midjourney v6.1, Flux.1 Pro, or SDXL).
2. **Interactive 3D Motion & Beveling Architecture**: Technical CSS and React mechanics for dynamic pop-up photo cards that tilt, bevel, cast ambient shadows, and float across parallax depth layers.

---

## Part 1: Editorial Photography Generation & Refinement Prompts

Each prompt is calibrated for ultra-realistic architectural and wildlife editorial aesthetics (reminiscent of *Condé Nast Traveler*, *Architectural Digest*, and *National Geographic*).

### 1. The Sunset Lapa & Open Boma Fire Pit
* **Reference Asset**: `public/images/facilities/sunset-lapa-restaurant.jpg`
* **Prompt**:
  > *Ultra-wide cinematic architectural photograph of a luxury African safari lodge restaurant nestled on a hillside in the Eastern Cape at twilight. Traditional high double-volume thatched roof with exposed dark timber rafters. Walls built from rough-hewn native golden-brown sandstone. Large floor-to-ceiling openings looking out over a wide elevated timber deck. In the center foreground, an authentic stone boma fire pit with glowing red mopane logs sending subtle embers drifting into the deep indigo night sky. Warm amber lantern glow illuminating the interior lounge with plush leather armchairs and a stone fireplace. In the background, dramatic panoramic view of misty rolling hills and acacia trees under the southern hemisphere starry sky. Shot on Hasselblad H6D-100c, 24mm f/4 lens, golden hour fading into dusk, warm atmospheric lighting, hyper-realistic textures, architectural photography, 8k resolution. --ar 16:9 --style raw --v 6.1*

### 2. Valley Camp Lodge: 4★ Luxury Canopy Suite & Slipper Bath
* **Reference Asset**: `public/images/facilities/valley-camp-suite.jpg` & `valley-camp-deck.jpg`
* **Prompt**:
  > *Luxurious safari tented suite nestled deep inside a lush indigenous coastal forest canopy in the Wild Coast. Elevated heavy dark timber deck surrounded by towering Umtiza and milkwood trees. On the private outdoor deck, a vintage freestanding white slipper soaking tub filled with warm water, overlooking a sea of green treetops bathed in morning sunlight. Soft canvas tent walls rolled open to reveal crisp white king-size linen bed with woven tribal throws, bedside reading lamps, and dark teak furniture. Dappled natural sunlight filtering through green foliage creating soft light shafts. Editorial interior and lifestyle photography, shot on Sony A7R V, 35mm f/1.4 GM lens, natural morning diffused light, serene atmosphere, ultra-detailed fabric and wood grain textures, photorealistic. --ar 16:9 --style raw --v 6.1*

### 3. Bush Camp Lodge: Hilltop Safari Tent & Cave-Hewn Bathroom
* **Reference Asset**: `public/images/facilities/bush-camp-cave-ensuite.jpg` & `bush-camp-exterior.jpg`
* **Prompt**:
  > *Authentic luxury safari tent perched on an elevated hilltop ridge overlooking an expansive valley in the Eastern Cape bushveld. High-resolution shot showing the exterior timber viewing deck with two safari safari chairs and a small table. Seamlessly connected to the rear, a unique private ensuite bathroom sculpted directly out of natural river stones and local granite rock to resemble an organic cavern, with a modern rainfall shower head cascading warm water over mossy boulders. Wide panoramic bushveld vista in the background with distant game paths. Warm afternoon sun hitting the rock textures. Architectural documentary photography, shot on Leica SL2, 28mm f/2.8, rich tactile stone textures, natural lighting. --ar 16:9 --style raw --v 6.1*

### 4. Emthombeni Grand Dining & Wedding Reception Venue
* **Reference Asset**: `public/images/facilities/emthombeni-restaurant.jpg`
* **Prompt**:
  > *Architectural interior photograph of a grand African banquet and wedding reception hall in an Eastern Cape private game reserve. Towering high-pitch thatched ceiling with massive structural timber beams. Expansive multi-panel glass folding doors pushed completely back, merging the indoor hall with an expansive elevated timber deck overlooking the African bushveld and distant Indian Ocean. Rich polished stone flooring reflecting ambient golden light. Tables elegantly set for an evening gala with crystal wine glasses, white tablecloths, indigenous floral centerpieces of proteas and wild aloes. Warm, celebratory, sophisticated ambiance. Shot on Canon EOS R5, 16-35mm f/2.8L at 20mm, interior architecture photography, 8k. --ar 16:9 --style raw --v 6.1*

### 5. The Open-Air Wild Fig Tree Wedding Chapel
* **Reference Asset**: `public/images/facilities/wedding-fig-tree-chapel.jpg`
* **Prompt**:
  > *Romantic outdoor wedding ceremony venue nestled in a botanical sanctuary beneath a colossal, ancient African Wild Fig Tree. The sprawling canopy provides a natural shaded archway with gentle beams of golden afternoon sunlight piercing through the leaves. A clean terracotta-red carpet aisle flanked by rustic dark wood benches stretches toward a natural timber wedding arch decorated with white orchids and wild foliage. Beside the aisle, a serene landscaped stream with smooth river stones and blooming water lilies reflecting the sky. Romantic, timeless, peaceful sanctuary. Shot on Nikon Z9, 50mm f/1.2 lens, shallow depth of field, fairytale natural lighting. --ar 16:9 --style raw --v 6.1*

### 6. The Rare White Lions of Inkwenkwezi
* **Reference Asset**: `public/images/facilities/white-lions.jpg`
* **Prompt**:
  > *Close-medium wildlife photograph of a magnificent pair of rare White Lions resting together on a grassy knoll in the Eastern Cape savanna at golden hour. Pure white and cream fur with distinct black pigmentation on their paw pads and dark charcoal noses (genuine genetic white lions, non-albino). Piercing warm amber eyes looking calmly into the lens. In the background, rolling coastal grassland and distant acacia trees under a soft warm sky. Incredible detail on individual whiskers, fur strands, and muscular structure. Shot on Canon 1D X Mark III with 400mm f/2.8 lens, National Geographic editorial wildlife cover shot, 8k resolution. --ar 16:9 --style raw --v 6.1*

### 7. The Five Biomes: Ecological Crossroad
* **Reference Asset**: `public/images/facilities/umtiza-tree.jpg` & `canoeing-estuary.jpg`
* **Prompt**:
  > *Panoramic landscape showing the dramatic meeting point of five distinct eco-systems on the Wild Coast. In the foreground, the tranquil glass-like waters of a tidal saltwater estuary reflecting the sky, with a wooden canoe tied to a reed bank. Moving up, dense ancient Umtiza coastal forest with emerald green canopies giving way to rocky valley bushveld with flowering red aloes and rolling open grasslands on the coastal horizon. Cinematic morning mist hanging low in the river basin. Landscape photography, shot on Phase One IQ4 150MP, 24mm, polarizer filter, breathtaking depth and dynamic range. --ar 16:9 --style raw --v 6.1*

---

## Part 2: Interactive 3D Beveling & Pop-Up Motion System

To make the photography feel alive on screen rather than simply flat images pinned to scroll, we introduce a **3D Beveled Pop-Up Card Architecture**.

### 1. Visual Design: The "Safari Editorial" Bevel
Each floating photo card features:
1. **Outer Subtle Metallic/Gold Bevel**: A 1px border with a soft gradient mimicking brushed champagne gold (`linear-gradient(135deg, rgba(200, 157, 92, 0.45), rgba(200, 157, 92, 0.1))`).
2. **Inner Inset Highlight**: `box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.25)`.
3. **Multi-Stage Ambient Elevation Shadow**:
   * Resting: `box-shadow: 0 16px 36px -12px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(200, 157, 92, 0.2)`.
   * Popped (active/hover): `box-shadow: 0 32px 64px -16px rgba(0, 0, 0, 0.85), 0 0 0 1.5px rgba(200, 157, 92, 0.45)`.
4. **Editorial Location/Spec Stamp**: Minimal typography on the lower border indicating exact lodge coordinates and facility names.

### 2. Motion Mechanics & React Implementation

```tsx
// Interactive 3D Tilt & Bevel Component
import { useState, useRef, MouseEvent } from 'react';

export function BeveledPhotoCard({ 
  src, 
  alt, 
  title, 
  caption, 
  tag, 
  className = '' 
}: {
  src: string;
  alt: string;
  title: string;
  caption: string;
  tag: string;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0, active: false });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20; // -10 to +10 deg
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20; // -10 to +10 deg
    setCoords({ x, y, active: true });
  };

  const handleMouseLeave = () => {
    setCoords({ x: 0, y: 0, active: false });
  };

  return (
    <div 
      ref={cardRef}
      className={`beveled-photo-card ${className} ${coords.active ? 'is-hovered' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: coords.active 
          ? `perspective(1000px) rotateX(${coords.y}deg) rotateY(${coords.x}deg) scale3d(1.03, 1.03, 1.03)` 
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: coords.active ? 'transform 0.08s ease-out' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
      }}
    >
      <div className="card-media">
        <img src={src} alt={alt} loading="lazy" />
        <div className="card-glass-glare" style={{
          background: coords.active 
            ? `radial-gradient(circle at ${(coords.x + 10) * 5}% ${(coords.y + 10) * 5}%, rgba(255,255,255,0.22) 0%, transparent 60%)` 
            : 'none'
        }} />
      </div>
      <div className="card-details">
        <span className="card-tag">{tag}</span>
        <h4>{title}</h4>
        <p>{caption}</p>
      </div>
    </div>
  );
}
```

### 3. CSS Bevel & Elevation Stylesheet

```css
/* 3D Beveled Photography Card Styling */
.beveled-photo-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(14, 24, 20, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(200, 157, 92, 0.35);
  box-shadow: 
    0 24px 48px -12px rgba(0, 0, 0, 0.75),
    inset 0 1px 1px rgba(255, 255, 255, 0.25),
    inset 0 -1px 1px rgba(0, 0, 0, 0.5);
  will-change: transform, box-shadow;
  cursor: pointer;
}

.beveled-photo-card.is-hovered {
  border-color: rgba(200, 157, 92, 0.65);
  box-shadow: 
    0 36px 72px -16px rgba(0, 0, 0, 0.9),
    0 0 25px rgba(200, 157, 92, 0.2),
    inset 0 1px 2px rgba(255, 255, 255, 0.4);
}

.beveled-photo-card .card-media {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
}

.beveled-photo-card .card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.beveled-photo-card:hover .card-media img {
  transform: scale(1.06);
}

.beveled-photo-card .card-glass-glare {
  position: absolute;
  inset: 0;
  pointer-events: none;
  mix-blend-mode: overlay;
  z-index: 2;
}

.beveled-photo-card .card-details {
  padding: 1.25rem;
  color: #fff;
}

.beveled-photo-card .card-tag {
  display: inline-block;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #c89d5c;
  margin-bottom: 0.35rem;
  font-weight: 600;
}

.beveled-photo-card h4 {
  font-size: 1.15rem;
  font-weight: 500;
  margin: 0 0 0.4rem 0;
  color: #f6f3ee;
}

.beveled-photo-card p {
  font-size: 0.85rem;
  line-height: 1.45;
  color: rgba(246, 243, 238, 0.75);
  margin: 0;
}
```

---

## Part 3: Pop-Up Stagger Map Across the 8 Scenes

| Scene | Trigger Progress (`p`) | Popping Photography Card | 3D Bevel Placement & Tilt |
| :--- | :--- | :--- | :--- |
| **02 Five Biomes** | `0.15 – 0.24` | `umtiza-tree.jpg` (Ancient Umtiza) + `canoeing-estuary.jpg` | Lower right, `rotate(3deg)`, floats up from bottom |
| **03 4×4 Safari & Lions** | `0.29 – 0.37` | `white-lions.jpg` (Rare White Lion Pride) | Centered floating card with golden bevel highlight |
| **04 Tented Sanctuaries** | `0.41 – 0.50` | *Valley Camp*: `valley-camp-suite.jpg` (Slipper Tub)<br/>*Bush Camp*: `bush-camp-cave-ensuite.jpg` (Cave Rock Shower) | Controlled via Interactive Deck Toggle with smooth card flip |
| **05 Sunset Lapa & Boma** | `0.54 – 0.63` | `sunset-lapa-restaurant.jpg` (Stone & Thatched Lounge) | Floats over drifting ember particles with warm amber rim-light |
| **06 Emthombeni & Weddings**| `0.68 – 0.76` | `wedding-fig-tree-chapel.jpg` (Wild Fig Tree Chapel) | Right side, `rotate(-4deg)` with red carpet accent tag |
| **07 Wild Coast Adventures**| `0.81 – 0.88` | Multi-card stagger: Canoeing + Quad trails | Overlapping triple card fan (`-6°`, `0°`, `+6°`) |
