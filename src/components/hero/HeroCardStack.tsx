import { useState, useRef, useCallback, useEffect } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { TechIcon } from './TechIcons';
import { MiniCodeEditor } from './MiniCodeEditor';
import { ArchitectureHologram } from './ArchitectureHologram';
import { developerTechStack, slideTechMap } from '@/data/repositories';
import type { TechItem } from '@/types/content';

interface HeroCardStackProps {
  slideId: string;
  isActive: boolean;
  onOpenProject?: (projectId: string) => void;
  onOpenRepoExplorer?: () => void;
}

interface CardArtworkParticle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  targetAlpha: number;
}

/**
 * HeroCardStack
 * Replaces flat single visual panels with a 3D stacked, layered card composition.
 *
 * Requirements met:
 * - 3 to 4 overlapping cards per slide with staggered offsets, rotations, and depth layering
 * - Distinct technical content per card: code snippets, architecture flowcharts, UI mockups, telemetry
 * - Interactive pointer tilt / parallax effect on desktop with smooth decay
 * - Staggered entrance animation when slides change
 * - Click triggers project detail modals directly from the cards
 * - Responsive mobile layout that collapses/scales gracefully with zero horizontal overflow
 * - Artwork Hover Micro-Interaction:
 *   * Emits subtle particles around card edges on pointer hover (~18–24 red and white particles)
 *   * Particles gently respond to cursor movement with fine connecting lines
 *   * Subtle card lift and depth illumination
 *   * Smooth fade-out on pointer leave with loop termination (0 continuous background CPU)
 *   * pointer-events: none ensures carousel, card clicks, and modals are unobstructed
 * - Interactive Developer Ecosystem:
 *   * Floating orbital technology nodes with hover tooltips
 *   * Dynamic vector connection lines linking cards to active technologies
 *   * Repository Explorer trigger with live GitHub indicator
 */
export function HeroCardStack({
  slideId,
  isActive,
  onOpenProject,
  onOpenRepoExplorer,
}: HeroCardStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const activeTechIds = slideTechMap[slideId] || ['python', 'react', 'typescript', 'threejs'];
  const activeTechNodes: TechItem[] = activeTechIds
    .map((id) => developerTechStack.find((t) => t.id === id))
    .filter((t): t is TechItem => Boolean(t));

  // Artwork hover particle animation refs
  const particlesRef = useRef<CardArtworkParticle[]>([]);
  const animIdRef = useRef<number | null>(null);
  const isHoveringRef = useRef(false);
  const mousePosRef = useRef({ x: 0, y: 0, active: false });

  // ---------------------------------------------------------------------------
  // Artwork Hover Particle Animation Loop
  // ---------------------------------------------------------------------------
  const runArtworkAnimation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const particles = particlesRef.current;
    const isHovering = isHoveringRef.current;
    const mouse = mousePosRef.current;

    // 1. Draw fine connecting lines between nearby particles
    const lineThreshold = 45;
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      if (!p1 || p1.alpha <= 0.05) continue;

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        if (!p2 || p2.alpha <= 0.05) continue;

        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.hypot(dx, dy);

        if (dist < lineThreshold) {
          const lineAlpha =
            Math.min(p1.alpha, p2.alpha) * (1 - dist / lineThreshold) * 0.22;
          ctx.strokeStyle = `rgba(229, 9, 20, ${lineAlpha})`;
          ctx.lineWidth = 0.55;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    // 2. Update and draw particles
    let hasAlive = false;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (!p) continue;

      // Smooth fade in on hover, fade out on leave
      if (isHovering) {
        p.alpha += (p.targetAlpha - p.alpha) * 0.12;
      } else {
        p.alpha -= 0.055; // Fade out within ~300ms
      }

      if (p.alpha > 0.01) {
        hasAlive = true;

        // Gentle cursor interaction (soft repulsion / orbit)
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 85 && dist > 1) {
            const force = (1 - dist / 85) * 0.35;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Restoring spring toward perimeter anchor
        p.vx += (p.originX - p.x) * 0.016;
        p.vy += (p.originY - p.y) * 0.016;

        // Natural drag/damping
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94;
        p.vy *= 0.94;

        // Render point
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3. Continue animation while hovering or while fading out
    if (isHovering || hasAlive) {
      animIdRef.current = requestAnimationFrame(runArtworkAnimation);
    } else {
      ctx.clearRect(0, 0, width, height);
      particlesRef.current = [];
      animIdRef.current = null;
    }
  }, []);

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion) return;

      // Disable on touch devices without a fine pointer
      if (
        typeof window !== 'undefined' &&
        window.matchMedia('(hover: hover) and (pointer: fine)').matches === false
      ) {
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      // Synchronize canvas coordinate resolution
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.scale(dpr, dpr);
      }

      isHoveringRef.current = true;
      setIsHovered(true);
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };

      // Card perimeter bounds calculation (relative to center)
      const cardW = Math.min(w * 0.74, 400);
      const cardH = Math.min(h * 0.74, 340);
      const cx = w / 2;
      const cy = h / 2;
      const minX = cx - cardW / 2;
      const maxX = cx + cardW / 2;
      const minY = cy - cardH / 2;
      const maxY = cy + cardH / 2;

      const colors = ['#E50914', '#B20710', '#FFFFFF', '#FF3E4D', '#FFFFFF'];
      const particles: CardArtworkParticle[] = [];
      const particleCount = 22; // 15–30 particles requirement

      for (let i = 0; i < particleCount; i++) {
        const edge = i % 4;
        let ox = cx;
        let oy = cy;

        if (edge === 0) {
          // Top edge
          ox = minX + Math.random() * cardW;
          oy = minY + (Math.random() - 0.5) * 18;
        } else if (edge === 1) {
          // Bottom edge
          ox = minX + Math.random() * cardW;
          oy = maxY + (Math.random() - 0.5) * 18;
        } else if (edge === 2) {
          // Left edge
          ox = minX + (Math.random() - 0.5) * 18;
          oy = minY + Math.random() * cardH;
        } else {
          // Right edge
          ox = maxX + (Math.random() - 0.5) * 18;
          oy = minY + Math.random() * cardH;
        }

        particles.push({
          x: ox + (Math.random() - 0.5) * 12,
          y: oy + (Math.random() - 0.5) * 12,
          originX: ox,
          originY: oy,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: 1.2 + Math.random() * 1.4, // 1–3 px
          color: colors[Math.floor(Math.random() * colors.length)] ?? '#E50914',
          alpha: 0,
          targetAlpha: 0.65 + Math.random() * 0.28,
        });
      }

      particlesRef.current = particles;

      if (!animIdRef.current) {
        animIdRef.current = requestAnimationFrame(runArtworkAnimation);
      }
    },
    [prefersReducedMotion, runArtworkAnimation]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion) return;
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      // Restrained tilt angle (max ±6 deg)
      setTilt({
        x: -y * 8,
        y: x * 10,
      });

      // Update pointer coordinate for particle interaction
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    },
    [prefersReducedMotion]
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    isHoveringRef.current = false;
    setIsHovered(false);
    mousePosRef.current.active = false;
  }, []);

  // Clean up animation loop on unmount
  useEffect(() => {
    return () => {
      if (animIdRef.current) {
        cancelAnimationFrame(animIdRef.current);
        animIdRef.current = null;
      }
    };
  }, []);

  const triggerModal = (projectId: string) => {
    if (onOpenProject) {
      onOpenProject(projectId);
    } else {
      window.dispatchEvent(
        new CustomEvent('open-project-modal', { detail: projectId })
      );
    }
  };

  return (
    <div
      ref={containerRef}
      className={`hero-card-stack ${isActive ? 'is-active' : ''} ${
        isHovered ? 'is-hovered' : ''
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
      aria-hidden="true"
    >
      {/* Ambient background glow behind stack */}
      <div className="hero-card-stack__ambient-glow" />

      {/* Feature 13: Red Scanning Beam (restrained periodic light sweep) */}
      <div className="hero-card-stack__scan-beam" aria-hidden="true" />

      {/* Artwork Hover Particle Canvas (pointer-events: none, passes all clicks through) */}
      <canvas
        ref={canvasRef}
        className="hero-card-stack__particle-canvas"
        aria-hidden="true"
      />

      {/* Dynamic Vector Connections between Central Card and Orbital Nodes */}
      <svg className="hero-ecosystem__connections" viewBox="0 0 700 500" aria-hidden="true">
        <defs>
          <linearGradient id="conn-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E50914" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#E50914" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path className="conn-path conn-path--tl" d="M 350 200 Q 200 130 65 65" />
        <path className="conn-path conn-path--tr" d="M 350 200 Q 500 130 635 65" />
        <path className="conn-path conn-path--bl" d="M 350 290 Q 200 350 65 435" />
        <path className="conn-path conn-path--br" d="M 350 290 Q 500 350 635 435" />
      </svg>

      {/* Floating Orbital Technology Nodes */}
      <div className="hero-ecosystem__orbital-nodes">
        {activeTechNodes.map((tech, idx) => {
          const positions = ['tl', 'tr', 'bl', 'br'] as const;
          const pos = positions[idx] || 'tl';
          return (
            <div
              key={tech.id}
              className={`hero-orbital-node hero-orbital-node--${pos}`}
              tabIndex={0}
              role="button"
              aria-label={`Technology: ${tech.name}. Role: ${tech.role}`}
              onClick={onOpenRepoExplorer}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpenRepoExplorer?.();
                }
              }}
            >
              <div className="hero-orbital-node__core" style={{ borderColor: tech.color }}>
                <TechIcon name={tech.iconName} size={18} />
              </div>
              <span className="hero-orbital-node__label">{tech.name}</span>
              <div className="hero-orbital-node__tooltip" role="tooltip">
                <span className="tooltip-cat">{tech.category.toUpperCase()}</span>
                <span className="tooltip-role">{tech.role}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide 1: Developer Spotlight (3 Cards) */}
      {slideId === 'developer-spotlight' && (
        <div className="hero-card-stack__layer">
          {/* Card 1 (Rear): Architecture & Systems Matrix */}
          <div className="hero-card hero-card--rear hero-card--dev-matrix">
            <div className="hero-card__header">
              <span className="hero-card__badge-dot" />
              <span className="hero-card__title">RUNTIME_MATRIX // ARCHITECTURE</span>
              <span className="hero-card__tag">DEV.ENV</span>
            </div>
            <div className="hero-card__body">
              <div className="hero-card__spec-row">
                <span className="hero-card__label">FOCUS</span>
                <span className="hero-card__val">Computer Science & AI</span>
              </div>
              <div className="hero-card__spec-row">
                <span className="hero-card__label">PARADIGM</span>
                <span className="hero-card__val">Local-First / Zero Privacy Loss</span>
              </div>
              <div className="hero-card__tech-pills">
                <span className="pill">React 19</span>
                <span className="pill">TypeScript</span>
                <span className="pill">Python</span>
                <span className="pill">PyTorch</span>
                <span className="pill">SQLite</span>
                <span className="pill">Three.js</span>
              </div>
            </div>
          </div>

          {/* Card 2 (Middle): Interactive Code Workspace IDE Window */}
          <div className="hero-card hero-card--middle hero-card--dev-ide">
            <MiniCodeEditor />
          </div>

          {/* Card 3 (Front - Focal): Developer Profile HUD */}
          <div
            className="hero-card hero-card--front hero-card--dev-hud"
            onClick={() => {
              const el = document.getElementById('about');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <div className="hero-card__header">
              <div className="hero-card__avatar-badge">SC</div>
              <div className="hero-card__hud-titles">
                <span className="hero-card__hud-name">Saureet Chakrabarti</span>
                <span className="hero-card__hud-sub">CS & AI Student • Developer</span>
              </div>
              <span className="hero-card__status-pill">ACTIVE // READY</span>
            </div>
            <div className="hero-card__metrics-row">
              <div className="hero-card__metric-item">
                <span className="metric-num">10+</span>
                <span className="metric-label">Showcase Projects</span>
              </div>
              <div className="hero-card__metric-item">
                <span className="metric-num">100%</span>
                <span className="metric-label">Local LLMs & OSS</span>
              </div>
              <div className="hero-card__metric-item">
                <span className="metric-num">2026</span>
                <span className="metric-label">Graduation Year</span>
              </div>
            </div>
            <div className="hero-card__action-hint">
              <span>View Developer Profile & Bio →</span>
            </div>
          </div>
        </div>
      )}

      {/* Slide 2: DecisionVault (4 Cards) */}
      {slideId === 'decisionvault' && (
        <div className="hero-card-stack__layer">
          {/* Card 1 (Rear): GitHub Thread Ingestion */}
          <div className="hero-card hero-card--back-4 hero-card--dv-github">
            <div className="hero-card__header">
              <span className="hero-card__badge-dot" />
              <span className="hero-card__title">GITHUB_INGEST // PR #142</span>
              <span className="hero-card__status-badge hero-card__status-badge--green">MERGED</span>
            </div>
            <div className="hero-card__body">
              <p className="hero-card__thread-text">
                &ldquo;Discussing local storage: SQLite vs Postgres vs Redis. We need zero cloud hosting
                cost and direct git traceability for team ADRs...&rdquo;
              </p>
              <div className="hero-card__meta-bar">
                <span>18 Comments Parsed</span>
                <span>•</span>
                <span>4 Tradeoffs Identified</span>
              </div>
            </div>
          </div>

          {/* Card 2 (Middle-Back): Local LLM Extraction Pipeline */}
          <div className="hero-card hero-card--mid-back-4 hero-card--dv-pipeline">
            <div className="hero-card__header">
              <span className="hero-card__badge-dot hero-card__badge-dot--red" />
              <span className="hero-card__title">OLLAMA // LOCAL INFERENCE ENGINE</span>
              <span className="hero-card__tag">TEMP: 0.1</span>
            </div>
            <div className="hero-card__code-body">
              <pre>
                <code>
                  {'{'}{'\n'}
                  {'  '}&quot;decision&quot;: &quot;Use SQLite embedded engine&quot;,{'\n'}
                  {'  '}&quot;status&quot;: &quot;ACCEPTED&quot;,{'\n'}
                  {'  '}&quot;confidence&quot;: 0.984,{'\n'}
                  {'  '}&quot;rejected&quot;: [&quot;PostgreSQL&quot;, &quot;Redis&quot;]{'\n'}
                  {'}'}
                </code>
              </pre>
              <div className="hero-card__code-footer">
                <span className="hero-card__status-text">Structured Schema Validated</span>
              </div>
            </div>
          </div>

          {/* Card 3 (Middle): Interactive Architecture Hologram */}
          <div className="hero-card hero-card--mid-front-4 hero-card--dv-graph">
            <ArchitectureHologram />
          </div>

          {/* Card 4 (Front - Focal): Structured Decision Record (ADR-004) */}
          <div
            className="hero-card hero-card--front-4 hero-card--dv-record"
            onClick={() => triggerModal('decisiontrace')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && triggerModal('decisiontrace')}
          >
            <div className="hero-card__header">
              <div className="hero-card__adr-id">ADR-004</div>
              <span className="hero-card__title">Local SQLite Persistence Engine</span>
              <span className="hero-card__status-badge hero-card__status-badge--red">ACCEPTED</span>
            </div>
            <div className="hero-card__body">
              <p className="hero-card__desc">
                Engineering decisions, tradeoffs, and rejected alternatives extracted from PR threads with
                zero cloud API fees.
              </p>
              <div className="hero-card__tech-pills">
                <span className="pill">Python</span>
                <span className="pill">Ollama</span>
                <span className="pill">SQLite</span>
                <span className="pill">Git Traceability</span>
              </div>
            </div>
            <div className="hero-card__action-hint">
              <span>Click to Open DecisionVault Modal →</span>
            </div>
          </div>
        </div>
      )}

      {/* Slide 3: AI Cognitive Support Platform (4 Cards) */}
      {slideId === 'cognitive-support' && (
        <div className="hero-card-stack__layer">
          {/* Card 1 (Rear): System Architecture & Privacy Gate */}
          <div className="hero-card hero-card--back-4 hero-card--cog-arch">
            <div className="hero-card__header">
              <span className="hero-card__badge-dot" />
              <span className="hero-card__title">SYS_FLOW // PATIENT PRIVACY</span>
              <span className="hero-card__tag">OFFLINE-FIRST</span>
            </div>
            <div className="hero-card__body">
              <div className="graph-node-chain">
                <div className="graph-node">Assistive UI</div>
                <div className="graph-arrow">◀─▶</div>
                <div className="graph-node graph-node--active">Privacy Gate</div>
                <div className="graph-arrow">◀─▶</div>
                <div className="graph-node">Cognitive Model</div>
              </div>
              <p className="graph-caption">
                Zero patient biometric data shared with external vendors. Local evaluation loop.
              </p>
            </div>
          </div>

          {/* Card 2 (Middle-Back): Caregiver Telemetry HUD */}
          <div className="hero-card hero-card--mid-back-4 hero-card--cog-caregiver">
            <div className="hero-card__header">
              <span className="hero-card__badge-dot hero-card__badge-dot--red" />
              <span className="hero-card__title">CAREGIVER PORTAL // TELEMETRY</span>
              <span className="hero-card__status-badge hero-card__status-badge--green">OPTIMAL</span>
            </div>
            <div className="hero-card__body">
              <div className="hero-card__spec-row">
                <span className="hero-card__label">Daily Activity Completion</span>
                <span className="hero-card__val">94%</span>
              </div>
              <div className="hero-card__progress-track">
                <div className="hero-card__progress-fill" style={{ width: '94%' }} />
              </div>
              <div className="hero-card__meta-bar">
                <span>Prompt Tone: Calm / Non-Intrusive</span>
                <span>•</span>
                <span>Contrast: WCAG AAA</span>
              </div>
            </div>
          </div>

          {/* Card 3 (Middle): Cognitive Exercise Activity */}
          <div className="hero-card hero-card--mid-front-4 hero-card--cog-exercise">
            <div className="hero-card__header">
              <span className="hero-card__badge-dot" />
              <span className="hero-card__title">EXERCISE // RECALL & SEQUENCING</span>
              <span className="hero-card__tag">ACTIVE SESSION</span>
            </div>
            <div className="hero-card__exercise-body">
              <span className="hero-card__prompt-label">Select the morning pattern in sequence:</span>
              <div className="hero-card__icon-grid">
                <div className="icon-card is-selected">☀️ Sun</div>
                <div className="icon-card is-selected">🌲 Tree</div>
                <div className="icon-card">🔔 Bell</div>
                <div className="icon-card">💧 Water</div>
              </div>
            </div>
          </div>

          {/* Card 4 (Front - Focal): Patient Assistive Interface Preview */}
          <div
            className="hero-card hero-card--front-4 hero-card--cog-assistive"
            onClick={() => triggerModal('cognitive-support')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && triggerModal('cognitive-support')}
          >
            <div className="hero-card__header">
              <span className="hero-card__badge-dot hero-card__badge-dot--red" />
              <span className="hero-card__title">ASSISTIVE INTERFACE // COGNITIVE SUPPORT</span>
              <span className="hero-card__status-pill">APPLIED AI</span>
            </div>
            <div className="hero-card__body">
              <div className="hero-card__patient-bubble">
                <p className="hero-card__greeting">
                  &ldquo;Good morning, Helen. Today is Tuesday. Would you like to try your morning memory
                  puzzle or listen to peaceful music?&rdquo;
                </p>
              </div>
              <div className="hero-card__tech-pills">
                <span className="pill">Python</span>
                <span className="pill">Assistive UX</span>
                <span className="pill">Healthcare AI</span>
                <span className="pill">High Contrast</span>
              </div>
            </div>
            <div className="hero-card__action-hint">
              <span>Click to Open Cognitive Support Modal →</span>
            </div>
          </div>
        </div>
      )}

      {/* Slide 4: Project Collection Showcase (4 Cards) */}
      {slideId === 'project-collection' && (
        <div className="hero-card-stack__layer">
          {/* Card 1 (Rear): Python Algorithms & Automation Lab */}
          <div className="hero-card hero-card--back-4 hero-card--col-algo">
            <div className="hero-card__header">
              <span className="hero-card__badge-dot" />
              <span className="hero-card__title">PYTHON // ALGORITHMS & BENCHMARKS</span>
              <span className="hero-card__tag">LAB.01</span>
            </div>
            <div className="hero-card__body">
              <div className="hero-card__spec-row">
                <span className="hero-card__label">Test Suites Passing</span>
                <span className="hero-card__val">100% (64/64)</span>
              </div>
              <div className="hero-card__spec-row">
                <span className="hero-card__label">Search Complexity</span>
                <span className="hero-card__val">O(log n) Binary / Graph</span>
              </div>
              <div className="hero-card__tech-pills">
                <span className="pill">Python 3.12</span>
                <span className="pill">Automation</span>
                <span className="pill">Data Structures</span>
              </div>
            </div>
          </div>

          {/* Card 2 (Middle-Back): Simon Memory Sequencer */}
          <div className="hero-card hero-card--mid-back-4 hero-card--col-simon">
            <div className="hero-card__header">
              <span className="hero-card__badge-dot hero-card__badge-dot--red" />
              <span className="hero-card__title">SIMON // AUDIO-VISUAL SEQUENCER</span>
              <span className="hero-card__status-badge hero-card__status-badge--green">COMPLETE</span>
            </div>
            <div className="hero-card__simon-body">
              <div className="simon-quadrant-preview">
                <div className="simon-pad simon-pad--green" />
                <div className="simon-pad simon-pad--red is-active" />
                <div className="simon-pad simon-pad--yellow" />
                <div className="simon-pad simon-pad--blue" />
              </div>
              <div className="simon-stats">
                <span className="simon-score">Max Sequence: 18</span>
                <span className="simon-meta">Web Audio Synthesis</span>
              </div>
            </div>
          </div>

          {/* Card 3 (Middle): Spotify-Inspired Music Player */}
          <div className="hero-card hero-card--mid-front-4 hero-card--col-music">
            <div className="hero-card__header">
              <span className="hero-card__badge-dot" />
              <span className="hero-card__title">STREAMING UI // HTML5 AUDIO</span>
              <span className="hero-card__tag">NOW PLAYING</span>
            </div>
            <div className="hero-card__body">
              <div className="music-track-info">
                <div className="music-album-art">🎵</div>
                <div className="music-track-meta">
                  <span className="music-track-name">Midnight Echoes</span>
                  <span className="music-artist-name">Electronic Ambient</span>
                </div>
              </div>
              <div className="music-scrubber">
                <div className="music-scrubber-bar">
                  <div className="music-scrubber-fill" style={{ width: '45%' }} />
                </div>
                <div className="music-time-meta">
                  <span>01:48</span>
                  <span>04:12</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4 (Front - Focal): Showcase Catalog Hub */}
          <div
            className="hero-card hero-card--front-4 hero-card--col-catalog"
            onClick={() => {
              const el = document.getElementById('projects');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const el = document.getElementById('projects');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <div className="hero-card__header">
              <span className="hero-card__badge-dot hero-card__badge-dot--red" />
              <span className="hero-card__title">PROJECT CATALOG // TOP 10 BUILDS</span>
              <span className="hero-card__status-pill">CURATED</span>
            </div>
            <div className="hero-card__body">
              <p className="hero-card__desc">
                10 curated software engineering, AI architecture, and interactive web projects.
              </p>
              <div className="hero-card__catalog-snippets">
                <div className="catalog-row">
                  <span className="catalog-idx">#1</span>
                  <span className="catalog-title">DecisionVault / Trace</span>
                  <span className="catalog-tag">AI / Arch</span>
                </div>
                <div className="catalog-row">
                  <span className="catalog-idx">#2</span>
                  <span className="catalog-title">Cognitive Support Platform</span>
                  <span className="catalog-tag">Healthcare</span>
                </div>
                <div className="catalog-row">
                  <span className="catalog-idx">#3</span>
                  <span className="catalog-title">Streaming Music Player</span>
                  <span className="catalog-tag">HTML5 Audio</span>
                </div>
              </div>
            </div>
            <div className="hero-card__action-hint">
              <span>Browse All Projects in Full Showcase →</span>
            </div>
          </div>
        </div>
      )}

      {/* Command Center Status & Explorer Bar */}
      <div className="hero-ecosystem__command-bar">
        <div className="hero-ecosystem__live-pill">
          <span className="live-dot" />
          <span>GITHUB: @saureetc007</span>
        </div>

        <button
          type="button"
          className="hero-ecosystem__explorer-btn"
          onClick={onOpenRepoExplorer}
          aria-label="Open GitHub Repository and Technology Explorer"
        >
          <TechIcon name="git" size={15} />
          <span>EXPLORE REPOSITORIES (10+ BUILDS)</span>
          <span className="btn-arrow" aria-hidden="true">↗</span>
        </button>

        <button
          type="button"
          className="hero-ecosystem__terminal-btn"
          onClick={() => window.dispatchEvent(new CustomEvent('open-terminal'))}
          aria-label="Open Secret Developer Terminal"
          title="Terminal Console: Ctrl+` or click name 3x"
        >
          <span className="term-prompt-icon" aria-hidden="true">~</span>
          <span>TERMINAL</span>
        </button>
      </div>
    </div>
  );
}
