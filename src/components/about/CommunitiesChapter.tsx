import type { EducationData } from '@/data/education';

interface CommunitiesChapterProps {
  data: EducationData['communities'];
}

function AIClubIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="5" r="3.2" stroke="#E50914" strokeWidth="1.8" />
      <circle cx="5" cy="21" r="3.2" stroke="#FFFFFF" strokeWidth="1.8" />
      <circle cx="23" cy="21" r="3.2" stroke="#FFFFFF" strokeWidth="1.8" />
      <circle cx="14" cy="14" r="2.2" fill="#E50914" />
      <line x1="14" y1="8.2" x2="14" y2="11.8" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.4" />
      <line x1="12" y1="15.5" x2="7.5" y2="19" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.4" />
      <line x1="16" y1="15.5" x2="20.5" y2="19" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.4" />
    </svg>
  );
}

function GDGIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      {/* Left chevron < in Google Red & Blue */}
      <path d="M12 9L5 16L12 23" stroke="#4285F4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Right chevron > in Google Green & Yellow */}
      <path d="M20 9L27 16L20 23" stroke="#EA4335" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Slash / in Green and Yellow accents */}
      <line x1="18" y1="9" x2="14" y2="23" stroke="#34A853" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function CommunitiesChapter({ data }: CommunitiesChapterProps) {
  return (
    <div className="academic-chapter-card academic-chapter-card--communities">
      {/* Chapter Kicker & Header */}
      <div className="academic-chapter-header">
        <span className="academic-chapter-kicker">CHAPTER 03 // BEYOND THE CLASSROOM</span>

        <div className="academic-institution-group">
          <h3 className="academic-institution-title">{data.title}</h3>
          <p className="academic-chapter-subtitle">&ldquo;{data.subtitle}&rdquo;</p>
        </div>
      </div>

      {/* Two Distinct Community Cards */}
      <div className="academic-communities-grid">
        {data.entries.map((entry) => {
          const isAI = entry.id === 'ai-club';
          return (
            <div key={entry.id} className="academic-community-entry">
              <div className="community-entry-header">
                <div className="community-icon-wrapper">
                  {isAI ? <AIClubIcon /> : <GDGIcon />}
                </div>

                <div className="community-meta">
                  <span className="community-tag">{entry.tag}</span>
                  <h4 className="community-name">{entry.name}</h4>
                  <p className="community-affiliation">{entry.affiliation}</p>
                </div>
              </div>

              <p className="community-description">{entry.description}</p>

              <div className="community-footer">
                <span className="community-status-badge">
                  <span className="status-dot" />
                  <span>{entry.subtitle}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

