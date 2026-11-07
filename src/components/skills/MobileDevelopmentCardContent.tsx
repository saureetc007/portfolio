import { useState } from 'react';
import { SkillIcon } from './SkillIcons';

export function MobileDevelopmentCardContent() {
  const [activeScreen, setActiveScreen] = useState<'feed' | 'player' | 'hotreload'>('feed');
  const [isDynamicIslandExpanded, setIsDynamicIslandExpanded] = useState<boolean>(false);

  return (
    <div className="mobile-card-content motion-primitives-phone">
      {/* 1. 3D Depth Smartphone Chassis */}
      <div className="smartphone-chassis">
        {/* Specular Light Reflection Sheen */}
        <div className="phone-specular-sheen" aria-hidden="true" />

        {/* Dynamic Island (Motion Primitives inspired expandable pill) */}
        <button
          type="button"
          className={`phone-top-island ${isDynamicIslandExpanded ? 'is-expanded' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            setIsDynamicIslandExpanded((prev) => !prev);
          }}
          title="Tap Dynamic Island to toggle notification"
          aria-label="Toggle Dynamic Island notification"
        >
          {isDynamicIslandExpanded ? (
            <div className="island-expanded-content">
              <span className="island-dot-live" />
              <span className="island-text">Flutter 3.x AOT (60 FPS)</span>
              <span className="island-badge">OK</span>
            </div>
          ) : (
            <>
              <span className="island-pill" />
              <span className="camera-lens" />
            </>
          )}
        </button>

        {/* Mobile Status Bar */}
        <div className="phone-status-bar" aria-hidden="true">
          <span className="phone-time">9:41</span>
          <div className="phone-icons">
            <span className="status-signal">5G</span>
            <span className="status-battery">
              <span className="battery-level" />
            </span>
          </div>
        </div>

        {/* Mobile Screen Viewport */}
        <div className="phone-screen">
          {/* Mobile App Bar */}
          <div className="phone-app-bar">
            <div className="app-brand">
              <SkillIcon name="flutter" size={14} />
              <span>Saureet.mobile</span>
            </div>
            <span className="hot-reload-pill">⚡ FLUTTER</span>
          </div>

          {/* Screen Content with Motion Primitives transition */}
          <div className="phone-body">
            {activeScreen === 'feed' && (
              <div className="phone-screen-view phone-screen-view--feed">
                <div className="feed-card">
                  <div className="feed-header">
                    <span className="feed-dot" />
                    <span className="feed-title">DecisionVault Mobile</span>
                  </div>
                  <p className="feed-desc">Local ADR review on iOS & Android.</p>
                  <div className="feed-meta">
                    <span className="feed-badge">Dart 3.5</span>
                    <span className="feed-status">Synced</span>
                  </div>
                </div>

                <div className="feed-card feed-card--compact">
                  <span className="feed-title">Cognitive Assist UI</span>
                  <span className="feed-status feed-status--green">Active</span>
                </div>
              </div>
            )}

            {activeScreen === 'player' && (
              <div className="phone-screen-view phone-screen-view--player">
                <div className="mini-player-artwork">
                  <div className="artwork-icon">
                    <SkillIcon name="flutter" size={24} />
                  </div>
                </div>
                <div className="player-meta">
                  <span className="player-track">Cinematic Ambience</span>
                  <span className="player-artist">Flutter Audio Engine</span>
                </div>
                <div className="player-scrubber">
                  <div className="scrubber-fill" style={{ width: '65%' }} />
                </div>
              </div>
            )}

            {activeScreen === 'hotreload' && (
              <div className="phone-screen-view phone-screen-view--terminal">
                <div className="phone-terminal-box">
                  <span className="term-line-1">$ flutter run -d mobile</span>
                  <span className="term-line-2">Syncing files to device...</span>
                  <span className="term-line-3">✓ Hot reload in 184ms!</span>
                  <span className="term-line-4">FPS: 60.0 (AOT Native)</span>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Bottom Navigation Bar (Motion Primitives interactive tabs) */}
          <div className="phone-bottom-nav" role="tablist" aria-label="Mobile App Navigation">
            <button
              type="button"
              role="tab"
              aria-selected={activeScreen === 'feed'}
              className={`nav-tab-btn ${activeScreen === 'feed' ? 'is-active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveScreen('feed');
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="nav-svg">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
              <span>Feed</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeScreen === 'player'}
              className={`nav-tab-btn ${activeScreen === 'player' ? 'is-active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveScreen('player');
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="nav-svg">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
              </svg>
              <span>Player</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeScreen === 'hotreload'}
              className={`nav-tab-btn ${activeScreen === 'hotreload' ? 'is-active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveScreen('hotreload');
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="nav-svg">
                <polyline points="4 17 10 11 4 5" />
                <line x1="12" y1="19" x2="20" y2="19" />
              </svg>
              <span>Reload</span>
            </button>
          </div>

          {/* Home Indicator Bar */}
          <div className="phone-home-indicator" aria-hidden="true" />
        </div>
      </div>

      {/* 2. Flutter & Dart Cross-Platform Branding */}
      <div className="mobile-branding-row">
        <div className="brand-chip">
          <SkillIcon name="flutter" size={13} />
          <span>Flutter 3.x Native</span>
        </div>
        <div className="brand-chip">
          <SkillIcon name="dart" size={13} />
          <span>Dart AOT (60 FPS)</span>
        </div>
      </div>
    </div>
  );
}
