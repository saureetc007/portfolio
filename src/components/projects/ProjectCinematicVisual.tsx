import { type CSSProperties } from 'react';
import type { Project } from '@/types/content';

export interface ProjectCinematicVisualProps {
  project: Project;
  isActive: boolean;
}

/**
 * ProjectCinematicVisual — Tailored, High-Fidelity Animated Visual System
 * Renders distinct, project-specific animations for the active 3D card.
 * Every animation matches the actual project's domain and architecture.
 */
export function ProjectCinematicVisual({ project, isActive }: ProjectCinematicVisualProps) {
  if (!isActive) return null;

  switch (project.id) {
    case 'decisiontrace':
      // 01: DecisionVault / DecisionTrace — Directed Acyclic Graph (DAG) with pulsing evidence flow
      return (
        <div className="cinematic-visual cinematic-visual--dag" aria-hidden="true">
          <svg viewBox="0 0 400 240" className="visual-svg">
            <defs>
              <linearGradient id="dag-edge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#E50914" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.9" />
              </linearGradient>
              <filter id="dag-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Architecture Grid */}
            <path d="M40 60 H360 M40 120 H360 M40 180 H360" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 3" />
            <path d="M80 30 V210 M160 30 V210 M240 30 V210 M320 30 V210" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 3" />

            {/* Connecting Decision Paths */}
            <path d="M70 160 C120 160, 140 90, 190 90 L260 90 C300 90, 320 150, 350 150" fill="none" stroke="url(#dag-edge-grad)" strokeWidth="2.5" className="dag-flow-path" />
            <path d="M190 90 C220 90, 240 160, 270 160 L330 160" fill="none" stroke="#E50914" strokeWidth="1.8" strokeDasharray="4 4" className="dag-alt-path" />

            {/* Active Nodes */}
            <g className="dag-node" transform="translate(70, 160)">
              <circle r="12" fill="#181818" stroke="#E50914" strokeWidth="2.5" />
              <circle r="4" fill="#FFFFFF" />
              <text y="24" textAnchor="middle" fill="#B3B3B3" fontSize="9" fontFamily="monospace">PR #142</text>
            </g>

            <g className="dag-node dag-node--pulse" transform="translate(190, 90)">
              <circle r="16" fill="rgba(229,9,20,0.18)" stroke="#E50914" strokeWidth="2" filter="url(#dag-glow)" />
              <circle r="10" fill="#E50914" />
              <circle r="4" fill="#FFFFFF" />
              <text y="-20" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="monospace">DECISION: OLLAMA</text>
            </g>

            <g className="dag-node" transform="translate(270, 160)">
              <circle r="9" fill="#181818" stroke="#808080" strokeWidth="1.8" />
              <circle r="3" fill="#808080" />
              <text y="20" textAnchor="middle" fill="#808080" fontSize="8" fontFamily="monospace">REJECTED: API</text>
            </g>

            <g className="dag-node" transform="translate(350, 150)">
              <circle r="13" fill="#181818" stroke="#27C93F" strokeWidth="2.5" />
              <circle r="5" fill="#27C93F" />
              <text y="25" textAnchor="middle" fill="#27C93F" fontSize="9" fontWeight="bold" fontFamily="monospace">PERSISTED</text>
            </g>
          </svg>
          <div className="visual-telemetry">
            <span className="telemetry-dot" />
            <span className="telemetry-text">TRACEABILITY RECOVERY ACTIVE // LOCAL LLM</span>
          </div>
        </div>
      );

    case 'cognitive-support':
      // 02: AI-Powered Cognitive Support — Neural network pulse & accessible focus ring
      return (
        <div className="cinematic-visual cinematic-visual--cognitive" aria-hidden="true">
          <svg viewBox="0 0 400 240" className="visual-svg">
            <defs>
              <radialGradient id="cog-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#A855F7" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Pulsing Concentric Radar Rings */}
            <circle cx="200" cy="120" r="75" fill="none" stroke="rgba(168,85,247,0.18)" strokeWidth="1.5" className="pulse-ring-1" />
            <circle cx="200" cy="120" r="50" fill="none" stroke="rgba(168,85,247,0.3)" strokeWidth="1.8" className="pulse-ring-2" />
            <circle cx="200" cy="120" r="26" fill="url(#cog-glow)" stroke="#A855F7" strokeWidth="2.5" />
            <circle cx="200" cy="120" r="8" fill="#FFFFFF" />

            {/* Neural Synapse Links */}
            <g stroke="#A855F7" strokeWidth="1.5" opacity="0.6">
              <line x1="200" y1="120" x2="110" y2="70" strokeDasharray="3 3" className="synapse-line" />
              <line x1="200" y1="120" x2="290" y2="70" strokeDasharray="3 3" className="synapse-line" />
              <line x1="200" y1="120" x2="130" y2="180" strokeDasharray="3 3" className="synapse-line" />
              <line x1="200" y1="120" x2="280" y2="175" strokeDasharray="3 3" className="synapse-line" />
            </g>

            {/* Surrounding Supportive Nodes */}
            <circle cx="110" cy="70" r="10" fill="#181818" stroke="#A855F7" strokeWidth="2" />
            <text x="110" y="93" textAnchor="middle" fill="#E9D5FF" fontSize="8" fontFamily="monospace">WCAG AAA</text>

            <circle cx="290" cy="70" r="10" fill="#181818" stroke="#A855F7" strokeWidth="2" />
            <text x="290" y="93" textAnchor="middle" fill="#E9D5FF" fontSize="8" fontFamily="monospace">HIGH CONTRAST</text>

            <circle cx="130" cy="180" r="9" fill="#181818" stroke="#E50914" strokeWidth="1.8" />
            <circle cx="280" cy="175" r="9" fill="#181818" stroke="#27C93F" strokeWidth="1.8" />
          </svg>
          <div className="visual-telemetry" style={{ borderColor: 'rgba(168,85,247,0.4)', color: '#E9D5FF' }}>
            <span className="telemetry-dot" style={{ background: '#A855F7' }} />
            <span>ACCESSIBLE COGNITIVE INTERFACE // GENTLE PROMPTS</span>
          </div>
        </div>
      );

    case 'music-player':
      // 03: Spotify-Inspired Music Player — Animated equalizer waveform & rotating vinyl center
      return (
        <div className="cinematic-visual cinematic-visual--audio" aria-hidden="true">
          <div className="audio-visualizer-container">
            {/* Spinning Stylized Vinyl Disc */}
            <div className="vinyl-disc-mini">
              <div className="vinyl-groove" />
              <div className="vinyl-label">
                <span className="vinyl-dot" />
              </div>
            </div>

            {/* Bouncing Audio Spectrum Equalizer Bars */}
            <div className="spectrum-bars-row">
              {[45, 85, 30, 95, 60, 100, 75, 40, 90, 50, 70, 85, 35, 95].map((baseH, idx) => (
                <div
                  key={idx}
                  className="spectrum-bar"
                  style={
                    {
                      '--base-height': `${baseH}%`,
                      animationDelay: `${(idx * 0.12).toFixed(2)}s`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
          </div>
          <div className="visual-telemetry" style={{ borderColor: 'rgba(39,201,63,0.3)', color: '#86EFAC' }}>
            <span className="telemetry-dot" style={{ background: '#27C93F' }} />
            <span>HTML5 AUDIO CORE // BUFFERED 320 KBPS</span>
          </div>
        </div>
      );

    case 'simon-game':
      // 04: Simon Memory Game — 4 illuminated quadrant button pads pulsing in pattern
      return (
        <div className="cinematic-visual cinematic-visual--simon" aria-hidden="true">
          <div className="simon-disc">
            <div className="simon-quadrant simon-green" />
            <div className="simon-quadrant simon-red" />
            <div className="simon-quadrant simon-yellow" />
            <div className="simon-quadrant simon-blue" />
            <div className="simon-center">
              <span className="simon-score">LVL 08</span>
              <span className="simon-sub">SEQUENCE</span>
            </div>
          </div>
          <div className="visual-telemetry" style={{ borderColor: 'rgba(234,179,8,0.3)', color: '#FDE047' }}>
            <span className="telemetry-dot" style={{ background: '#EAB308' }} />
            <span>ASYNC STATE MACHINE // WEB AUDIO SYNTH</span>
          </div>
        </div>
      );

    case 'portfolio':
      // 05: Personal Developer Portfolio — Cinema Billboard frame & live red scanline
      return (
        <div className="cinematic-visual cinematic-visual--portfolio" aria-hidden="true">
          <div className="portfolio-billboard-screen">
            <div className="screen-header">
              <span className="screen-dot red" />
              <span className="screen-dot yellow" />
              <span className="screen-dot green" />
              <span className="screen-url">https://saureet.dev/featured</span>
            </div>
            <div className="screen-body">
              <div className="billboard-scanner-bar" />
              <div className="billboard-mock-grid">
                <div className="mock-card mock-card--hero" />
                <div className="mock-card" />
                <div className="mock-card" />
              </div>
            </div>
          </div>
          <div className="visual-telemetry">
            <span className="telemetry-dot" />
            <span>NETFLIX ARCHITECTURE // THREE.JS UNIVERSE</span>
          </div>
        </div>
      );

    case 'python-collection':
      // 06: Python Problem-Solving — Binary Search Tree & Big-O Complexity Graph
      return (
        <div className="cinematic-visual cinematic-visual--bst" aria-hidden="true">
          <svg viewBox="0 0 360 210" className="visual-svg">
            {/* Tree Branch Edges */}
            <line x1="180" y1="40" x2="100" y2="100" stroke="#38BDF8" strokeWidth="2" />
            <line x1="180" y1="40" x2="260" y2="100" stroke="#38BDF8" strokeWidth="2" />
            <line x1="100" y1="100" x2="60" y2="160" stroke="#38BDF8" strokeWidth="1.5" />
            <line x1="100" y1="100" x2="140" y2="160" stroke="#38BDF8" strokeWidth="1.5" />
            <line x1="260" y1="100" x2="220" y2="160" stroke="#38BDF8" strokeWidth="1.5" />
            <line x1="260" y1="100" x2="300" y2="160" stroke="#38BDF8" strokeWidth="1.5" />

            {/* Tree Nodes */}
            <circle cx="180" cy="40" r="14" fill="#181818" stroke="#38BDF8" strokeWidth="2.5" />
            <text x="180" y="44" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">50</text>

            <circle cx="100" cy="100" r="13" fill="#181818" stroke="#E50914" strokeWidth="2.5" className="tree-node--visited" />
            <text x="100" y="104" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">25</text>

            <circle cx="260" cy="100" r="12" fill="#181818" stroke="#808080" strokeWidth="1.5" />
            <text x="260" y="104" textAnchor="middle" fill="#B3B3B3" fontSize="9">75</text>

            <circle cx="60" cy="160" r="10" fill="#181818" stroke="#808080" strokeWidth="1.5" />
            <circle cx="140" cy="160" r="11" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="2" />
            <text x="140" y="164" textAnchor="middle" fill="#000000" fontSize="9" fontWeight="bold">30</text>

            <circle cx="220" cy="160" r="10" fill="#181818" stroke="#808080" strokeWidth="1.5" />
            <circle cx="300" cy="160" r="10" fill="#181818" stroke="#808080" strokeWidth="1.5" />
          </svg>
          <div className="visual-telemetry" style={{ borderColor: 'rgba(56,189,248,0.3)', color: '#BAE6FD' }}>
            <span className="telemetry-dot" style={{ background: '#38BDF8' }} />
            <span>BINARY SEARCH TREE // O(log n) OPTIMAL TIME</span>
          </div>
        </div>
      );

    case 'js-interactive':
      // 07: JavaScript Interactive Projects — Event Loop Orbit (Call Stack → Microtask → Event Loop)
      return (
        <div className="cinematic-visual cinematic-visual--eventloop" aria-hidden="true">
          <div className="eventloop-orbit-stage">
            <div className="eventloop-ring" />
            <div className="orbit-orb orb-microtask">
              <span>PROMISE</span>
            </div>
            <div className="orbit-orb orb-macrotask">
              <span>TIMER</span>
            </div>
            <div className="eventloop-core">
              <span className="core-title">EVENT</span>
              <span className="core-sub">LOOP</span>
            </div>
          </div>
          <div className="visual-telemetry" style={{ borderColor: 'rgba(250,204,21,0.3)', color: '#FEF08A' }}>
            <span className="telemetry-dot" style={{ background: '#FACC15' }} />
            <span>NON-BLOCKING CONCURRENCY // 60 FPS RAF</span>
          </div>
        </div>
      );

    case 'responsive-interfaces':
      // 08: Responsive Web Interfaces — Fluid clamp() viewport resizing ruler
      return (
        <div className="cinematic-visual cinematic-visual--responsive" aria-hidden="true">
          <div className="responsive-ruler-frame">
            <div className="ruler-ticks">
              <span>360px</span>
              <span>768px</span>
              <span>1024px</span>
              <span>1440px</span>
            </div>
            <div className="responsive-resizing-box">
              <div className="resizing-edge-indicator" />
              <span className="clamp-formula">clamp(1rem, 2.5vw, 2.25rem)</span>
              <div className="mini-grid-preview">
                <span /><span /><span />
              </div>
            </div>
          </div>
          <div className="visual-telemetry" style={{ borderColor: 'rgba(236,72,153,0.3)', color: '#FBCFE8' }}>
            <span className="telemetry-dot" style={{ background: '#EC4899' }} />
            <span>FLUID CSS GRID & CLAMP() // MOBILE-FIRST</span>
          </div>
        </div>
      );

    case 'ml-experiments':
      // 09: AI / Machine Learning Experiments — Gradient Descent Loss Curve
      return (
        <div className="cinematic-visual cinematic-visual--ml" aria-hidden="true">
          <svg viewBox="0 0 360 210" className="visual-svg">
            <defs>
              <linearGradient id="loss-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#E50914" />
              </linearGradient>
            </defs>
            {/* Axis */}
            <line x1="40" y1="170" x2="320" y2="170" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
            <line x1="40" y1="30" x2="40" y2="170" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
            <text x="325" y="174" fill="#808080" fontSize="9" fontFamily="monospace">Weights (w)</text>
            <text x="35" y="24" fill="#808080" fontSize="9" fontFamily="monospace">Loss J(w)</text>

            {/* Parabolic Loss Curve */}
            <path d="M50 45 Q 180 210, 310 45" fill="none" stroke="url(#loss-grad)" strokeWidth="3" />

            {/* Gradient descent rolling ball */}
            <circle cx="180" cy="148" r="8" fill="#E50914" stroke="#FFFFFF" strokeWidth="2.5" className="gd-optimum-ball" />
            <text x="180" y="130" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="monospace">
              MIN LOSS: 0.002
            </text>
          </svg>
          <div className="visual-telemetry" style={{ borderColor: 'rgba(139,92,246,0.3)', color: '#DDD6FE' }}>
            <span className="telemetry-dot" style={{ background: '#8B5CF6' }} />
            <span>GRADIENT DESCENT CONVERGENCE // NUMPY MATRIX</span>
          </div>
        </div>
      );

    case 'video-projects':
      // 10: Creative Video Projects — Multi-track timeline & scrub playhead
      return (
        <div className="cinematic-visual cinematic-visual--video" aria-hidden="true">
          <div className="video-mini-timeline">
            <div className="mini-track">
              <span className="track-badge">V1</span>
              <div className="mini-clip clip-v1">hero_cinematic.mp4</div>
            </div>
            <div className="mini-track">
              <span className="track-badge">G1</span>
              <div className="mini-clip clip-g1">kinetic_typography ◆ ◆</div>
            </div>
            <div className="mini-track">
              <span className="track-badge">A1</span>
              <div className="mini-clip clip-a1">audio_score_mix.wav</div>
            </div>
            {/* Animated Red Scrubbing Playhead */}
            <div className="mini-playhead" />
          </div>
          <div className="visual-telemetry" style={{ borderColor: 'rgba(153,153,255,0.3)', color: '#C7D2FE' }}>
            <span className="telemetry-dot" style={{ background: '#9999FF' }} />
            <span>24 FPS CINEMATIC MASTER // KEYFRAME TIMELINE</span>
          </div>
        </div>
      );

    default:
      return null;
  }
}

