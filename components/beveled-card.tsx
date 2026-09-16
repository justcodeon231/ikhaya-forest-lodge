"use client";
import React, { useRef, useState, MouseEvent } from 'react';
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
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false
  });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    // Map to -12deg to +12deg tilt
    const rotX = (py - 0.5) * -16;
    const rotY = (px - 0.5) * 16;
    setCoords({ x: rotY, y: rotX, active: true });
  };

  const handleMouseLeave = () => {
    setCoords({ x: 0, y: 0, active: false });
  };

  return (
    <div
      ref={cardRef}
      className={`beveled-photo-card ${coords.active ? 'is-active' : ''} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        ...style,
        transform: coords.active
          ? `perspective(900px) rotateX(${coords.y}deg) rotateY(${coords.x}deg) scale3d(1.035, 1.035, 1.035)`
          : 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: coords.active
          ? 'transform 0.08s ease-out, box-shadow 0.2s ease-out'
          : 'transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.45s ease-out'
      }}
    >
      <div className="card-media-wrapper">
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          sizes="(max-width: 768px) 90vw, 420px"
          className="card-media-img"
        />
        <div
          className="card-specular-glare"
          style={{
            background: coords.active
              ? `radial-gradient(circle at ${(coords.x + 8) * 6}% ${(coords.y + 8) * 6}%, rgba(255,255,255,0.28) 0%, transparent 65%)`
              : 'none'
          }}
        />
        {tag && (
          <span className="card-floating-tag" style={{ color: accent, borderColor: `${accent}60` }}>
            {tag}
          </span>
        )}
      </div>
      <div className="card-text-panel">
        <h4 className="card-headline">{title}</h4>
        {subtitle && <p className="card-subtext">{subtitle}</p>}
      </div>
      <div className="card-bevel-edge" style={{ borderColor: `${accent}40` }} />
    </div>
  );
}
