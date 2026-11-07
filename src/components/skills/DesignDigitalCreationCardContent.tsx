import { useState, useEffect, useRef } from 'react';
import { SkillIcon } from './SkillIcons';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function DesignDigitalCreationCardContent() {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playheadPos, setPlayheadPos] = useState<number>(38); // percentage (0 - 100)
  const prefersReducedMotion = useReducedMotion();
  const animFrameRef = useRef<number | null>(null);

  // Coordinated playback loop
  useEffect(() => {
    if (prefersReducedMotion || !isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let lastTime = performance.now();
    const speed = 0.016; // percent per ms (~6 seconds per loop)

    const tick = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;

      setPlayheadPos((prev) => {
        const next = prev + delta * speed;
        return next >= 98 ? 2 : next;
      });

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, prefersReducedMotion]);

  const formatTimecode = (pct: number) => {
    const totalFrames = Math.floor((pct / 100) * 180);
    const sec = Math.floor(totalFrames / 30);
    const frames = totalFrames % 30;
    return `00:00:0${sec}:${frames < 10 ? `0${frames}` : frames}`;
  };

  return (
    <div className="design-card-content gsap-timeline-container">
      {/* 1. Header Toolbar with Play / Pause / Timecode */}
      <div className="design-card-content__header">
        <div className="design-mode-badges">
          <span className="workspace-badge">CREATIVE TIMELINE</span>
          <span className="timeline-tc">{formatTimecode(playheadPos)}</span>
        </div>

        <div className="design-tools-row">
          <button
            type="button"
            className="timeline-play-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying((prev) => !prev);
            }}
            aria-label={isPlaying ? 'Pause timeline playback' : 'Start timeline playback'}
            title={isPlaying ? 'Pause timeline playback' : 'Start timeline playback'}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10" aria-hidden="true">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10" aria-hidden="true">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </button>
          <span className="fps-badge">60 FPS</span>
        </div>
      </div>

      {/* 2. Top: Mini UI Artboard & Prototype Flow (UI/UX, Interface Design, Prototyping) */}
      <div className="design-artboard-strip">
        <div className="artboard-canvas-mini">
          <div className="canvas-card canvas-card--selected">
            <div className="selection-handle handle-tl" />
            <div className="selection-handle handle-tr" />
            <div className="selection-handle handle-bl" />
            <div className="selection-handle handle-br" />
            <div className="canvas-mini-wireframe">
              <div className="wf-bar" />
              <div className="wf-circle" />
              <div className="wf-text" />
            </div>
          </div>

          {/* Prototype animated noodle linking artboards */}
          <svg className="prototype-noodle-svg" viewBox="0 0 70 30" aria-hidden="true">
            <path
              d="M 5 15 C 25 5, 45 25, 65 15"
              fill="none"
              stroke="#9999FF"
              strokeWidth="1.5"
              strokeDasharray="3,3"
              className="prototype-flow-path"
            />
            <circle cx="65" cy="15" r="2.5" fill="#9999FF" />
          </svg>

          <div className="canvas-card canvas-card--secondary">
            <span className="canvas-badge">MODAL_SPEC</span>
            <span className="canvas-coord">Vector 100%</span>
          </div>
        </div>
      </div>

      {/* 3. Center: Coordinated Multi-Track Video & Motion Timeline */}
      <div
        className="video-timeline-editor"
        onClick={(e) => {
          // Click on timeline to scrub playhead directly
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const newPct = Math.max(2, Math.min(98, (clickX / rect.width) * 100));
          setPlayheadPos(newPct);
        }}
        title="Click anywhere to scrub playhead"
      >
        <div className="timeline-track-list">
          {/* Track 1: Video (Premiere Pro) */}
          <div className="timeline-track">
            <div className="track-label">
              <SkillIcon name="adobepremierepro" size={11} />
              <span>V1</span>
            </div>
            <div className="track-lane">
              <div className="clip-block clip-block--video" style={{ width: '58%' }}>
                <span className="clip-name">hero_cinematic.mp4</span>
              </div>
              <div className="clip-block clip-block--video-cut" style={{ width: '38%' }}>
                <span className="clip-name">b-roll_cut.mp4</span>
              </div>
            </div>
          </div>

          {/* Track 2: Motion Graphics (After Effects) */}
          <div className="timeline-track">
            <div className="track-label">
              <SkillIcon name="adobeaftereffects" size={11} />
              <span>G1</span>
            </div>
            <div className="track-lane">
              <div className="clip-block clip-block--motion" style={{ width: '78%' }}>
                <span className="clip-name">kinetic_typography_comp</span>
                <div className="keyframes-row" aria-hidden="true">
                  <span className="keyframe-diamond" style={{ left: '15%' }}>◆</span>
                  <span className="keyframe-diamond" style={{ left: '50%' }}>◆</span>
                  <span className="keyframe-diamond" style={{ left: '85%' }}>◆</span>
                </div>
              </div>
            </div>
          </div>

          {/* Track 3: Audio Waveform */}
          <div className="timeline-track">
            <div className="track-label">
              <span>A1</span>
            </div>
            <div className="track-lane">
              <div className="clip-block clip-block--audio" style={{ width: '96%' }}>
                <div className="waveform-bars" aria-hidden="true">
                  <span style={{ height: '35%' }} />
                  <span style={{ height: '70%' }} />
                  <span style={{ height: '95%' }} />
                  <span style={{ height: '40%' }} />
                  <span style={{ height: '80%' }} />
                  <span style={{ height: '100%' }} />
                  <span style={{ height: '55%' }} />
                  <span style={{ height: '90%' }} />
                  <span style={{ height: '30%' }} />
                  <span style={{ height: '75%' }} />
                  <span style={{ height: '85%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrubbing Playhead */}
        <div
          className="timeline-playhead"
          style={{ left: `${playheadPos}%` }}
          aria-hidden="true"
        >
          <div className="playhead-top-arrow" />
        </div>
      </div>

      {/* 4. Bottom: Cloud Deployment Indicators (Vercel & Netlify) */}
      <div className="design-card-content__deploy-bar">
        <div className="deploy-pill">
          <SkillIcon name="vercel" size={11} />
          <span>Vercel Edge (12ms)</span>
        </div>
        <div className="deploy-pill">
          <SkillIcon name="netlify" size={11} />
          <span>Netlify CDN</span>
        </div>
        <span className="deploy-live-status">● Live</span>
      </div>
    </div>
  );
}
