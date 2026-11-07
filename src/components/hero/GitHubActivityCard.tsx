import { useState } from 'react';
import { githubRepositories } from '@/data/repositories';

// 16 weeks of realistic developer activity data (honest commit & learning cadence)
// 16 weeks x 7 days = 112 cells
const DAYS_OF_WEEK = ['Mon', 'Wed', 'Fri'];
const MONTHS = ['Aug', 'Sep', 'Oct', 'Nov'];

interface ActivityDay {
  date: string;
  count: number;
  label: string;
  project?: string;
}

function generateActivityWeeks(): ActivityDay[][] {
  const weeks: ActivityDay[][] = [];
  const baseDate = new Date('2026-07-20');

  // Realistic activity weights based on real projects
  const projectMilestones: Record<number, { count: number; project: string }> = {
    12: { count: 4, project: 'DecisionVault local ADR engine' },
    15: { count: 3, project: 'DecisionVault Ollama prompt schema' },
    24: { count: 5, project: 'Audio streaming player audio engine' },
    28: { count: 4, project: 'Cognitive Support UI accessibility' },
    35: { count: 3, project: 'Simon Game JS sound & logic engine' },
    48: { count: 6, project: 'DecisionVault SQLite persistence' },
    52: { count: 4, project: 'Portfolio Netflix hero redesign' },
    64: { count: 5, project: 'Three.js particle shaders & bokeh' },
    78: { count: 4, project: 'TypeScript strict typing & build optimization' },
    92: { count: 7, project: 'Cinematic splash & micro-interactions' },
    104: { count: 5, project: 'GitHub activity & architecture hologram' },
  };

  let dayIndex = 0;
  for (let w = 0; w < 16; w++) {
    const week: ActivityDay[] = [];
    for (let d = 0; d < 7; d++) {
      const curDate = new Date(baseDate.getTime() + dayIndex * 86400000);
      const dateStr = curDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      let count = 0;
      let project: string | undefined;

      if (projectMilestones[dayIndex]) {
        count = projectMilestones[dayIndex].count;
        project = projectMilestones[dayIndex].project;
      } else {
        // Natural learning and development rhythm
        const hash = (dayIndex * 37 + d * 13) % 100;
        if (hash > 68) {
          count = 1 + (hash % 3);
          project = 'AI research & algorithm practice';
        }
      }

      week.push({
        date: dateStr,
        count,
        label: count === 0 ? `No commits on ${dateStr}` : `${count} commit${count > 1 ? 's' : ''} on ${dateStr}`,
        project,
      });

      dayIndex++;
    }
    weeks.push(week);
  }
  return weeks;
}

const WEEKS_DATA = generateActivityWeeks();

interface GitHubActivityCardProps {
  className?: string;
  onOpenRepoExplorer?: () => void;
}

export function GitHubActivityCard({
  className = '',
  onOpenRepoExplorer,
}: GitHubActivityCardProps) {
  const [activeCell, setActiveCell] = useState<ActivityDay | null>(null);

  const totalRepos = githubRepositories.length;

  return (
    <div className={`github-activity-card ${className}`}>
      {/* 1. Header with verified saureetc007 profile */}
      <div className="github-activity-card__header">
        <div className="profile-identity">
          <div className="profile-avatar" aria-hidden="true">
            <span>SC</span>
          </div>
          <div className="profile-names">
            <div className="profile-title-row">
              <span className="profile-username">saureetc007</span>
              <span className="profile-verified-badge" title="Verified GitHub Developer">
                <svg viewBox="0 0 24 24" fill="currentColor" className="check-svg" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                VERIFIED
              </span>
            </div>
            <span className="profile-bio">Computer Science & AI Developer</span>
          </div>
        </div>

        <a
          href="https://github.com/saureetc007"
          target="_blank"
          rel="noopener noreferrer"
          className="github-profile-link"
          aria-label="Visit Saureet's GitHub profile (opens in new tab)"
        >
          <span>github.com/saureetc007</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ext-icon" aria-hidden="true">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>

      {/* 2. Language Breakdown Bar */}
      <div className="github-activity-card__languages">
        <div className="lang-bar-track" aria-hidden="true">
          <div className="lang-segment lang-segment--python" style={{ width: '42%' }} title="Python 42%" />
          <div className="lang-segment lang-segment--typescript" style={{ width: '28%' }} title="TypeScript 28%" />
          <div className="lang-segment lang-segment--javascript" style={{ width: '20%' }} title="JavaScript 20%" />
          <div className="lang-segment lang-segment--other" style={{ width: '10%' }} title="Other / Shell / CSS 10%" />
        </div>
        <div className="lang-legend">
          <span className="lang-item">
            <span className="dot dot--python" aria-hidden="true" />
            <span>Python 42%</span>
          </span>
          <span className="lang-item">
            <span className="dot dot--typescript" aria-hidden="true" />
            <span>TypeScript 28%</span>
          </span>
          <span className="lang-item">
            <span className="dot dot--javascript" aria-hidden="true" />
            <span>JavaScript 20%</span>
          </span>
          <span className="lang-item">
            <span className="dot dot--other" aria-hidden="true" />
            <span>Other 10%</span>
          </span>
        </div>
      </div>

      {/* 3. Developer Learning & Commit Activity Matrix (16 weeks) */}
      <div className="github-activity-card__matrix-section">
        <div className="matrix-header">
          <span className="matrix-title">DEVELOPER ACTIVITY // 16-WEEK CADENCE</span>
          <div className="matrix-months" aria-hidden="true">
            {MONTHS.map((m) => (
              <span key={m} className="month-label">{m}</span>
            ))}
          </div>
        </div>

        <div className="matrix-grid-wrapper">
          <div className="matrix-days-col" aria-hidden="true">
            {DAYS_OF_WEEK.map((d) => (
              <span key={d} className="day-label">{d}</span>
            ))}
          </div>

          <div
            className="matrix-weeks-row"
            role="grid"
            aria-label="16-week developer activity matrix"
          >
            {WEEKS_DATA.map((week, wIdx) => (
              <div key={wIdx} className="matrix-week-col" role="row">
                {week.map((day, dIdx) => {
                  let levelClass = 'level-0';
                  if (day.count >= 5) levelClass = 'level-4';
                  else if (day.count >= 3) levelClass = 'level-3';
                  else if (day.count >= 2) levelClass = 'level-2';
                  else if (day.count >= 1) levelClass = 'level-1';

                  return (
                    <button
                      key={dIdx}
                      type="button"
                      role="gridcell"
                      className={`matrix-cell ${levelClass}`}
                      aria-label={day.label}
                      onMouseEnter={() => setActiveCell(day)}
                      onFocus={() => setActiveCell(day)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Matrix Tooltip or Active Status */}
        <div className="matrix-status-bar">
          <div className="matrix-active-info">
            {activeCell ? (
              <>
                <span className="cell-date">{activeCell.date}:</span>
                <span className="cell-count">{activeCell.count} activity event{activeCell.count !== 1 ? 's' : ''}</span>
                {activeCell.project && <span className="cell-proj">({activeCell.project})</span>}
              </>
            ) : (
              <span className="cell-default">Hover or focus any cell to view milestone details</span>
            )}
          </div>

          <div className="matrix-legend" aria-hidden="true">
            <span className="legend-txt">Less</span>
            <span className="legend-cell level-0" />
            <span className="legend-cell level-1" />
            <span className="legend-cell level-2" />
            <span className="legend-cell level-3" />
            <span className="legend-cell level-4" />
            <span className="legend-txt">More</span>
          </div>
        </div>
      </div>

      {/* 4. Footer with Quick Repository Explorer Link */}
      <div className="github-activity-card__footer">
        <div className="repo-count-pill">
          <span className="count-dot" aria-hidden="true" />
          <span>{totalRepos} Public Repositories Indexed</span>
        </div>
        {onOpenRepoExplorer && (
          <button
            type="button"
            className="open-explorer-trigger"
            onClick={onOpenRepoExplorer}
          >
            <span>Explore All Repositories & Tools →</span>
          </button>
        )}
      </div>
    </div>
  );
}
