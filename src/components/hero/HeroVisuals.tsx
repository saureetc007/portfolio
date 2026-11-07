import type { HeroSlide } from '@/types/content';

/**
 * Slide A: Developer Spotlight Visual
 * Layered dark architectural geometry, ambient red illumination,
 * engineering telemetry markings, and floating ambient dust motes.
 * Completely avoids the "empty red tunnel" look.
 */
export function DeveloperVisual() {
  return (
    <div className="hero-visual hero-visual--developer" aria-hidden="true">
      <svg
        className="hero-visual__svg"
        viewBox="0 0 680 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="dev-ambient" cx="60%" cy="50%" r="55%">
            <stop offset="0%" stop-color="#E50914" stop-opacity="0.25" />
            <stop offset="50%" stop-color="#181818" stop-opacity="0.7" />
            <stop offset="100%" stop-color="#141414" stop-opacity="0.95" />
          </radialGradient>
          <linearGradient id="dev-card-border" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#E50914" stop-opacity="0.8" />
            <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.2" />
            <stop offset="100%" stop-color="#E50914" stop-opacity="0.1" />
          </linearGradient>
        </defs>

        {/* Ambient Dark Background Glow */}
        <rect width="680" height="500" rx="12" fill="url(#dev-ambient)" />

        {/* Subtle Architectural Coordinate Grid */}
        <g stroke="rgba(255,255,255,0.06)" stroke-width="1">
          <line x1="60" y1="60" x2="620" y2="60" />
          <line x1="60" y1="160" x2="620" y2="160" stroke-dasharray="4,4" />
          <line x1="60" y1="260" x2="620" y2="260" />
          <line x1="60" y1="360" x2="620" y2="360" stroke-dasharray="4,4" />
          <line x1="60" y1="440" x2="620" y2="440" />

          <line x1="140" y1="40" x2="140" y2="460" stroke-dasharray="4,4" />
          <line x1="340" y1="40" x2="340" y2="460" />
          <line x1="540" y1="40" x2="540" y2="460" stroke-dasharray="4,4" />
        </g>

        {/* Layered Architectural Geometry (Isometric Slabs) */}
        <g transform="translate(40, 20)">
          {/* Back Plane */}
          <polygon
            points="240,110 520,70 560,250 280,290"
            fill="#181818"
            stroke="rgba(255,255,255,0.08)"
            stroke-width="1.5"
          />

          {/* Middle Elevated Plane */}
          <polygon
            points="180,180 460,140 500,320 220,360"
            fill="#202020"
            stroke="url(#dev-card-border)"
            stroke-width="1.5"
          />

          {/* Front Highlight Plate */}
          <polygon
            points="140,240 380,205 410,340 170,375"
            fill="#242424"
            stroke="#E50914"
            stroke-width="1.5"
            stroke-opacity="0.6"
          />
        </g>

        {/* Telemetry Info Panel (Floating Glass HUD) */}
        <g transform="translate(220, 180)">
          <rect
            x="0"
            y="0"
            width="340"
            height="180"
            rx="8"
            fill="#1c1c1c"
            fill-opacity="0.94"
            stroke="rgba(255,255,255,0.14)"
            stroke-width="1.5"
          />
          {/* Panel Header */}
          <rect x="0" y="0" width="340" height="34" rx="8" fill="#252525" />
          <circle cx="18" cy="17" r="4.5" fill="#E50914" />
          <text x="32" y="21" fill="#FFFFFF" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="600" letter-spacing="0.1em">
            SYSTEM // CORE_STATUS
          </text>
          <text x="280" y="21" fill="#808080" font-family="'JetBrains Mono', monospace" font-size="10">
            NST.CS
          </text>

          {/* Panel Content Lines */}
          <text x="20" y="65" fill="#B3B3B3" font-family="'JetBrains Mono', monospace" font-size="11">
            DISCIPLINE:
          </text>
          <text x="120" y="65" fill="#FFFFFF" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="600">
            Computer Science & AI
          </text>

          <text x="20" y="95" fill="#B3B3B3" font-family="'JetBrains Mono', monospace" font-size="11">
            PHILOSOPHY:
          </text>
          <text x="120" y="95" fill="#FFFFFF" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="600">
            Learning by Building
          </text>

          <text x="20" y="125" fill="#B3B3B3" font-family="'JetBrains Mono', monospace" font-size="11">
            STACK:
          </text>
          <text x="120" y="125" fill="#E50914" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="600">
            Python · React · Local AI
          </text>

          {/* Bottom Metric Bar */}
          <line x1="20" y1="148" x2="320" y2="148" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
          <text x="20" y="167" fill="#808080" font-family="'JetBrains Mono', monospace" font-size="9.5">
            LAT 28.61 // BUILD PASSING // READY
          </text>
        </g>

        {/* Ambient Laser Horizon Beam */}
        <line x1="60" y1="440" x2="620" y2="440" stroke="#E50914" stroke-width="2" stroke-opacity="0.8" />
        <circle cx="340" cy="440" r="4" fill="#FFFFFF" />

        {/* Fine Floating Ambient Particles */}
        <circle cx="160" cy="110" r="1.5" fill="#FFFFFF" opacity="0.6" />
        <circle cx="480" cy="80" r="2" fill="#E50914" opacity="0.8" />
        <circle cx="580" cy="220" r="1.5" fill="#FFFFFF" opacity="0.4" />
        <circle cx="120" cy="390" r="2" fill="#E50914" opacity="0.7" />
        <circle cx="520" cy="410" r="1.5" fill="#FFFFFF" opacity="0.6" />
      </svg>
    </div>
  );
}

/**
 * Slide B: DecisionVault Knowledge System Visual
 * Direct visualization of an engineering decision extraction system:
 * Central repo node connected to decision cards, evidence snippets, and rejected alternatives.
 */
export function DecisionVaultVisual() {
  return (
    <div className="hero-visual hero-visual--decisionvault" aria-hidden="true">
      <svg
        className="hero-visual__svg"
        viewBox="0 0 680 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="dv-ambient" cx="45%" cy="50%" r="55%">
            <stop offset="0%" stop-color="#E50914" stop-opacity="0.22" />
            <stop offset="50%" stop-color="#181818" stop-opacity="0.75" />
            <stop offset="100%" stop-color="#141414" stop-opacity="0.95" />
          </radialGradient>
        </defs>

        <rect width="680" height="500" rx="12" fill="url(#dv-ambient)" />

        {/* Connecting Traces from Root to Cards */}
        <g stroke-linecap="round">
          {/* Main branch line to Decision 01 */}
          <path
            d="M 200 240 C 260 240 270 120 340 120"
            stroke="#E50914"
            stroke-width="2.5"
            fill="none"
          />
          {/* Branch line to Decision 02 */}
          <path
            d="M 200 240 C 280 240 290 260 340 260"
            stroke="#E50914"
            stroke-width="2"
            fill="none"
          />
          {/* Branch line to Rejected Alternative */}
          <path
            d="M 200 240 C 260 240 270 390 340 390"
            stroke="rgba(255,255,255,0.25)"
            stroke-width="2"
            stroke-dasharray="5,5"
            fill="none"
          />
        </g>

        {/* Central Repository Root Node */}
        <g transform="translate(60, 195)">
          <rect
            x="0"
            y="0"
            width="145"
            height="90"
            rx="8"
            fill="#1c1c1c"
            stroke="#E50914"
            stroke-width="2"
          />
          <circle cx="20" cy="24" r="5" fill="#E50914" />
          <text x="32" y="28" fill="#FFFFFF" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700">
            REPO // ROOT
          </text>
          <text x="18" y="52" fill="#FFFFFF" font-family="'Space Grotesk', sans-serif" font-size="13" font-weight="700">
            DecisionVault
          </text>
          <text x="18" y="72" fill="#808080" font-family="'JetBrains Mono', monospace" font-size="10">
            git:main / active
          </text>
        </g>

        {/* Decision Card 1: Local LLM Engine */}
        <g transform="translate(340, 65)">
          <rect
            x="0"
            y="0"
            width="290"
            height="105"
            rx="8"
            fill="#222222"
            stroke="#E50914"
            stroke-width="1.5"
          />
          <rect x="0" y="0" width="290" height="26" rx="8" fill="#2a2a2a" />
          <text x="14" y="17" fill="#E50914" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700">
            DECISION #01 [RECOVERED]
          </text>
          <text x="220" y="17" fill="#46d369" font-family="'JetBrains Mono', monospace" font-size="9.5">
            ✓ APPROVED
          </text>

          <text x="14" y="48" fill="#FFFFFF" font-family="'Space Grotesk', sans-serif" font-size="12" font-weight="600">
            Local LLM Extraction Pipeline
          </text>
          <text x="14" y="70" fill="#B3B3B3" font-family="'JetBrains Mono', monospace" font-size="10">
            EVIDENCE: PR #14 discussion quote
          </text>
          <text x="14" y="88" fill="#808080" font-family="'JetBrains Mono', monospace" font-size="9.5">
            &quot;Avoid cloud latency &amp; maintain code privacy&quot;
          </text>
        </g>

        {/* Decision Card 2: SQLite Schema */}
        <g transform="translate(340, 205)">
          <rect
            x="0"
            y="0"
            width="290"
            height="105"
            rx="8"
            fill="#222222"
            stroke="rgba(255,255,255,0.15)"
            stroke-width="1.5"
          />
          <rect x="0" y="0" width="290" height="26" rx="8" fill="#2a2a2a" />
          <text x="14" y="17" fill="#FFFFFF" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700">
            DECISION #02 [STRUCTURED]
          </text>
          <text x="225" y="17" fill="#46d369" font-family="'JetBrains Mono', monospace" font-size="9.5">
            ✓ VERIFIED
          </text>

          <text x="14" y="48" fill="#FFFFFF" font-family="'Space Grotesk', sans-serif" font-size="12" font-weight="600">
            Evidence-Linked SQLite Schema
          </text>
          <text x="14" y="70" fill="#B3B3B3" font-family="'JetBrains Mono', monospace" font-size="10">
            EVIDENCE: Issue #8 decision schema
          </text>
          <text x="14" y="88" fill="#808080" font-family="'JetBrains Mono', monospace" font-size="9.5">
            &quot;Decisions link directly to raw thread context&quot;
          </text>
        </g>

        {/* Card 3: Rejected Alternative */}
        <g transform="translate(340, 345)">
          <rect
            x="0"
            y="0"
            width="290"
            height="95"
            rx="8"
            fill="#1c1c1c"
            stroke="rgba(255,255,255,0.1)"
            stroke-width="1"
            stroke-dasharray="4,4"
          />
          <rect x="0" y="0" width="290" height="24" rx="8" fill="#242424" />
          <text x="14" y="16" fill="#808080" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="600">
            REJECTED ALTERNATIVE
          </text>
          <text x="210" y="16" fill="#e5a00d" font-family="'JetBrains Mono', monospace" font-size="9.5">
            ✕ ARCHIVED
          </text>

          <text x="14" y="46" fill="#B3B3B3" font-family="'Space Grotesk', sans-serif" font-size="12">
            Hosted Third-Party SaaS API
          </text>
          <text x="14" y="68" fill="#808080" font-family="'JetBrains Mono', monospace" font-size="9.5">
            REASON: Data lock-in &amp; per-token cost burden
          </text>
        </g>
      </svg>
    </div>
  );
}

/**
 * Slide C: AI & Software Engineering Visual
 * Abstract technical environment with dimensional geometry,
 * interconnected components, and subtle red lighting.
 */
export function AiEngineeringVisual() {
  return (
    <div className="hero-visual hero-visual--ai" aria-hidden="true">
      <svg
        className="hero-visual__svg"
        viewBox="0 0 680 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="ai-ambient" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stop-color="#E50914" stop-opacity="0.2" />
            <stop offset="50%" stop-color="#181818" stop-opacity="0.8" />
            <stop offset="100%" stop-color="#141414" stop-opacity="0.95" />
          </radialGradient>
        </defs>

        <rect width="680" height="500" rx="12" fill="url(#ai-ambient)" />

        {/* Perspective Grid Plane */}
        <g stroke="rgba(255,255,255,0.08)" stroke-width="1">
          <line x1="80" y1="360" x2="600" y2="360" />
          <line x1="120" y1="410" x2="560" y2="410" />
          <line x1="160" y1="450" x2="520" y2="450" />

          <line x1="340" y1="200" x2="160" y2="450" />
          <line x1="340" y1="200" x2="260" y2="450" />
          <line x1="340" y1="200" x2="340" y2="450" stroke="#E50914" stroke-opacity="0.5" />
          <line x1="340" y1="200" x2="420" y2="450" />
          <line x1="340" y1="200" x2="520" y2="450" />
        </g>

        {/* Interconnected System Architecture Nodes */}
        {/* Module 1: Model & Embeddings */}
        <g transform="translate(100, 80)">
          <rect
            x="0"
            y="0"
            width="200"
            height="90"
            rx="8"
            fill="#202020"
            stroke="#E50914"
            stroke-width="1.5"
          />
          <text x="16" y="26" fill="#E50914" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700">
            01 // INTELLIGENT CORE
          </text>
          <text x="16" y="50" fill="#FFFFFF" font-family="'Space Grotesk', sans-serif" font-size="13" font-weight="600">
            Local Models &amp; Embeddings
          </text>
          <text x="16" y="72" fill="#808080" font-family="'JetBrains Mono', monospace" font-size="10">
            Private Weights &amp; Inference
          </text>
        </g>

        {/* Module 2: Software Pipeline */}
        <g transform="translate(380, 80)">
          <rect
            x="0"
            y="0"
            width="200"
            height="90"
            rx="8"
            fill="#202020"
            stroke="rgba(255,255,255,0.15)"
            stroke-width="1.5"
          />
          <text x="16" y="26" fill="#FFFFFF" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700">
            02 // SYSTEM PIPELINE
          </text>
          <text x="16" y="50" fill="#FFFFFF" font-family="'Space Grotesk', sans-serif" font-size="13" font-weight="600">
            API &amp; Typed Architecture
          </text>
          <text x="16" y="72" fill="#808080" font-family="'JetBrains Mono', monospace" font-size="10">
            Deterministic Contracts
          </text>
        </g>

        {/* Module 3: Frontend Experience */}
        <g transform="translate(240, 230)">
          <rect
            x="0"
            y="0"
            width="200"
            height="90"
            rx="8"
            fill="#252525"
            stroke="#E50914"
            stroke-width="2"
          />
          <circle cx="20" cy="22" r="4" fill="#E50914" />
          <text x="32" y="26" fill="#FFFFFF" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700">
            03 // INTERACTIVE UX
          </text>
          <text x="16" y="50" fill="#FFFFFF" font-family="'Space Grotesk', sans-serif" font-size="13" font-weight="600">
            Reactive Web &amp; Spatial 3D
          </text>
          <text x="16" y="72" fill="#808080" font-family="'JetBrains Mono', monospace" font-size="10">
            Tactile Streaming Interface
          </text>
        </g>

        {/* Connecting Filaments Between Modules */}
        <path d="M 200 170 L 290 230" stroke="#E50914" stroke-width="2" stroke-dasharray="4,4" />
        <path d="M 480 170 L 390 230" stroke="rgba(255,255,255,0.25)" stroke-width="2" />
        <line x1="300" y1="125" x2="380" y2="125" stroke="#E50914" stroke-width="2" />

        {/* Floating Dimensional Coordinate Crosshairs */}
        <g stroke="rgba(255,255,255,0.2)" stroke-width="1">
          <line x1="60" y1="260" x2="76" y2="260" />
          <line x1="68" y1="252" x2="68" y2="268" />
          <line x1="610" y1="260" x2="626" y2="260" />
          <line x1="618" y1="252" x2="618" y2="268" />
        </g>
      </svg>
    </div>
  );
}

export function HeroVisual({ type }: { type: HeroSlide['visualType'] }) {
  switch (type) {
    case 'developer':
      return <DeveloperVisual />;
    case 'decisionvault':
      return <DecisionVaultVisual />;
    case 'ai-systems':
      return <AiEngineeringVisual />;
    default:
      return <DeveloperVisual />;
  }
}

