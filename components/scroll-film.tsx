"use client";
import { useEffect, useRef } from 'react';

type Manifest = {
  enabled: boolean;
  count: number;
  fps: number;
  desktop: string;
  mobile: string;
  stops: { scroll: number; frame: number }[];
};

export function ScrollFilm() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const stage = canvas.closest('.stage');
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const abort = new AbortController();

    // Cache of loaded image elements
    const cache = new Map<number, HTMLImageElement>();
    const loading = new Set<number>();
    let config: Manifest | null = null;
    let targetFrame = 0;
    let currentFrame = 0;
    let disposed = false;
    let ready = false;
    let animId = 0;
    let currentProgress = 0;

    // Draw the specified frame onto the canvas (cover fit)
    const renderFrame = (frameNum: number) => {
      if (disposed || reduced.matches) return;

      const rounded = Math.round(frameNum);
      let img = cache.get(rounded);
      if (!img) {
        // Find closest cached frame
        if (cache.size === 0) return;
        const keys = Array.from(cache.keys());
        keys.sort((a, b) => Math.abs(a - rounded) - Math.abs(b - rounded));
        img = cache.get(keys[0]);
      }
      if (!img || !img.naturalWidth) return;

      const w = canvas.width;
      const h = canvas.height;
      const hRatio = w / img.naturalWidth;
      const vRatio = h / img.naturalHeight;
      const ratio = Math.max(hRatio, vRatio);
      const cw = img.naturalWidth * ratio;
      const ch = img.naturalHeight * ratio;
      const cx = (w - cw) / 2;
      const cy = (h - ch) / 2;

      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, cx, cy, cw, ch);

      if (!ready) {
        ready = true;
        canvas.style.opacity = '1';
        stage?.classList.add('film-active');
      }
    };

    // Continuous render loop for silky smooth frame lerping
    const tick = () => {
      if (disposed) return;
      // Smooth lerp toward target frame
      const diff = targetFrame - currentFrame;
      if (Math.abs(diff) > 0.02) {
        currentFrame += diff * 0.35;
        renderFrame(currentFrame);
        animId = requestAnimationFrame(tick);
      } else {
        currentFrame = targetFrame;
        renderFrame(currentFrame);
        animId = 0;
      }
    };

    const triggerTick = () => {
      if (!animId) {
        animId = requestAnimationFrame(tick);
      }
    };

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      renderFrame(currentFrame);
    };

    // Load a single frame by index
    const loadFrame = (index: number): Promise<HTMLImageElement | null> => {
      if (cache.has(index)) return Promise.resolve(cache.get(index)!);
      if (loading.has(index) || !config || disposed) return Promise.resolve(null);

      loading.add(index);
      return new Promise((resolve) => {
        const pattern = window.innerWidth <= 700 ? config!.mobile : config!.desktop;
        const src = pattern.replace('{frame}', String(index + 1).padStart(4, '0'));
        const img = new window.Image();
        img.onload = () => {
          loading.delete(index);
          if (disposed) return resolve(null);
          cache.set(index, img);
          if (Math.round(currentFrame) === index || (!ready && index === 0)) {
            renderFrame(currentFrame);
          }
          resolve(img);
        };
        img.onerror = () => {
          loading.delete(index);
          resolve(null);
        };
        img.src = src;
      });
    };

    // Eager preloader: load frame 0 immediately, then preload all sequence frames in chunks
    const preloadAllFrames = async (cfg: Manifest) => {
      // 1. Immediately load frame 0 and frame 120 (the door)
      await loadFrame(0);
      if (disposed) return;
      loadFrame(Math.min(120, cfg.count - 1));

      // 2. Load the rest of the arrival sequence in batches of 6
      const allIndices = Array.from({ length: cfg.count }, (_, i) => i);
      const batchSize = 6;
      for (let i = 0; i < allIndices.length; i += batchSize) {
        if (disposed) break;
        const batch = allIndices.slice(i, i + batchSize);
        await Promise.all(batch.map((idx) => loadFrame(idx)));
      }
    };

    const update = (p: number) => {
      currentProgress = Math.max(0, Math.min(1, p));
      if (!config) return;

      const stops = config.stops;
      let a = stops[0];
      let b = stops[stops.length - 1];

      for (let i = 1; i < stops.length; i++) {
        if (currentProgress <= stops[i].scroll) {
          a = stops[i - 1];
          b = stops[i];
          break;
        }
      }

      const ratio = Math.max(0, Math.min(1, (currentProgress - a.scroll) / (b.scroll - a.scroll || 1)));
      targetFrame = Math.round(a.frame + (b.frame - a.frame) * ratio);
      targetFrame = Math.max(0, Math.min(config.count - 1, targetFrame));

      triggerTick();
    };

    const onProgress = (event: Event) => {
      update((event as CustomEvent<number>).detail);
    };

    const motionChange = () => {
      if (reduced.matches) {
        canvas.style.opacity = '0';
        stage?.classList.remove('film-active');
        ready = false;
      } else {
        resize();
        update(currentProgress);
      }
    };

    window.addEventListener('ikhaya-progress', onProgress, { passive: true });
    window.addEventListener('resize', resize, { passive: true });
    reduced.addEventListener('change', motionChange);

    fetch('/sequence/manifest.json', { signal: abort.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((val) => {
        const m = val as Manifest | null;
        if (!m?.enabled || !Number.isInteger(m.count) || m.count < 2) return;
        config = m;
        resize();
        preloadAllFrames(m);
        update(currentProgress);
      })
      .catch(() => {
        // Static photograph fallback remains active if film fetch fails
      });

    resize();

    return () => {
      disposed = true;
      if (animId) cancelAnimationFrame(animId);
      stage?.classList.remove('film-active');
      abort.abort();
      window.removeEventListener('ikhaya-progress', onProgress);
      window.removeEventListener('resize', resize);
      reduced.removeEventListener('change', motionChange);
      cache.clear();
      loading.clear();
    };
  }, []);

  return <canvas ref={canvasRef} className="scroll-film" data-layer="scroll-film" aria-hidden="true" />;
}
