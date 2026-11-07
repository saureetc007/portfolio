export interface CoverflowAutoplayControlsProps {
  currentIndex: number;
  totalCards: number;
  isPlaying: boolean;
  isPausedByUser: boolean;
  progressPercent: number; // 0 to 100
  onTogglePlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
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

/**
 * CoverflowAutoplayControls — Apple TV-style Cinematic Navigation Bar
 * Features position counter, 8s progress bar, Play/Pause toggle, and Chevrons.
 */
export function CoverflowAutoplayControls({
  currentIndex,
  totalCards,
  isPlaying,
  isPausedByUser,
  progressPercent,
  onTogglePlayPause,
  onPrev,
  onNext,
}: CoverflowAutoplayControlsProps) {
  const formattedCurrent = currentIndex + 1 < 10 ? `0${currentIndex + 1}` : `${currentIndex + 1}`;
  const formattedTotal = totalCards < 10 ? `0${totalCards}` : `${totalCards}`;

  const isActuallyRunning = isPlaying && !isPausedByUser;

  return (
    <div className="coverflow-top-controls" aria-label="3D Coverflow showcase controls">
      {/* Position Counter Badge */}
      <span className="coverflow-counter-badge" aria-live="polite">
        <span className="current-idx">{formattedCurrent}</span>
        <span className="separator">/</span>
        <span className="total-idx">{formattedTotal}</span>
      </span>

      {/* Cinematic 8-Second Progress Bar */}
      <div
        className={`coverflow-progress-wrapper ${isActuallyRunning ? 'is-active-timer' : 'is-paused-timer'}`}
        title={isActuallyRunning ? `Showcase active: ${Math.round(8 * (1 - progressPercent / 100))}s remaining` : 'Showcase paused'}
        aria-hidden="true"
      >
        <div
          className="coverflow-progress-fill"
          style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
        />
      </div>

      {/* Play / Pause Toggle Button */}
      <button
        type="button"
        className={`coverflow-nav-btn coverflow-autoplay-btn ${isActuallyRunning ? 'is-playing' : 'is-paused'}`}
        onClick={onTogglePlayPause}
        aria-label={isActuallyRunning ? 'Pause automatic project showcase' : 'Resume automatic project showcase (8s per card)'}
        title={isActuallyRunning ? 'Pause automatic showcase' : 'Play automatic showcase (8s)'}
      >
        {isActuallyRunning ? <PauseIcon /> : <PlayIcon />}
      </button>

      {/* Previous Card Button */}
      <button
        type="button"
        className="coverflow-nav-btn"
        onClick={onPrev}
        aria-label="Previous project in Coverflow (Arrow Left)"
        title="Previous project"
      >
        <ChevronLeft />
      </button>

      {/* Next Card Button */}
      <button
        type="button"
        className="coverflow-nav-btn"
        onClick={onNext}
        aria-label="Next project in Coverflow (Arrow Right)"
        title="Next project"
      >
        <ChevronRight />
      </button>
    </div>
  );
}

