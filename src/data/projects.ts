import type { Project } from '@/types/content';

/**
 * Top 10 Showcase. These represent active engineering, completed builds,
 * and learning experiments.
 * Statuses: 'completed', 'in-progress', 'experiment', 'learning-project'.
 * URLs are linked only when verified on GitHub (https://github.com/saureetc007);
 * unverified links remain honestly null without inventing URLs.
 */
export const projects: Project[] = [
  {
    id: 'decisiontrace',
    rank: 1,
    title: 'DecisionVault / DecisionTrace',
    tagline: 'Recovers engineering decisions from GitHub discussions, with evidence behind every one.',
    status: 'in-progress',
    technologies: ['Python', 'Ollama', 'SQLite', 'LLM Prompting', 'Git'],
    summary:
      'Extracts architecture decisions and rejected alternatives from pull requests and issues using a local language model, preserving direct traceability back to source discussions.',
    thumbnail: '/assets/projects/project-1.svg',
    detail: {
      problem:
        'Engineering decisions, trade-offs, and reasons why alternatives were rejected get buried deep in long GitHub pull request threads and discussions. Months later, context is lost and teams struggle to understand why an architectural decision was made.',
      approach:
        'Parse repository discussions into structured decision artifacts using evidence-first extraction. Rather than hallucinating summaries, every extracted decision links directly back to quoted remarks and comments in the source discussion.',
      techChoices:
        'Python for text parsing and automation; local LLMs through Ollama to maintain privacy without hosted API costs; SQLite for local structured persistence and queryability.',
      implementation:
        'Core extraction pipeline and prompt structures designed for local model execution; working on structured schema persistence and automated issue thread parsing.',
      lessons:
        'Local language models require disciplined structured prompt engineering and clear schema validation to return reliably parseable decision records.',
    },
    links: {
      repo: null, // Confirm repo URL on https://github.com/saureetc007
      demo: null,
    },
  },
  {
    id: 'cognitive-support',
    rank: 2,
    title: 'AI-Powered Cognitive Support Platform',
    tagline: 'Improves access to cognitive-support resources for older adults and their families.',
    status: 'in-progress',
    technologies: ['Python', 'AI / ML', 'Healthcare Tech', 'Interface Design'],
    summary:
      'An applied AI project exploring accessible assistive interfaces, cognitive exercises, and supportive tooling designed specifically for older adults and caregivers.',
    thumbnail: '/assets/projects/project-2.svg',
    detail: {
      problem:
        'Digital cognitive wellness tools often feature dense, complex interfaces with poor contrast and confusing navigation, making them inaccessible for older adults experiencing early cognitive decline.',
      approach:
        'Design a patient-first, distraction-free environment with large accessible targets, high contrast, gentle conversational prompting, and structured cognitive exercises.',
      techChoices:
        'Python backend for personalization logic; accessible semantic web standards with WCAG AAA contrast guidelines; lightweight conversational AI for friendly guidance.',
      implementation:
        'Initial interface prototypes and user flow architecture completed; evaluating appropriate interaction paradigms for older users.',
      lessons:
        'Designing for accessibility requires stripping away unnecessary cognitive overhead and focusing on predictability, clear visual landmarks, and zero ambiguity.',
    },
    links: {
      repo: null,
      demo: null,
    },
  },
  {
    id: 'music-player',
    rank: 3,
    title: 'Spotify-Inspired Music Player',
    tagline: 'A music-player interface inspired by modern streaming experiences.',
    status: 'completed',
    technologies: ['JavaScript', 'HTML5 Audio', 'CSS3', 'DOM API'],
    summary:
      'A sleek web-based streaming music player featuring dynamic track playback, audio scrubber controls, volume mixing, playlist queueing, and responsive player controls.',
    thumbnail: '/assets/projects/project-3.svg',
    detail: {
      problem:
        'Building a custom media player that feels smooth, responsive, and tactile requires precise coordination between HTML5 Audio events, DOM state, and responsive styling.',
      approach:
        'Modeled the streaming player around a central state manager handling current track time, duration, play/pause states, track progression, and playlist indexing.',
      techChoices:
        'Native JavaScript and HTML5 Audio API for zero-dependency low latency playback; custom CSS grid and flexbox for responsive desktop and mobile viewports.',
      implementation:
        'Full playback controls (play, pause, next, previous, scrub, volume), dynamic duration formatting, track metadata display, and active playing indicator.',
      lessons:
        'Direct synchronization between `timeupdate` audio events and slider range inputs requires throttling to avoid UI stuttering while maintaining responsive scrubbing.',
    },
    links: {
      repo: null,
      demo: null,
    },
  },
  {
    id: 'simon-game',
    rank: 4,
    title: 'Simon Memory Game',
    tagline: 'A browser-based memory game built with web technologies.',
    status: 'completed',
    technologies: ['JavaScript', 'CSS Animations', 'Web Audio', 'DOM Manipulation'],
    summary:
      'Classic electronic pattern memory game featuring randomized audio-visual sequences, progressive difficulty scaling, user input validation, and high score tracking.',
    thumbnail: '/assets/projects/project-4.svg',
    detail: {
      problem:
        'Recreating the iconic Simon game requires managing strict async timing sequences, disabling user inputs during sequence replay, and accurately detecting pattern failures.',
      approach:
        'Implemented a state machine separating sequence generation, computer demonstration playback, and user input validation phases.',
      techChoices:
        'Vanilla JavaScript for lightweight execution, CSS keyframe animations for illuminated button pads, and web audio synthesis for quadrant tones.',
      implementation:
        'Progressive sequence generator, audio tone playback, error feedback flashing, level counter, and game restart logic.',
      lessons:
        'Managing async timing with JavaScript timeouts requires clean state cancellation to avoid stray input triggers when players make an error mid-sequence.',
    },
    links: {
      repo: null,
      demo: null,
    },
  },
  {
    id: 'portfolio',
    rank: 5,
    title: 'Personal Developer Portfolio',
    tagline: 'This cinematic, Netflix-inspired developer portfolio experience.',
    status: 'in-progress',
    technologies: ['React 19', 'TypeScript', 'Vite', 'Three.js', 'CSS Tokens'],
    summary:
      'A Netflix-inspired developer showcase featuring a cinematic billboard slideshow, horizontal browsing carousels, Top 10 project rankings, and an interactive 3D Three.js skills universe.',
    thumbnail: '/assets/projects/project-5.svg',
    detail: {
      problem:
        'Standard developer portfolios often look identical with generic SaaS gradients, while heavy 3D portfolios suffer from poor accessibility and performance.',
      approach:
        'Adopted a cinematic streaming platform visual identity: rich black surfaces, Netflix red accents, horizontal browsing rows with smooth hover scaling, and an interactive Three.js constellation.',
      techChoices:
        'React 19 and TypeScript for typed components; Vite for fast builds; Three.js for 3D spatial node visualization; CSS custom properties for a cohesive token system.',
      implementation:
        'Featured slideshow hero with auto-play & visibility pause, horizontal card carousels with chevron controls, Top 10 numbered overlay cards, modal drawer, and WebGL scene.',
      lessons:
        'Creating a streaming interface requires meticulous attention to visual depth, card hover physics, and ensuring 3D scenes degrade gracefully for reduced-motion and mobile users.',
    },
    links: {
      repo: 'https://github.com/saureetc007',
      demo: null,
    },
  },
  {
    id: 'python-collection',
    rank: 6,
    title: 'Python Problem-Solving Collection',
    tagline: 'A collection of programming exercises and algorithmic solutions.',
    status: 'experiment',
    technologies: ['Python 3', 'Data Structures', 'Algorithms', 'Testing'],
    summary:
      'A structured repository of algorithmic solutions tackling arrays, hash maps, linked lists, binary search, tree traversals, and recursion with time/space complexity analysis.',
    thumbnail: '/assets/projects/project-6.svg',
    detail: {
      problem:
        'Building strong computer science foundations requires deliberate practice with fundamental algorithms and rigorous understanding of Big-O time and space trade-offs.',
      approach:
        'Implement multiple solution approaches for key problems (e.g., brute force vs optimal two-pointer or hash map), documenting trade-offs directly in docstrings.',
      techChoices:
        'Python 3 for clean syntax and expressive standard library data structures (`collections.deque`, `heapq`, `defaultdict`).',
      implementation:
        'Modular algorithmic modules with clean test cases and complexity annotations.',
      lessons:
        'Visualizing memory layout and pointer references helps deeply understand why specific algorithmic choices produce optimal performance.',
    },
    links: {
      repo: 'https://github.com/saureetc007',
      demo: null,
    },
  },
  {
    id: 'js-interactive',
    rank: 7,
    title: 'JavaScript Interactive Projects',
    tagline: 'Small interactive applications demonstrating DOM manipulation and browser programming.',
    status: 'experiment',
    technologies: ['JavaScript', 'HTML5', 'CSS3', 'Browser APIs'],
    summary:
      'A series of focused frontend experiments exploring event delegation, canvas particle rendering, drag-and-drop interactions, and dynamic local state persistence.',
    thumbnail: '/assets/projects/project-7.svg',
    detail: {
      problem:
        'Mastering modern web development requires direct fluency with browser APIs before relying on high-level UI frameworks.',
      approach:
        'Created isolated, single-purpose mini-applications exploring specific browser capabilities: custom mouse followers, accordion systems, modal overlays, and storage caches.',
      techChoices:
        'Vanilla ES6+ JavaScript, CSS transitions, and semantic HTML.',
      implementation:
        'Clean event listener patterns, debounced input handlers, and responsive CSS layouts.',
      lessons:
        'Understanding the browser event loop and event bubbling is essential for building bug-free interactive interfaces.',
    },
    links: {
      repo: 'https://github.com/saureetc007',
      demo: null,
    },
  },
  {
    id: 'responsive-interfaces',
    rank: 8,
    title: 'Responsive Web Interfaces',
    tagline: 'Web-development exercises focused on responsive layouts and visual design.',
    status: 'learning-project',
    technologies: ['HTML5', 'CSS Grid', 'Flexbox', 'Responsive Typography'],
    summary:
      'A collection of precision web layout implementations demonstrating responsive grid systems, fluid typography clamp functions, and mobile-first accessibility.',
    thumbnail: '/assets/projects/project-8.svg',
    detail: {
      problem:
        'Ensuring web layouts look intentional across all device viewports—from 360px phones to 4K displays—without awkward line breaks or horizontal scrolling.',
      approach:
        'Adopted mobile-first media queries, intrinsic CSS Grid auto-fit/auto-fill columns, and fluid clamp() typography calculations.',
      techChoices:
        'Modern CSS features including CSS custom properties, grid layouts, and viewport-relative units.',
      implementation:
        'Tested responsive layouts across varying aspect ratios, touch screen targets, and browser zoom levels.',
      lessons:
        'Designing with intrinsic sizing and flexbox wrapping prevents layout breakage more reliably than rigid pixel breakpoints.',
    },
    links: {
      repo: 'https://github.com/saureetc007',
      demo: null,
    },
  },
  {
    id: 'ml-experiments',
    rank: 9,
    title: 'AI and Machine Learning Experiments',
    tagline: 'Experiments exploring concepts such as linear regression and data science.',
    status: 'experiment',
    technologies: ['Python', 'NumPy', 'Pandas', 'Matplotlib', 'Scikit-Learn'],
    summary:
      'Hands-on Jupyter notebooks and scripts implementing linear regression, gradient descent optimization, exploratory data analysis, and feature scaling.',
    thumbnail: '/assets/projects/project-9.svg',
    detail: {
      problem:
        'Gaining an intuitive, mathematical understanding of machine learning models rather than treating algorithms as black boxes.',
      approach:
        'Implemented simple linear regression from scratch using NumPy vector operations and gradient descent before comparing results against Scikit-Learn baselines.',
      techChoices:
        'Python, NumPy for matrix mathematics, Pandas for data frame operations, and Matplotlib for loss surface and regression line visualization.',
      implementation:
        'Cost function computation, gradient descent iterations, learning rate tuning, and R² metric evaluation on synthetic and sample datasets.',
      lessons:
        'Feature scaling (standardization/normalization) significantly accelerates gradient descent convergence and avoids numerical overflow.',
    },
    links: {
      repo: 'https://github.com/saureetc007',
      demo: null,
    },
  },
  {
    id: 'video-projects',
    rank: 10,
    title: 'Creative Video Projects',
    tagline: 'Video-editing, pacing, and storytelling experiments.',
    status: 'learning-project',
    technologies: ['Adobe Premiere Pro', 'After Effects', 'Sound Design', 'Color Grading'],
    summary:
      'Creative editing experiments combining motion graphics, rhythmic audio cutting, keyframe animations, and cinematic color grading to tell compelling visual stories.',
    thumbnail: '/assets/projects/project-10.svg',
    detail: {
      problem:
        'Communicating technical concepts and narratives through engaging, high-retention video formats.',
      approach:
        'Explored narrative pacing, multi-track audio mixing, visual match cuts, and custom title card motion design.',
      techChoices:
        'Adobe Premiere Pro for timeline assembly and pacing; After Effects for kinetic typography and motion graphics.',
      implementation:
        'Short-form and thematic video cuts focusing on dynamic cuts synced to music beats and crisp typography.',
      lessons:
        'Audio pacing and sound design carry more emotional weight and viewer attention than complex visual effects alone.',
    },
    links: {
      repo: null,
      demo: null,
    },
  },
];
