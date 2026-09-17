"use client";
import React, { useState, useEffect } from 'react';
import { Monitor, Smartphone, Copy, Check, ArrowRight, Compass, Sparkles, X } from 'lucide-react';

export function DesktopDisclaimerModal() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if device is mobile/tablet or viewport < 1024px
    const checkIsMobile = () => {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmall = window.innerWidth < 1024;
      return isSmall || isTouch;
    };

    const mobileDetected = checkIsMobile();
    setIsMobile(mobileDetected);

    const handleManualOpen = () => setOpen(true);
    window.addEventListener('open-desktop-disclaimer', handleManualOpen);

    // Check if user has already dismissed the disclaimer
    try {
      const dismissed = localStorage.getItem('ikhaya_desktop_disclaimer_dismissed');
      const forcePreview = window.location.search.includes('disclaimer') || window.location.search.includes('nudge');
      
      if (!dismissed || forcePreview) {
        // Gentle entrance delay for smooth page init
        const timer = setTimeout(() => {
          setOpen(true);
        }, 500);
        return () => {
          clearTimeout(timer);
          window.removeEventListener('open-desktop-disclaimer', handleManualOpen);
        };
      }
    } catch {
      // If localStorage is unavailable, show once
      setOpen(true);
    }

    return () => {
      window.removeEventListener('open-desktop-disclaimer', handleManualOpen);
    };
  }, []);

  const handleDismiss = () => {
    try {
      localStorage.setItem('ikhaya_desktop_disclaimer_dismissed', 'true');
    } catch {
      // Ignore localStorage errors
    }
    setOpen(false);
  };

  const handleCopyLink = async () => {
    try {
      const url = window.location.origin + window.location.pathname;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!mounted || !open) return null;

  return (
    <div
      className="disclaimer-overlay animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-title"
    >
      <div className="disclaimer-backdrop" onClick={handleDismiss} />

      <div className="disclaimer-modal-card">
        {/* Subtle Ambient Gold Glow */}
        <div className="disclaimer-glow" aria-hidden="true" />

        {/* Top Header Badge */}
        <div className="disclaimer-card-header">
          <div className="disclaimer-brand-row">
            <div className="disclaimer-icon-badge">
              <Compass size={18} color="#c89d5c" />
            </div>
            <span className="disclaimer-brand-text">INKWENKWEZI PRIVATE GAME RESERVE</span>
          </div>

          <button
            type="button"
            className="disclaimer-close-btn"
            onClick={handleDismiss}
            aria-label="Close disclaimer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Visual Device Icon Pairing */}
        <div className="disclaimer-visual-badge">
          <div className="disclaimer-device-icon monitor">
            <Monitor size={28} color="#e8cf9c" />
          </div>
          <span className="disclaimer-vs-sparkle">
            <Sparkles size={14} color="#c89d5c" />
          </span>
          <div className={`disclaimer-device-icon phone ${isMobile ? 'is-active-device' : ''}`}>
            <Smartphone size={22} color={isMobile ? '#c89d5c' : '#73837a'} />
          </div>
        </div>

        {/* Disclaimer Core Notice */}
        <div className="disclaimer-content">
          <span className="disclaimer-eyebrow">
            {isMobile ? 'MOBILE VIEWPORT DETECTED' : 'EXPERIENCE NOTICE'}
          </span>
          
          <h2 id="disclaimer-title" className="disclaimer-headline">
            This experience looks <em>way better on desktop.</em>
          </h2>

          <p className="disclaimer-subheadline">
            Please view it on desktop. It looks way better on desktop.
          </p>

          <p className="disclaimer-body">
            We choreographed Inkwenkwezi’s fluid canopy arrival, five protected biomes, and 4K wildlife sequences
            for widescreen desktop immersion and 60fps continuous scroll-scrubbing.
            <br className="desktop-break" />
            Unless you already know what you’re looking for, we strongly nudge you to experience this on a desktop display.
          </p>

          {/* Device Status Chip */}
          <div className="disclaimer-status-chip">
            {isMobile ? (
              <>
                <span className="status-dot warning" />
                <span>You are currently on a mobile device — desktop strongly recommended.</span>
              </>
            ) : (
              <>
                <span className="status-dot ready" />
                <span>You are on a desktop display — widescreen visual fidelity active.</span>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="disclaimer-actions">
          {isMobile ? (
            <>
              <button
                type="button"
                className="pill disclaimer-primary-btn"
                onClick={handleDismiss}
              >
                <span>Continue on Mobile (I Know What I'm Looking For)</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                className="pill disclaimer-secondary-btn"
                onClick={handleCopyLink}
              >
                {copied ? <Check size={16} color="#25d366" /> : <Copy size={16} />}
                <span>{copied ? 'Link Copied! Paste on your desktop' : 'Copy Link to Open on Desktop'}</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="pill disclaimer-primary-btn"
                onClick={handleDismiss}
              >
                <span>Enter Fullscreen Desktop Experience</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                className="pill disclaimer-secondary-btn"
                onClick={handleCopyLink}
              >
                {copied ? <Check size={16} color="#25d366" /> : <Copy size={16} />}
                <span>{copied ? 'Link Copied!' : 'Copy Link for Another Device'}</span>
              </button>
            </>
          )}
        </div>

        {/* Footer Note */}
        <div className="disclaimer-card-footer">
          <span>This notice is only shown to first-time viewers and won't appear again.</span>
        </div>
      </div>
    </div>
  );
}
