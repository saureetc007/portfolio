import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type PointerEvent,
} from 'react';
import { projects } from '@/data';
import type { Project } from '@/types/content';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { CoverflowCard } from './CoverflowCard';
import { CoverflowAutoplayControls } from './CoverflowAutoplayControls';
import { CoverflowPagination } from './CoverflowPagination';
import { ProjectModal } from './ProjectModal';
import { gamification } from '@/lib/gamification';

// Project-specific atmospheric ambient lighting colors (restrained streaming red palette)
const PROJECT_GLOWS: Record<string, string> = {
  decisiontrace: 'rgba(229, 9, 20, 0.15)',
  'cognitive-support': 'rgba(229, 9, 20, 0.12)',
  'music-player': 'rgba(229, 9, 20, 0.12)',
  'simon-game': 'rgba(229, 9, 20, 0.12)',
  portfolio: 'rgba(229, 9, 20, 0.15)',
  'python-collection': 'rgba(229, 9, 20, 0.12)',
  'js-interactive': 'rgba(229, 9, 20, 0.12)',
  'responsive-interfaces': 'rgba(229, 9, 20, 0.12)',
  'ml-experiments': 'rgba(229, 9, 20, 0.12)',
  'video-projects': 'rgba(229, 9, 20, 0.12)',
};

const AUTOPLAY_DURATION_MS = 8000; // 8 seconds per project

/**
 * ProjectsSection — Immersive 3D Cinematic Coverflow Gallery
 * Features:
 * - Deep 3D Spatial Arrangement (Center +140px, side cards -140px to -360px)
 * - Automatic Cinematic Project Showcase (8s interval, progress bar, play/pause)
 * - Layered card parallax & domain-specific animations for all 10 projects
 * - Gesture drag physics & touch swipe
 * - Accessible modal architecture breakdown
 */
export function ProjectsSection() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<number>(0);

  // Autoplay Showcase State
  const [isUserPaused, setIsUserPaused] = useState<boolean>(false);
  const [isSectionVisible, setIsSectionVisible] = useState<boolean>(false);
  const [isHoveringStage, setIsHoveringStage] = useState<boolean>(false);
  const [isFocusedStage, setIsFocusedStage] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const isPointerDownRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const hasDraggedRef = useRef<boolean>(false);
  const velocityRef = useRef<number>(0);
  const lastMoveTimeRef = useRef<number>(0);
  const lastClientXRef = useRef<number>(0);

  // Time tracking for 8-second progress loop
  const elapsedMsRef = useRef<number>(0);
  const lastTimeRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const prefersReducedMotion = useReducedMotion();
  const total = projects.length;
  const activeProject = projects[activeIndex] || projects[0];
  const activeGlow = PROJECT_GLOWS[activeProject.id] || 'rgba(229, 9, 20, 0.25)';

  // Circular navigation
  const handlePrev = useCallback(() => {
    elapsedMsRef.current = 0;
    setProgressPercent(0);
    setActiveIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  }, [total]);

  const handleNext = useCallback(() => {
    elapsedMsRef.current = 0;
    setProgressPercent(0);
    setActiveIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  }, [total]);

  const handleSelectProject = useCallback((_project: Project, index: number) => {
    elapsedMsRef.current = 0;
    setProgressPercent(0);
    setActiveIndex(index);
  }, []);

  const handleTogglePlayPause = useCallback(() => {
    setIsUserPaused((prev) => {
      const next = !prev;
      if (!next) {
        // Resuming: reset lastTime to avoid jump
        lastTimeRef.current = performance.now();
      }
      return next;
    });
  }, []);

  // 1. Intersection Observer: Track when Projects section is in viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsSectionVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSectionVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 2. High-Performance rAF Autoplay Engine
  useEffect(() => {
    // Autoplay eligibility conditions
    const canAutoplay =
      !prefersReducedMotion &&
      !isUserPaused &&
      isSectionVisible &&
      !isHoveringStage &&
      !isFocusedStage &&
      !isDragging &&
      selectedProject === null;

    if (!canAutoplay) {
      lastTimeRef.current = null;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    const tick = (now: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
      }
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      elapsedMsRef.current += delta;
      const pct = Math.min(100, (elapsedMsRef.current / AUTOPLAY_DURATION_MS) * 100);
      setProgressPercent(pct);

      if (elapsedMsRef.current >= AUTOPLAY_DURATION_MS) {
        elapsedMsRef.current = 0;
        setProgressPercent(0);
        handleNext();
      } else {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [
    prefersReducedMotion,
    isUserPaused,
    isSectionVisible,
    isHoveringStage,
    isFocusedStage,
    isDragging,
    selectedProject,
    handleNext,
  ]);

  // 3. Listen to Hero slideshow CTA modal event
  useEffect(() => {
    const handleOpenModal = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const projectId = customEvent.detail;
      const foundIndex = projects.findIndex((p) => p.id === projectId);
      if (foundIndex !== -1) {
        elapsedMsRef.current = 0;
        setProgressPercent(0);
        setActiveIndex(foundIndex);
        setSelectedProject(projects[foundIndex]);

        const sectionEl = document.getElementById('projects');
        sectionEl?.scrollIntoView({ behavior: 'smooth' });
      }
    };

    window.addEventListener('open-project-modal', handleOpenModal);
    return () => window.removeEventListener('open-project-modal', handleOpenModal);
  }, []);

  // 4. Global Keyboard Arrow Navigation
  useEffect(() => {
    const handleGlobalKey = (e: globalThis.KeyboardEvent) => {
      if (selectedProject) return; // Modal is open
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [selectedProject, handlePrev, handleNext]);

  // 5. Pointer Drag & Touch Swipe Gesture Mechanics with Momentum
  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    isPointerDownRef.current = true;
    startXRef.current = e.clientX;
    lastClientXRef.current = e.clientX;
    lastMoveTimeRef.current = performance.now();
    velocityRef.current = 0;
    hasDraggedRef.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    const now = performance.now();
    const dt = now - lastMoveTimeRef.current;
    if (dt > 8) {
      velocityRef.current = (e.clientX - lastClientXRef.current) / dt;
      lastMoveTimeRef.current = now;
      lastClientXRef.current = e.clientX;
    }

    const deltaX = e.clientX - startXRef.current;

    if (Math.abs(deltaX) > 6) {
      hasDraggedRef.current = true;
      setIsDragging(true);

      const cardEstimatedWidth = 360;
      const norm = Math.max(-0.95, Math.min(0.95, deltaX / cardEstimatedWidth));
      setDragOffset(norm);
    }
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    if (hasDraggedRef.current) {
      const deltaX = e.clientX - startXRef.current;
      const velocity = velocityRef.current;
      const isFlick = Math.abs(velocity) > 0.3; // Responsive swipe flick threshold

      if (deltaX < -35 || (isFlick && velocity < 0)) {
        handleNext();
      } else if (deltaX > 35 || (isFlick && velocity > 0)) {
        handlePrev();
      }
    }

    setIsDragging(false);
    setDragOffset(0);
  };

  const handlePointerCancel = (e: PointerEvent<HTMLDivElement>) => {
    isPointerDownRef.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleOpenProjectModal = useCallback((p: Project) => {
    gamification.unlockAchievement('code-explorer');
    setSelectedProject(p);
  }, []);

  return (
    <Section id="projects" labelledBy="projects-title" tone="alt">
      <div
        ref={sectionRef}
        className="projects-coverflow-wrapper"
        style={{
          '--active-project-glow': activeGlow,
        } as React.CSSProperties}
      >
        {/* 1. Cinematic Background Atmosphere */}
        <div className="projects-coverflow__ambient-glow" aria-hidden="true" />
        <div className="projects-coverflow__vignette" aria-hidden="true" />
        <div className="projects-coverflow__film-grain" aria-hidden="true" />

        {/* 2. Header Row with Section Heading & Autoplay Controls */}
        <div className="coverflow-header-row">
          <SectionHeading
            id="projects-title"
            eyebrow="CINEMATIC 3D COVERFLOW · TOP 10 SHOWCASE"
            title="Top 10 Featured Projects"
            description="An immersive 3D perspective gallery of verified engineering builds, local AI pipelines, and interactive systems. Features automatic showcasing with complete interactive control."
          />

          <CoverflowAutoplayControls
            currentIndex={activeIndex}
            totalCards={total}
            isPlaying={!prefersReducedMotion && isSectionVisible && !isHoveringStage && !isFocusedStage && !isDragging && selectedProject === null}
            isPausedByUser={isUserPaused}
            progressPercent={progressPercent}
            onTogglePlayPause={handleTogglePlayPause}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </div>

        {/* 3. 3D Spatial Coverflow Stage */}
        <div
          ref={stageRef}
          data-cursor="drag"
          className={`coverflow-stage-container ${isDragging ? 'is-dragging' : ''}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onMouseEnter={() => setIsHoveringStage(true)}
          onMouseLeave={() => setIsHoveringStage(false)}
          onFocus={() => setIsFocusedStage(true)}
          onBlur={() => setIsFocusedStage(false)}
          role="region"
          aria-roledescription="carousel"
          aria-label="3D Coverflow Project Stage. Drag horizontally or use arrow keys."
          tabIndex={0}
        >
          <div className="coverflow-track">
            {/* 3D Circular Ring Turntable Alignment Footprint */}
            <div className="coverflow-turntable" aria-hidden="true">
              <div className="coverflow-turntable__ring-outer" />
              <div className="coverflow-turntable__ring-inner" />
              <div className="coverflow-turntable__axis" />
            </div>

            {projects.map((project, idx) => (
              <CoverflowCard
                key={project.id}
                project={project}
                index={idx}
                activeIndex={activeIndex}
                totalCards={total}
                dragOffset={dragOffset}
                isDragging={isDragging}
                onSelect={handleSelectProject}
                onOpenModal={handleOpenProjectModal}
              />
            ))}
          </div>
        </div>

        {/* 4. Apple TV-style Timeline Track / Pagination */}
        <CoverflowPagination
          projects={projects}
          activeIndex={activeIndex}
          onSelectIndex={(idx) => handleSelectProject(projects[idx], idx)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>

      {/* 6. Cinematic Expanded Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </Section>
  );
}
