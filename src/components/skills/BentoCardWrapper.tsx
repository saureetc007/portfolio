import { useState, useRef, type MouseEvent, type ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { BentoSkillCategory } from '@/data/skills';
import { emitSkillParticleBurst } from './SkillsParticleCanvas';
import { gamification } from '@/lib/gamification';
import { ReactTilt, TiltParallaxLayer } from './react-tilt/ReactTilt';
import { HoloSheenOverlay } from './spin-card/HoloSheenOverlay';
import { SpotlightCard } from './react-bits/SpotlightCard';

export interface BentoCardWrapperProps {
  category: BentoSkillCategory;
  children: ReactNode;
  onOpenModal: (category: BentoSkillCategory) => void;
  className?: string;
  entranceDirection?: 'left' | 'right' | 'up';
  entranceDelay?: number;
  hasEntered?: boolean;
}

/**
 * BentoCardWrapper — Cinematic 3-Layer Interactive Engineering Card
 * Combines:
 * - Layer 1: Atmospheric Background & Lighting (SpotlightCard from React Bits + HoloSheenOverlay from Spin Card)
 * - Layer 2: Main Interactive Artwork (TiltParallaxLayer depth: 4)
 * - Layer 3: Category Information & Tech Labels (TiltParallaxLayer depth: 6)
 * - React Tilt 3D perspective rotation with zero-jank rAF synchronization
 */
export function BentoCardWrapper({
  category,
  children,
  onOpenModal,
  className = '',
  entranceDirection = 'up',
  entranceDelay = 0,
  hasEntered = true,
}: BentoCardWrapperProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const isHero = category.id === 'code-engineering';

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    emitSkillParticleBurst(e.clientX, e.clientY);
    setIsSelected((prev) => !prev);
    gamification.unlockAchievement('skill-hunter');
    onOpenModal(category);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        emitSkillParticleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
      onOpenModal(category);
    }
  };

  const entranceClasses = prefersReducedMotion
    ? ''
    : `skill-card-enter ${hasEntered ? 'has-entered' : ''} enter-${entranceDirection}`;

  return (
    <div
      ref={cardRef}
      className={`bento-card-root ${category.gridClass} ${isHero ? 'is-hero-card-root' : ''} ${entranceClasses} ${className}`}
      style={{
        animationDelay: !prefersReducedMotion && entranceDelay ? `${entranceDelay}ms` : undefined,
      }}
    >
      <ReactTilt
        max={isHero ? 4.8 : 3.6}
        perspective={1000}
        scale={1.012}
        speed={420}
        onHoverChange={setIsHovered}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-label={`${category.number} ${category.title} — Click to expand cinematic engineering details`}
        className={`bento-card ${isHero ? 'is-featured-code-card' : ''} ${isHovered ? 'is-card-hovered' : ''} ${isSelected ? 'is-card-selected' : ''}`}
        style={{
          '--card-accent': category.accentColor,
        } as React.CSSProperties}
      >
        <SpotlightCard
          isHero={isHero}
          spotlightColor="rgba(229, 9, 20, 0.10)"
          spotlightSize={isHero ? 420 : 360}
          borderColor="rgba(229, 9, 20, 0.45)"
          className="bento-card__inner-spotlight"
        >
          {/* ================================================================
              LAYER 1: ATMOSPHERIC BACKGROUND & LIGHTING (depth: 0)
              ================================================================ */}
          <TiltParallaxLayer depth={0} className="bento-card__layer-atmosphere">
            {/* Ambient Red Light Bleed Behind Featured Cards */}
            <div className={`bento-card__ambient-bleed ${isHero ? 'is-hero-bleed' : ''}`} aria-hidden="true" />

            {/* Spin Card Holographic Foil & Specular Glare Sheen */}
            <HoloSheenOverlay
              isHovered={isHovered}
              accentColor={category.accentColor}
              isHero={isHero}
            />
          </TiltParallaxLayer>

          {/* ================================================================
              LAYER 3 (Top): CATEGORY INFORMATION HEADER (depth: 6)
              ================================================================ */}
          <TiltParallaxLayer depth={6} className="bento-card__layer-info-header">
            <div className="bento-card__header">
              <div className="bento-card__tag-row">
                <span className="bento-card__num">{category.number}</span>
                <span className="bento-card__badge">{category.badge}</span>
                {isHero && <span className="bento-card__hero-tag">FEATURED DISCIPLINE</span>}
              </div>
              <button
                type="button"
                className="bento-card__expand-icon-btn"
                aria-hidden="true"
                tabIndex={-1}
                title="Expand cinematic details"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="expand-svg">
                  <polyline points="15 3 21 3 21 9" />
                  <polyline points="9 21 3 21 3 15" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              </button>
            </div>

            <div className="bento-card__title-block">
              <h3 className="bento-card__title">{category.title}</h3>
              <p className="bento-card__subtitle">{category.subtitle}</p>
            </div>
          </TiltParallaxLayer>

          {/* ================================================================
              LAYER 2: MAIN INTERACTIVE ARTWORK (depth: 4)
              ================================================================ */}
          <TiltParallaxLayer depth={4} className="bento-card__layer-artwork">
            <div
              className="bento-card__canvas"
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </div>
          </TiltParallaxLayer>

          {/* ================================================================
              LAYER 3 (Bottom): TECHNOLOGY LABELS & FOOTER (depth: 6)
              ================================================================ */}
          <TiltParallaxLayer depth={6} className="bento-card__layer-info-footer">
            <div className="bento-card__footer">
              <div className="bento-card__tech-pills">
                {category.technologies.map((tech) => (
                  <span key={tech.id} className="bento-tech-pill">
                    <span className="pill-name">{tech.name}</span>
                  </span>
                ))}
              </div>
              <span className="bento-card__click-hint" aria-hidden="true">
                <span>Details</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="click-hint-arrow" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </TiltParallaxLayer>
        </SpotlightCard>
      </ReactTilt>
    </div>
  );
}
