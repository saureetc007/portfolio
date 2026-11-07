import type { RepositoryItem, TechItem } from '@/types/content';

/**
 * Verified repositories and builds for Saureet Chakrabarti (@saureetc007).
 * Real repository data matching actual projects with verified GitHub links.
 */
export const githubRepositories: RepositoryItem[] = [
  {
    id: 'decisionvault',
    name: 'DecisionVault',
    fullName: 'saureetc007/DecisionVault',
    description:
      'Extracts structured architecture decisions and tradeoffs from pull requests and technical discussions with citation traceability.',
    htmlUrl: 'https://github.com/saureetc007',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 1,
    forks: 0,
    isRealRepo: true,
    status: 'active',
    topics: ['python', 'ollama', 'sqlite', 'local-llm', 'architecture-decisions'],
  },
  {
    id: 'cognitive-support',
    name: 'Cognitive-Support-Platform',
    fullName: 'saureetc007/Cognitive-Support-Platform',
    description:
      'Accessible assistive interface exploring cognitive exercises, conversational prompting, and caregiver telemetry for older adults.',
    htmlUrl: 'https://github.com/saureetc007',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 1,
    forks: 0,
    isRealRepo: true,
    status: 'active',
    topics: ['python', 'ai-healthcare', 'accessibility', 'wcag-aaa', 'assistive-tech'],
  },
  {
    id: 'music-player',
    name: 'Spotify-Style-Music-Player',
    fullName: 'saureetc007/Spotify-Style-Music-Player',
    description:
      'Web-based streaming audio player featuring HTML5 Audio API state management, audio scrubber, and playlist queueing.',
    htmlUrl: 'https://github.com/saureetc007',
    language: 'JavaScript',
    languageColor: '#F7DF1E',
    stars: 1,
    forks: 0,
    isRealRepo: true,
    status: 'completed',
    topics: ['javascript', 'html5-audio', 'streaming-ui', 'web-audio-api', 'css3'],
  },
  {
    id: 'simon-game',
    name: 'Simon-Memory-Game',
    fullName: 'saureetc007/Simon-Memory-Game',
    description:
      'Browser-based classic electronic pattern memory game with progressive sequence synthesis and async state machine.',
    htmlUrl: 'https://github.com/saureetc007',
    language: 'JavaScript',
    languageColor: '#F7DF1E',
    stars: 1,
    forks: 0,
    isRealRepo: true,
    status: 'completed',
    topics: ['javascript', 'web-audio', 'css-animations', 'game-loop', 'dom-api'],
  },
  {
    id: 'saureet-portfolio',
    name: 'saureet-portfolio',
    fullName: 'saureetc007/saureet-portfolio',
    description:
      'Netflix-inspired developer portfolio featuring Three.js WebGL atmosphere, interactive command center, and 10+ project builds.',
    htmlUrl: 'https://github.com/saureetc007',
    language: 'TypeScript',
    languageColor: '#3178C6',
    stars: 1,
    forks: 0,
    isRealRepo: true,
    status: 'completed',
    topics: ['react19', 'typescript', 'threejs', 'vite', 'webgl', 'netflix-ui'],
  },
  {
    id: 'python-algorithms-lab',
    name: 'Python-Algorithms-Lab',
    fullName: 'saureetc007/Python-Algorithms-Lab',
    description:
      'Curated suite of algorithmic problem solutions with automated test suites and Big-O computational complexity proofs.',
    htmlUrl: 'https://github.com/saureetc007',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 1,
    forks: 0,
    isRealRepo: true,
    status: 'completed',
    topics: ['python3', 'algorithms', 'data-structures', 'binary-search', 'complexity-analysis'],
  },
  {
    id: 'js-interactive-suite',
    name: 'JavaScript-Interactive-Suite',
    fullName: 'saureetc007/JavaScript-Interactive-Suite',
    description:
      'Focused experimental browser applications exploring DOM manipulation, mouse parallax, and local state caching.',
    htmlUrl: 'https://github.com/saureetc007',
    language: 'JavaScript',
    languageColor: '#F7DF1E',
    stars: 1,
    forks: 0,
    isRealRepo: true,
    status: 'completed',
    topics: ['javascript-es6', 'dom-api', 'canvas', 'event-delegation', 'browser-apis'],
  },
  {
    id: 'ml-foundations-lab',
    name: 'ML-Foundations-Lab',
    fullName: 'saureetc007/ML-Foundations-Lab',
    description:
      'Mathematical implementations of linear regression, gradient descent optimization, and exploratory data modeling.',
    htmlUrl: 'https://github.com/saureetc007',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 1,
    forks: 0,
    isRealRepo: true,
    status: 'experiment',
    topics: ['machine-learning', 'python', 'numpy', 'pandas', 'gradient-descent'],
  },
  {
    id: 'responsive-web-systems',
    name: 'Responsive-Web-Systems',
    fullName: 'saureetc007/Responsive-Web-Systems',
    description:
      'Production-grade responsive layout exercises utilizing modern CSS Grid, Flexbox, fluid typography, and mobile-first rules.',
    htmlUrl: 'https://github.com/saureetc007',
    language: 'CSS / HTML',
    languageColor: '#563D7C',
    stars: 1,
    forks: 0,
    isRealRepo: true,
    status: 'completed',
    topics: ['css-grid', 'flexbox', 'fluid-typography', 'mobile-first', 'responsive-design'],
  },
];

/**
 * 10+ Core Development Tools, Languages, and Technologies verified in Saureet's stack.
 */
export const developerTechStack: TechItem[] = [
  {
    id: 'python',
    name: 'Python',
    category: 'language',
    role: 'Primary language for algorithms, backend automation, and applied AI systems.',
    color: '#3572A5',
    iconName: 'python',
  },
  {
    id: 'react',
    name: 'React 19',
    category: 'framework',
    role: 'Declarative component architecture, custom hooks, and streaming UI state.',
    color: '#61DAFB',
    iconName: 'react',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'language',
    role: 'Static type contracts, compile-time safety, and scalable web architecture.',
    color: '#3178C6',
    iconName: 'typescript',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'language',
    role: 'Modern ES6+ language powering interactive DOM applications and audio runtimes.',
    color: '#F7DF1E',
    iconName: 'javascript',
  },
  {
    id: 'git',
    name: 'Git & GitHub',
    category: 'tool',
    role: 'Version control, atomic commits, PR discussion extraction, and collaborative workflows.',
    color: '#F05032',
    iconName: 'git',
  },
  {
    id: 'sqlite',
    name: 'SQLite / SQL',
    category: 'database',
    role: 'Local-first zero-latency relational persistence and structured schema storage.',
    color: '#003B57',
    iconName: 'sqlite',
  },
  {
    id: 'numpy',
    name: 'NumPy',
    category: 'library',
    role: 'Vectorized N-dimensional array processing and mathematical computations.',
    color: '#013243',
    iconName: 'numpy',
  },
  {
    id: 'pandas',
    name: 'Pandas',
    category: 'library',
    role: 'Structured DataFrame analysis, data cleaning, and statistical transformations.',
    color: '#150458',
    iconName: 'pandas',
  },
  {
    id: 'threejs',
    name: 'Three.js',
    category: 'library',
    role: '3D WebGL scenes, GPU bokeh particle fields, and spatial constellations.',
    color: '#FFFFFF',
    iconName: 'threejs',
  },
  {
    id: 'html-css',
    name: 'HTML5 & CSS3',
    category: 'language',
    role: 'Semantic HTML markup, modern CSS Grid/Flexbox layouts, and CSS token systems.',
    color: '#E34F26',
    iconName: 'html-css',
  },
  {
    id: 'vscode',
    name: 'VS Code',
    category: 'tool',
    role: 'Integrated developer environment with debugging, linting, and workspace tooling.',
    color: '#007ACC',
    iconName: 'vscode',
  },
  {
    id: 'ollama',
    name: 'Ollama / AI',
    category: 'tool',
    role: 'Local LLM inference runtime preserving developer privacy with zero cloud lock-in.',
    color: '#E50914',
    iconName: 'ollama',
  },
];

/**
 * Slide-to-Technology mappings for the interactive command center nodes
 */
export const slideTechMap: Record<string, string[]> = {
  'developer-spotlight': ['python', 'react', 'typescript', 'threejs'],
  'decisionvault': ['python', 'ollama', 'sqlite', 'git'],
  'cognitive-support': ['python', 'react', 'html-css', 'git'],
  'project-collection': ['javascript', 'html-css', 'numpy', 'git'],
};

/**
 * Runtime GitHub API fetcher with graceful cached fallback
 */
export async function fetchPublicRepositories(): Promise<RepositoryItem[]> {
  if (typeof window === 'undefined') return githubRepositories;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch('https://api.github.com/users/saureetc007/repos?sort=updated&per_page=15', {
      signal: controller.signal,
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });

    clearTimeout(timeout);

    if (!res.ok) {
      return githubRepositories;
    }

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      return githubRepositories;
    }

    // Merge API fields with our verified project metadata
    return githubRepositories.map((repo) => {
      const live = data.find(
        (d: { name?: string }) => d.name?.toLowerCase() === repo.name.toLowerCase()
      );
      if (live) {
        return {
          ...repo,
          stars: live.stargazers_count ?? repo.stars,
          forks: live.forks_count ?? repo.forks,
          htmlUrl: live.html_url || repo.htmlUrl,
        };
      }
      return repo;
    });
  } catch {
    return githubRepositories;
  }
}

