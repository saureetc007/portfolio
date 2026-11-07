import type { EducationData } from '@/data/education';

interface EngineeringChapterProps {
  data: EducationData['engineering'];
  isActive: boolean;
}

export function EngineeringChapter({ data, isActive }: EngineeringChapterProps) {
  return (
    <article
      className={`academic-chapter-card academic-chapter-card--engineering ${
        isActive ? 'is-active' : ''
      }`}
    >
      {/* Restrained blueprint grid overlay */}
      <div className="academic-blueprint-grid" aria-hidden="true" />
      <div className="academic-ambient-flare" aria-hidden="true" />

      {/* Chapter Kicker & Live Status */}
      <div className="academic-chapter-header">
        <div className="academic-chapter-meta">
          <span className="academic-chapter-kicker academic-chapter-kicker--active">
            CHAPTER 02 // HIGHER EDUCATION
          </span>

          <span className="academic-status-badge academic-status-badge--active">
            <span className="academic-live-beacon" />
            <span>{data.standing.toUpperCase()} — {data.status.toUpperCase()}</span>
          </span>
        </div>

        <div className="academic-institution-group">
          <h3 className="academic-institution-title academic-institution-title--engineering">
            {data.institution}
          </h3>
          <p className="academic-programme-title">{data.programme}</p>
        </div>
      </div>

      {/* Narrative */}
      <p className="academic-chapter-narrative">{data.description}</p>

      {/* Technical Architectural Blueprint Visual (Not a fake code editor) */}
      <div className="academic-blueprint-schematic" aria-label="Technical curriculum architecture schematic">
        <div className="blueprint-header-bar">
          <span className="blueprint-tag">SYSTEMS ARCHITECTURE // ACADEMIC BLUEPRINT</span>
          <span className="blueprint-status">ACTIVE CURRICULUM</span>
        </div>

        <svg
          className="blueprint-svg"
          viewBox="0 0 640 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Subtle Grid Base */}
          <line x1="20" y1="90" x2="620" y2="90" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="160" y1="20" x2="160" y2="160" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
          <line x1="320" y1="20" x2="320" y2="160" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
          <line x1="480" y1="20" x2="480" y2="160" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />

          {/* Module 1: Foundational Logic */}
          <rect x="25" y="45" width="125" height="90" rx="4" fill="#181818" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
          <text x="40" y="70" fill="#9CA3AF" fontSize="9" fontFamily="var(--font-mono)" letterSpacing="0.08em">LAYER 01</text>
          <text x="40" y="92" fill="#FFFFFF" fontSize="12" fontWeight="700" fontFamily="sans-serif">Compute & Logic</text>
          <text x="40" y="112" fill="#6B7280" fontSize="9.5" fontFamily="var(--font-mono)">Discrete Foundations</text>

          {/* Connector 1 -> 2 */}
          <line x1="150" y1="90" x2="185" y2="90" stroke="#E50914" strokeWidth="1.5" className="blueprint-connector-line" />
          <circle cx="150" cy="90" r="3" fill="#E50914" className="blueprint-connector-dot" />
          <circle cx="185" cy="90" r="3" fill="#E50914" className="blueprint-connector-dot" />

          {/* Module 2: Data Structures */}
          <rect x="185" y="45" width="125" height="90" rx="4" fill="#181818" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
          <text x="200" y="70" fill="#9CA3AF" fontSize="9" fontFamily="var(--font-mono)" letterSpacing="0.08em">LAYER 02</text>
          <text x="200" y="92" fill="#FFFFFF" fontSize="12" fontWeight="700" fontFamily="sans-serif">Data Structures</text>
          <text x="200" y="112" fill="#6B7280" fontSize="9.5" fontFamily="var(--font-mono)">Algorithmic Design</text>

          {/* Connector 2 -> 3 */}
          <line x1="310" y1="90" x2="345" y2="90" stroke="#E50914" strokeWidth="1.5" className="blueprint-connector-line" />
          <circle cx="310" cy="90" r="3" fill="#E50914" className="blueprint-connector-dot" />
          <circle cx="345" cy="90" r="3" fill="#E50914" className="blueprint-connector-dot" />

          {/* Module 3: AI & Machine Learning */}
          <rect x="345" y="45" width="125" height="90" rx="4" fill="#181818" stroke="rgba(229, 9, 20, 0.45)" strokeWidth="1.2" />
          <text x="360" y="70" fill="#FF4D55" fontSize="9" fontFamily="var(--font-mono)" letterSpacing="0.08em">LAYER 03</text>
          <text x="360" y="92" fill="#FFFFFF" fontSize="12" fontWeight="700" fontFamily="sans-serif">Applied AI</text>
          <text x="360" y="112" fill="#9CA3AF" fontSize="9.5" fontFamily="var(--font-mono)">Model Architectures</text>

          {/* Connector 3 -> 4 */}
          <line x1="470" y1="90" x2="505" y2="90" stroke="#E50914" strokeWidth="1.5" className="blueprint-connector-line" />
          <circle cx="470" cy="90" r="3" fill="#E50914" className="blueprint-connector-dot" />
          <circle cx="505" cy="90" r="3" fill="#E50914" className="blueprint-connector-dot" />

          {/* Module 4: Systems Delivery */}
          <rect x="505" y="45" width="110" height="90" rx="4" fill="#181818" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
          <text x="520" y="70" fill="#9CA3AF" fontSize="9" fontFamily="var(--font-mono)" letterSpacing="0.08em">LAYER 04</text>
          <text x="520" y="92" fill="#FFFFFF" fontSize="12" fontWeight="700" fontFamily="sans-serif">Web & Systems</text>
          <text x="520" y="112" fill="#6B7280" fontSize="9.5" fontFamily="var(--font-mono)">Production Build</text>
        </svg>

        <div className="blueprint-footer-note">
          <span className="blueprint-indicator-dot" />
          <span>Iterative progression from fundamental discrete mathematics to applied machine learning systems.</span>
        </div>
      </div>
    </article>
  );
}

