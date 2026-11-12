import { useState } from 'react';
import { BackgroundBeams } from './aceternity/BackgroundBeams';

interface NeuralNode {
  id: string;
  label: string;
  layer: 'input' | 'hidden' | 'output';
  value: string;
  weight: string;
}

const NODES: NeuralNode[] = [
  { id: 'in-1', label: 'x₁', layer: 'input', value: 'Feature Matrix [1024]', weight: 'w₁ = 0.82' },
  { id: 'in-2', label: 'x₂', layer: 'input', value: 'Embeddings [768]', weight: 'w₂ = 0.91' },
  { id: 'in-3', label: 'x₃', layer: 'input', value: 'Attention Weights', weight: 'w₃ = 0.74' },
  { id: 'hid-1', label: 'h₁', layer: 'hidden', value: 'ReLU(W₁x + b₁) = 0.88', weight: 'w₄ = 0.65' },
  { id: 'hid-2', label: 'h₂', layer: 'hidden', value: 'ReLU(W₂x + b₂) = 0.42', weight: 'w₅ = 0.38' },
  { id: 'hid-3', label: 'h₃', layer: 'hidden', value: 'ReLU(W₃x + b₃) = 0.95', weight: 'w₆ = 0.89' },
  { id: 'hid-4', label: 'h₄', layer: 'hidden', value: 'ReLU(W₄x + b₄) = 0.61', weight: 'w₇ = 0.52' },
  { id: 'out-1', label: 'y₁', layer: 'output', value: 'ADR Decision: ACCEPT (0.97)', weight: 'logits = 4.2' },
  { id: 'out-2', label: 'y₂', layer: 'output', value: 'Alternative Rejected (0.03)', weight: 'logits = -2.1' },
];

export function AIDataIntelligenceCardContent() {
  const [selectedNode, setSelectedNode] = useState<NeuralNode>(NODES[5]!);
  const [activeTab, setActiveTab] = useState<'network' | 'regression' | 'tensor'>('network');

  return (
    <div className="ai-card-content aceternity-card ai-card-content--lighting">
      {/* Aceternity Background Beams */}
      <BackgroundBeams />

      {/* Subtle Crimson / Charcoal Atmospheric Lighting */}
      <div className="ai-ambient-glow" aria-hidden="true" />

      {/* 1. Header Toolbar with Mode Switcher */}
      <div className="ai-card-content__header">
        <div className="ai-status-indicator">
          <span className="ai-pulse-dot" />
          <span className="ai-status-text">NEURAL GRAPH // INFERENCE PIPELINE</span>
        </div>

        <div className="ai-tabs" role="tablist" aria-label="AI Visualization Modes">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'network'}
            className={`ai-tab ${activeTab === 'network' ? 'is-active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('network');
            }}
          >
            Neural
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'regression'}
            className={`ai-tab ${activeTab === 'regression' ? 'is-active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('regression');
            }}
          >
            Regression
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'tensor'}
            className={`ai-tab ${activeTab === 'tensor' ? 'is-active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('tensor');
            }}
          >
            Tensors
          </button>
        </div>
      </div>

      {/* 2. Visual Canvas Area */}
      <div className="ai-card-content__canvas">
        {activeTab === 'network' && (
          <div className="neural-network-visual">
            <svg className="neural-synapses-svg" viewBox="0 0 340 160" aria-hidden="true">
              <defs>
                <linearGradient id="synapse-grad-ai" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#E50914" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#E50914" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              {/* Synaptic paths from Input to Hidden (Crimson & Monochrome Lighting) */}
              <line x1="30" y1="35" x2="160" y2="25" stroke="rgba(255, 255, 255, 0.22)" strokeWidth="1.2" />
              <line x1="30" y1="35" x2="160" y2="65" stroke="rgba(229, 9, 20, 0.45)" strokeWidth="1.2" />
              <line x1="30" y1="80" x2="160" y2="65" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="1.2" />
              <line x1="30" y1="80" x2="160" y2="105" stroke="rgba(229, 9, 20, 0.6)" strokeWidth="1.5" />
              <line x1="30" y1="125" x2="160" y2="105" stroke="rgba(255, 255, 255, 0.22)" strokeWidth="1.2" />
              <line x1="30" y1="125" x2="160" y2="145" stroke="rgba(229, 9, 20, 0.45)" strokeWidth="1.2" />

              {/* Synaptic paths from Hidden to Output */}
              <line x1="160" y1="25" x2="300" y2="55" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.2" />
              <line x1="160" y1="65" x2="300" y2="55" stroke="rgba(229, 9, 20, 0.65)" strokeWidth="1.6" />
              <line x1="160" y1="105" x2="300" y2="55" stroke="url(#synapse-grad-ai)" strokeWidth="2.2" className="synapse-pulse" />
              <line x1="160" y1="105" x2="300" y2="115" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.2" />
              <line x1="160" y1="145" x2="300" y2="115" stroke="rgba(229, 9, 20, 0.45)" strokeWidth="1.2" />
            </svg>

            {/* Interactive Nodes Layer */}
            <div className="neural-layers-row">
              {/* Input Layer */}
              <div className="neural-col">
                <span className="col-label">INPUT</span>
                {NODES.filter((n) => n.layer === 'input').map((node) => (
                  <button
                    key={node.id}
                    type="button"
                    className={`neural-node ${selectedNode.id === node.id ? 'is-active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNode(node);
                    }}
                    title={`${node.label}: ${node.value}`}
                  >
                    <span>{node.label}</span>
                  </button>
                ))}
              </div>

              {/* Hidden Layer */}
              <div className="neural-col">
                <span className="col-label">HIDDEN</span>
                {NODES.filter((n) => n.layer === 'hidden').map((node) => (
                  <button
                    key={node.id}
                    type="button"
                    className={`neural-node neural-node--hidden ${selectedNode.id === node.id ? 'is-active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNode(node);
                    }}
                    title={`${node.label}: ${node.value}`}
                  >
                    <span>{node.label}</span>
                  </button>
                ))}
              </div>

              {/* Output Layer */}
              <div className="neural-col">
                <span className="col-label">OUTPUT</span>
                {NODES.filter((n) => n.layer === 'output').map((node) => (
                  <button
                    key={node.id}
                    type="button"
                    className={`neural-node neural-node--output ${selectedNode.id === node.id ? 'is-active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNode(node);
                    }}
                    title={`${node.label}: ${node.value}`}
                  >
                    <span>{node.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'regression' && (
          <div className="linear-regression-visual">
            <div className="regression-chart-card">
              <div className="chart-meta">
                <span className="math-formula">ŷ = 0.84x + 1.25</span>
                <span className="chart-r2">ILLUSTRATIVE FIT // R² = 0.94</span>
              </div>
              <svg className="regression-svg" viewBox="0 0 280 110" aria-hidden="true">
                {/* Axes */}
                <line x1="25" y1="10" x2="25" y2="95" stroke="#444444" strokeWidth="1.2" />
                <line x1="25" y1="95" x2="265" y2="95" stroke="#444444" strokeWidth="1.2" />
                {/* Gridlines */}
                <line x1="25" y1="50" x2="265" y2="50" stroke="#222222" strokeDasharray="3,3" />
                <line x1="145" y1="10" x2="145" y2="95" stroke="#222222" strokeDasharray="3,3" />
                {/* Regression Line with red accent */}
                <line x1="30" y1="88" x2="255" y2="20" stroke="#E50914" strokeWidth="2.5" />
                {/* Scatter Data Points */}
                <circle cx="45" cy="82" r="3.2" fill="#FFFFFF" />
                <circle cx="70" cy="74" r="3.2" fill="#B3B3B3" />
                <circle cx="95" cy="79" r="3.2" fill="#FFFFFF" />
                <circle cx="120" cy="62" r="3.2" fill="#FFFFFF" />
                <circle cx="150" cy="50" r="4" fill="#E50914" />
                <circle cx="180" cy="46" r="3.2" fill="#B3B3B3" />
                <circle cx="210" cy="34" r="3.2" fill="#FFFFFF" />
                <circle cx="240" cy="22" r="3.2" fill="#FFFFFF" />
              </svg>
            </div>
          </div>
        )}

        {activeTab === 'tensor' && (
          <div className="tensor-data-visual">
            <div className="tensor-spec-block">
              <div className="tensor-title-row">
                <span className="tensor-name">np.ndarray</span>
                <span className="tensor-shape">shape: (1024, 768) • float32</span>
              </div>
              <div className="tensor-matrix-preview">
                <code>[[ 0.1428, -0.8912,  0.4190, ...],</code>
                <code> [ 0.0512,  0.7819, -0.2201, ...],</code>
                <code> [-0.6401,  0.1198,  0.9412, ...]]</code>
              </div>
            </div>

            <div className="sql-snippet-block">
              <span className="sql-tag">SQL QUERY STRUCTURE</span>
              <code>SELECT model_id, confidence FROM adr_records WHERE confidence &gt; 0.90;</code>
            </div>
          </div>
        )}
      </div>

      {/* 3. Telemetry Bar for Active Node / Model */}
      <div className="ai-card-content__telemetry">
        <div className="telemetry-item">
          <span className="telemetry-label">INSPECT:</span>
          <span className="telemetry-val">{selectedNode.label} ({selectedNode.value})</span>
        </div>
        <div className="telemetry-item telemetry-item--right">
          <span className="local-ai-pill">OLLAMA // LOCAL INFERENCE (DEMO)</span>
        </div>
      </div>
    </div>
  );
}
