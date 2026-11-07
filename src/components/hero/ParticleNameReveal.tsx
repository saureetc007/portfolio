import { useEffect, useRef, useState, useCallback } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ParticleNameRevealProps {
  firstName: string;
  lastName: string;
  onComplete?: () => void;
}

interface RevealParticle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  targetAlpha: number;
  delay: number;
}

interface HoverParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}

/**
 * ParticleNameReveal
 *
 * Capabilities:
 * 1. Initial One-Time Opening Reveal (Morph Hero concept):
 *    - Particles assemble into "SAUREET" in ~1.6s, hold with a soft bloom,
 *      then settle into the semantic HTML heading.
 *    - Never re-runs on hover once settled.
 *
 * 2. Name Hover Micro-Interaction:
 *    - On visitor hover over "Saureet Chakrabarti", emits a small, restrained
 *      burst of ~18–24 red and white particles moving outward with subtle variation.
 *    - Draws very fine connecting lines between nearby particles.
 *    - Fades out smoothly within ~400–600ms.
 *    - Animation loop shuts down completely when inactive (0 background CPU).
 *    - Completely passes through pointer events and leaves text selectable and accessible.
 */
export function ParticleNameReveal({
  firstName,
  lastName,
  onComplete,
}: ParticleNameRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const revealCanvasRef = useRef<HTMLCanvasElement>(null);
  const hoverCanvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isSettled, setIsSettled] = useState(prefersReducedMotion);
  const [showRevealCanvas, setShowRevealCanvas] = useState(!prefersReducedMotion);

  // Hover burst animation state
  const hoverParticlesRef = useRef<HoverParticle[]>([]);
  const hoverAnimIdRef = useRef<number | null>(null);
  const lastHoverBurstRef = useRef<number>(0);

  // Easter Egg: Triple-click terminal trigger
  const clickCountRef = useRef<number>(0);
  const clickTimerRef = useRef<number | null>(null);

  const handleNameClick = () => {
    clickCountRef.current += 1;
    if (clickTimerRef.current) {
      window.clearTimeout(clickTimerRef.current);
    }
    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      window.dispatchEvent(new CustomEvent('open-terminal'));
    } else {
      clickTimerRef.current = window.setTimeout(() => {
        clickCountRef.current = 0;
      }, 650);
    }
  };

  // ---------------------------------------------------------------------------
  // 1. Initial Name Reveal Animation Loop (Runs once on mount)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (prefersReducedMotion) {
      setIsSettled(true);
      setShowRevealCanvas(false);
      onComplete?.();
      return;
    }

    const canvas = revealCanvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsSettled(true);
      setShowRevealCanvas(false);
      return;
    }

    let animationFrameId: number;
    let startTime: number | null = null;
    let isCancelled = false;

    const rect = container.getBoundingClientRect();
    const width = Math.max(rect.width || 420, 320);
    const height = 90;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);

    // Offscreen canvas to rasterize target positions
    const offscreen = document.createElement('canvas');
    offscreen.width = width;
    offscreen.height = height;
    const offCtx = offscreen.getContext('2d');

    if (!offCtx) {
      setIsSettled(true);
      setShowRevealCanvas(false);
      return;
    }

    const fontSize = Math.min(Math.floor(width / 6.2), 62);
    offCtx.fillStyle = '#FFFFFF';
    offCtx.font = `900 ${fontSize}px "Netflix Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    offCtx.textAlign = 'left';
    offCtx.textBaseline = 'middle';
    offCtx.fillText(firstName.toUpperCase(), 4, height / 2);

    const imgData = offCtx.getImageData(0, 0, width, height).data;
    const targets: { x: number; y: number }[] = [];
    const sampleStep = width < 480 ? 3 : 2;

    for (let y = 0; y < height; y += sampleStep) {
      for (let x = 0; x < width; x += sampleStep) {
        const index = (y * width + x) * 4;
        const alpha = imgData[index + 3];
        if (alpha !== undefined && alpha > 128) {
          targets.push({ x, y });
        }
      }
    }

    const palette = ['#E50914', '#FF2A35', '#FFFFFF', '#FFA8AF', '#B20710'];

    const particles: RevealParticle[] = targets.map((target) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 80 + Math.random() * 160;
      const originX = target.x + Math.cos(angle) * distance;
      const originY = target.y + Math.sin(angle) * distance;
      const color = palette[Math.floor(Math.random() * palette.length)] ?? '#E50914';

      return {
        x: originX,
        y: originY,
        originX,
        originY,
        targetX: target.x,
        targetY: target.y,
        vx: 0,
        vy: 0,
        size: Math.random() < 0.25 ? 2.6 : 1.8,
        color,
        alpha: 0,
        targetAlpha: 0.85 + Math.random() * 0.15,
        delay: Math.random() * 300,
      };
    });

    const ASSEMBLY_DURATION = 1600;
    const HOLD_DURATION = 400;
    const FADE_OUT_DURATION = 500;
    const TOTAL_DURATION = ASSEMBLY_DURATION + HOLD_DURATION + FADE_OUT_DURATION;

    const easeOutQuart = (x: number): number => 1 - Math.pow(1 - x, 4);

    const render = (now: number) => {
      if (isCancelled) return;
      if (!startTime) startTime = now;
      const elapsed = now - startTime;

      ctx.clearRect(0, 0, width, height);

      if (elapsed < ASSEMBLY_DURATION) {
        for (const p of particles) {
          const particleTime = Math.max(0, elapsed - p.delay);
          const progress = Math.min(1, particleTime / (ASSEMBLY_DURATION - p.delay));
          const eased = easeOutQuart(progress);

          p.x = p.originX + (p.targetX - p.originX) * eased;
          p.y = p.originY + (p.targetY - p.originY) * eased;
          p.alpha = p.targetAlpha * Math.min(1, progress * 1.5);

          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (elapsed < ASSEMBLY_DURATION + HOLD_DURATION) {
        setIsSettled(true);
        const holdProgress = (elapsed - ASSEMBLY_DURATION) / HOLD_DURATION;
        const pulse = Math.sin(holdProgress * Math.PI) * 0.3;

        for (const p of particles) {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.min(1, p.targetAlpha + pulse);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (elapsed < TOTAL_DURATION) {
        setIsSettled(true);
        const fadeProgress = (elapsed - (ASSEMBLY_DURATION + HOLD_DURATION)) / FADE_OUT_DURATION;
        const canvasAlpha = Math.max(0, 1 - fadeProgress);

        for (const p of particles) {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.targetAlpha * canvasAlpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        setIsSettled(true);
        setShowRevealCanvas(false);
        onComplete?.();
        return;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      isCancelled = true;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [firstName, prefersReducedMotion, onComplete]);

  // ---------------------------------------------------------------------------
  // 2. Name Hover Micro-Interaction Loop (On-demand particle burst)
  // ---------------------------------------------------------------------------
  const runHoverAnimation = useCallback(() => {
    const canvas = hoverCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const particles = hoverParticlesRef.current;

    // 1. Update and draw connecting lines between nearby particles
    const lineThreshold = 36;
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      if (!p1 || p1.alpha <= 0) continue;

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        if (!p2 || p2.alpha <= 0) continue;

        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.hypot(dx, dy);

        if (dist < lineThreshold) {
          const lineAlpha = Math.min(p1.alpha, p2.alpha) * (1 - dist / lineThreshold) * 0.28;
          ctx.strokeStyle = `rgba(229, 9, 20, ${lineAlpha})`;
          ctx.lineWidth = 0.55;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    // 2. Update particle positions and draw points
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (!p) continue;

      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.94; // Gentle deceleration
      p.vy *= 0.94;
      p.alpha -= p.decay;

      if (p.alpha > 0) {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Filter out dead particles
    hoverParticlesRef.current = particles.filter((p) => p.alpha > 0);

    // If particles remain, keep loop running; otherwise stop completely
    if (hoverParticlesRef.current.length > 0) {
      hoverAnimIdRef.current = requestAnimationFrame(runHoverAnimation);
    } else {
      ctx.clearRect(0, 0, width, height);
      hoverAnimIdRef.current = null;
    }
  }, []);

  const triggerNameHover = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      // Respect accessibility: no animations if reduced motion requested
      if (prefersReducedMotion) return;

      // Disable on touch devices without a fine pointer
      if (
        typeof window !== 'undefined' &&
        window.matchMedia('(hover: hover) and (pointer: fine)').matches === false
      ) {
        return;
      }

      // Throttle burst triggers to avoid particle saturation on rapid movement
      const now = Date.now();
      if (now - lastHoverBurstRef.current < 260) return;
      lastHoverBurstRef.current = now;

      const canvas = hoverCanvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const originX = e.clientX - rect.left;
      const originY = e.clientY - rect.top;

      // Synchronize canvas coordinate resolution
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.scale(dpr, dpr);
      }

      // Palette: Netflix Red, Crimson, Crisp White, Ruby
      const colors = ['#E50914', '#B20710', '#FFFFFF', '#FF3E4D', '#FFFFFF'];
      const burstCount = 20; // 15–30 particles requirement
      const newParticles: HoverParticle[] = [];

      for (let i = 0; i < burstCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.7 + Math.random() * 1.8;
        newParticles.push({
          x: originX + (Math.random() - 0.5) * 18,
          y: originY + (Math.random() - 0.5) * 12,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 1.2 + Math.random() * 1.4, // 1–3 px
          color: colors[Math.floor(Math.random() * colors.length)] ?? '#E50914',
          alpha: 0.95,
          // Fades out in approximately 350–550ms (~22–35 frames at 60fps)
          decay: 0.028 + Math.random() * 0.016,
        });
      }

      // Keep array restrained to at most 35 active particles
      hoverParticlesRef.current = [
        ...hoverParticlesRef.current.slice(-15),
        ...newParticles,
      ];

      // Start loop if not currently active
      if (!hoverAnimIdRef.current) {
        hoverAnimIdRef.current = requestAnimationFrame(runHoverAnimation);
      }
    },
    [prefersReducedMotion, runHoverAnimation]
  );

  // Clean up hover loop on unmount
  useEffect(() => {
    return () => {
      if (hoverAnimIdRef.current) {
        cancelAnimationFrame(hoverAnimIdRef.current);
        hoverAnimIdRef.current = null;
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="hero__name-reveal-container">
      {/* 1. Initial Reveal Particle Canvas (Active only during the one-time opening reveal) */}
      {showRevealCanvas && (
        <canvas
          ref={revealCanvasRef}
          className={`hero__name-canvas ${isSettled ? 'is-fading' : ''}`}
          aria-hidden="true"
        />
      )}

      {/* 2. Hover Burst Canvas (Overlays letters with pointer-events: none) */}
      <canvas
        ref={hoverCanvasRef}
        className="hero__name-hover-canvas"
        aria-hidden="true"
      />

      {/* 3. Semantic Accessible Heading — Remains permanently in DOM and accessible */}
      <h1
        className="hero__title hero__title--spotlight hero__title--interactive"
        aria-label={`${firstName} ${lastName}`}
        onMouseEnter={triggerNameHover}
        onMouseMove={triggerNameHover}
        onClick={handleNameClick}
      >
        <span
          className={`hero__name-first ${
            isSettled || prefersReducedMotion ? 'is-settled' : 'is-revealing'
          }`}
        >
          {firstName}
        </span>
        <span
          className={`hero__name-last ${
            isSettled || prefersReducedMotion ? 'is-settled' : 'is-revealing'
          }`}
        >
          {lastName}
        </span>
      </h1>

      <div
        className={`hero__title-accent-line ${
          isSettled || prefersReducedMotion ? 'is-settled' : ''
        }`}
        aria-hidden="true"
      />
    </div>
  );
}
