import { useRef, useCallback, useState, useEffect, type MouseEvent } from 'react';
import type { Project } from '@/types/content';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ProjectCinematicVisual } from './ProjectCinematicVisual';

export interface CoverflowCardProps {
  project: Project;
  index: number;
  activeIndex: number;
  totalCards: number;
  dragOffset: number; // Normalized continuous drag offset (-1 to 1)
  isDragging: boolean;
  isSectionVisible?: boolean;
  onSelect: (project: Project, index: number) => void;
  onOpenModal: (project: Project) => void;
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

/**
 * CoverflowCard — 3D Circular Ring Arrangement (Top 10 Project Showcase)
 *
 * Circular Ring Geometry:
 * The 10 project cards are positioned around the circumference of a 3D cylinder/circle.
 * - Angle per card: 360° / 10 = 36°
 * - Radius R: responsive (~720px desktop, ~520px tablet, ~330px mobile)
 * - 3D Coordinates:
 *     X = R * sin(θ)
 *     Z = R * (cos(θ) - 1)
 *     rotateY = -θ
 * - Active center card steps proudly forward (Z: +80px, scale: 1.0, zIndex: 50) with cursor 3D tilt.
 * - Upcoming / previous neighbor hover: gently steps forward (Z: -80px, scale: 0.89, zIndex: 38 < 50).
 * - Inside each card: Clean, rectangular artwork & domain-specific interactive diagrams.
 */
export function CoverflowCard({
  project,
  index,
  activeIndex,
  totalCards,
  dragOffset,
  isDragging,
  onSelect,
  onOpenModal,
}: CoverflowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Responsive radius for the 3D circular cylinder
  const [radius, setRadius] = useState<number>(() => {
    if (typeof window === 'undefined') return 720;
    const w = window.innerWidth;
    if (w < 640) return 330;
    if (w < 1024) return 520;
    return 720;
  });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) setRadius(330);
      else if (w < 1024) setRadius(520);
      else setRadius(720);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 1. Calculate circular shortest distance (-total/2 to +total/2)
  let offset = index - activeIndex;
  const half = totalCards / 2;
  if (offset > half) offset -= totalCards;
  if (offset < -half) offset += totalCards;

  // Continuous offset combining discrete index and active drag motion
  const continuousOffset = offset + dragOffset;
  const isActive = Math.abs(continuousOffset) < 0.5;
  const absOffset = Math.abs(continuousOffset);

  // Immediate neighbor for upcoming/previous hover enlargement
  const isImmediateNeighbor = !isActive && absOffset < 1.4;
  const isSideEnlarged = isImmediateNeighbor && isHovered && !isDragging;

  // Angular position around the 3D circle (360° / 10 cards = 36° step)
  const stepAngle = 360 / totalCards;
  const angleDeg = continuousOffset * stepAngle;
  const angleRad = (angleDeg * Math.PI) / 180;

  // Cards on the rear side of the cylinder (|offset| > 2.7) are culled for GPU efficiency
  const isVisible = absOffset <= 2.7;

  // 3D Spatial positioning around the cylinder
  let transform = '';
  let zIndex = 30;
  let opacity = 1;
  let filter = 'none';

  if (prefersReducedMotion) {
    // 2D simplified mode for reduced-motion users
    const xPos = continuousOffset * (radius * 0.44);
    const scale = isActive ? 1 : isSideEnlarged ? 0.88 : 0.82;
    transform = `translate3d(${xPos}px, 0, 0) scale(${scale})`;
    zIndex = isActive ? 50 : 30 - Math.round(absOffset);
    opacity = absOffset > 2.4 ? 0 : Math.max(0.2, 1 - absOffset * 0.35);
  } else {
    // 3D Circular Cylinder Coordinates
    const baseX = radius * Math.sin(angleRad);
    const baseZ = radius * (Math.cos(angleRad) - 1);
    const baseRotateY = -angleDeg;

    if (absOffset < 0.05) {
      // Active center card: positioned at front of circle, stepping forward (+80px)
      const tiltX = isHovered ? tilt.x : 0;
      const tiltY = isHovered ? tilt.y : 0;
      transform = `translate3d(0, 0, 80px) rotateY(${tiltY}deg) rotateX(${tiltX}deg) scale(1)`;
      zIndex = 50; // Active card retains highest stacking priority
      opacity = 1;
      filter = 'brightness(1) contrast(1)';
    } else if (isSideEnlarged) {
      // Upcoming / previous neighbor hovered: gently steps forward while staying behind active card
      const xPos = baseX * 0.94;
      const zPos = baseZ + 55; // Steps forward along Z, strictly lower than +80px
      const rotateY = baseRotateY * 0.74; // Slightly turns towards viewer
      transform = `translate3d(${xPos.toFixed(1)}px, 0, ${zPos.toFixed(1)}px) rotateY(${rotateY.toFixed(1)}deg) scale(0.89)`;
      zIndex = 38; // CRITICAL: strictly below active card's 50
      opacity = 0.98;
      filter = 'brightness(0.94) contrast(1.02)';
    } else {
      // Standard perspective cards along the 3D circular ring
      const scale = Math.max(0.66, 0.84 - (absOffset - 1) * 0.08);
      transform = `translate3d(${baseX.toFixed(1)}px, 0, ${baseZ.toFixed(1)}px) rotateY(${baseRotateY.toFixed(1)}deg) scale(${scale.toFixed(2)})`;

      // Natural front-to-back z-index along the circle based on cos(θ)
      zIndex = Math.max(1, Math.round(25 + 20 * Math.cos(angleRad)));

      // Smooth opacity falloff as cards curve around toward the sides and rear of the cylinder
      if (absOffset <= 2.2) {
        opacity = Math.max(0.25, Math.cos(angleRad) * 0.82 + 0.18);
      } else {
        opacity = Math.max(0, (2.7 - absOffset) / 0.5) * 0.35;
      }

      filter = `brightness(${Math.max(0.42, 0.72 - (absOffset - 1) * 0.14).toFixed(2)}) contrast(0.95)`;
    }
  }

  // Active Card Cursor 3D Tilt
  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!isActive || prefersReducedMotion || !cardRef.current || isDragging) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const xPct = (x / rect.width) * 100;
      const yPct = (y / rect.height) * 100;

      cardRef.current.style.setProperty('--mouse-x', `${xPct.toFixed(1)}%`);
      cardRef.current.style.setProperty('--mouse-y', `${yPct.toFixed(1)}%`);

      const tiltMax = 6.0; // Restrained Apple TV-style tilt
      const tiltX = -((y - rect.height / 2) / (rect.height / 2)) * tiltMax;
      const tiltY = ((x - rect.width / 2) / (rect.width / 2)) * tiltMax;
      setTilt({ x: Number(tiltX.toFixed(2)), y: Number(tiltY.toFixed(2)) });
    },
    [isActive, prefersReducedMotion, isDragging]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  const handleClick = () => {
    if (isDragging) return;
    if (!isActive) {
      onSelect(project, index);
    } else {
      onOpenModal(project);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isActive) {
        onSelect(project, index);
      } else {
        onOpenModal(project);
      }
    }
  };

  const formattedRank = project.rank < 10 ? `0${project.rank}` : `${project.rank}`;

  return (
    <div
      ref={cardRef}
      className={`coverflow-card ${isActive ? 'is-active' : 'is-side'} ${isSideEnlarged ? 'is-side-hovered' : ''} ${isActive && !isHovered && !isDragging ? 'is-floating' : ''}`}
      style={{
        transform,
        zIndex,
        opacity: isVisible ? opacity : 0,
        filter,
        pointerEvents: isVisible ? 'auto' : 'none',
        visibility: isVisible ? 'visible' : 'hidden',
      }}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={isActive ? 0 : -1}
      aria-current={isActive ? 'true' : undefined}
      aria-label={`Project #${project.rank}: ${project.title}. ${isActive ? 'Active project. Press Enter to view details.' : 'Click to bring to center.'}`}
    >
      {/* ====================================================================
          LAYER 1: BACKGROUND SHELL & AMBIENT EDGE LIGHTING (depth: 0px)
          ==================================================================== */}
      <div className="coverflow-card__surface">
        {/* Animated Red Border Edge Glow */}
        <div className="coverflow-card__edge-glow" aria-hidden="true" />

        {/* Cursor Spotlight Gradient */}
        <div className="coverflow-card__spotlight" aria-hidden="true" />

        {/* Large Ghost Rank Number in Background */}
        <div className="coverflow-card__ghost-rank" aria-hidden="true">
          {formattedRank}
        </div>

        {/* ==================================================================
            LAYER 3: FLOATING HEADER (depth: 55px in 3D preserve-3d)
            ================================================================== */}
        <div className="coverflow-card__header coverflow-layer-header">
          <div className="coverflow-card__rank-badge">
            <span className="hash">TOP 10 //</span>
            <span className="num">#{formattedRank}</span>
          </div>
          <StatusBadge status={project.status} />
        </div>

        {/* ==================================================================
            LAYER 2: MAIN ARTWORK & DOMAIN-SPECIFIC ANIMATIONS (depth: 30px)
            Clean, rectangular photos and architectural visual diagrams
            ================================================================== */}
        <div className="coverflow-card__media coverflow-layer-artwork">
          <img
            src={project.thumbnail}
            alt=""
            loading="lazy"
            decoding="async"
            className="coverflow-card__img"
          />

          {/* Project-Specific Interactive Animation Overlay when Active */}
          <ProjectCinematicVisual project={project} isActive={isActive} />
        </div>

        {/* ==================================================================
            LAYER 3: CARD FOOTER & ACTIONS (depth: 55px in 3D preserve-3d)
            ================================================================== */}
        <div className="coverflow-card__footer coverflow-layer-footer">
          <h3 className="coverflow-card__title" title={project.title}>
            {project.title}
          </h3>
          <p className="coverflow-card__tagline">
            {project.tagline}
          </p>

          <div className="coverflow-card__tech-row" aria-label="Key technologies">
            {project.technologies.slice(0, 3).map((tech) => (
              <span key={tech} className="coverflow-tech-pill">
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="coverflow-tech-pill" style={{ color: 'var(--color-red)' }}>
                +{project.technologies.length - 3}
              </span>
            )}
          </div>

          <div className="coverflow-card__actions">
            {isActive ? (
              <button
                type="button"
                className="coverflow-card__more-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenModal(project);
                }}
                title={`Open complete architecture breakdown for ${project.title}`}
              >
                <InfoIcon />
                <span>More Info</span>
              </button>
            ) : (
              <span className="coverflow-card__select-hint" aria-hidden="true">
                Click to inspect →
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
