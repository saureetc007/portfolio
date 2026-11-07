import { useEffect, useRef, useState, useCallback } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SplashScreenProps {
  onComplete: () => void;
}

interface SplashParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  size: number;
  color: string;
  alpha: number;
  maxAlpha: number;
}

const FIRST_NAME = 'SAUREET';
const LAST_NAME = 'CHAKRABARTI';
const TOTAL_CHARS = FIRST_NAME.length + LAST_NAME.length;

/**
 * SplashScreen
 *
 * Sequence:
 * Phase 1 — Blackout (0ms):
 *   Full-screen black (#000000) completely covering the website.
 * Phase 2 — Particle animation (200ms):
 *   Red and white particles appear from darkness and converge toward center with fine connecting lines.
 * Phase 3 — Name reveal (500ms):
 *   Letter-by-letter typographic reveal for "SAUREET CHAKRABARTI" with restrained red glow.
 * Phase 4 — Loading line (1100ms):
 *   Thin red progress line sweeps beneath the name with subtle status typography.
 * Phase 5 — Website reveal (2300ms):
 *   Particles and text dissolve, splash screen lifts upward like a cinema curtain,
 *   revealing the entire portfolio with a smooth opacity and upward glide.
 */
export function SplashScreen({ onComplete }: SplashScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Phase transition states
  const [ambientVisible, setAmbientVisible] = useState(false);
  const [kickerVisible, setKickerVisible] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const [lineVisible, setLineVisible] = useState(false);
  const [lineActive, setLineActive] = useState(false);
  const [statusVisible, setStatusVisible] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);

  const animIdRef = useRef<number | null>(null);
  const particlesRef = useRef<SplashParticle[]>([]);
  const isFinishedRef = useRef(false);

  const finishSequence = useCallback(() => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    document.body.style.overflow = '';
    onComplete();
  }, [onComplete]);

  // Phase Timeline Orchestration
  useEffect(() => {
    if (prefersReducedMotion) {
      finishSequence();
      return;
    }

    // Lock scrolling while splash screen is active
    document.body.style.overflow = 'hidden';

    // Phase 2: Ambient Keylight & Particle emergence (200ms)
    const tAmbient = setTimeout(() => {
      setAmbientVisible(true);
    }, 200);

    // Phase 3: Kicker & Letter-by-Letter Name Reveal (500ms)
    const tKicker = setTimeout(() => {
      setKickerVisible(true);
    }, 500);

    let charTimer: NodeJS.Timeout | null = null;
    const tCharsStart = setTimeout(() => {
      let count = 0;
      charTimer = setInterval(() => {
        count += 1;
        setRevealedCount(count);
        if (count >= TOTAL_CHARS) {
          if (charTimer) clearInterval(charTimer);
        }
      }, 42); // 42ms per letter (~750ms total for 18 letters)
    }, 540);

    // Phase 4: Decorative Progress Line & Status Label (1100ms)
    const tLine = setTimeout(() => {
      setLineVisible(true);
      setStatusVisible(true);
      requestAnimationFrame(() => {
        setLineActive(true);
      });
    }, 1100);

    // Phase 5: Cinematic Website Reveal (2300ms)
    const tReveal = setTimeout(() => {
      setIsRevealing(true);
    }, 2300);

    // Complete & Unmount (2850ms)
    const tFinish = setTimeout(() => {
      finishSequence();
    }, 2850);

    // Failsafe timeout
    const tFailsafe = setTimeout(() => {
      finishSequence();
    }, 3100);

    return () => {
      clearTimeout(tAmbient);
      clearTimeout(tKicker);
      clearTimeout(tCharsStart);
      if (charTimer) clearInterval(charTimer);
      clearTimeout(tLine);
      clearTimeout(tReveal);
      clearTimeout(tFinish);
      clearTimeout(tFailsafe);
      document.body.style.overflow = '';
    };
  }, [prefersReducedMotion, finishSequence]);

  // Particle Engine
  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const centerX = width / 2;
    const centerY = height / 2;

    const colors = ['#E50914', '#B20710', '#FFFFFF', '#FF3E4D', '#FFFFFF'];
    const particleCount = 32;
    const particles: SplashParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + Math.random() * 0.3;
      const radiusX = 130 + Math.random() * 220;
      const radiusY = 80 + Math.random() * 150;

      const px = centerX + Math.cos(angle) * radiusX;
      const py = centerY + Math.sin(angle) * radiusY;

      particles.push({
        x: px,
        y: py,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        targetX: centerX + (Math.random() - 0.5) * 180,
        targetY: centerY + (Math.random() - 0.5) * 80,
        size: 1.2 + Math.random() * 1.3,
        color: colors[Math.floor(Math.random() * colors.length)] ?? '#E50914',
        alpha: 0,
        maxAlpha: 0.65 + Math.random() * 0.3,
      });
    }

    particlesRef.current = particles;
    const startTime = performance.now();

    const render = (now: number) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, width, height);

      // Start particles after Phase 1 blackout (200ms)
      if (elapsed > 200) {
        const isFadingOut = elapsed > 2200;
        const pList = particlesRef.current;

        // Connecting lines
        const lineThreshold = 45;
        for (let i = 0; i < pList.length; i++) {
          const p1 = pList[i];
          if (!p1 || p1.alpha <= 0.05) continue;

          for (let j = i + 1; j < pList.length; j++) {
            const p2 = pList[j];
            if (!p2 || p2.alpha <= 0.05) continue;

            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.hypot(dx, dy);

            if (dist < lineThreshold) {
              const lineAlpha =
                Math.min(p1.alpha, p2.alpha) * (1 - dist / lineThreshold) * 0.22;
              ctx.strokeStyle = `rgba(229, 9, 20, ${lineAlpha})`;
              ctx.lineWidth = 0.55;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }

        // Particle movement & render
        for (const p of pList) {
          if (!isFadingOut) {
            p.alpha += (p.maxAlpha - p.alpha) * 0.08;
          } else {
            p.alpha -= 0.05;
          }

          if (p.alpha > 0.01) {
            p.vx += (p.targetX - p.x) * 0.0016;
            p.vy += (p.targetY - p.y) * 0.0016;

            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.95;
            p.vy *= 0.95;

            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animIdRef.current = requestAnimationFrame(render);
    };

    animIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animIdRef.current) {
        cancelAnimationFrame(animIdRef.current);
        animIdRef.current = null;
      }
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div
      className={`splash-screen ${isRevealing ? 'is-revealing' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio experience"
    >
      {/* 1. Ambient Background Keylight */}
      <div
        className={`splash-screen__ambient-glow ${
          ambientVisible ? 'is-visible' : ''
        }`}
        aria-hidden="true"
      />

      {/* 2. Expanding Crimson Flare Sweep on Reveal */}
      <div className="splash-screen__light-sweep" aria-hidden="true" />

      {/* 3. Cosmic Atmosphere Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="splash-screen__canvas"
        aria-hidden="true"
      />

      {/* 4. Central Typographic Experience */}
      <div className="splash-screen__content">
        {/* Kicker */}
        <div
          className={`splash-screen__kicker ${
            kickerVisible ? 'is-visible' : ''
          }`}
        >
          <span className="splash-screen__kicker-dot" />
          <span>PORTFOLIO EXPERIENCE</span>
        </div>

        {/* Letter-by-Letter Name Reveal */}
        <h1 className="splash-screen__name" aria-label="Saureet Chakrabarti">
          <span className="splash-screen__word">
            {FIRST_NAME.split('').map((char, index) => {
              const charIndex = index;
              const isRevealed = revealedCount > charIndex;
              return (
                <span
                  key={index}
                  className={`splash-screen__char ${
                    isRevealed ? 'is-revealed' : ''
                  }`}
                >
                  {char}
                </span>
              );
            })}
          </span>
          <span className="splash-screen__space">&nbsp;</span>
          <span className="splash-screen__word">
            {LAST_NAME.split('').map((char, index) => {
              const charIndex = FIRST_NAME.length + index;
              const isRevealed = revealedCount > charIndex;
              return (
                <span
                  key={index}
                  className={`splash-screen__char ${
                    isRevealed ? 'is-revealed' : ''
                  }`}
                >
                  {char}
                </span>
              );
            })}
          </span>
        </h1>

        {/* Decorative Progress Bar */}
        <div
          className={`splash-screen__progress-bar ${
            lineVisible ? 'is-visible' : ''
          }`}
        >
          <span
            className={`splash-screen__progress-fill ${
              lineActive ? 'is-active' : ''
            }`}
          />
        </div>

        {/* Status Label */}
        <div
          className={`splash-screen__status ${
            statusVisible ? 'is-visible' : ''
          }`}
        >
          INITIALIZING EXPERIENCE
        </div>
      </div>
    </div>
  );
}

