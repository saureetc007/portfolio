import { useState, useCallback } from 'react';

interface CodeFile {
  name: string;
  language: string;
  extension: 'py' | 'tsx' | 'md';
  rawCode: string;
  lines: Array<{
    tokens: Array<{ text: string; type?: 'kw' | 'fn' | 'type' | 'str' | 'comment' | 'num' | 'punct' }>;
  }>;
}

const FILES: Record<string, CodeFile> = {
  'pipeline.py': {
    name: 'pipeline.py',
    language: 'Python',
    extension: 'py',
    rawCode: `# DecisionVault: Local ADR Extraction Engine
import json
from ollama import Client
from typing import Dict, Any

class DecisionPipeline:
    def __init__(self, model: str = "llama3.2"):
        self.client = Client()
        self.model = model

    def parse_discussion(self, thread: str) -> Dict[str, Any]:
        """Local-first inference: Zero cloud fees or telemetry."""
        prompt = "Extract decision, tradeoffs & rationale into JSON."
        res = self.client.generate(
            model=self.model,
            prompt=f"{prompt}\\n\\n{thread}",
            format="json",
            options={"temperature": 0.1}
        )
        return json.loads(res["response"])`,
    lines: [
      {
        tokens: [
          { text: '# DecisionVault: Local ADR Extraction Engine', type: 'comment' },
        ],
      },
      {
        tokens: [
          { text: 'import', type: 'kw' },
          { text: ' json' },
        ],
      },
      {
        tokens: [
          { text: 'from', type: 'kw' },
          { text: ' ollama ' },
          { text: 'import', type: 'kw' },
          { text: ' Client' },
        ],
      },
      {
        tokens: [
          { text: 'from', type: 'kw' },
          { text: ' typing ' },
          { text: 'import', type: 'kw' },
          { text: ' Dict, Any' },
        ],
      },
      { tokens: [] },
      {
        tokens: [
          { text: 'class', type: 'kw' },
          { text: ' DecisionPipeline' },
          { text: ':', type: 'punct' },
        ],
      },
      {
        tokens: [
          { text: '    def', type: 'kw' },
          { text: ' __init__' },
          { text: '(self, model: ' },
          { text: 'str', type: 'type' },
          { text: ' = ' },
          { text: '"llama3.2"', type: 'str' },
          { text: '):' },
        ],
      },
      {
        tokens: [
          { text: '        self.client = ' },
          { text: 'Client', type: 'fn' },
          { text: '()' },
        ],
      },
      {
        tokens: [{ text: '        self.model = model' }],
      },
      { tokens: [] },
      {
        tokens: [
          { text: '    def', type: 'kw' },
          { text: ' parse_discussion' },
          { text: '(self, thread: ' },
          { text: 'str', type: 'type' },
          { text: ') -> ' },
          { text: 'Dict', type: 'type' },
          { text: '[str, Any]:' },
        ],
      },
      {
        tokens: [
          { text: '        """Local-first inference: Zero data loss."""', type: 'comment' },
        ],
      },
      {
        tokens: [
          { text: '        prompt = ' },
          { text: '"Extract decision, tradeoffs & rationale into JSON."', type: 'str' },
        ],
      },
      {
        tokens: [
          { text: '        res = self.client.' },
          { text: 'generate', type: 'fn' },
          { text: '(' },
        ],
      },
      {
        tokens: [
          { text: '            model=self.model,' },
        ],
      },
      {
        tokens: [
          { text: '            prompt=' },
          { text: 'f"{prompt}\\n\\n{thread}"', type: 'str' },
          { text: ',' },
        ],
      },
      {
        tokens: [
          { text: '            format=' },
          { text: '"json"', type: 'str' },
          { text: ',' },
        ],
      },
      {
        tokens: [
          { text: '            options={' },
          { text: '"temperature"', type: 'str' },
          { text: ': ' },
          { text: '0.1', type: 'num' },
          { text: '}' },
        ],
      },
      {
        tokens: [{ text: '        )' }],
      },
      {
        tokens: [
          { text: '        return json.' },
          { text: 'loads', type: 'fn' },
          { text: '(res[' },
          { text: '"response"', type: 'str' },
          { text: '])' },
        ],
      },
    ],
  },
  'App.tsx': {
    name: 'App.tsx',
    language: 'TypeScript',
    extension: 'tsx',
    rawCode: `// Netflix-inspired Streaming Portfolio Experience
import { useState, useCallback } from 'react';
import { HeroAtmosphere } from './HeroAtmosphere';
import { HeroCardStack } from './HeroCardStack';

export function NetflixHeroShowcase() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % 4);
  }, []);

  return (
    <div className="hero__command-center">
      <HeroAtmosphere density="cinematic" accent="#E50914" />
      <HeroCardStack slideId="developer-spotlight" isActive={true} />
    </div>
  );
}`,
    lines: [
      {
        tokens: [
          { text: '// Netflix-inspired Streaming Portfolio Experience', type: 'comment' },
        ],
      },
      {
        tokens: [
          { text: 'import', type: 'kw' },
          { text: ' { useState, useCallback } ' },
          { text: 'from', type: 'kw' },
          { text: " 'react'", type: 'str' },
          { text: ';' },
        ],
      },
      {
        tokens: [
          { text: 'import', type: 'kw' },
          { text: ' { HeroAtmosphere } ' },
          { text: 'from', type: 'kw' },
          { text: " './HeroAtmosphere'", type: 'str' },
          { text: ';' },
        ],
      },
      {
        tokens: [
          { text: 'import', type: 'kw' },
          { text: ' { HeroCardStack } ' },
          { text: 'from', type: 'kw' },
          { text: " './HeroCardStack'", type: 'str' },
          { text: ';' },
        ],
      },
      { tokens: [] },
      {
        tokens: [
          { text: 'export function', type: 'kw' },
          { text: ' NetflixHeroShowcase' },
          { text: '() {' },
        ],
      },
      {
        tokens: [
          { text: '  const', type: 'kw' },
          { text: ' [currentSlide, setCurrentSlide] = ' },
          { text: 'useState', type: 'fn' },
          { text: '<' },
          { text: 'number', type: 'type' },
          { text: '>(0);' },
        ],
      },
      {
        tokens: [
          { text: '  const', type: 'kw' },
          { text: ' [isPaused, setIsPaused] = ' },
          { text: 'useState', type: 'fn' },
          { text: '<' },
          { text: 'boolean', type: 'type' },
          { text: '>(false);' },
        ],
      },
      { tokens: [] },
      {
        tokens: [
          { text: '  const', type: 'kw' },
          { text: ' handleNext = ' },
          { text: 'useCallback', type: 'fn' },
          { text: '(() => {' },
        ],
      },
      {
        tokens: [
          { text: '    setCurrentSlide((prev) => (prev + 1) % 4);' },
        ],
      },
      {
        tokens: [{ text: '  }, []);' }],
      },
      { tokens: [] },
      {
        tokens: [
          { text: '  return (' },
        ],
      },
      {
        tokens: [
          { text: '    <div className=' },
          { text: '"hero__command-center"', type: 'str' },
          { text: '>' },
        ],
      },
      {
        tokens: [
          { text: '      <HeroAtmosphere density=' },
          { text: '"cinematic"', type: 'str' },
          { text: ' accent=' },
          { text: '"#E50914"', type: 'str' },
          { text: ' />' },
        ],
      },
      {
        tokens: [
          { text: '      <HeroCardStack slideId=' },
          { text: '"developer-spotlight"', type: 'str' },
          { text: ' isActive={true} />' },
        ],
      },
      {
        tokens: [{ text: '    </div>' }],
      },
      {
        tokens: [{ text: '  );' }],
      },
      {
        tokens: [{ text: '}' }],
      },
    ],
  },
  'README.md': {
    name: 'README.md',
    language: 'Markdown',
    extension: 'md',
    rawCode: `# Saureet Chakrabarti // CS & AI Portfolio
> High-performance systems, local-first LLMs, and interactive graphics.

### Core Focus Areas
- Local Machine Learning & Autonomous Agents (Ollama, PyTorch)
- Scalable Frontend Architectures (React 19 + TypeScript)
- Systems Traceability & ADR extraction (DecisionVault)

### Live Links
- GitHub: https://github.com/saureetc007
- LinkedIn: https://www.linkedin.com/in/saureet-chakrabarti-140a59238/
- Status: Ready for Software Engineering & AI Roles`,
    lines: [
      {
        tokens: [
          { text: '# Saureet Chakrabarti // CS & AI Portfolio', type: 'kw' },
        ],
      },
      {
        tokens: [
          { text: '> Local-first AI, high-performance web systems & graphics.', type: 'comment' },
        ],
      },
      { tokens: [] },
      {
        tokens: [
          { text: '### Core Architecture Paradigms', type: 'type' },
        ],
      },
      {
        tokens: [
          { text: '- Local Inference (Ollama Llama 3.2 / Zero cloud fees)' },
        ],
      },
      {
        tokens: [
          { text: '- Modern React 19 Frontend + TypeScript + Three.js' },
        ],
      },
      {
        tokens: [
          { text: '- Automated ADR Ingestion from Git Discussions' },
        ],
      },
      { tokens: [] },
      {
        tokens: [
          { text: '### Identity & Verified Profiles', type: 'type' },
        ],
      },
      {
        tokens: [
          { text: '- GitHub: ' },
          { text: 'https://github.com/saureetc007', type: 'str' },
        ],
      },
      {
        tokens: [
          { text: '- LinkedIn: ' },
          { text: 'saureet-chakrabarti', type: 'str' },
        ],
      },
      {
        tokens: [
          { text: '- Status: ' },
          { text: 'Active Developer // Building Products', type: 'fn' },
        ],
      },
    ],
  },
};

interface MiniCodeEditorProps {
  className?: string;
  defaultFile?: string;
}

export function MiniCodeEditor({
  className = '',
  defaultFile = 'pipeline.py',
}: MiniCodeEditorProps) {
  const [activeFileKey, setActiveFileKey] = useState<string>(defaultFile);
  const [copied, setCopied] = useState<boolean>(false);

  const activeFile = FILES[activeFileKey] || FILES['pipeline.py']!;

  const handleCopy = useCallback(() => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(activeFile.rawCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  }, [activeFile]);

  return (
    <div className={`mini-code-editor ${className}`}>
      {/* 1. Header Bar: Window Dots + Tabs + Copy Button */}
      <div className="mini-code-editor__header">
        <div className="mini-code-editor__mac-dots" aria-hidden="true">
          <span className="dot dot--red" />
          <span className="dot dot--yellow" />
          <span className="dot dot--green" />
        </div>

        <div className="mini-code-editor__tabs" role="tablist" aria-label="Editor File Tabs">
          {Object.keys(FILES).map((fileName) => {
            const file = FILES[fileName]!;
            const isActive = fileName === activeFileKey;
            return (
              <button
                key={fileName}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`mini-code-editor__tab ${isActive ? 'is-active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveFileKey(fileName);
                }}
              >
                <span className={`tab-file-dot tab-file-dot--${file.extension}`} aria-hidden="true" />
                <span className="tab-filename">{file.name}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className={`mini-code-editor__copy-btn ${copied ? 'is-copied' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            handleCopy();
          }}
          title="Copy snippet to clipboard"
          aria-label={copied ? 'Code snippet copied' : 'Copy code snippet'}
        >
          {copied ? (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="copy-icon" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="copy-text">Copied!</span>
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="copy-icon" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span className="copy-text">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Editor Body: Line Numbers + Syntax Highlighted Content */}
      <div className="mini-code-editor__body" tabIndex={0} aria-label={`${activeFile.name} code preview`}>
        <div className="mini-code-editor__lines">
          {activeFile.lines.map((line, idx) => {
            const lineNum = idx + 1;
            return (
              <div key={lineNum} className="editor-line">
                <span className="line-num" aria-hidden="true">
                  {lineNum < 10 ? `0${lineNum}` : lineNum}
                </span>
                <span className="line-content">
                  {line.tokens.length === 0 ? (
                    '\u00A0'
                  ) : (
                    line.tokens.map((token, tIdx) => (
                      <span
                        key={tIdx}
                        className={token.type ? `token-${token.type}` : undefined}
                      >
                        {token.text}
                      </span>
                    ))
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Status Bar: Language, Git Branch, Passing Tests */}
      <div className="mini-code-editor__status-bar">
        <div className="status-item status-branch">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="status-icon" aria-hidden="true">
            <line x1="6" y1="3" x2="6" y2="15" />
            <circle cx="18" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <path d="M18 9a9 9 0 0 1-9 9" />
          </svg>
          <span>main*</span>
        </div>
        <div className="status-item status-tests">
          <span className="status-dot-green" aria-hidden="true" />
          <span>Passing 48/48</span>
        </div>
        <div className="status-item status-lang">
          <span>{activeFile.language}</span>
        </div>
        <div className="status-item status-enc">
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
}

