"use client";
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

interface Adventure {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  badge: string;
  src: string;
  alt: string;
  reserveName: string;
}

const ADVENTURES: Adventure[] = [
  {
    id: 'canoeing',
    tag: 'Tidal Waters',
    title: 'Tidal Estuary Canoeing',
    subtitle: 'Paddle down tranquil saltwater estuary waters, gliding past riverine thicket and nesting fish eagles.',
    badge: 'Tranquil Water Trail · All Skill Levels',
    src: '/images/editorial/estuary-canoe-2k.webp',
    alt: 'Canoe tied along the tranquil tidal estuary of Inkwenkwezi',
    reserveName: 'Estuary Canoeing'
  },
  {
    id: 'quads',
    tag: 'Bushveld Trail',
    title: 'Guided Quad Biking Safaris',
    subtitle: '1 to 2 hour technical trails through river crossings, steep ridges, and panoramic valley viewpoints.',
    badge: '1–2h Guided Trails · Quad Cruisers',
    src: '/images/facilities/safari-game-drive.jpg',
    alt: '4x4 safari cruiser and quad trail traversing Eastern Cape bushveld',
    reserveName: 'Guided Quad Biking Tour'
  },
  {
    id: 'umtiza',
    tag: 'Botanical Sanctuary',
    title: 'Guided Umtiza Forest Walk',
    subtitle: 'Walk beneath over 300 specimens of the ancient, rare Umtiza listeriana tree in a protected forest sanctuary.',
    badge: 'Rare Flora Sanctuary · Field Naturalist',
    src: '/images/facilities/umtiza-tree.jpg',
    alt: 'Sunlight filtering through the ancient Umtiza listeriana canopy',
    reserveName: 'Umtiza Guided Walk'
  }
];

interface AdventureDeckProps {
  onSelect: (experienceName: string) => void;
}

export function AdventureDeck({ onSelect }: AdventureDeckProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = (idx: number) => {
    setActiveIdx(idx);
    if (!gridRef.current) return;
    const container = gridRef.current;
    const cards = container.querySelectorAll<HTMLElement>('.borderless-adventure-card');
    if (cards[idx]) {
      cards[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  const handleScroll = () => {
    if (!gridRef.current) return;
    const container = gridRef.current;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.clientWidth * 0.78;
    const current = Math.round(scrollLeft / (cardWidth || 1));
    setActiveIdx(Math.max(0, Math.min(ADVENTURES.length - 1, current)));
  };

  return (
    <div className="borderless-adventure-deck">
      {/* Mobile Activity Tabs (hidden on desktop) */}
      <div className="adventure-mobile-tabs" role="tablist" aria-label="Adventures selection">
        {ADVENTURES.map((item, idx) => (
          <button
            key={item.id}
            className={`adventure-mobile-tab-btn ${idx === activeIdx ? 'is-active' : ''}`}
            onClick={() => scrollToIndex(idx)}
            role="tab"
            aria-selected={idx === activeIdx}
            type="button"
          >
            {item.tag}
          </button>
        ))}
      </div>

      <div className="adventure-grid" ref={gridRef} onScroll={handleScroll}>
        {ADVENTURES.map((item, idx) => (
          <div
            key={item.id}
            className={`borderless-adventure-card ${idx === activeIdx ? 'is-active-card' : ''}`}
            onClick={() => onSelect(item.reserveName)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(item.reserveName);
              }
            }}
            aria-label={`Explore ${item.title}`}
          >
            <div className="adventure-photo-box">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                unoptimized
                sizes="(max-width: 768px) 80vw, 360px"
                className="adventure-photo-img"
              />
            </div>

            <div className="adventure-info">
              <span className="adventure-tag-text">{item.tag}</span>
              <h3 className="adventure-card-title">{item.title}</h3>
              <p className="adventure-card-desc">{item.subtitle}</p>
              <div className="adventure-link-action">
                <span>Enquire activity</span>
                <ArrowUpRight size={15} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Indicator Dots (hidden on desktop) */}
      <div className="adventure-mobile-dots">
        {ADVENTURES.map((item, idx) => (
          <button
            key={item.id}
            className={`adventure-dot ${idx === activeIdx ? 'is-active' : ''}`}
            onClick={() => scrollToIndex(idx)}
            aria-label={`Slide to ${item.title}`}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}
