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
  const [statusText, setStatusText] = useState('INITIALIZING EXPERIENCE');
  const [isRevealing, setIsRevealing] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isVideoFading, setIsVideoFading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpectrumActive, setIsSpectrumActive] = useState(false);
  const [isSpectrumZooming, setIsSpectrumZooming] = useState(false);
  const [exitDirection, setExitDirection] = useState<'up' | 'down'>('up');

  const videoRef = useRef<HTMLVideoElement>(null);
  const animIdRef = useRef<number | null>(null);
  const particlesRef = useRef<SplashParticle[]>([]);
  const isFinishedRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);

  // Synthesizes the authentic Netflix "Ta-Dum" cinematic soundmark resonance
  const playNetflixTaDum = useCallback(() => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;

      // 1. Initial "TA" attack: punchy mid-low kick
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(68, now);
      osc1.frequency.exponentialRampToValueAtTime(32, now + 0.32);
      gain1.gain.setValueAtTime(0.75, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.33);

      // 2. Heavy "DUM" sub-bass boom: seismic chest thud (0.14s later)
      const tDum = now + 0.14;
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(54, tDum);
      osc2.frequency.exponentialRampToValueAtTime(26, tDum + 0.85);
      gain2.gain.setValueAtTime(0.85, tDum);
      gain2.gain.exponentialRampToValueAtTime(0.001, tDum + 0.85);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(tDum);
      osc2.stop(tDum + 0.86);

      // 3. Shimmering chromatic harmonic overtone (matching the light spectrum)
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = 'triangle';
      osc3.frequency.setValueAtTime(220, tDum);
      osc3.frequency.exponentialRampToValueAtTime(520, tDum + 0.75);
      gain3.gain.setValueAtTime(0.12, tDum);
      gain3.gain.exponentialRampToValueAtTime(0.001, tDum + 0.75);
      osc3.connect(gain3);
      gain3.connect(ctx.destination);
      osc3.start(tDum);
      osc3.stop(tDum + 0.76);
    } catch {
      // Audio autoplay restrictions gracefully handled
    }
  }, []);

  const finishSequence = useCallback(() => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    document.body.style.overflow = '';
    onComplete();
  }, [onComplete]);

  const handleVideoEnded = useCallback(() => {
    if (isFinishedRef.current) return;
    setIsVideoFading(true);
    setTimeout(() => {
      finishSequence();
    }, 140);
  }, [finishSequence]);

  const triggerExit = useCallback(
    (dir: 'up' | 'down' = 'up', userGesture = false) => {
      if (isFinishedRef.current) return;

      // If user clicks, taps, or presses key WHILE the video transition is already running, skip immediately
      if (isRevealing || isVideoActive) {
        finishSequence();
        return;
      }

      setExitDirection(dir);
      setIsRevealing(true);
      setIsVideoActive(true);
      setIsSpectrumActive(true);

      const video = videoRef.current;
      if (video) {
        video.currentTime = 0;
        video.playbackRate = 1.35; // Fast, punchy cinematic tempo
        if (userGesture) {
          video.muted = false;
          setIsMuted(false);
        }
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Video is playing authentic Netflix intro
            })
            .catch(() => {
              // If browser blocked unmuted autoplay, mute video and use WebAudio fallback
              try {
                video.muted = true;
                setIsMuted(true);
                video.play().catch(() => {});
              } catch {}
              playNetflixTaDum();
            });
        }
      } else {
        playNetflixTaDum();
      }

      requestAnimationFrame(() => {
        setIsSpectrumZooming(true);
      });

      // Rapid cinematic surge: finish transition after ~850ms
      setTimeout(() => {
        handleVideoEnded();
      }, 880);
    },
    [isRevealing, isVideoActive, finishSequence, handleVideoEnded, playNetflixTaDum]
  );

  // Audio unlock listener on first user gesture
  useEffect(() => {
    const unlockAudio = () => {
      if (videoRef.current) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    };
    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  // Keyboard navigation / dismissal
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape' || e.key === 'ArrowUp') {
        e.preventDefault();
        triggerExit('up', true);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        triggerExit('down', true);
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

    // Phase 2: Ambient Keylight (40ms)
    const tAmbient = setTimeout(() => {
      setAmbientVisible(true);
    }, 40);

    // Phase 3: Kicker & Soundmark Bars (80ms)
    const tKicker = setTimeout(() => {
      setKickerVisible(true);
      setLineVisible(true);
      setStatusVisible(true);
      requestAnimationFrame(() => {
        setLineActive(true);
      });
    }, 80);

    let charTimer: NodeJS.Timeout | null = null;
    let scrambleInterval: NodeJS.Timeout | null = null;

    // Rapid scramble glyph updater (16ms)
    scrambleInterval = setInterval(() => {
      setScrambleChar(
        SCRAMBLE_POOL[Math.floor(Math.random() * SCRAMBLE_POOL.length)] ?? '#'
      );
    }, 16);

    // High-speed matrix text decrypting: 100ms start, 12ms per character
    const tCharsStart = setTimeout(() => {
      let count = 0;
      charTimer = setInterval(() => {
        count += 1;
        setRevealedCount(count);
        if (count >= TOTAL_CHARS) {
          if (charTimer) clearInterval(charTimer);
          if (scrambleInterval) clearInterval(scrambleInterval);
        }
      }, 12);
    }, 100);

    // Status resolves to "EXPERIENCE READY" at 340ms
    const tStatusReady = setTimeout(() => {
      setStatusText('EXPERIENCE READY');
    }, 340);

    // Phase 5: Fast Netflix Intro Transition begins at 500ms
    const tReveal = setTimeout(() => {
      triggerExit('up', false);
    }, 500);

    // Failsafe timeout (2200ms)
    const tFailsafe = setTimeout(() => {
      finishSequence();
    }, 2200);

    return () => {
      clearTimeout(tAmbient);
      clearTimeout(tKicker);
      clearTimeout(tCharsStart);
      if (charTimer) clearInterval(charTimer);
      if (scrambleInterval) clearInterval(scrambleInterval);
      clearTimeout(tStatusReady);
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
      triggerExit(diffY > 0 ? 'up' : 'down', true);
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
      triggerExit(diffY > 0 ? 'up' : 'down', true);
    }
    touchStartYRef.current = null;
  };

  // Cosmic Atmosphere Particle Engine with 3D Depth & Native Retina Resolution
  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const setupCanvas = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    setupCanvas();

    const handleResize = () => {
      setupCanvas();
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

      if (elapsed > 40) {
        const isFadingOut = elapsed > 500;
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
      onClick={() => triggerExit('up', true)}
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
          {statusText}
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

      {/* 6. Authentic Netflix Video Transition (From user-provided media) */}
      <video
        ref={videoRef}
        className={`splash-screen__netflix-video ${
          isVideoActive ? 'is-active' : ''
        } ${isVideoFading ? 'is-fading' : ''}`}
        src="/assets/splash/netflix-intro.mp4"
        playsInline
        preload="auto"
        muted={isMuted}
        onEnded={handleVideoEnded}
        aria-hidden="true"
      />

      {/* 7. Netflix-Style Skip Button during playback */}
      {isVideoActive && (
        <button
          type="button"
          className="splash-screen__skip-intro-btn"
          onClick={(e) => {
            e.stopPropagation();
            finishSequence();
          }}
          aria-label="Skip intro animation"
        >
          SKIP INTRO <span aria-hidden="true">›</span>
        </button>
      )}

      {/* 8. Authentic Netflix Spectrum Light Ribbon Zoom Transition (Fallback / Ambient Underlay) */}
      {isSpectrumActive && (
        <div
          className={`splash-screen__spectrum-stage ${
            isSpectrumZooming ? 'is-zooming' : ''
          }`}
          aria-hidden="true"
        >
          {/* Background Ambient Glow */}
          <div className="spectrum-ambient" />

          {/* High-Fidelity Vector Netflix 'N' */}
          <div className="spectrum-netflix-n-container">
            <svg
              className="spectrum-netflix-n"
              viewBox="0 0 100 150"
              width="100"
              height="150"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M15 10 L38 10 L38 140 L15 140 Z" fill="#B20710" />
              <path d="M62 10 L85 10 L85 140 L62 140 Z" fill="#B20710" />
              <path d="M62 10 L85 10 L85 140 L62 55 Z" fill="rgba(0,0,0,0.65)" />
              <path d="M15 10 L38 10 L85 140 L62 140 Z" fill="#E50914" />
            </svg>
          </div>

          {/* High-Fidelity Spectrum Ribbons from User Reference */}
          <div className="spectrum-texture-layer" />

          {/* Procedural Glowing Light Beams for Additive Shimmer */}
          <div className="spectrum-beams-container">
            <div className="spectrum-beam beam-gold" />
            <div className="spectrum-beam beam-crimson-1" />
            <div className="spectrum-beam beam-crimson-2" />
            <div className="spectrum-beam beam-green-slit" />
            <div className="spectrum-beam beam-netflix-red" />
            <div className="spectrum-beam beam-coral" />
            <div className="spectrum-beam beam-magenta" />
            <div className="spectrum-beam beam-violet" />
            <div className="spectrum-beam beam-cyan" />
            <div className="spectrum-beam beam-blue" />
          </div>

          {/* Anamorphic Horizontal Lens Flare Sweep */}
          <div className="spectrum-flare-core" />
          <div className="spectrum-flare-streak" />
        </div>
      )}
    </div>
  );
}
