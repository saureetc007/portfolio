import { useState } from 'react';
import { SkillIcon } from './SkillIcons';

export function WebDevelopmentCardContent() {
  const [activeMode, setActiveMode] = useState<'preview' | 'tailwind' | 'grid'>('preview');
  const [viewportSize, setViewportSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  return (
    <div className="web-card-content magicui-browser">
      {/* 1. Magic UI Safari / Browser Window Chrome */}
      <div className="browser-chrome">
        <div className="browser-dots" aria-hidden="true">
          <span className="dot dot--red" />
          <span className="dot dot--yellow" />
          <span className="dot dot--green" />
        </div>

        {/* Address Bar */}
        <div className="browser-address-bar">
          <svg className="lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className="address-text">https://saureet.dev/ui-system</span>
          <span className="badge-live">200 OK</span>
        </div>

        {/* Responsive Viewport Switcher (Magic UI style interactive controls) */}
        <div className="browser-viewport-controls" aria-label="Simulate Viewport Breakpoints">
          <button
            type="button"
            className={`viewport-btn ${viewportSize === 'desktop' ? 'is-active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setViewportSize('desktop');
            }}
            title="Desktop Breakpoint (1024px+)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </button>
          <button
            type="button"
            className={`viewport-btn ${viewportSize === 'tablet' ? 'is-active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setViewportSize('tablet');
            }}
            title="Tablet Breakpoint (768px)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11">
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
          </button>
          <button
            type="button"
            className={`viewport-btn ${viewportSize === 'mobile' ? 'is-active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setViewportSize('mobile');
            }}
            title="Mobile Breakpoint (375px)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="10" height="10">
              <rect x="6" y="2" width="12" height="20" rx="2" ry="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
          </button>
        </div>

        {/* Mode Toggles */}
        <div className="browser-mode-toggle">
          <button
            type="button"
            className={`mode-btn ${activeMode === 'preview' ? 'is-active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setActiveMode('preview');
            }}
          >
            UI
          </button>
          <button
            type="button"
            className={`mode-btn ${activeMode === 'tailwind' ? 'is-active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setActiveMode('tailwind');
            }}
          >
            Tailwind
          </button>
        </div>
      </div>

      {/* 2. Miniature Website Viewport with fluid breakpoint container */}
      <div className={`browser-viewport browser-viewport--${viewportSize}`}>
        {activeMode === 'preview' && (
          <div className="mini-site">
            {/* Mini Navigation Bar */}
            <div className="mini-site__nav">
              <div className="mini-site__logo">
                <span className="mini-logo-dot" />
                <span className="mini-logo-text">SAUREET.UI</span>
              </div>
              <div className="mini-site__links">
                <span className="mini-link is-active">Overview</span>
                <span className="mini-link">Tokens</span>
                <span className="mini-link">Fluid CSS</span>
              </div>
            </div>

            {/* Mini Hero Card with Magic UI Shimmer Effect */}
            <div className="mini-site__hero-card">
              <div className="mini-site__badge">
                <span className="mini-badge-glow" />
                <span>FLUID CSS & TAILWIND v3.4</span>
              </div>
              <h4 className="mini-site__title">Streaming Web Architecture</h4>
              <p className="mini-site__p">Semantic HTML5 tree with responsive CSS clamp() scaling.</p>

              {/* Shimmer Buttons */}
              <div className="mini-site__actions">
                <span className="mini-btn magic-shimmer-btn">
                  <SkillIcon name="tailwindcss" size={12} />
                  <span>Tailwind Utility</span>
                  <span className="shimmer-sparkle" aria-hidden="true" />
                </span>
                <span className="mini-btn mini-btn--secondary">
                  <SkillIcon name="html" size={12} />
                  <span>HTML5 Standard</span>
                </span>
              </div>
            </div>

            {/* Mini CSS Grid Visualizer */}
            <div className="mini-site__grid-row">
              <div className="mini-grid-cell">
                <span className="cell-tag">&lt;header&gt;</span>
                <span className="cell-bar" />
              </div>
              <div className="mini-grid-cell mini-grid-cell--accent">
                <span className="cell-tag">&lt;main grid-12&gt;</span>
                <span className="cell-bar cell-bar--red" />
              </div>
              <div className="mini-grid-cell">
                <span className="cell-tag">&lt;footer&gt;</span>
                <span className="cell-bar" />
              </div>
            </div>
          </div>
        )}

        {activeMode === 'tailwind' && (
          <div className="mini-tailwind-view">
            <div className="tailwind-header">
              <span className="tw-badge">TAILWIND UTILITY SPEC</span>
              <span className="tw-version">v3.4 Production</span>
            </div>
            <div className="tailwind-classes-cloud">
              <span className="tw-pill">grid-cols-12</span>
              <span className="tw-pill tw-pill--accent">gap-4</span>
              <span className="tw-pill">backdrop-blur-xl</span>
              <span className="tw-pill tw-pill--red">bg-red-950/20</span>
              <span className="tw-pill tw-pill--red">border-red-500/30</span>
              <span className="tw-pill">text-white</span>
              <span className="tw-pill">hover:scale-[1.02]</span>
              <span className="tw-pill">transition-all</span>
              <span className="tw-pill">ease-out</span>
              <span className="tw-pill">clamp(1rem,2.5vw,1.75rem)</span>
            </div>
            <div className="tailwind-metrics">
              <div className="tw-metric">
                <span className="k">BUNDLE SIZE</span>
                <span className="v">3.8 KB (JIT Purged)</span>
              </div>
              <div className="tw-metric">
                <span className="k">CONTRAST</span>
                <span className="v">WCAG AAA (14.2:1)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
