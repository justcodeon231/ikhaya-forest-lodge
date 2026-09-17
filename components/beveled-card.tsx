"use client";
import React from 'react';
import Image from 'next/image';

interface BeveledCardProps {
  src: string;
  alt: string;
  tag?: string;
  title: string;
  subtitle?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  accent?: string;
}

export function BeveledCard({
  src,
  alt,
  tag,
  title,
  subtitle,
  className = '',
  style,
  onClick,
  accent = '#c89d5c'
}: BeveledCardProps) {
  return (
    <div
      className={`borderless-photo-card ${className}`}
      onClick={onClick}
      style={style}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      <div className="photo-media-box">
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          sizes="(max-width: 768px) 90vw, 440px"
          className="photo-media-img"
        />
      </div>

      <div className="photo-meta-panel">
        {tag && (
          <span className="photo-tag-label" style={{ color: accent }}>
            {tag}
          </span>
        )}
        <h4 className="photo-headline">{title}</h4>
        {subtitle && <p className="photo-subtext">{subtitle}</p>}
      </div>
    </div>
  );
}
