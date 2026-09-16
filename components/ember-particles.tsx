"use client";
import { useEffect, useRef } from 'react';

export function EmberParticles({ active = false }: { active?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const count = 35;
    const embers = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: height + Math.random() * 100,
      size: Math.random() * 3 + 1,
      speedY: Math.random() * 1.8 + 0.8,
      sway: Math.random() * 0.02 + 0.01,
      swayOffset: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.7 + 0.3,
      decay: Math.random() * 0.003 + 0.002,
      color: Math.random() > 0.4 ? '#ff9a3c' : '#ff4d15'
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < count; i++) {
        const e = embers[i];
        e.y -= e.speedY;
        e.x += Math.sin(e.y * e.sway + e.swayOffset) * 0.8;
        e.opacity -= e.decay;

        if (e.y < -10 || e.opacity <= 0) {
          e.y = height + Math.random() * 40;
          e.x = width * 0.3 + Math.random() * (width * 0.4); // spawn centered around fire pit
          e.opacity = Math.random() * 0.7 + 0.3;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, e.opacity);
        ctx.fillStyle = e.color;
        ctx.shadowColor = '#ff6b2b';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`ember-canvas ${active ? 'is-visible' : ''}`}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 5,
        opacity: active ? 0.85 : 0,
        transition: 'opacity 0.6s ease'
      }}
    />
  );
}
