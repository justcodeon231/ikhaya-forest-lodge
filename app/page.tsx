"use client";
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ScrollFilm } from '@/components/scroll-film';
import { BeveledCard } from '@/components/beveled-card';
import { EmberParticles } from '@/components/ember-particles';
import { AdventureDeck } from '@/components/adventure-deck';
import { ArrowDown, ArrowUpRight, Compass, MessageCircle, Phone } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const range = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const ease = (v: number) => v * v * (3 - 2 * v);
const fade = (p: number, a: number, b: number, c: number, d: number) =>
  ease(range(p, a, b)) * (1 - ease(range(p, c, d)));

export const chapters = [
  'Wild Coast Arrival',
  'Five Biomes',
  '4×4 Safari & Lions',
  'Tented Sanctuaries',
  'Sunset Lapa & Boma',
  'Emthombeni & Chapel',
  'Wild Adventures',
  'Plan Your Escape'
];

export const chapterStops = [0.00, 0.16, 0.30, 0.44, 0.58, 0.72, 0.83, 0.96];

type BiomeId = 'estuary' | 'umtiza' | 'bushveld' | 'grassland' | 'riverine';

interface BiomeInfo {
  name: string;
  src: string;
  tag: string;
  title: string;
  badge: string;
  desc: string;
  reserveTarget: string;
}

const BIOME_DATA: Record<BiomeId, BiomeInfo> = {
  estuary: {
    name: 'Tidal Estuary',
    src: '/images/editorial/estuary-canoe-2k.webp',
    tag: 'Coastal Ecology',
    title: 'Living Tidal Saltwater Estuary',
    badge: 'Tidal Waters & Fish Eagles',
    desc: 'Tranquil coastal river waters with natural ebb and flow, home to kingfishers, African fish eagles, and serene canoeing trails.',
    reserveTarget: 'Estuary Canoeing'
  },
  umtiza: {
    name: 'Umtiza Forest',
    src: '/images/facilities/umtiza-tree.jpg',
    tag: 'Botanical Sanctuary',
    title: 'Ancient Umtiza Listeriana Forest',
    badge: 'Over 300 Protected Specimens',
    desc: 'The second largest protected population in South Africa of the rare ancient Umtiza listeriana tree, conserved in a 1-hectare sanctuary.',
    reserveTarget: 'Umtiza Guided Walk'
  },
  bushveld: {
    name: 'Valley Bushveld',
    src: '/images/facilities/nyala-wildlife.jpg',
    tag: 'Subtropical Thicket',
    title: 'Valley Bushveld & Thicket',
    badge: 'Giant Aloes & Spekboom',
    desc: 'Dense succulent and thorny thicket featuring giant bitter aloes, euphorbias, and spekboom, sustaining abundant browsing game.',
    reserveTarget: 'Day Safari & Game Drive'
  },
  grassland: {
    name: 'Coastal Grassland',
    src: '/images/editorial/sunset-lapa-aerial-4k.webp',
    tag: 'Endangered Habitat',
    title: 'Rolling Coastal Grassland',
    badge: 'Rare Stangeria Cycads',
    desc: 'Prime coastal habitat supporting the rare cycad Stangeria eriopus and the endangered cycad-feeding butterfly Veniliodes setinata.',
    reserveTarget: 'Day Safari & Game Drive'
  },
  riverine: {
    name: 'Riverine Thicket',
    src: '/images/facilities/safari-game-drive.jpg',
    tag: 'Riverine Corridor',
    title: 'Riverine Thicket & Pans',
    badge: 'Riparian Game Trails',
    desc: 'Dense lush vegetation bordering natural river courses and freshwater pans where leopards and nyala drink.',
    reserveTarget: 'Day Safari & Game Drive'
  }
};

const BIOME_KEYS: BiomeId[] = ['estuary', 'umtiza', 'bushveld', 'grassland', 'riverine'];

export default function Home() {
  const journey = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [activeBiome, setActiveBiome] = useState<BiomeId>('umtiza');
  const currentBiome = BIOME_DATA[activeBiome];
  const [camp, setCamp] = useState<'valley' | 'bush'>('valley');
  const campRef = useRef(camp);
  const [booking, setBooking] = useState(false);
  const [suite, setSuite] = useState('Valley Tented Suite');
  const [sent, setSent] = useState(false);
  const [arrival, setArrival] = useState('');

  useEffect(() => {
    campRef.current = camp;
  }, [camp]);

  useEffect(() => {
    const root = journey.current!;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let previous = -1;
    let current = -1;
    let lastTime = 0;
    const els = Object.fromEntries(
      Array.from(root.querySelectorAll<HTMLElement>('[data-layer]')).map(el => [el.dataset.layer!, el])
    );

    const paint = (now = performance.now()) => {
      frame = 0;
      const target = clamp(-root.getBoundingClientRect().top / Math.max(1, root.offsetHeight - innerHeight));
      const dt = Math.min(64, now - lastTime || 16);
      lastTime = now;
      if (current < 0 || reduced.matches) current = target;
      else current += (target - current) * (1 - Math.exp(-dt / 90));
      if (Math.abs(target - current) < 0.0001) current = target;
      const p = current;

      // 8 distinct scene trigger zones
      const scene =
        p < 0.13 ? 0 :
        p < 0.27 ? 1 :
        p < 0.41 ? 2 :
        p < 0.55 ? 3 :
        p < 0.69 ? 4 :
        p < 0.81 ? 5 :
        p < 0.92 ? 6 : 7;

      if (scene !== previous) {
        previous = scene;
        setActive(scene);
      }

      root.style.setProperty('--progress', String(p));
      window.dispatchEvent(new CustomEvent('ikhaya-progress', { detail: p }));

      if (reduced.matches) {
        Object.values(els).forEach(el => {
          el.style.cssText = '';
          el.removeAttribute('aria-hidden');
          el.inert = false;
        });
        return;
      }

      const apply = (name: string, styles: Record<string, string | number>) => {
        const el = els[name];
        if (el) Object.assign(el.style, styles);
      };

      const content = (name: string, opacity: number, transform: string) => {
        if (!els[name]) return;
        apply(name, { opacity, transform });
        els[name].inert = opacity < 0.35;
        els[name].setAttribute('aria-hidden', String(opacity < 0.35));
      };

      // 01: ScrollFilm: Fluid glide through forest canopy to the open door, smoothly pushing through doorway
      const doorZoom = ease(range(p, 0.09, 0.14));
      apply('scroll-film', {
        opacity: 1 - ease(range(p, 0.12, 0.16)),
        transform: `scale(${1 + doorZoom * 0.35}) translate3d(${-doorZoom * 4}%, ${-doorZoom * 2}%, 0)`
      });

      // Initial poster layer beneath canvas (fades out as film draws)
      apply('forest', {
        opacity: 1 - ease(range(p, 0.02, 0.05))
      });

      // Framing foreground canopy drifts past as camera pushes forward
      const canopyApproach = ease(range(p, 0.01, 0.09));
      apply('canopy', {
        opacity: (1 - ease(range(p, 0.03, 0.09))) * 0.95,
        transform: `scale(${1 + canopyApproach * 0.7}) translate3d(${-canopyApproach * 3}%, ${-canopyApproach * 4}%, 0)`
      });

      // Scene 02: Tidal Estuary Canoeing & Five Biomes (revealed seamlessly as camera crosses through doorway)
      const biomesPhase = ease(range(p, 0.12, 0.28));
      apply('biomes-bg', {
        opacity: fade(p, 0.12, 0.16, 0.24, 0.28),
        transform: `scale(${1.06 - biomesPhase * 0.06})`
      });

      // Scene 03: Guided 4x4 Safari & White Lions Pride
      const lionsPhase = ease(range(p, 0.26, 0.42));
      apply('lions-bg', {
        opacity: fade(p, 0.26, 0.30, 0.38, 0.42),
        transform: `scale(${1.06 - lionsPhase * 0.06})`
      });

      // Scene 04: Tented Sanctuaries (Valley Camp vs Bush Camp)
      const suitePhase = ease(range(p, 0.40, 0.56));
      const suiteAlpha = fade(p, 0.40, 0.44, 0.52, 0.56);
      const isValley = campRef.current === 'valley';
      apply('suite-valley-bg', {
        opacity: isValley ? suiteAlpha : 0,
        transform: `scale(${1.06 - suitePhase * 0.06})`
      });
      apply('suite-bush-bg', {
        opacity: !isValley ? suiteAlpha : 0,
        transform: `scale(${1.06 - suitePhase * 0.06})`
      });

      // Scene 05: Sunset Lapa Fireplace & Boma Fire Pit
      const lapaPhase = ease(range(p, 0.54, 0.70));
      apply('lapa-bg', {
        opacity: fade(p, 0.54, 0.58, 0.66, 0.70),
        transform: `scale(${1.06 - lapaPhase * 0.06})`
      });

      // Scene 06: Emthombeni Banquet Hall Dining Room
      const banquetPhase = ease(range(p, 0.68, 0.82));
      apply('banquet-bg', {
        opacity: fade(p, 0.68, 0.72, 0.78, 0.82),
        transform: `scale(${1.06 - banquetPhase * 0.06})`
      });

      // Scene 07: Open-Air Fig Tree Wedding Chapel
      const chapelPhase = ease(range(p, 0.78, 0.93));
      apply('chapel-bg', {
        opacity: fade(p, 0.78, 0.82, 0.89, 0.93),
        transform: `scale(${1.06 - chapelPhase * 0.06})`
      });

      // Scene 08: Wild Coast Escape
      const closingPhase = ease(range(p, 0.89, 1.00));
      apply('closing-bg', {
        opacity: ease(range(p, 0.89, 0.94)),
        transform: `scale(${1.05 - closingPhase * 0.05})`
      });

      const end = ease(range(p, 0.91, 0.98));
      apply('shade', {
        background: `linear-gradient(90deg, rgba(4,20,16,${0.62 + lapaPhase * 0.12 + end * 0.1}), rgba(4,20,16,0.22)), linear-gradient(0deg, rgba(4,20,16,0.72), transparent 45%)`
      });

      // Chapter text layers with subtle, elegant vertical drift (safe area prevents bottom-clipping)
      content(
        'arrival',
        1 - ease(range(p, 0.03, 0.10)),
        `translate3d(0, ${-range(p, 0, 0.10) * 20}px, 0)`
      );

      content(
        'biomes-copy',
        fade(p, 0.13, 0.17, 0.24, 0.28),
        `translate3d(0, ${(1 - ease(range(p, 0.12, 0.18))) * 20 - range(p, 0.23, 0.28) * 20}px, 0)`
      );

      content(
        'wildlife-copy',
        fade(p, 0.27, 0.31, 0.38, 0.42),
        `translate3d(0, ${(1 - ease(range(p, 0.26, 0.32))) * 20 - range(p, 0.37, 0.42) * 20}px, 0)`
      );

      content(
        'suite-copy',
        fade(p, 0.41, 0.45, 0.52, 0.56),
        `translate3d(0, ${(1 - ease(range(p, 0.40, 0.46))) * 20 - range(p, 0.51, 0.56) * 20}px, 0)`
      );

      content(
        'lapa-copy',
        fade(p, 0.55, 0.59, 0.66, 0.70),
        `translate3d(0, ${(1 - ease(range(p, 0.54, 0.60))) * 20 - range(p, 0.65, 0.70) * 20}px, 0)`
      );

      content(
        'wedding-copy',
        fade(p, 0.69, 0.73, 0.79, 0.83),
        `translate3d(0, ${(1 - ease(range(p, 0.68, 0.74))) * 20 - range(p, 0.78, 0.83) * 20}px, 0)`
      );

      content(
        'experiences-copy',
        fade(p, 0.81, 0.84, 0.90, 0.93),
        `translate3d(0, ${(1 - ease(range(p, 0.80, 0.85))) * 20 - range(p, 0.89, 0.93) * 20}px, 0)`
      );

      content(
        'last-copy',
        ease(range(p, 0.92, 0.96)),
        `translate3d(0, ${(1 - end) * 25}px, 0)`
      );

      if (Math.abs(target - current) > 0.0001) frame = requestAnimationFrame(paint);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    reduced.addEventListener('change', schedule);
    paint();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      reduced.removeEventListener('change', schedule);
    };
  }, []);

  function go(index: number) {
    const root = journey.current!;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      root.querySelectorAll<HTMLElement>('.chapter')[index]?.scrollIntoView({ behavior: 'instant' });
      return;
    }
    window.scrollTo({
      top: root.offsetTop + chapterStops[index] * (root.offsetHeight - innerHeight),
      behavior: 'smooth'
    });
  }

  function reserve(name = 'Valley Tented Suite') {
    setSuite(name);
    setSent(false);
    setBooking(true);
  }

  return (
    <main>
      <div className="speculative-banner">
        <span>
          Independent speculative concept by <strong>LocalAI Systems</strong> · Not commissioned by or affiliated with{' '}
          <strong>Inkwenkwezi Private Game Reserve</strong>
        </span>
      </div>

      <header className="nav">
        <button className="brand" onClick={() => go(0)} aria-label="Inkwenkwezi Private Game Reserve, return to arrival">
          <Compass size={26} color="#c89d5c" />
          <span>
            INKWENKWEZI<small>PRIVATE GAME RESERVE</small>
          </span>
        </button>
        <span className="nav-location">CHINTSA, WILD COAST · EAST LONDON · MALARIA-FREE</span>
        <button className="nav-book" onClick={() => reserve()}>
          Plan your escape <ArrowUpRight size={17} />
        </button>
      </header>

      <div className="journey" ref={journey}>
        <div className="stage">
          {/* Base Arrival Forest Landscape fallback poster */}
          <div className="scene-image forest" data-layer="forest">
            <Image
              src="/images/forest-lodge.webp"
              alt="Inkwenkwezi Private Game Reserve Wild Coast forest"
              fill
              priority
              unoptimized
              sizes="100vw"
            />
          </div>

          {/* 01: Scroll Film: Zooming through forest canopy up to the open door */}
          <ScrollFilm />

          {/* Canopy overlay framing the arrival */}
          <div className="canopy-layer" data-layer="canopy" aria-hidden="true">
            <Image src="/images/canopy-overlay.webp" alt="" fill unoptimized sizes="100vw" />
          </div>

          {/* EDITORIAL SLIDESHOW PLANES (revealed as user enters the doorway) */}
          {/* 02: Tidal Estuary Canoeing & Five Biomes */}
          <div className="scene-image biomes-bg" data-layer="biomes-bg">
            <Image
              src="/images/editorial/estuary-canoe-2k.webp"
              alt="Canoe drifting on the tranquil tidal estuary of Inkwenkwezi"
              fill
              unoptimized
              sizes="100vw"
            />
          </div>

          {/* 03: 4x4 Safari & White Lions Pride */}
          <div className="scene-image lions-bg" data-layer="lions-bg">
            <Image
              src="/images/editorial/white-lions-pride-2k.webp"
              alt="The magnificent White Lions pride resting on the coastal grassland"
              fill
              unoptimized
              sizes="100vw"
            />
          </div>

          {/* 04: Tented Sanctuaries (Valley Camp Luxury Suite) */}
          <div className="scene-image suite-valley-bg" data-layer="suite-valley-bg">
            <Image
              src="/images/editorial/valley-camp-suite-2k.webp"
              alt="Valley Camp luxury safari suite with panoramic slipper bathtub overlooking canopy"
              fill
              unoptimized
              sizes="100vw"
            />
          </div>

          {/* 04b: Tented Sanctuaries (Bush Camp Hilltop Ridge) */}
          <div className="scene-image suite-bush-bg" data-layer="suite-bush-bg">
            <Image
              src="/images/editorial/bush-camp-hilltop-2k.webp"
              alt="Bush Camp luxury safari tent perched on hilltop ridge"
              fill
              unoptimized
              sizes="100vw"
            />
          </div>

          {/* 05: Sunset Lapa Fireplace & Boma at Dusk */}
          <div className="scene-image lapa-bg" data-layer="lapa-bg">
            <Image
              src="/images/editorial/sunset-lapa-twilight-2k.webp"
              alt="Sunset Lapa restaurant and stone boma fireplace under evening stars"
              fill
              unoptimized
              sizes="100vw"
            />
          </div>

          {/* 06: Emthombeni Grand Venue Banquet Hall Dining Room */}
          <div className="scene-image banquet-bg" data-layer="banquet-bg">
            <Image
              src="/images/editorial/emthombeni-banquet-2k.webp"
              alt="Emthombeni banquet hall dining room with high timber ceiling and glass folding doors"
              fill
              unoptimized
              sizes="100vw"
            />
          </div>

          {/* 07: Open-Air Wild Fig Tree Wedding Chapel */}
          <div className="scene-image chapel-bg" data-layer="chapel-bg">
            <Image
              src="/images/editorial/wedding-chapel-2k.webp"
              alt="Romantic open-air wedding chapel sheltered under the ancient Wild Fig Tree"
              fill
              unoptimized
              sizes="100vw"
            />
          </div>

          {/* 08: Closing Wild Coast Escape */}
          <div className="scene-image closing-bg" data-layer="closing-bg">
            <Image
              src="/images/editorial/sunset-lapa-aerial-4k.webp"
              alt="Panoramic Wild Coast landscape at Inkwenkwezi Private Game Reserve"
              fill
              unoptimized
              sizes="100vw"
            />
          </div>

          {/* Ember particles active on Sunset Lapa & Boma */}
          <EmberParticles active={active === 4} />

          <div className="shade" data-layer="shade" />

          {/* SCENE 01: ARRIVAL */}
          <section className="chapter arrival" data-layer="arrival">
            <p className="eyebrow">01 / THE WILD COAST · CHINTSA</p>
            <h1>
              Five worlds.<br />
              One <em>wild escape.</em>
            </h1>
            <p className="body-copy">
              Where rugged Indian Ocean shores meet untamed Eastern Cape bushveld.<br />
              A malaria-free private wilderness sanctuary where time slows down.
            </p>
            <button className="enter-link" onClick={() => go(1)}>
              Explore the biomes{' '}
              <span>
                <ArrowDown size={18} />
              </span>
            </button>
          </section>

          {/* SCENE 02: THE FIVE BIOMES */}
          <section className="chapter biomes-copy" data-layer="biomes-copy">
            <div className="chapter-split">
              <div>
                <p className="eyebrow">02 / FIVE DISTINCT BIOMES & TIDAL ESTUARY</p>
                <h2>
                  Five worlds.<br />
                  <em>One reserve.</em>
                </h2>
                <p className="body-copy">
                  Inkwenkwezi encompasses one of South Africa’s rarest ecological crossroads — five regional biomes
                  and a living tidal saltwater estuary flourishing inside a single protected valley.
                </p>
                <div className="biomes-interactive-nav" role="tablist" aria-label="Regional biomes selection">
                  {BIOME_KEYS.map(key => {
                    const b = BIOME_DATA[key];
                    const isSelected = activeBiome === key;
                    return (
                      <button
                        key={key}
                        className={`biome-pill-btn ${isSelected ? 'is-active' : ''}`}
                        onClick={() => setActiveBiome(key)}
                        role="tab"
                        aria-selected={isSelected}
                      >
                        <span className="biome-pill-dot" />
                        {b.name}
                      </button>
                    );
                  })}
                </div>
                <div className="biome-detail-card">
                  <span className="biome-detail-badge">{currentBiome.badge}</span>
                  <p className="biome-detail-text">{currentBiome.desc}</p>
                </div>
              </div>
              <div className="chapter-media-pop">
                <BeveledCard
                  src={currentBiome.src}
                  alt={currentBiome.name}
                  tag={currentBiome.tag}
                  title={currentBiome.title}
                  subtitle={currentBiome.desc}
                  onClick={() => reserve(currentBiome.reserveTarget)}
                />
              </div>
            </div>
          </section>

          {/* SCENE 03: 4X4 SAFARI & WHITE LIONS */}
          <section className="chapter wildlife-copy" data-layer="wildlife-copy">
            <div className="chapter-split">
              <div>
                <p className="eyebrow">03 / GUIDED 4×4 SAFARIS & WHITE LIONS</p>
                <h2>
                  Walk alongside<br />
                  <em>the legends.</em>
                </h2>
                <p className="body-copy">
                  Traverse 5 biomes from our fleet of 11+ open 4×4 game vehicles. Encounter 4 of the Big 5 (lions,
                  leopards, white rhinos, Cape buffalo) and rare, genuine non-albino White Lions in their natural habitat.
                </p>
                <div className="moments">
                  <span>Open 4×4 Guided Game Drives</span>
                  <span>Rare Genuine White Lions</span>
                  <span>Cheetah Educational Area</span>
                  <span>286+ Identified Bird Species</span>
                </div>
              </div>
              <div className="chapter-media-pop">
                <BeveledCard
                  src="/images/facilities/safari-game-drive.jpg"
                  alt="Open 4x4 guided safari cruiser navigating the reserve"
                  tag="Guided Game Drives"
                  title="Open 4×4 Safari Fleet"
                  subtitle="Track the Big 5 and rare White Lions across 5 distinct biomes with dedicated field guides."
                  onClick={() => reserve('Day Safari & Game Drive')}
                />
              </div>
            </div>
          </section>

          {/* SCENE 04: TENTED SANCTUARIES WITH INTERACTIVE DECK TOGGLE */}
          <section className="chapter suite-copy" data-layer="suite-copy">
            <div className="chapter-split">
              <div>
                <p className="eyebrow">04 / YOUR TENTED SANCTUARY</p>
                <h2>
                  Rest where the<br />
                  <em>wild breathes.</em>
                </h2>
                <p className="body-copy">
                  Elevated timber decks. Soft linen. An ancient indigenous canopy right outside your glass and canvas retreat.
                </p>

                {/* Interactive Accommodation Deck Toggle */}
                <div className="deck-toggle-wrapper" role="tablist" aria-label="Lodge accommodation selection">
                  <button
                    className={`deck-toggle-btn ${camp === 'valley' ? 'is-active' : ''}`}
                    onClick={() => {
                      setCamp('valley');
                      campRef.current = 'valley';
                      window.dispatchEvent(new Event('scroll'));
                    }}
                    role="tab"
                    aria-selected={camp === 'valley'}
                  >
                    Valley Camp 4★ (Canopy Decks)
                  </button>
                  <button
                    className={`deck-toggle-btn ${camp === 'bush' ? 'is-active' : ''}`}
                    onClick={() => {
                      setCamp('bush');
                      campRef.current = 'bush';
                      window.dispatchEvent(new Event('scroll'));
                    }}
                    role="tab"
                    aria-selected={camp === 'bush'}
                  >
                    Bush Camp 3★ (Hilltop & Cave Ensuite)
                  </button>
                </div>

                {camp === 'valley' ? (
                  <div>
                    <p className="body-copy" style={{ marginTop: '0', fontSize: '14.5px' }}>
                      6 custom-designed luxury safari tents spaced <strong>50 meters apart</strong> for absolute privacy. Nestled inside
                      the indigenous tree canopy with private covered viewing decks and a freestanding slipper bath tub.
                    </p>
                    <div className="deck-specs-list">
                      <span>4-Star Graded</span>
                      <span>50m Deck Seclusion</span>
                      <span>Freestanding Slipper Tub</span>
                      <span>Family Suite Attached</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="body-copy" style={{ marginTop: '0', fontSize: '14.5px' }}>
                      5 en-suite safari tents spaced <strong>20 meters apart</strong> perched on a hilltop ridge overlooking the valley.
                      Features raised viewing decks, Cloud 9 mattresses, and a <strong>hand-crafted natural rock cave bathroom</strong>.
                    </p>
                    <div className="deck-specs-list">
                      <span>3-Star Graded</span>
                      <span>Panoramic Hilltop View</span>
                      <span>Cave-Crafted Stone Shower</span>
                      <span>Cloud 9 Beds</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="chapter-media-pop">
                {camp === 'valley' ? (
                  <BeveledCard
                    src="/images/facilities/valley-camp-suite.jpg"
                    alt="Valley Camp luxury tent interior and slipper bath"
                    tag="4★ Valley Camp"
                    title="Luxury Canopy Tented Suite"
                    subtitle="Spacious interior lounge, private elevated deck, and panoramic slipper bath overlooking the bush."
                    onClick={() => reserve('Valley Tented Suite')}
                  />
                ) : (
                  <BeveledCard
                    src="/images/facilities/bush-camp-cave-ensuite.jpg"
                    alt="Bush Camp handcrafted natural rock cave bathroom"
                    tag="3★ Bush Camp"
                    title="Hilltop Ridge Safari Suite"
                    subtitle="Panoramic hilltop vantage point, Cloud 9 bed, raised viewing deck, and hand-crafted natural cave rock ensuite."
                    onClick={() => reserve('Bush Camp Suite')}
                  />
                )}
              </div>
            </div>
          </section>

          {/* SCENE 05: SUNSET LAPA & BOMA FIRE PIT */}
          <section className="chapter lapa-copy" data-layer="lapa-copy">
            <div className="chapter-split">
              <div>
                <p className="eyebrow">05 / THE SUNSET RESTAURANT & BOMA</p>
                <h2>
                  Firelight under<br />
                  <em>African skies.</em>
                </h2>
                <p className="body-copy">
                  Built exclusively for resident lodge guests, the Sunset Restaurant features walls culled directly from
                  Inkwenkwezi’s native geology, high thatch ceilings, a cozy stone fireplace, and an open-air boma fire pit
                  overlooking glorious African sunsets.
                </p>
                <div className="moments">
                  <span>Native Sandstone Walls & Thatch</span>
                  <span>Open-Air Boma Fire Pit</span>
                  <span>Fine South African Wine Selection</span>
                  <span>Exclusively for Resident Guests</span>
                </div>
              </div>
              <div className="chapter-media-pop">
                <BeveledCard
                  src="/images/facilities/sunset-lapa-restaurant.jpg"
                  alt="Sunset Lapa restaurant and lounge interior"
                  tag="Resident Dining"
                  title="The Sunset Restaurant & Lounge"
                  subtitle="Relax next to the open-air fire pit with a glass of wine as stars illuminate the valley."
                  onClick={() => reserve('Lodge Stay & Boma Dinner')}
                />
              </div>
            </div>
          </section>

          {/* SCENE 06: EMTHOMBENI & OPEN-AIR FIG TREE CHAPEL */}
          <section className="chapter wedding-copy" data-layer="wedding-copy">
            <div className="chapter-split">
              <div>
                <p className="eyebrow">06 / EMTHOMBENI & THE FIG TREE CHAPEL</p>
                <h2>
                  Grand gatherings.<br />
                  <em>Timeless vows.</em>
                </h2>
                <p className="body-copy">
                  Emthombeni (“Under the Wild Fig Tree”) seats up to 300 guests with floor-to-ceiling glass folding doors opening
                  onto lush gardens and sweeping bushveld views. Take your vows down the red carpet in the enchanting open-air chapel
                  shaded by a majestic ancient Wild Fig Tree.
                </p>
                <div className="moments">
                  <span>Open-Air Wild Fig Tree Chapel</span>
                  <span>Emthombeni Grand Venue (Up to 300 Pax)</span>
                  <span>Legendary Sunday Buffet (R295/Adult)</span>
                  <span>All-Weather Covered Deck Backup</span>
                </div>
              </div>
              <div className="chapter-media-pop">
                <BeveledCard
                  src="/images/editorial/wedding-chapel-2k.webp"
                  alt="Open-air wedding chapel under the ancient Wild Fig Tree"
                  tag="Wild Coast Weddings"
                  title="Open-Air Wild Fig Chapel"
                  subtitle="Red carpet aisle, water features, and gentle birdsong beneath the sacred Wild Fig Tree canopy."
                  onClick={() => reserve('Weddings & Events')}
                />
              </div>
            </div>
          </section>

          {/* SCENE 07: WILD COAST ADVENTURES */}
          <section className="chapter experiences-copy" data-layer="experiences-copy">
            <p className="eyebrow">07 / WILD COAST ADVENTURES & EXPEDITIONS</p>
            <h2>
              Trails, tides &amp;<br />
              <em>untamed paths.</em>
            </h2>
            <p className="body-copy" style={{ marginBottom: '14px' }}>
              Beyond game drives, Inkwenkwezi invites you to paddle tranquil tidal waters and conquer rugged bushveld slopes.
            </p>
            <AdventureDeck onSelect={name => reserve(name)} />
          </section>

          {/* SCENE 08: PLAN YOUR ESCAPE & CONCIERGE */}
          <section className="chapter last-copy" data-layer="last-copy">
            <p className="eyebrow">08 / YOUR WILD COAST JOURNEY</p>
            <h2>
              Your wild escape<br />
              <em>awaits.</em>
            </h2>
            <div className="cta-actions">
              <button className="pill light" onClick={() => reserve()}>
                Preview reservation <ArrowUpRight size={18} />
              </button>
              <a
                href="https://wa.me/27437343234?text=Hi%20Inkwenkwezi,%20I'm%20enquiring%20about%20a%20stay%20and%20safari%20experience"
                target="_blank"
                rel="noopener noreferrer"
                className="pill whatsapp"
              >
                <MessageCircle size={18} /> Chat on WhatsApp
              </a>
              <a href="tel:+27437343234" className="pill" style={{ background: '#142d2290' }}>
                <Phone size={16} /> +27 (043) 734 3234
              </a>
            </div>
            <p className="concept">
              Independent speculative concept by LocalAI Systems · Not commissioned by or affiliated with Inkwenkwezi Private Game Reserve<br />
              Schafli Road, East Coast, East London, South Africa · pgr@inkwenkwezi.co.za
            </p>
            <button className="again" onClick={() => go(0)}>
              Wander back to the beginning
            </button>
          </section>

          <div className="scene-footer">
            <span className="place-note">FIVE BIOMES · BIG 4 · MALARIA-FREE</span>
            <nav className="chapters" aria-label="Journey chapters">
              {chapters.map((name, i) => (
                <button key={name} aria-current={active === i ? 'step' : undefined} onClick={() => go(i)}>
                  <span className="chapter-number">0{i + 1}</span>
                  <span className="chapter-name">{name}</span>
                </button>
              ))}
            </nav>
            <span className="scroll-cue">
              SCROLL TO WANDER <ArrowDown size={14} />
            </span>
          </div>

          <div className="progress-track">
            <div className="progress-fill" />
          </div>
        </div>
      </div>

      {/* Reservation & Stay Inquiry Dialog */}
      <Dialog open={booking} onOpenChange={setBooking}>
        <DialogContent className="booking">
          <DialogTitle className="booking-title">Reserve your experience.</DialogTitle>
          <DialogDescription>
            Independent speculative concept by LocalAI Systems for Inkwenkwezi Private Game Reserve. Select your preferred
            facility or safari below; direct WhatsApp channel connects to the reserve.
          </DialogDescription>
          {sent ? (
            <div className="confirmation" role="status">
              <Compass size={40} color="#c89d5c" />
              <h3>Your escape, imagined.</h3>
              <p>
                {suite}, arriving {arrival}. You can also connect directly with Inkwenkwezi reservations at{' '}
                <strong>+27 (043) 734 3234</strong> or on WhatsApp.
              </p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <a
                  href={`https://wa.me/27437343234?text=Hi%20Inkwenkwezi,%20I'd%20like%20to%20enquire%20about%20${encodeURIComponent(
                    suite
                  )}%20arriving%20${encodeURIComponent(arrival)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill whatsapp"
                >
                  <MessageCircle size={17} /> Confirm on WhatsApp
                </a>
                <button className="pill" onClick={() => setBooking(false)}>
                  Back to reserve
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={e => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <label>
                Your Experience / Accommodation
                <select value={suite} onChange={e => setSuite(e.target.value)}>
                  <option>Valley Tented Suite (4★ Canopy Decks)</option>
                  <option>Bush Tented Suite (3★ Hilltop & Cave Ensuite)</option>
                  <option>Guided 4×4 Game Drive (Day Safari)</option>
                  <option>Sunday Buffet Lunch at Emthombeni</option>
                  <option>Guided Quad Biking Safari</option>
                  <option>Wedding or Function Venue Inquiry</option>
                </select>
              </label>
              <div className="date-grid">
                <label>
                  Preferred Date
                  <input
                    type="date"
                    required
                    min={new Date().toLocaleDateString('en-CA')}
                    value={arrival}
                    onChange={e => setArrival(e.target.value)}
                  />
                </label>
                <label>
                  Guests
                  <select>
                    <option>2 guests</option>
                    <option>1 guest</option>
                    <option>3 guests</option>
                    <option>4+ guests</option>
                    <option>Group / Wedding (20+ guests)</option>
                  </select>
                </label>
              </div>
              <button className="pill" type="submit">
                Preview my reservation <ArrowUpRight size={17} />
              </button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
