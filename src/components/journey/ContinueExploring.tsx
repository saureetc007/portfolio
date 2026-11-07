import { useRef, useState, useEffect, useCallback, type PointerEvent, type KeyboardEvent } from 'react';
import { learningActivities } from '@/data';
import { Section } from '@/components/layout/Section';
import type { LearningActivity } from '@/types/content';

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <polygon points="6 4 20 12 6 20 6 4" />
    </svg>
  );
}

interface ContinueCardProps {
  activity: LearningActivity;
}

function ContinueCard({ activity }: ContinueCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSelected, setIsSelected] = useState(false);

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleClick = () => {
    setIsSelected((prev) => !prev);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsSelected((prev) => !prev);
    }
  };

  const progressPercentage = activity.progress !== null ? `${activity.progress}%` : '50%';

  return (
    <div
      ref={cardRef}
      tabIndex={0}
      role="article"
      aria-label={`${activity.title} — Status: ${activity.status}`}
      className={`continue-queue-card ${isSelected ? 'is-card-selected' : ''}`}
      onPointerMove={handlePointerMove}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {/* Subtle cursor spotlight */}
      <div className="continue-queue-card__spotlight" aria-hidden="true" />

      {/* Subtle red ambient glow bleed on hover/focus */}
      <div className="continue-queue-card__ambient-glow" aria-hidden="true" />

      {/* Top action row */}
      <div className="continue-queue-card__top">
        <div className="continue-queue-play-glyph" aria-hidden="true">
          <PlayIcon />
        </div>
        <div className="continue-queue-status-pill">
          <span className="continue-queue-status-dot" aria-hidden="true" />
          <span>{activity.status}</span>
        </div>
      </div>

      {/* Card typography & narrative */}
      <div className="continue-queue-card__body">
        <h4 className="continue-queue-card__title">{activity.title}</h4>
        <p className="continue-queue-card__desc">{activity.description}</p>
      </div>

      {/* Tags */}
      {activity.tags && activity.tags.length > 0 && (
        <div className="continue-queue-tags" aria-label="Technologies and topics">
          {activity.tags.map((tag) => (
            <span key={tag} className="continue-queue-tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Restrained progress indicator */}
      <div className="continue-queue-progress-track" aria-hidden="true">
        <div
          className="continue-queue-progress-bar"
          style={{ width: progressPercentage }}
        />
      </div>
    </div>
  );
}

export function ContinueExploring() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = trackRef.current;
    if (!el) return;

    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);

    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  const scrollLeft = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  return (
    <Section id="exploring" labelledBy="exploring-title">
      <div className="continue-queue-section">
        <div className="continue-queue-header">
        <div className="continue-queue-heading-group">
          <div className="continue-queue-eyebrow">
            <span className="continue-queue-eyebrow-dash" aria-hidden="true" />
            <span>Continue Building</span>
          </div>
          <h2 id="exploring-title" className="continue-queue-title">
            Active Learning &amp; Exploration Queue
          </h2>
          <p className="continue-queue-desc">
            A real-time snapshot of what I&apos;m engineering, researching, and testing right now.
            Updated continuously as technical pursuits evolve.
          </p>
        </div>

        <div className="continue-queue-controls" aria-label="Queue navigation controls">
          <button
            type="button"
            className="continue-nav-btn"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            aria-label="Scroll queue left"
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            className="continue-nav-btn"
            onClick={scrollRight}
            disabled={!canScrollRight}
            aria-label="Scroll queue right"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

        <div className="continue-queue-track-wrapper">
          <div className="continue-queue-track" ref={trackRef}>
            {learningActivities.map((activity) => (
              <ContinueCard key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
