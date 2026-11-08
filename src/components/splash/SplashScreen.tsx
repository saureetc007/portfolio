import { useEffect, useRef, useState, useCallback } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SplashScreenProps {
  onComplete: () => void;
}

interface SplashParticle {
  x: number;
  y: number;
  z: number;
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
const SCRAMBLE_POOL = '0123456789ABCDEF$#@!%&/*[]<>~+=-';

/**
 * SplashScreen — High-Performance Cinematic Intro
 * Inspired by DavidHDev/react-bits (DecryptedText), motiondivision/motion,
 * and premium streaming platform soundmarks & curtain reveals.
 *
 * Supports swipe gestures: swiping up or down instantly reveals the portfolio
 * with a matching directional curtain fade.
 */
export function SplashScreen({ onComplete }: SplashScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Phase transition states
  const [ambientVisible, setAmbientVisible] = useState(false);
  const [kickerVisible, setKickerVisible] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const [scrambleChar, setScrambleChar] = useState('');
  const [lineVisible, setLineVisible] = useState(false);
  const [lineActive, setLineActive] = useState(false);
  const [statusVisible, setStatusVisible] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [exitDirection, setExitDirection] = useState<'up' | 'down'>('up');

  const animIdRef = useRef<number | null>(null);
  const particlesRef = useRef<SplashParticle[]>([]);
  const isFinishedRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);

  const finishSequence = useCallback(() => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    document.body.style.overflow = '';
    onComplete();
  }, [onComplete]);

  const triggerExit = useCallback(
    (dir: 'up' | 'down' = 'up') => {
      if (isRevealing || isFinishedRef.current) return;
      setExitDirection(dir);
      setIsRevealing(true);
      setTimeout(() => {
        finishSequence();
      }, 620);
    },
    [isRevealing, finishSequence]
  );

  // Keyboard navigation / dismissal
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape' || e.key === 'ArrowUp') {
        e.preventDefault();
        triggerExit('up');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        triggerExit('down');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [triggerExit]);

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

    // Phase 3: Kicker & Scramble Decryption (480ms)
    const tKicker = setTimeout(() => {
      setKickerVisible(true);
    }, 480);

    let charTimer: NodeJS.Timeout | null = null;
    let scrambleInterval: NodeJS.Timeout | null = null;

    // Scramble glyph updater
    scrambleInterval = setInterval(() => {
      setScrambleChar(
        SCRAMBLE_POOL[Math.floor(Math.random() * SCRAMBLE_POOL.length)] ?? '#'
      );
    }, 35);

    const tCharsStart = setTimeout(() => {
      let count = 0;
      charTimer = setInterval(() => {
        count += 1;
        setRevealedCount(count);
        if (count >= TOTAL_CHARS) {
          if (charTimer) clearInterval(charTimer);
          if (scrambleInterval) clearInterval(scrambleInterval);
        }
      }, 42); // 42ms per letter (~750ms total for 18 letters)
    }, 520);

    // Phase 4: Decorative Soundmark Bar & Progress Line (1050ms)
    const tLine = setTimeout(() => {
      setLineVisible(true);
      setStatusVisible(true);
      requestAnimationFrame(() => {
        setLineActive(true);
      });
    }, 1050);

    // Phase 5: Automatic Cinematic Reveal (2400ms)
    const tReveal = setTimeout(() => {
      triggerExit('up');
    }, 2400);

    // Failsafe timeout
    const tFailsafe = setTimeout(() => {
      finishSequence();
    }, 3100);

    return () => {
      clearTimeout(tAmbient);
      clearTimeout(tKicker);
      clearTimeout(tCharsStart);
      if (charTimer) clearInterval(charTimer);
      if (scrambleInterval) clearInterval(scrambleInterval);
      clearTimeout(tLine);
      clearTimeout(tReveal);
      clearTimeout(tFailsafe);
      document.body.style.overflow = '';
    };
  }, [prefersReducedMotion, finishSequence, triggerExit]);

  // Interactive Touch & Pointer Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null) return;
    const diffY = touchStartYRef.current - e.changedTouches[0].clientY;
    if (Math.abs(diffY) > 35) {
      triggerExit(diffY > 0 ? 'up' : 'down');
    }
    touchStartYRef.current = null;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    touchStartYRef.current = e.clientY;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (touchStartYRef.current === null) return;
    const diffY = touchStartYRef.current - e.clientY;
    if (Math.abs(diffY) > 35) {
      triggerExit(diffY > 0 ? 'up' : 'down');
    }
    touchStartYRef.current = null;
  };

  // Cosmic Atmosphere Particle Engine with 3D Depth
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

    const colors = ['#E50914', '#B20710', '#FFFFFF', '#FF3E4D', '#FFFFFF', '#FF7A85'];
    const particleCount = 42;
    const particles: SplashParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + Math.random() * 0.35;
      const radiusX = 120 + Math.random() * 260;
      const radiusY = 70 + Math.random() * 180;

      const px = centerX + Math.cos(angle) * radiusX;
      const py = centerY + Math.sin(angle) * radiusY;

      particles.push({
        x: px,
        y: py,
        z: Math.random() * 2 + 0.6,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        targetX: centerX + (Math.random() - 0.5) * 220,
        targetY: centerY + (Math.random() - 0.5) * 110,
        size: 1.2 + Math.random() * 1.5,
        color: colors[Math.floor(Math.random() * colors.length)] ?? '#E50914',
        alpha: 0,
        maxAlpha: 0.7 + Math.random() * 0.3,
      });
    }

    particlesRef.current = particles;
    const startTime = performance.now();

    const render = (now: number) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, width, height);

      if (elapsed > 180) {
        const isFadingOut = elapsed > 2200;
        const pList = particlesRef.current;

        // Constellation connection lines
        const lineThreshold = 55;
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
                Math.min(p1.alpha, p2.alpha) * (1 - dist / lineThreshold) * 0.25;
              ctx.strokeStyle = `rgba(229, 9, 20, ${lineAlpha})`;
              ctx.lineWidth = 0.6;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }

        // Particle update & render
        for (const p of pList) {
          if (!isFadingOut) {
            p.alpha += (p.maxAlpha - p.alpha) * 0.08;
          } else {
            p.alpha -= 0.06;
          }

          if (p.alpha > 0.01) {
            p.vx += (p.targetX - p.x) * 0.0018;
            p.vy += (p.targetY - p.y) * 0.0018;

            p.x += p.vx * p.z;
            p.y += p.vy * p.z;
            p.vx *= 0.94;
            p.vy *= 0.94;

            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.beginPath();
            ctx.arc(p.x, p.y, (p.size * p.z) / 2, 0, Math.PI * 2);
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
      className={`splash-screen ${
        isRevealing ? `is-revealing swipe-${exitDirection}` : ''
      }`}
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio experience. Swipe up or down to enter."
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onClick={() => triggerExit('up')}
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
        {/* Kicker Badge */}
        <div
          className={`splash-screen__kicker ${
            kickerVisible ? 'is-visible' : ''
          }`}
        >
          <span className="splash-screen__kicker-dot" />
          <span>PORTFOLIO EXPERIENCE</span>
        </div>

        {/* Decrypted Matrix Typography Reveal */}
        <h1 className="splash-screen__name" aria-label="Saureet Chakrabarti">
          <span className="splash-screen__word">
            {FIRST_NAME.split('').map((char, index) => {
              const charIndex = index;
              const isRevealed = revealedCount > charIndex;
              const isScrambling = revealedCount === charIndex;
              return (
                <span
                  key={index}
                  className={`splash-screen__char ${
                    isRevealed
                      ? 'is-revealed'
                      : isScrambling
                      ? 'is-scrambling'
                      : ''
                  }`}
                >
                  {isRevealed ? char : isScrambling ? scrambleChar : '·'}
                </span>
              );
            })}
          </span>
          <span className="splash-screen__space">&nbsp;</span>
          <span className="splash-screen__word">
            {LAST_NAME.split('').map((char, index) => {
              const charIndex = FIRST_NAME.length + index;
              const isRevealed = revealedCount > charIndex;
              const isScrambling = revealedCount === charIndex;
              return (
                <span
                  key={index}
                  className={`splash-screen__char ${
                    isRevealed
                      ? 'is-revealed'
                      : isScrambling
                      ? 'is-scrambling'
                      : ''
                  }`}
                >
                  {isRevealed ? char : isScrambling ? scrambleChar : '·'}
                </span>
              );
            })}
          </span>
        </h1>

        {/* Cinematic Soundmark Frequency Bars */}
        <div
          className={`splash-screen__soundmark ${
            lineVisible ? 'is-visible' : ''
          }`}
          aria-hidden="true"
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="splash-screen__soundmark-bar"
              style={{
                animationDelay: `${i * 38}ms`,
              }}
            />
          ))}
        </div>

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
          INITIALIZING ARCHITECTURE
        </div>
      </div>

      {/* 5. Interactive Floating Swipe-to-Enter Indicator */}
      <div
        className={`splash-screen__swipe-hint ${
          kickerVisible ? 'is-visible' : ''
        }`}
        aria-hidden="true"
      >
        <span className="splash-screen__swipe-chevron">▲</span>
        <span className="splash-screen__swipe-text">SWIPE UP OR DOWN TO ENTER</span>
        <span className="splash-screen__swipe-chevron">▼</span>
      </div>
    </div>
  );
}
