import { useState } from 'react';

interface ArchitectureNode {
  id: string;
  name: string;
  category: string;
  latency: string;
  description: string;
  format: string;
  tag: string;
}

const NODES: ArchitectureNode[] = [
  {
    id: 'ingest',
    name: 'GitHub PR Ingestion',
    category: 'Source Thread',
    latency: '35ms',
    description: 'Parses engineering debate, author comments, and alternatives from GitHub discussion markdown.',
    format: 'Markdown / Git Diff',
    tag: 'SOURCE',
  },
  {
    id: 'extraction',
    name: 'Local LLM Extraction',
    category: 'Ollama Engine',
    latency: '115ms',
    description: 'Runs local inference on Apple Silicon/GPU. Extracts accepted decision and rejected alternatives without cloud data transfer.',
    format: 'Unstructured Text -> Schema',
    tag: 'LOCAL_AI',
  },
  {
    id: 'validation',
    name: 'Validation & Bounds Gate',
    category: 'Schema Gate',
    latency: '<10ms',
    description: 'Verifies Pydantic strict structure. Confirms explicit quotations link back to source conversation coordinates.',
    format: 'ADR-JSON v1.0',
    tag: 'INTEGRITY',
  },
  {
    id: 'storage',
    name: 'Embedded Persistence',
    category: 'SQLite & Git',
    latency: '<5ms',
    description: 'Persists structured decision records locally into SQLite. Automatically generates human-readable Markdown docs committed to repo.',
    format: 'SQLite + .md',
    tag: 'STORAGE',
  },
  {
    id: 'retrieval',
    name: 'Knowledge Traceability',
    category: 'Vector & FTS5',
    latency: '18ms',
    description: 'Fast retrieval of past architectural decisions. Developers search why decisions were made to prevent repeating settled debates.',
    format: 'Query Search Engine',
    tag: 'SEARCH',
  },
];

interface ArchitectureHologramProps {
  className?: string;
  onSelectNode?: (node: ArchitectureNode) => void;
}

export function ArchitectureHologram({
  className = '',
  onSelectNode,
}: ArchitectureHologramProps) {
  const [activeNodeId, setActiveNodeId] = useState<string>('extraction');

  const activeNode = NODES.find((n) => n.id === activeNodeId) || NODES[1]!;

  const handleSelect = (node: ArchitectureNode) => {
    setActiveNodeId(node.id);
    onSelectNode?.(node);
  };

  return (
    <div className={`arch-hologram ${className}`}>
      {/* 1. Header Bar with Holographic Telemetry Badge */}
      <div className="arch-hologram__header">
        <div className="arch-hologram__status">
          <span className="arch-hologram__pulse-dot" aria-hidden="true" />
          <span className="arch-hologram__title">DECISIONVAULT // ARCHITECTURE HOLOGRAM</span>
        </div>
        <div className="arch-hologram__telemetry">
          <span className="telemetry-badge">LOCAL-FIRST</span>
          <span className="telemetry-badge telemetry-badge--red">ZERO CLOUD FEES</span>
        </div>
      </div>

      {/* 2. Interactive Flow Pipeline Nodes with Animated SVG Connectors */}
      <div className="arch-hologram__pipeline">
        <svg
          className="arch-hologram__connectors"
          viewBox="0 0 500 40"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="hologram-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E50914" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#E50914" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#E50914" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path
            d="M 40,20 L 460,20"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M 40,20 L 460,20"
            stroke="url(#hologram-line-grad)"
            strokeWidth="2"
            strokeDasharray="8, 12"
            className="arch-flow-pulse"
            fill="none"
          />
        </svg>

        <div className="arch-hologram__nodes-row">
          {NODES.map((node, index) => {
            const isSelected = node.id === activeNodeId;
            return (
              <button
                key={node.id}
                type="button"
                className={`arch-node ${isSelected ? 'is-selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(node);
                }}
                onMouseEnter={() => handleSelect(node)}
                aria-pressed={isSelected}
              >
                <div className="arch-node__circle">
                  <span className="arch-node__step">0{index + 1}</span>
                </div>
                <span className="arch-node__label">{node.name}</span>
                <span className="arch-node__tag">{node.tag}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Real-Time Telemetry & Node Inspection Card */}
      <div className="arch-hologram__inspector">
        <div className="inspector-top">
          <div className="inspector-info">
            <span className="inspector-cat">{activeNode.category.toUpperCase()}</span>
            <h4 className="inspector-name">{activeNode.name}</h4>
          </div>
          <div className="inspector-metrics">
            <div className="metric-pill">
              <span className="metric-k">LATENCY</span>
              <span className="metric-v">{activeNode.latency}</span>
            </div>
            <div className="metric-pill">
              <span className="metric-k">FORMAT</span>
              <span className="metric-v">{activeNode.format}</span>
            </div>
          </div>
        </div>
        <p className="inspector-desc">{activeNode.description}</p>
        <div className="inspector-footer">
          <span className="inspector-signal">
            <span className="signal-led" aria-hidden="true" />
            <span>Traceability: Cryptographic Hash Linked to Git Commits</span>
          </span>
          <span className="inspector-privacy">Local-First (No API key required)</span>
        </div>
      </div>
    </div>
  );
}

