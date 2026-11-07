import { useState, useEffect } from 'react';
import { useGamification } from '@/hooks/useGamification';
import { ACHIEVEMENTS, CORE_SECTIONS, gamification } from '@/lib/gamification';

const SECTION_LABELS: Record<string, string> = {
  top: 'Command Center (Hero)',
  skills: 'Technical Skills (Bento)',
  projects: 'Coverflow Projects (3D)',
  universe: 'Spatial Universe (3D)',
  about: 'Academic Journey 2.0',
  contact: 'Direct Transmission (Contact)',
};

export function ExplorationHUD() {
  const { progress, unlockedAchievements, activeToast, dismissToast } = useGamification();
  const [isExpanded, setIsExpanded] = useState(false);
  const [easterEggMsg, setEasterEggMsg] = useState<string | null>(null);

  // Listen for easter egg events
  useEffect(() => {
    const handleEasterEgg = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string }>;
      setEasterEggMsg(customEvent.detail.message);
      const timer = setTimeout(() => {
        setEasterEggMsg(null);
      }, 5000);
      return () => clearTimeout(timer);
    };

    window.addEventListener('portfolio-easter-egg', handleEasterEgg);
    return () => window.removeEventListener('portfolio-easter-egg', handleEasterEgg);
  }, []);

  const totalAchievements = Object.keys(ACHIEVEMENTS).length;
  const unlockedCount = unlockedAchievements.size;
  const exploredSet = gamification.getExploredSections();

  return (
    <>
      {/* ====================================================================
          1. FLOATING EXPLORATION PILL & DRAWER
          ==================================================================== */}
      <div
        className={`exploration-hud ${isExpanded ? 'is-expanded' : ''}`}
        aria-label="Portfolio Exploration HUD"
      >
        {/* Collapsed Pill Trigger */}
        <button
          type="button"
          className="exploration-hud__pill"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
          aria-controls="exploration-panel"
          title="Toggle Portfolio Exploration Progress"
        >
          <span className="exploration-hud__icon" aria-hidden="true">
            🧭
          </span>
          <div className="exploration-hud__pill-text">
            <span className="exploration-hud__pill-label">EXPLORATION</span>
            <span className="exploration-hud__pill-pct">{progress}%</span>
          </div>

          <div className="exploration-hud__mini-track" aria-hidden="true">
            <div
              className="exploration-hud__mini-bar"
              style={{ width: `${progress}%` }}
            />
          </div>

          <span className="exploration-hud__chevron" aria-hidden="true">
            {isExpanded ? '▾' : '▴'}
          </span>
        </button>

        {/* Expanded Drawer Details */}
        {isExpanded && (
          <div
            id="exploration-panel"
            className="exploration-hud__drawer"
            role="region"
            aria-label="Exploration Status & Achievements"
          >
            <div className="exploration-hud__drawer-header">
              <div>
                <span className="exploration-hud__drawer-eyebrow">// RECON TELEMETRY</span>
                <h4 className="exploration-hud__drawer-title">Portfolio Exploration</h4>
              </div>
              <button
                type="button"
                className="exploration-hud__close-btn"
                onClick={() => setIsExpanded(false)}
                aria-label="Close Exploration Panel"
              >
                ✕
              </button>
            </div>

            {/* Progress Bar */}
            <div className="exploration-hud__progress-container">
              <div className="exploration-hud__progress-meta">
                <span>SECTORS CATALOGUED</span>
                <span className="exploration-hud__pct-large">{progress}%</span>
              </div>
              <div className="exploration-hud__full-track" aria-hidden="true">
                <div
                  className="exploration-hud__full-bar"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Sectors Checklist */}
            <div className="exploration-hud__sectors-list">
              <span className="exploration-hud__subheading">CORE SECTORS</span>
              {CORE_SECTIONS.map((secId) => {
                const isVisited = exploredSet.has(secId);
                return (
                  <div
                    key={secId}
                    className={`exploration-hud__sector-item ${
                      isVisited ? 'is-visited' : 'is-pending'
                    }`}
                  >
                    <span className="exploration-hud__check">
                      {isVisited ? '✓' : '○'}
                    </span>
                    <span className="exploration-hud__sector-name">
                      {SECTION_LABELS[secId]}
                    </span>
                    <span className="exploration-hud__sector-status">
                      {isVisited ? 'VISITED' : 'UNEXPLORED'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Achievements Grid */}
            <div className="exploration-hud__achievements-wrapper">
              <div className="exploration-hud__achievements-header">
                <span className="exploration-hud__subheading">DISCOVERY BADGES</span>
                <span className="exploration-hud__badge-count">
                  {unlockedCount} / {totalAchievements}
                </span>
              </div>

              <div className="exploration-hud__achievements-grid">
                {Object.values(ACHIEVEMENTS).map((ach) => {
                  const isUnlocked = unlockedAchievements.has(ach.id);
                  return (
                    <div
                      key={ach.id}
                      className={`exploration-hud__badge ${
                        isUnlocked ? 'is-unlocked' : 'is-locked'
                      }`}
                      title={isUnlocked ? ach.description : 'Undiscovered achievement'}
                    >
                      <span className="exploration-hud__badge-icon">
                        {isUnlocked ? ach.icon : '🔒'}
                      </span>
                      <div className="exploration-hud__badge-info">
                        <span className="exploration-hud__badge-title">
                          {ach.title}
                        </span>
                        <span className="exploration-hud__badge-desc">
                          {isUnlocked ? ach.description : 'Hidden discovery'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ====================================================================
          2. ACHIEVEMENT UNLOCKED POPUP TOAST
          ==================================================================== */}
      {activeToast && (
        <div
          className="achievement-toast"
          role="status"
          aria-live="polite"
        >
          <div className="achievement-toast__accent-bar" aria-hidden="true" />
          <div className="achievement-toast__icon" aria-hidden="true">
            {activeToast.icon}
          </div>
          <div className="achievement-toast__content">
            <span className="achievement-toast__eyebrow">ACHIEVEMENT UNLOCKED</span>
            <h5 className="achievement-toast__title">{activeToast.title}</h5>
            <p className="achievement-toast__desc">{activeToast.description}</p>
          </div>
          <button
            type="button"
            className="achievement-toast__dismiss"
            onClick={dismissToast}
            aria-label="Dismiss Achievement Notice"
          >
            ✕
          </button>
        </div>
      )}

      {/* ====================================================================
          3. HIDDEN EASTER EGG TOAST
          ==================================================================== */}
      {easterEggMsg && (
        <div
          className="easter-egg-toast"
          role="status"
          aria-live="polite"
        >
          <div className="easter-egg-toast__icon" aria-hidden="true">
            💡
          </div>
          <div className="easter-egg-toast__content">
            <span className="easter-egg-toast__eyebrow">// SECRET DEVELOPER LOG</span>
            <p className="easter-egg-toast__text">{easterEggMsg}</p>
          </div>
          <button
            type="button"
            className="achievement-toast__dismiss"
            onClick={() => setEasterEggMsg(null)}
            aria-label="Dismiss Easter Egg Notice"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
