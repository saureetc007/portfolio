import type { Project } from '@/types/content';

export interface CoverflowPaginationProps {
  projects: Project[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
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
 * CoverflowPagination — Interactive Apple TV-style timeline scrubber & navigation controls
 */
export function CoverflowPagination({
  projects,
  activeIndex,
  onSelectIndex,
  onPrev,
  onNext,
}: CoverflowPaginationProps) {
  return (
    <nav className="coverflow-pagination" aria-label="Project carousel pagination and controls">
      <button
        type="button"
        className="coverflow-nav-btn"
        onClick={onPrev}
        aria-label="Previous project in Coverflow"
        title="Previous project (Arrow Left)"
      >
        <ChevronLeft />
      </button>

      <div className="coverflow-pagination__track" role="tablist" aria-label="Jump directly to project rank">
        {projects.map((p, idx) => {
          const isActive = idx === activeIndex;
          const formatted = p.rank < 10 ? `0${p.rank}` : `${p.rank}`;
          return (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Jump to #${p.rank}: ${p.title}`}
              className={`coverflow-pagination__dot ${isActive ? 'is-active' : ''}`}
              onClick={() => onSelectIndex(idx)}
            >
              <span>{formatted}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="coverflow-nav-btn"
        onClick={onNext}
        aria-label="Next project in Coverflow"
        title="Next project (Arrow Right)"
      >
        <ChevronRight />
      </button>
    </nav>
  );
}

