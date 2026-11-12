import { useState, useCallback } from 'react';
import { SkillIcon } from './SkillIcons';
import { DecryptedText } from './react-bits/DecryptedText';

interface CodeSnippet {
  fileName: string;
  lang: string;
  icon: string;
  command: string;
  output: string;
  lines: Array<{
    num: string;
    tokens: Array<{ text: string; type?: 'kw' | 'fn' | 'type' | 'str' | 'comment' | 'num' | 'punct' }>;
  }>;
}

const SNIPPETS: Record<string, CodeSnippet> = {
  python: {
    fileName: 'engine.py',
    lang: 'Python 3.11',
    icon: 'python',
    command: 'python -m engine --vectorize-embeddings --threads=8',
    output: '[SIMULATION]: 1024 tensor embeddings normalized (shape: [1024, 768]). Status: OK (Exit: 0)',
    lines: [
      {
        num: '01',
        tokens: [
          { text: 'def', type: 'kw' },
          { text: ' vectorize_stream' },
          { text: '(data: ' },
          { text: 'list', type: 'type' },
          { text: '[' },
          { text: 'dict', type: 'type' },
          { text: ']) -> ' },
          { text: 'ndarray', type: 'type' },
          { text: ':' },
        ],
      },
      {
        num: '02',
        tokens: [
          { text: '    """High-throughput tensor transformation."""', type: 'comment' },
        ],
      },
      {
        num: '03',
        tokens: [
          { text: '    embeddings = np.' },
          { text: 'array', type: 'fn' },
          { text: '([item[' },
          { text: '"features"', type: 'str' },
          { text: '] ' },
          { text: 'for', type: 'kw' },
          { text: ' item ' },
          { text: 'in', type: 'kw' },
          { text: ' data])' },
        ],
      },
      {
        num: '04',
        tokens: [
          { text: '    norm = np.linalg.' },
          { text: 'norm', type: 'fn' },
          { text: '(embeddings, axis=' },
          { text: '1', type: 'num' },
          { text: ', keepdims=' },
          { text: 'True', type: 'kw' },
          { text: ')' },
        ],
      },
      {
        num: '05',
        tokens: [
          { text: '    ' },
          { text: 'return', type: 'kw' },
          { text: ' np.' },
          { text: 'divide', type: 'fn' },
          { text: '(embeddings, norm, out=embeddings)' },
        ],
      },
      {
        num: '06',
        tokens: [
          { text: '    # Real-time cosine similarity matrix calculation', type: 'comment' },
        ],
      },
    ],
  },
  javascript: {
    fileName: 'runtime.js',
    lang: 'JavaScript ES6+',
    icon: 'javascript',
    command: 'node --experimental-vm-modules runtime.js',
    output: '[SIMULATION]: Event loop microtask queue drained. 48/48 unit assertions passed.',
    lines: [
      {
        num: '01',
        tokens: [
          { text: 'export async function', type: 'kw' },
          { text: ' dispatchPipeline' },
          { text: '(signal) {' },
        ],
      },
      {
        num: '02',
        tokens: [
          { text: '  // Non-blocking browser event loop execution', type: 'comment' },
        ],
      },
      {
        num: '03',
        tokens: [
          { text: '  const', type: 'kw' },
          { text: ' stream = ' },
          { text: 'await', type: 'kw' },
          { text: ' audioContext.' },
          { text: 'decodeBuffer', type: 'fn' },
          { text: '(signal);' },
        ],
      },
      {
        num: '04',
        tokens: [
          { text: '  const', type: 'kw' },
          { text: ' pool = ' },
          { text: 'new', type: 'kw' },
          { text: ' WorkerPool({ maxConcurrency: ' },
          { text: '4', type: 'num' },
          { text: ' });' },
        ],
      },
      {
        num: '05',
        tokens: [
          { text: '  ' },
          { text: 'return', type: 'kw' },
          { text: ' pool.' },
          { text: 'execute', type: 'fn' },
          { text: '(stream);' },
        ],
      },
      {
        num: '06',
        tokens: [
          { text: '  // Zero-copy ArrayBuffer transfer across worker threads', type: 'comment' },
        ],
      },
    ],
  },
};

export function CodeEngineeringCardContent() {
  const [activeTab, setActiveTab] = useState<'python' | 'javascript'>('python');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [runSuccess, setRunSuccess] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);

  const snippet = SNIPPETS[activeTab];

  const handleRun = useCallback(() => {
    setIsRunning(true);
    setRunSuccess(false);
    setTimeout(() => {
      setIsRunning(false);
      setRunSuccess(true);
    }, 600);
  }, []);

  const handleCopy = useCallback(() => {
    const raw = snippet.lines.map((l) => l.tokens.map((t) => t.text).join('')).join('\n');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(raw).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }, [snippet]);

  return (
    <div className="code-card-content code-card-content--prominent">
      {/* 1. Terminal Window Bar */}
      <div className="code-card-content__header">
        <div className="code-card-content__dots" aria-hidden="true">
          <span className="dot dot--red" />
          <span className="dot dot--yellow" />
          <span className="dot dot--green" />
        </div>

        {/* React Bits Animated Tabs */}
        <div className="code-card-content__tabs" role="tablist" aria-label="Code File Tabs">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'python'}
            className={`code-card-content__tab ${activeTab === 'python' ? 'is-active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('python');
            }}
          >
            <SkillIcon name="python" size={13} />
            <DecryptedText text="engine.py" speed={30} maxIterations={6} animateOn="hover" />
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'javascript'}
            className={`code-card-content__tab ${activeTab === 'javascript' ? 'is-active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('javascript');
            }}
          >
            <SkillIcon name="javascript" size={13} />
            <DecryptedText text="runtime.js" speed={30} maxIterations={6} animateOn="hover" />
          </button>
        </div>

        {/* Actions: Run Code & Copy */}
        <div className="code-header-actions">
          <button
            type="button"
            className={`run-code-btn run-code-btn--prominent ${isRunning ? 'is-running' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleRun();
            }}
            title="Execute code snippet"
            aria-label="Run code snippet"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10" aria-hidden="true">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span>{isRunning ? 'Compiling...' : 'Run'}</span>
          </button>

          <button
            type="button"
            className="copy-code-mini-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            title="Copy code snippet"
            aria-label={copied ? 'Code copied' : 'Copy code'}
          >
            {copied ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="#27C93F" strokeWidth="2.5" width="11" height="11">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* 2. Editor Body with cursor & line hover highlight */}
      <div className="code-card-content__body">
        <div className="code-lines">
          {snippet.lines.map((line) => (
            <div
              key={line.num}
              className={`code-line ${hoveredLine === line.num ? 'is-line-hovered' : ''}`}
              onMouseEnter={() => setHoveredLine(line.num)}
              onMouseLeave={() => setHoveredLine(null)}
            >
              <span className="code-num" aria-hidden="true">{line.num}</span>
              <span className="code-text">
                {line.tokens.map((tok, idx) => (
                  <span key={idx} className={tok.type ? `tok-${tok.type}` : undefined}>
                    {tok.text}
                  </span>
                ))}
              </span>
            </div>
          ))}
          <div className="code-line code-line--active">
            <span className="code-num code-num--active" aria-hidden="true">07</span>
            <span className="code-text">
              <span className="typing-cursor" aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>

      {/* 3. Terminal Execution Output (React Bits style decrypted output) */}
      <div className="code-card-content__terminal">
        <div className="terminal-bar-top">
          <span className="terminal-title">
            <span className="terminal-prompt-sym">❯ </span>
            <DecryptedText key={snippet.fileName} text={snippet.command} speed={25} maxIterations={8} animateOn="mount" />
          </span>
          <span className={`terminal-indicator ${runSuccess ? 'is-success' : 'is-loading'}`}>
            {isRunning ? '● COMPILING' : '● SIMULATED RUNTIME'}
          </span>
        </div>
        <p className="terminal-output-text">
          <DecryptedText
            key={`${snippet.fileName}-${runSuccess}`}
            text={snippet.output}
            speed={20}
            maxIterations={5}
            animateOn="mount"
          />
        </p>
      </div>

      {/* 4. IDE Status Bar */}
      <div className="code-editor-status-bar" aria-hidden="true">
        <div className="status-bar-left">
          <span className="status-item status-item--red">
            <span className="status-dot-pulse" />
            PRIMARY LOGIC
          </span>
          <span className="status-item">{snippet.lang}</span>
          <span className="status-item">UTF-8</span>
        </div>
        <div className="status-bar-right">
          <span className="status-item">Ln 7, Col 1</span>
          <span className="status-item">Spaces: 4</span>
          <span className="status-item status-item--git">git: main*</span>
        </div>
      </div>
    </div>
  );
}
