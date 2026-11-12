import { useState, useEffect, useRef, useCallback } from 'react';
import { heroSlides } from '@/data';
import type { HeroSlide } from '@/types/content';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMagnetic } from '@/hooks/useMagnetic';
import { WordReveal } from '@/components/ui/WordReveal';
import { HeroVideoBackground } from './HeroVideoBackground';
import { HeroAtmosphere } from './HeroAtmosphere';
import { ParticleNameReveal } from './ParticleNameReveal';
import { HeroCardStack } from './HeroCardStack';
import { RepositoryExplorerModal } from './RepositoryExplorerModal';
import { SecretTerminal } from './SecretTerminal';
import { gamification } from '@/lib/gamification';
import { cx } from '@/lib/cx';

function PlayIcon() {
  return (
    <svg className="btn__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 4.5v15a1 1 0 0 0 1.52.85l12-7.5a1 1 0 0 0 0-1.7l-12-7.5A1 1 0 0 0 7 4.5Z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className="btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg className="btn__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function HeroMagneticLink({
  href,
  className,
  tabIndex,
  onClick,
  target,
  rel,
  children,
}: {
  href: string;
  className: string;
  tabIndex: number;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  target?: string;
  rel?: string;
  children: React.ReactNode;
}) {
  const ref = useMagnetic<HTMLAnchorElement>({ strength: 0.35, radius: 15 });
  return (
    <a
      ref={ref}
      href={href}
      className={className}
      tabIndex={tabIndex}
      onClick={onClick}
      target={target}
      rel={rel}
    >
      {children}
    </a>
  );
}

const AUTOPLAY_INTERVAL = 8000;

export function Hero() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isRepoExplorerOpen, setIsRepoExplorerOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const slideCount = heroSlides.length;
  const timerRef = useRef<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Global listener for Secret Terminal (Ctrl+` or ~ or custom event)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }
      if (
        (e.ctrlKey && e.key === '`') ||
        e.key === '~' ||
        (e.altKey && (e.key === 't' || e.key === 'T'))
      ) {
        e.preventDefault();
        setIsTerminalOpen((prev) => {
          if (!prev) gamification.unlockAchievement('curious-mind');
          return !prev;
        });
      }
    };

    const handleOpenTerminalEvent = () => {
      gamification.unlockAchievement('curious-mind');
      setIsTerminalOpen(true);
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    window.addEventListener('open-terminal', handleOpenTerminalEvent);

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      window.removeEventListener('open-terminal', handleOpenTerminalEvent);
    };
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      resetTimer();
      setCurrent((index + slideCount) % slideCount);
    },
    [slideCount, resetTimer]
  );

  const nextSlide = useCallback(() => {
    goToSlide(current + 1);
  }, [current, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(current - 1);
  }, [current, goToSlide]);

  // Slideshow automatic transition
  useEffect(() => {
    if (prefersReducedMotion || isPaused) {
      resetTimer();
      return;
    }

    resetTimer();
    timerRef.current = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % slideCount);
    }, AUTOPLAY_INTERVAL);

    return () => resetTimer();
  }, [isPaused, prefersReducedMotion, slideCount, current, resetTimer]);

  // Pause when browser tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true);
      } else {
        setIsPaused(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Keyboard navigation when user is focused in hero
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
    }
  };

  // Mobile Touch Swipe Handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartXRef.current - touchEndX;
    const diffY = touchStartYRef.current - touchEndY;

    // Check if vertical swipe dominates
    if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 50) {
      if (diffY > 0) {
        // Swiped UP -> Scroll down to Skills section
        const skillsEl = document.getElementById('skills');
        skillsEl?.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const handlePrimaryClick = (e: React.MouseEvent, slide: HeroSlide) => {
    if (slide.primaryCta.isModal && slide.primaryCta.projectId) {
      e.preventDefault();
      window.dispatchEvent(
        new CustomEvent('open-project-modal', { detail: slide.primaryCta.projectId })
      );
    }
  };

  const handleSecondaryClick = (e: React.MouseEvent, slide: HeroSlide) => {
    if (slide.secondaryCta.isModal && slide.secondaryCta.projectId) {
      e.preventDefault();
      window.dispatchEvent(
        new CustomEvent('open-project-modal', { detail: slide.secondaryCta.projectId })
      );
    }
  };

  return (
    <section
      id="top"
      ref={sectionRef}
      className="hero"
      aria-roledescription="carousel"
      aria-label="Featured Portfolio Slideshow"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. Cinematic Video Background Layer (Aethera style with smooth fades and poster fallback) */}
      <HeroVideoBackground />

      {/* 2. Interactive 3D Three.js Particle Environment (Stampede Shelby bokeh field) */}
      <HeroAtmosphere />

      {/* 3. Cinematic Scrims & Vignettes */}
      <div className="hero__ambient-scrim" aria-hidden="true" />
      <div className="hero__vignette-scrim" aria-hidden="true" />

      {/* 4. Main Dual-Panel Viewport Container */}
      <div className="hero__viewport-container">
        {heroSlides.map((slide, index) => {
          const isActive = index === current;
          const isSpotlight = slide.id === 'developer-spotlight';

          return (
            <div
              key={slide.id}
              className={cx('hero__slide-panel', isActive && 'is-active')}
              aria-hidden={!isActive}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slideCount}: ${slide.title}`}
            >
              {/* Left Column: Text & Actions with Particle Reveal */}
              <div className="hero__left-column">
                {slide.badge && (
                  <div
                    className="hero__badge interactive-target"
                    onClick={(e) => {
                      gamification.triggerEasterEgg(
                        "Command Node Active: 'Every complex system starts with one honest prototype.' — Saureet"
                      );
                      window.dispatchEvent(
                        new CustomEvent('emit-global-burst', {
                          detail: { x: e.clientX, y: e.clientY, count: 18 },
                        })
                      );
                    }}
                    role="button"
                    tabIndex={0}
                    title="Click to ping developer beacon"
                  >
                    <span className="hero__badge-dot" aria-hidden="true" />
                    <span>{slide.badge}</span>
                  </div>
                )}

                {isSpotlight && slide.titleFirst && slide.titleLast ? (
                  <ParticleNameReveal
                    firstName={slide.titleFirst}
                    lastName={slide.titleLast}
                  />
                ) : (
                  <div className="hero__title-wrapper">
                    <span className="hero__owner-kicker">Saureet Chakrabarti · Project Showcase</span>
                    <h1 className="hero__title">
                      <WordReveal text={slide.title} as="span" wordDelay={0.06} />
                    </h1>
                    <div className="hero__title-accent-line" aria-hidden="true" />
                  </div>
                )}

                <p className="hero__subtitle">{slide.subtitle}</p>

                <p className="hero__description">{slide.description}</p>

                <div className="hero__actions">
                  <HeroMagneticLink
                    href={`#${slide.primaryCta.target}`}
                    className="btn btn--primary hero__btn"
                    tabIndex={isActive ? 0 : -1}
                    onClick={(e) => handlePrimaryClick(e, slide)}
                  >
                    <PlayIcon />
                    <span>{slide.primaryCta.label}</span>
                  </HeroMagneticLink>

                  {slide.secondaryCta.external && slide.secondaryCta.href ? (
                    <HeroMagneticLink
                      href={slide.secondaryCta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn--secondary hero__btn"
                      tabIndex={isActive ? 0 : -1}
                    >
                      <GithubIcon />
                      <span>{slide.secondaryCta.label}</span>
                    </HeroMagneticLink>
                  ) : (
                    <HeroMagneticLink
                      href={`#${slide.secondaryCta.target || ''}`}
                      className="btn btn--secondary hero__btn"
                      tabIndex={isActive ? 0 : -1}
                      onClick={(e) => handleSecondaryClick(e, slide)}
                    >
                      <InfoIcon />
                      <span>{slide.secondaryCta.label}</span>
                    </HeroMagneticLink>
                  )}
                </div>
              </div>

              {/* Right Column: Multi-Card Overlapping Visuals */}
              <div className="hero__right-column">
                <HeroCardStack
                  slideId={slide.id}
                  isActive={isActive}
                  onOpenRepoExplorer={() => setIsRepoExplorerOpen(true)}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual Chevron Navigation Controls */}
      <div className="hero__controls" aria-label="Slideshow navigation">
        <button
          type="button"
          className="hero__arrow hero__arrow--prev"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <ChevronLeft />
        </button>
        <button
          type="button"
          className="hero__arrow hero__arrow--next"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Netflix-style Segment Slide Progress Indicators */}
      <div className="hero__indicators" role="tablist" aria-label="Slide selectors">
        {heroSlides.map((slide, index) => {
          const isActive = index === current;
          return (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Go to slide ${index + 1}: ${slide.title}`}
              className={cx('hero__indicator-bar', isActive && 'is-active')}
              onClick={() => goToSlide(index)}
            >
              <span className="hero__indicator-progress" />
            </button>
          );
        })}
      </div>

      {/* Floating Swipe-Down Indicator to Explore Sections */}
      <a
        href="#skills"
        className="hero__swipe-indicator"
        aria-label="Swipe or scroll down to explore competencies"
      >
        <span className="hero__swipe-mouse">
          <span className="hero__swipe-wheel" />
        </span>
        <span className="hero__swipe-text">SWIPE DOWN</span>
        <span className="hero__swipe-arrow">↓</span>
      </a>

      {/* Interactive GitHub Repository & Technology Explorer Modal */}
      <RepositoryExplorerModal
        isOpen={isRepoExplorerOpen}
        onClose={() => setIsRepoExplorerOpen(false)}
      />

      {/* Feature 20: Secret Terminal Easter Egg Modal */}
      <SecretTerminal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        onOpenProject={(id) => {
          window.dispatchEvent(new CustomEvent('open-project-modal', { detail: id }));
        }}
      />
    </section>
  );
}
