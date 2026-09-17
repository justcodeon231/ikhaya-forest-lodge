"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Compass,
  Calendar,
  Users,
  Check,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  MessageCircle,
  Phone,
  Sparkles,
  Wine,
  ShieldCheck,
  X,
  Clock,
  Heart,
  ChevronRight
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSuite?: string;
}

interface ExperienceOption {
  id: string;
  name: string;
  tag: string;
  badge: string;
  description: string;
  image: string;
  category: 'lodge' | 'safari' | 'event' | 'adventure';
}

const EXPERIENCES: ExperienceOption[] = [
  {
    id: 'valley-camp',
    name: 'Valley Tented Suite (4★ Graded)',
    tag: '4-Star Canopy Luxury',
    badge: 'Canopy Decks & Slipper Tub',
    description: 'Secluded 50m apart in the indigenous forest canopy. King linen bed, private elevated viewing deck, and panoramic slipper bath.',
    image: '/images/editorial/valley-camp-suite-2k.webp',
    category: 'lodge'
  },
  {
    id: 'bush-camp',
    name: 'Bush Tented Suite (3★ Graded)',
    tag: '3-Star Hilltop Ridge',
    badge: 'Panoramic Vista & Cave Ensuite',
    description: 'Perched on high hilltop ridge with panoramic valley vistas, Cloud 9 bed, raised timber deck, and hand-crafted natural rock cave bathroom.',
    image: '/images/editorial/bush-camp-hilltop-2k.webp',
    category: 'lodge'
  },
  {
    id: 'safari-drive',
    name: 'Guided 4×4 Safari & White Lions',
    tag: 'Day Safari Expedition',
    badge: 'Big 4 & Rare White Lions',
    description: 'Open 4×4 game cruiser with dedicated ranger. Traverse 5 regional biomes tracking Big 4 and genuine non-albino White Lions.',
    image: '/images/editorial/white-lions-pride-2k.webp',
    category: 'safari'
  },
  {
    id: 'wedding-venue',
    name: 'Wild Coast Wedding & Banquet Hall',
    tag: 'Grand Gatherings & Vows',
    badge: 'Ancient Fig Tree Chapel & Emthombeni',
    description: 'Open-air chapel beneath the ancient Wild Fig Tree with red carpet aisle. Emthombeni banquet hall seating up to 300 guests with panoramic bush views.',
    image: '/images/editorial/wedding-chapel-2k.webp',
    category: 'event'
  },
  {
    id: 'active-adventure',
    name: 'Wild Coast Quad Safari & Canoeing',
    tag: 'Active Outdoor Adventure',
    badge: 'Bushveld Quads & Estuary Waters',
    description: '1 to 2-hour technical guided quad bike safari through river valleys, or serene canoeing on the tidal saltwater estuary.',
    image: '/images/editorial/estuary-canoe-2k.webp',
    category: 'adventure'
  }
];

interface AddOnOption {
  id: string;
  name: string;
  badge: string;
  description: string;
  iconName: string;
}

const ADD_ONS: AddOnOption[] = [
  {
    id: 'white-lions',
    name: 'White Lions & Big 4 Guided Safari Drive',
    badge: 'Signature Reserve Highlight',
    description: 'Track rare White Lions and 4 of the Big 5 across 5 biomes from open 4×4 cruisers.',
    iconName: 'safari'
  },
  {
    id: 'boma-dinner',
    name: 'Sunset Lapa Boma Fire Pit & Dining',
    badge: 'Resident Dining Tradition',
    description: 'Evening firelight, stone boma fire pit, indigenous sandstone fireplace & South African fine wines.',
    iconName: 'wine'
  },
  {
    id: 'canoeing',
    name: 'Tidal Saltwater Estuary Canoeing',
    badge: 'Peaceful Water Trail',
    description: 'Drift along calm tidal river waters alongside fish eagles, kingfishers, and riverine thicket.',
    iconName: 'canoe'
  },
  {
    id: 'umtiza-walk',
    name: 'Ancient Umtiza Forest Botanical Walk',
    badge: 'Protected Flora Sanctuary',
    description: 'Guided walk through the 1-hectare sanctuary protecting over 300 rare prehistoric Umtiza trees.',
    iconName: 'tree'
  },
  {
    id: 'sunday-buffet',
    name: 'Emthombeni Sunday Buffet Lunch Feast',
    badge: 'Eastern Cape Tradition · R295/Adult',
    description: 'Legendary multi-course Sunday carvery buffet overlooking rolling hills and water lilies.',
    iconName: 'buffet'
  },
  {
    id: 'quad-biking',
    name: 'Guided 4×4 Quad Biking Safari (1–2 hrs)',
    badge: 'Technical Scenic Trail',
    description: 'Navigate bushveld slopes, rock crossings, and hilltop viewpoints on powerful quad cruisers.',
    iconName: 'quad'
  },
  {
    id: 'romantic-setup',
    name: 'Romantic Celebration & Cap Classique Champagne',
    badge: 'Honeymoon & Anniversary',
    description: 'Chilled bottle of South African MCC sparkling wine, lantern-lit turndown & handcrafted artisanal chocolates.',
    iconName: 'sparkle'
  }
];

const STAY_LENGTHS = [
  '1 Night (Overnight Sanctuary)',
  '2 Nights (Signature Weekend Retreat)',
  '3–4 Nights (Wild Coast Immersion)',
  '5+ Nights (Extended Safari & Ocean)',
  'Day Visit (No Accommodation)'
];

const CELEBRATIONS = [
  'Romantic Getaway / Leisure',
  'Honeymoon',
  'Wedding Anniversary',
  'Milestone Birthday',
  'Family Holiday (Malaria-Free)',
  'Corporate / Group Retreat'
];

export function BookingModal({ open, onOpenChange, initialSuite }: BookingModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [selectedExperience, setSelectedExperience] = useState<string>('valley-camp');
  const [arrivalDate, setArrivalDate] = useState<string>('');
  const [duration, setDuration] = useState<string>('2 Nights (Signature Weekend Retreat)');
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['white-lions', 'boma-dinner']);
  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [celebration, setCelebration] = useState<string>('Romantic Getaway / Leisure');
  const [dietaryNotes, setDietaryNotes] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Sync initialSuite when opened from buttons across the site
  useEffect(() => {
    if (!initialSuite) return;
    const lower = initialSuite.toLowerCase();
    if (lower.includes('bush')) {
      setSelectedExperience('bush-camp');
    } else if (lower.includes('safari') || lower.includes('lion') || lower.includes('game drive')) {
      setSelectedExperience('safari-drive');
    } else if (lower.includes('wedding') || lower.includes('buffet') || lower.includes('emthombeni')) {
      setSelectedExperience('wedding-venue');
    } else if (lower.includes('quad') || lower.includes('canoe') || lower.includes('adventure')) {
      setSelectedExperience('active-adventure');
    } else {
      setSelectedExperience('valley-camp');
    }
  }, [initialSuite, open]);

  // Set default arrival date to next Friday if blank
  useEffect(() => {
    if (!arrivalDate) {
      const d = new Date();
      d.setDate(d.getDate() + 14);
      setArrivalDate(d.toISOString().split('T')[0]);
    }
  }, [arrivalDate]);

  const currentExp = EXPERIENCES.find(e => e.id === selectedExperience) || EXPERIENCES[0];

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const generateWhatsAppMessage = () => {
    const lines = [
      `🌿 *INKWENKWEZI PRIVATE GAME RESERVE — RESERVATION INQUIRY*`,
      `-----------------------------------------`,
      `*Guest:* ${guestName || 'Prospective Guest'}`,
      guestPhone ? `*Phone / WhatsApp:* ${guestPhone}` : null,
      guestEmail ? `*Email:* ${guestEmail}` : null,
      `*Primary Experience:* ${currentExp.name}`,
      `*Arrival Date:* ${arrivalDate || 'Flexible'}`,
      `*Duration:* ${duration}`,
      `*Party Size:* ${adults} Adult${adults > 1 ? 's' : ''}${children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}`,
      celebration && celebration !== 'Romantic Getaway / Leisure' ? `*Occasion:* ${celebration}` : null,
      selectedAddons.length > 0
        ? `*Curated Safari Add-ons:*\n${selectedAddons
            .map(id => {
              const a = ADD_ONS.find(x => x.id === id);
              return a ? `  • ${a.name}` : null;
            })
            .filter(Boolean)
            .join('\n')}`
        : null,
      dietaryNotes ? `*Dietary / Special Wishes:* ${dietaryNotes}` : null,
      `-----------------------------------------`,
      `_Inquiry sent via Ikhaya Forest Lodge & Inkwenkwezi Speculative Concierge._`,
      `Please check availability and share a tailored quote.`
    ].filter(Boolean);

    return encodeURIComponent(lines.join('\n'));
  };

  const handleWhatsAppDirect = () => {
    const text = generateWhatsAppMessage();
    const url = `https://wa.me/27437343234?text=${text}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDirectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setStep(1);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bespoke-concierge-modal">
        <div className="concierge-frame">
          {/* Top Header Bar */}
          <div className="concierge-header">
            <div className="concierge-brand">
              <div className="brand-badge-icon">
                <Compass size={18} color="#c89d5c" />
              </div>
              <div>
                <span className="concierge-eyebrow">INKWENKWEZI PRIVATE GAME RESERVE · WILD COAST</span>
                <DialogTitle className="concierge-title">Curate Your Wilderness Journey</DialogTitle>
              </div>
            </div>
            <DialogDescription className="sr-only">
              Bespoke reservation planner for Inkwenkwezi Private Game Reserve. Choose your accommodation, dates, party details, and curated safari activities.
            </DialogDescription>
          </div>

          {/* Stepper Progress Bar (visible when not submitted) */}
          {!isSubmitted && (
            <div className="concierge-stepper" role="navigation" aria-label="Booking steps">
              <button
                className={`step-tab ${step === 1 ? 'is-active' : ''} ${step > 1 ? 'is-complete' : ''}`}
                onClick={() => setStep(1)}
                type="button"
              >
                <span className="step-num">{step > 1 ? <Check size={12} /> : '1'}</span>
                <span className="step-label">Sanctuary</span>
              </button>
              <div className="step-connector" />
              <button
                className={`step-tab ${step === 2 ? 'is-active' : ''} ${step > 2 ? 'is-complete' : ''}`}
                onClick={() => setStep(2)}
                type="button"
              >
                <span className="step-num">{step > 2 ? <Check size={12} /> : '2'}</span>
                <span className="step-label">Dates & Party</span>
              </button>
              <div className="step-connector" />
              <button
                className={`step-tab ${step === 3 ? 'is-active' : ''} ${step > 3 ? 'is-complete' : ''}`}
                onClick={() => setStep(3)}
                type="button"
              >
                <span className="step-num">{step > 3 ? <Check size={12} /> : '3'}</span>
                <span className="step-label">Moments</span>
              </button>
              <div className="step-connector" />
              <button
                className={`step-tab ${step === 4 ? 'is-active' : ''}`}
                onClick={() => setStep(4)}
                type="button"
              >
                <span className="step-num">4</span>
                <span className="step-label">Concierge</span>
              </button>
            </div>
          )}

          {/* Modal Content Body */}
          <div className="concierge-body">
            {isSubmitted ? (
              /* Success Confirmation Screen */
              <div className="concierge-confirmation" role="status">
                <div className="confirmation-shield">
                  <ShieldCheck size={48} color="#c89d5c" />
                </div>
                <h2>Your Wild Coast Escape Awaits</h2>
                <p className="confirmation-lead">
                  Thank you, <strong>{guestName || 'Valued Guest'}</strong>. Your bespoke inquiry for{' '}
                  <strong>{currentExp.name}</strong> arriving on <strong>{arrivalDate}</strong> ({duration}) has been prepared.
                </p>

                <div className="itinerary-receipt-box">
                  <div className="receipt-row">
                    <span>Experience / Suite</span>
                    <strong>{currentExp.name}</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Guests</span>
                    <strong>
                      {adults} Adult{adults > 1 ? 's' : ''}
                      {children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}
                    </strong>
                  </div>
                  <div className="receipt-row">
                    <span>Malaria Status</span>
                    <strong className="badge-highlight">100% Malaria-Free Private Reserve</strong>
                  </div>
                  {selectedAddons.length > 0 && (
                    <div className="receipt-row receipt-addons">
                      <span>Curated Add-ons</span>
                      <div>
                        {selectedAddons.map(id => {
                          const a = ADD_ONS.find(x => x.id === id);
                          return a ? <span key={id} className="addon-tag-pill">{a.name}</span> : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="confirmation-actions">
                  <button className="pill whatsapp-btn" onClick={handleWhatsAppDirect}>
                    <MessageCircle size={18} /> Open WhatsApp Concierge & Send
                  </button>
                  <a href="tel:+27437343234" className="pill phone-btn">
                    <Phone size={16} /> Call Direct: +27 (043) 734 3234
                  </a>
                  <button className="back-btn" onClick={resetForm}>
                    Return to Lodge Exploration
                  </button>
                </div>
              </div>
            ) : (
              /* Step-by-Step Interactive Planner */
              <div>
                {/* STEP 1: Select Sanctuary or Experience */}
                {step === 1 && (
                  <div className="step-pane animate-fade-in">
                    <div className="pane-intro">
                      <h3>Choose your wilderness sanctuary</h3>
                      <p>Select your accommodation or primary experience across Inkwenkwezi’s five protected biomes.</p>
                    </div>

                    <div className="experience-selector-grid">
                      {EXPERIENCES.map(item => {
                        const isSelected = selectedExperience === item.id;
                        return (
                          <div
                            key={item.id}
                            className={`experience-select-card ${isSelected ? 'is-selected' : ''}`}
                            onClick={() => setSelectedExperience(item.id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={e => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setSelectedExperience(item.id);
                              }
                            }}
                          >
                            <div className="card-thumb-wrap">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                unoptimized
                                sizes="240px"
                                className="card-thumb-img"
                              />
                              <div className="card-thumb-overlay" />
                              <span className="card-floating-badge">{item.badge}</span>
                            </div>
                            <div className="card-meta">
                              <span className="card-tag">{item.tag}</span>
                              <h4 className="card-title">{item.name}</h4>
                              <p className="card-desc">{item.description}</p>
                            </div>
                            <div className="card-select-check">
                              <Check size={14} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 2: Dates, Nights & Party Details */}
                {step === 2 && (
                  <div className="step-pane animate-fade-in">
                    <div className="pane-intro">
                      <h3>When would you like to escape?</h3>
                      <p>Inkwenkwezi is a malaria-free coastal reserve welcoming guests year-round.</p>
                    </div>

                    <div className="dates-party-grid">
                      {/* Arrival Date */}
                      <div className="input-group-panel">
                        <label htmlFor="concierge-arrival">
                          <span className="label-icon"><Calendar size={15} color="#c89d5c" /></span>
                          Preferred Arrival Date
                        </label>
                        <input
                          id="concierge-arrival"
                          type="date"
                          required
                          min={new Date().toLocaleDateString('en-CA')}
                          value={arrivalDate}
                          onChange={e => setArrivalDate(e.target.value)}
                          className="luxury-input"
                        />
                        <span className="input-hint">Flexible check-in with dedicated reception greetings.</span>
                      </div>

                      {/* Duration of Stay */}
                      <div className="input-group-panel">
                        <label htmlFor="concierge-duration">
                          <span className="label-icon"><Clock size={15} color="#c89d5c" /></span>
                          Length of Experience
                        </label>
                        <select
                          id="concierge-duration"
                          value={duration}
                          onChange={e => setDuration(e.target.value)}
                          className="luxury-select"
                        >
                          {STAY_LENGTHS.map(len => (
                            <option key={len} value={len}>{len}</option>
                          ))}
                        </select>
                        <span className="input-hint">2-night stays recommended for full 5-biome exploration.</span>
                      </div>

                      {/* Adults Counter */}
                      <div className="input-group-panel">
                        <label>
                          <span className="label-icon"><Users size={15} color="#c89d5c" /></span>
                          Adult Guests
                        </label>
                        <div className="counter-row">
                          <button
                            type="button"
                            className="counter-btn"
                            onClick={() => setAdults(Math.max(1, adults - 1))}
                            disabled={adults <= 1}
                            aria-label="Decrease adults"
                          >
                            -
                          </button>
                          <span className="counter-display">{adults}</span>
                          <button
                            type="button"
                            className="counter-btn"
                            onClick={() => setAdults(Math.min(20, adults + 1))}
                            aria-label="Increase adults"
                          >
                            +
                          </button>
                          <span className="counter-label">Ages 12+</span>
                        </div>
                      </div>

                      {/* Children Counter */}
                      <div className="input-group-panel">
                        <label>
                          <span className="label-icon"><Heart size={15} color="#c89d5c" /></span>
                          Children / Family
                        </label>
                        <div className="counter-row">
                          <button
                            type="button"
                            className="counter-btn"
                            onClick={() => setChildren(Math.max(0, children - 1))}
                            disabled={children <= 0}
                            aria-label="Decrease children"
                          >
                            -
                          </button>
                          <span className="counter-display">{children}</span>
                          <button
                            type="button"
                            className="counter-btn"
                            onClick={() => setChildren(Math.min(10, children + 1))}
                            aria-label="Increase children"
                          >
                            +
                          </button>
                          <span className="counter-label">Ages 0–11</span>
                        </div>
                        <span className="input-hint malaria-hint">
                          <ShieldCheck size={13} color="#25d366" /> 100% Malaria-free & family safe
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Curate Your Moments (Bespoke Add-ons) */}
                {step === 3 && (
                  <div className="step-pane animate-fade-in">
                    <div className="pane-intro">
                      <h3>Curate your reserve moments</h3>
                      <p>Select the wildlife encounters and dining traditions to tailor your personal itinerary.</p>
                    </div>

                    <div className="addons-grid">
                      {ADD_ONS.map(addon => {
                        const isChecked = selectedAddons.includes(addon.id);
                        return (
                          <div
                            key={addon.id}
                            className={`addon-card ${isChecked ? 'is-selected' : ''}`}
                            onClick={() => toggleAddon(addon.id)}
                            role="checkbox"
                            aria-checked={isChecked}
                            tabIndex={0}
                            onKeyDown={e => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                toggleAddon(addon.id);
                              }
                            }}
                          >
                            <div className="addon-checkbox">
                              {isChecked && <Check size={13} color="#0a1711" />}
                            </div>
                            <div className="addon-info">
                              <span className="addon-badge">{addon.badge}</span>
                              <h4 className="addon-title">{addon.name}</h4>
                              <p className="addon-desc">{addon.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 4: Guest Details, Occasion & Submission */}
                {step === 4 && (
                  <form onSubmit={handleDirectSubmit} className="step-pane animate-fade-in">
                    <div className="pane-intro">
                      <h3>Direct concierge details</h3>
                      <p>Provide your preferred contact so our lodge reservations team can confirm your bespoke itinerary.</p>
                    </div>

                    <div className="guest-details-grid">
                      <div className="input-group-panel">
                        <label htmlFor="guest-name">Full Name *</label>
                        <input
                          id="guest-name"
                          type="text"
                          required
                          placeholder="e.g. Eleanor & David Vance"
                          value={guestName}
                          onChange={e => setGuestName(e.target.value)}
                          className="luxury-input"
                        />
                      </div>

                      <div className="input-group-panel">
                        <label htmlFor="guest-phone">WhatsApp / Phone Number *</label>
                        <input
                          id="guest-phone"
                          type="tel"
                          required
                          placeholder="e.g. +27 82 123 4567"
                          value={guestPhone}
                          onChange={e => setGuestPhone(e.target.value)}
                          className="luxury-input"
                        />
                        <span className="input-hint">Direct WhatsApp line for instant concierge quotes.</span>
                      </div>

                      <div className="input-group-panel">
                        <label htmlFor="guest-email">Email Address</label>
                        <input
                          id="guest-email"
                          type="email"
                          placeholder="e.g. eleanor@vance-travels.com"
                          value={guestEmail}
                          onChange={e => setGuestEmail(e.target.value)}
                          className="luxury-input"
                        />
                      </div>

                      <div className="input-group-panel">
                        <label htmlFor="guest-celebration">Special Celebration</label>
                        <select
                          id="guest-celebration"
                          value={celebration}
                          onChange={e => setCelebration(e.target.value)}
                          className="luxury-select"
                        >
                          {CELEBRATIONS.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div className="input-group-panel full-width">
                        <label htmlFor="dietary-notes">Dietary Preferences or Special Requests</label>
                        <textarea
                          id="dietary-notes"
                          rows={2}
                          placeholder="e.g. Vegetarian, anniversary flowers on arrival, airport transfer from East London Airport (ELS)..."
                          value={dietaryNotes}
                          onChange={e => setDietaryNotes(e.target.value)}
                          className="luxury-textarea"
                        />
                      </div>
                    </div>

                    {/* Live Itinerary Summary Panel */}
                    <div className="live-itinerary-preview">
                      <div className="itinerary-header">
                        <Sparkles size={16} color="#c89d5c" />
                        <span>Your Curated Itinerary Summary</span>
                      </div>
                      <div className="itinerary-summary-content">
                        <div className="summary-col">
                          <small>Sanctuary</small>
                          <strong>{currentExp.name}</strong>
                        </div>
                        <div className="summary-col">
                          <small>Arrival & Stay</small>
                          <strong>{arrivalDate} · {duration}</strong>
                        </div>
                        <div className="summary-col">
                          <small>Guests</small>
                          <strong>
                            {adults} Adult{adults > 1 ? 's' : ''}
                            {children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}
                          </strong>
                        </div>
                        <div className="summary-col">
                          <small>Curated Moments</small>
                          <strong>{selectedAddons.length} Experience{selectedAddons.length !== 1 ? 's' : ''} Added</strong>
                        </div>
                      </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="step-actions dual-submit-row">
                      <button
                        type="button"
                        className="pill whatsapp-primary-btn"
                        onClick={handleWhatsAppDirect}
                      >
                        <MessageCircle size={18} />
                        <span>Send to WhatsApp Concierge</span>
                        <ArrowUpRight size={16} />
                      </button>
                      <button type="submit" className="pill direct-inquiry-btn">
                        Preview & Confirm Inquiry <ChevronRight size={16} />
                      </button>
                    </div>
                  </form>
                )}

                {/* Bottom Navigation Buttons (Steps 1-3) */}
                {step < 4 && (
                  <div className="step-navigation-footer">
                    {step > 1 ? (
                      <button
                        type="button"
                        className="step-back-btn"
                        onClick={() => setStep((step - 1) as 1 | 2 | 3)}
                      >
                        <ArrowLeft size={16} /> Back
                      </button>
                    ) : (
                      <div />
                    )}

                    <button
                      type="button"
                      className="step-forward-btn"
                      onClick={() => setStep((step + 1) as 2 | 3 | 4)}
                    >
                      Continue <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
