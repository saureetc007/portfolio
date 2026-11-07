import { useState, useRef, useEffect, useCallback } from 'react';
import { githubRepositories, developerTechStack } from '@/data/repositories';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'banner';
  content: string | React.ReactNode;
}

const WELCOME_BANNER: TerminalLine = {
  id: 'banner',
  type: 'banner',
  content: `╔══════════════════════════════════════════════════════════════╗
║   SAUREET CHAKRABARTI — DEVELOPER CONSOLE v2.6.4             ║
║   Computer Science & AI Student • Developer                  ║
║   GitHub: https://github.com/saureetc007                     ║
║                                                              ║
║   Type 'help' to inspect commands or 'exit' to close.        ║
╚══════════════════════════════════════════════════════════════╝`,
};

const COMMANDS = [
  'help',
  'projects',
  'skills',
  'github',
  'about',
  'contact',
  'repo',
  'clear',
  'exit',
];

interface SecretTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProject?: (projectId: string) => void;
}

export function SecretTerminal({
  isOpen,
  onClose,
  onOpenProject,
}: SecretTerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([WELCOME_BANNER]);
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on line change
  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [lines, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Trap Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const executeCommand = useCallback(
    (rawCmd: string) => {
      const trimmed = rawCmd.trim();
      const lower = trimmed.toLowerCase();
      const lineId = `${Date.now()}-${Math.random()}`;

      // Echo command
      const echoLine: TerminalLine = {
        id: `echo-${lineId}`,
        type: 'input',
        content: `saureet@portfolio:~$ ${trimmed}`,
      };

      if (!trimmed) {
        setLines((prev) => [...prev, echoLine]);
        return;
      }

      // Add to history
      setHistory((prev) => [...prev, trimmed]);
      setHistoryIndex(-1);

      let outputLine: TerminalLine;

      switch (lower) {
        case 'help': {
          outputLine = {
            id: `out-${lineId}`,
            type: 'output',
            content: (
              <div className="terminal-table">
                <div className="terminal-table__row">
                  <span className="terminal-cmd">projects</span>
                  <span className="terminal-desc">List featured software engineering & AI projects</span>
                </div>
                <div className="terminal-table__row">
                  <span className="terminal-cmd">skills</span>
                  <span className="terminal-desc">Print technical skills & programming languages</span>
                </div>
                <div className="terminal-table__row">
                  <span className="terminal-cmd">github</span>
                  <span className="terminal-desc">Inspect GitHub profile and repositories for saureetc007</span>
                </div>
                <div className="terminal-table__row">
                  <span className="terminal-cmd">about</span>
                  <span className="terminal-desc">Read developer bio and engineering philosophy</span>
                </div>
                <div className="terminal-table__row">
                  <span className="terminal-cmd">contact</span>
                  <span className="terminal-desc">Display email, LinkedIn, and collaboration links</span>
                </div>
                <div className="terminal-table__row">
                  <span className="terminal-cmd">clear</span>
                  <span className="terminal-desc">Clear the terminal screen</span>
                </div>
                <div className="terminal-table__row">
                  <span className="terminal-cmd">exit</span>
                  <span className="terminal-desc">Close the developer console</span>
                </div>
              </div>
            ),
          };
          break;
        }

        case 'projects': {
          outputLine = {
            id: `out-${lineId}`,
            type: 'output',
            content: (
              <div className="terminal-projects-list">
                <div className="terminal-proj-item">
                  <span className="proj-num">01.</span>
                  <strong className="proj-title">DecisionVault</strong>
                  <span className="proj-tags">[Python, Ollama, SQLite]</span>
                  <p className="proj-desc">
                    Local-first architecture decision record engine. Ingests GitHub debates and extracts structured decisions without cloud API fees.
                  </p>
                  {onOpenProject && (
                    <button
                      type="button"
                      className="terminal-link-btn"
                      onClick={() => {
                        onClose();
                        onOpenProject('decisiontrace');
                      }}
                    >
                      [Open Modal Preview]
                    </button>
                  )}
                </div>

                <div className="terminal-proj-item">
                  <span className="proj-num">02.</span>
                  <strong className="proj-title">Cognitive Support Platform</strong>
                  <span className="proj-tags">[React, TypeScript, Local AI]</span>
                  <p className="proj-desc">
                    Private assistive system supporting neurodivergent users and caregivers.
                  </p>
                  {onOpenProject && (
                    <button
                      type="button"
                      className="terminal-link-btn"
                      onClick={() => {
                        onClose();
                        onOpenProject('cognitivesupport');
                      }}
                    >
                      [Open Modal Preview]
                    </button>
                  )}
                </div>

                <div className="terminal-proj-item">
                  <span className="proj-num">03.</span>
                  <strong className="proj-title">Audio Streaming Player</strong>
                  <span className="proj-tags">[JavaScript, Web Audio API, HTML5]</span>
                  <p className="proj-desc">
                    Custom web audio streaming interface with playlist caching and live visualizer.
                  </p>
                </div>

                <div className="terminal-proj-item">
                  <span className="proj-num">04.</span>
                  <strong className="proj-title">Simon Memory Game</strong>
                  <span className="proj-tags">[Vanilla JS, CSS3, DOM]</span>
                  <p className="proj-desc">
                    Interactive audio-visual pattern memory sequence game.
                  </p>
                </div>
              </div>
            ),
          };
          break;
        }

        case 'skills': {
          const categories = ['language', 'framework', 'database', 'library', 'tool'] as const;
          outputLine = {
            id: `out-${lineId}`,
            type: 'output',
            content: (
              <div className="terminal-skills-list">
                {categories.map((cat) => {
                  const items = developerTechStack.filter((t) => t.category === cat);
                  const label = cat.toUpperCase();
                  return (
                    <div key={cat} className="terminal-skills-cat">
                      <span className="cat-title">[{label}]</span>
                      <span className="cat-items">
                        {items.map((i) => i.name).join(', ')}
                      </span>
                    </div>
                  );
                })}
              </div>
            ),
          };
          break;
        }

        case 'github': {
          outputLine = {
            id: `out-${lineId}`,
            type: 'success',
            content: (
              <div className="terminal-github-block">
                <p>GitHub Profile: <a href="https://github.com/saureetc007" target="_blank" rel="noopener noreferrer" className="terminal-url">https://github.com/saureetc007</a></p>
                <p>Public Repositories: {githubRepositories.length} indexed</p>
                <ul className="terminal-repo-list">
                  {githubRepositories.slice(0, 5).map((repo) => (
                    <li key={repo.id}>
                      <a href={repo.htmlUrl} target="_blank" rel="noopener noreferrer" className="terminal-url">
                        {repo.name}
                      </a>{' '}
                      ({repo.language}) — {repo.description}
                    </li>
                  ))}
                </ul>
              </div>
            ),
          };
          break;
        }

        case 'about': {
          outputLine = {
            id: `out-${lineId}`,
            type: 'output',
            content: (
              <div className="terminal-about-block">
                <p><strong>Name:</strong> Saureet Chakrabarti</p>
                <p><strong>Focus:</strong> Computer Science and AI student & builder</p>
                <p><strong>Philosophy:</strong> Local-first intelligence, high-performance web systems, privacy-preserving AI architectures, and cinematic user interfaces.</p>
                <p><strong>Status:</strong> Ready for software engineering internships and AI developer roles.</p>
              </div>
            ),
          };
          break;
        }

        case 'contact': {
          outputLine = {
            id: `out-${lineId}`,
            type: 'output',
            content: (
              <div className="terminal-contact-block">
                <p>LinkedIn: <a href="https://www.linkedin.com/in/saureet-chakrabarti-140a59238/" target="_blank" rel="noopener noreferrer" className="terminal-url">linkedin.com/in/saureet-chakrabarti-140a59238/</a></p>
                <p>GitHub: <a href="https://github.com/saureetc007" target="_blank" rel="noopener noreferrer" className="terminal-url">github.com/saureetc007</a></p>
                <p>Portfolio: Saureet Chakrabarti Cinematic Portfolio</p>
              </div>
            ),
          };
          break;
        }

        case 'clear': {
          setLines([]);
          return;
        }

        case 'exit': {
          onClose();
          return;
        }

        default: {
          outputLine = {
            id: `out-${lineId}`,
            type: 'error',
            content: `Command not recognized: '${trimmed}'. Type 'help' to view available commands.`,
          };
          break;
        }
      }

      setLines((prev) => [...prev, echoLine, outputLine]);
    },
    [onClose, onOpenProject]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    executeCommand(inputVal);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIndex + 1 < history.length ? historyIndex + 1 : historyIndex;
      setHistoryIndex(nextIdx);
      const cmd = history[history.length - 1 - nextIdx];
      if (cmd) setInputVal(cmd);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        const cmd = history[history.length - 1 - nextIdx];
        if (cmd) setInputVal(cmd);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const match = COMMANDS.find((c) => c.startsWith(inputVal.toLowerCase()));
      if (match) setInputVal(match);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="terminal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Developer Interactive Terminal"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="terminal-window"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header */}
        <div className="terminal-window__header">
          <div className="terminal-window__dots">
            <button
              type="button"
              className="term-dot term-dot--close"
              onClick={onClose}
              aria-label="Close terminal"
            />
            <span className="term-dot term-dot--minimize" aria-hidden="true" />
            <span className="term-dot term-dot--expand" aria-hidden="true" />
          </div>
          <span className="terminal-window__title">saureet@dev-terminal:~ (bash)</span>
          <span className="terminal-window__shortcut">ESC to exit</span>
        </div>

        {/* Terminal Body */}
        <div
          className="terminal-window__body"
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((l) => (
            <div key={l.id} className={`terminal-line terminal-line--${l.type}`}>
              {l.type === 'banner' ? (
                <pre className="terminal-banner">{l.content}</pre>
              ) : (
                l.content
              )}
            </div>
          ))}

          {/* Active Input Line */}
          <form onSubmit={handleSubmit} className="terminal-form">
            <span className="terminal-prompt">saureet@portfolio:~$</span>
            <input
              ref={inputRef}
              type="text"
              className="terminal-input"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              aria-label="Terminal command input"
            />
          </form>

          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
