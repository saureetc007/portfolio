import type { SkillRow } from '@/types/content';

export interface BentoSkillItem {
  id: string;
  name: string;
  role: string;
  icon: string;
}

export interface BentoRelatedProject {
  id: string;
  title: string;
  role: string;
  repoName?: string;
  url?: string;
}

export interface BentoSkillCategory {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  technologies: BentoSkillItem[];
  accentColor: string;
  badge: string;
  gridClass: string;
  relatedProjects: BentoRelatedProject[];
}

/**
 * EXACT five skills categories and technologies requested:
 * 01 — Code & Engineering (Python, JavaScript)
 * 02 — Web Development (HTML, CSS, Tailwind CSS)
 * 03 — AI & Data Intelligence (AI/ML, Generative AI, Linear Regression, NumPy, Pandas, SQL, Data Analysis, Local AI Models)
 * 04 — Design & Digital Creation (UI/UX, Interface Design, Prototyping, Adobe Premiere Pro, Adobe After Effects, Content Creation, Vercel, Netlify)
 * 05 — Mobile Development (Flutter, Dart)
 */
export const bentoSkillCategories: BentoSkillCategory[] = [
  {
    id: 'code-engineering',
    number: '01',
    title: 'Code & Engineering',
    subtitle: 'High-Performance Systems & Logic',
    description:
      'Architecting robust algorithmic foundations, data transformations, and asynchronous browser runtimes using typed contracts and clean execution flow.',
    accentColor: '#E50914',
    badge: 'PRIORITY 01 // CORE FOCUS',
    gridClass: 'bento-grid__item--code',
    technologies: [
      {
        id: 'python',
        name: 'Python',
        role: 'Primary language for algorithms, backend scripting, and applied AI systems.',
        icon: 'python',
      },
      {
        id: 'javascript',
        name: 'JavaScript',
        role: 'Modern ES6+ language powering interactive web applications and event loops.',
        icon: 'javascript',
      },
    ],
    relatedProjects: [
      {
        id: 'decisionvault',
        title: 'DecisionVault',
        role: 'Python AST parsing, SQLite persistence, and structured schema validation.',
        repoName: 'saureetc007/DecisionVault',
        url: 'https://github.com/saureetc007',
      },
      {
        id: 'music-player',
        title: 'Spotify-Style Music Player',
        role: 'JavaScript ES6+, Web Audio API event synchronization, and state management.',
        repoName: 'saureetc007/Spotify-Style-Music-Player',
        url: 'https://github.com/saureetc007',
      },
      {
        id: 'simon-game',
        title: 'Simon Memory Game',
        role: 'Deterministic async sequence generator and event-driven state machine.',
        repoName: 'saureetc007/Simon-Memory-Game',
        url: 'https://github.com/saureetc007',
      },
    ],
  },
  {
    id: 'ai-data-intelligence',
    number: '02',
    title: 'AI & Data Intelligence',
    subtitle: 'Machine Learning & Local Neural Inference',
    description:
      'Building predictive models, mathematical matrix pipelines, and localized zero-latency inference workflows preserving full data privacy.',
    accentColor: '#A855F7',
    badge: 'PRIORITY 02 // LOCAL ML',
    gridClass: 'bento-grid__item--ai',
    technologies: [
      {
        id: 'aiml',
        name: 'AI/ML',
        role: 'Intelligent systems, supervised learning workflows, and model evaluations.',
        icon: 'aiml',
      },
      {
        id: 'generativeai',
        name: 'Generative AI',
        role: 'Large language model integration, prompt pipelines, and structured schemas.',
        icon: 'generativeai',
      },
      {
        id: 'linearregression',
        name: 'Linear Regression',
        role: 'Cost function minimization, gradient descent optimization, and predictive modeling.',
        icon: 'linearregression',
      },
      {
        id: 'numpy',
        name: 'NumPy',
        role: 'High-performance vectorized multi-dimensional numerical computation.',
        icon: 'numpy',
      },
      {
        id: 'pandas',
        name: 'Pandas',
        role: 'Structured DataFrame manipulation, time series processing, and data cleaning.',
        icon: 'pandas',
      },
      {
        id: 'sql',
        name: 'SQL',
        role: 'Relational database querying, schema structuring, indexing, and join operations.',
        icon: 'sql',
      },
      {
        id: 'dataanalysis',
        name: 'Data Analysis',
        role: 'Exploratory data analysis, statistical modeling, and distribution visualization.',
        icon: 'dataanalysis',
      },
      {
        id: 'localaimodels',
        name: 'Local AI Models',
        role: 'Offline LLM execution (Ollama), private embeddings, and zero-telemetry AI.',
        icon: 'localaimodels',
      },
    ],
    relatedProjects: [
      {
        id: 'decisionvault',
        title: 'DecisionVault / DecisionTrace',
        role: 'Local LLM inference via Ollama (Llama 3.2), prompt engineering, and SQLite telemetry.',
        repoName: 'saureetc007/DecisionVault',
        url: 'https://github.com/saureetc007',
      },
      {
        id: 'cognitive-support',
        title: 'Cognitive Support Platform',
        role: 'Applied machine learning logic, zero-latency inference, and caregiver data analysis.',
        repoName: 'saureetc007/Cognitive-Support-Platform',
        url: 'https://github.com/saureetc007',
      },
    ],
  },
  {
    id: 'web-development',
    number: '03',
    title: 'Web Development',
    subtitle: 'Modern Browser Architecture & Layout',
    description:
      'Crafting responsive, accessible, high-performance web systems using semantic markup, modern CSS tokens, fluid typography, and utility-first styling.',
    accentColor: '#38BDF8',
    badge: 'PRIORITY 03 // FRONTEND SYSTEMS',
    gridClass: 'bento-grid__item--web',
    technologies: [
      {
        id: 'html',
        name: 'HTML',
        role: 'Semantic document trees, accessible structures, and SEO standards.',
        icon: 'html',
      },
      {
        id: 'css',
        name: 'CSS',
        role: 'Modern CSS Grid, Flexbox, custom properties, and fluid typography clamp().',
        icon: 'css',
      },
      {
        id: 'tailwindcss',
        name: 'Tailwind CSS',
        role: 'Utility-first styling, rapid component composition, and responsive design systems.',
        icon: 'tailwindcss',
      },
    ],
    relatedProjects: [
      {
        id: 'portfolio',
        title: 'Developer Portfolio',
        role: 'Semantic HTML5 structure, responsive 12-column Bento Grid, and Tailwind CSS tokens.',
        repoName: 'saureetc007/saureet-portfolio',
        url: 'https://github.com/saureetc007',
      },
      {
        id: 'music-player',
        title: 'Streaming Music Interface',
        role: 'Responsive layout composition with custom audio sliders and streaming dark UI.',
        repoName: 'saureetc007/Spotify-Style-Music-Player',
        url: 'https://github.com/saureetc007',
      },
    ],
  },
  {
    id: 'design-digital-creation',
    number: '04',
    title: 'Design & Digital Creation',
    subtitle: 'UI/UX, Motion Design & Cloud Delivery',
    description:
      'Translating complex workflows into intuitive interface architectures, cinematic video sequences, and rapid production cloud deployments.',
    accentColor: '#9999FF',
    badge: 'PRIORITY 04 // CREATIVE PIPELINE',
    gridClass: 'bento-grid__item--design',
    technologies: [
      {
        id: 'uiux',
        name: 'UI/UX',
        role: 'User flow design, ergonomic dark-mode visual hierarchy, and micro-interactions.',
        icon: 'uiux',
      },
      {
        id: 'interfacedesign',
        name: 'Interface Design',
        role: 'Component libraries, design tokens, layout grids, and typographic contrast.',
        icon: 'interfacedesign',
      },
      {
        id: 'prototyping',
        name: 'Prototyping',
        role: 'Interactive state flows, user journey testing, and wireframe linking.',
        icon: 'prototyping',
      },
      {
        id: 'adobepremierepro',
        name: 'Adobe Premiere Pro',
        role: 'Multi-track timeline editing, narrative cutting, pacing, and color grading.',
        icon: 'adobepremierepro',
      },
      {
        id: 'adobeaftereffects',
        name: 'Adobe After Effects',
        role: 'Keyframe motion graphics, kinetic typography, and visual compositing.',
        icon: 'adobeaftereffects',
      },
      {
        id: 'contentcreation',
        name: 'Content Creation',
        role: 'Multimedia technical visual documentation and engineering storytelling.',
        icon: 'contentcreation',
      },
      {
        id: 'vercel',
        name: 'Vercel',
        role: 'Zero-config cloud deployments, edge network caching, and continuous previews.',
        icon: 'vercel',
      },
      {
        id: 'netlify',
        name: 'Netlify',
        role: 'Jamstack static hosting, build webhooks, form handling, and edge functions.',
        icon: 'netlify',
      },
    ],
    relatedProjects: [
      {
        id: 'portfolio-cinematic',
        title: 'Developer Portfolio Experience',
        role: 'Cinematic Netflix streaming interface, interactive motion design, and Vercel/Netlify CI/CD.',
        repoName: 'saureetc007/saureet-portfolio',
        url: 'https://github.com/saureetc007',
      },
      {
        id: 'cognitive-support-design',
        title: 'Assistive Healthcare UI Spec',
        role: 'WCAG AAA high-contrast accessibility system, interactive prototype wireframes, and design flows.',
        repoName: 'saureetc007/Cognitive-Support-Platform',
        url: 'https://github.com/saureetc007',
      },
    ],
  },
  {
    id: 'mobile-development',
    number: '05',
    title: 'Mobile Development',
    subtitle: 'Cross-Platform Native Experiences',
    description:
      'Crafting smooth, single-codebase cross-platform mobile applications with custom animation loops and fluid reactive state management.',
    accentColor: '#54C5F8',
    badge: 'PRIORITY 05 // MOBILE RUNTIMES',
    gridClass: 'bento-grid__item--mobile',
    technologies: [
      {
        id: 'flutter',
        name: 'Flutter',
        role: 'Cross-platform UI toolkit, widget composition, and high-FPS rendering.',
        icon: 'flutter',
      },
      {
        id: 'dart',
        name: 'Dart',
        role: 'Strongly-typed object-oriented language with AOT compilation and hot reload.',
        icon: 'dart',
      },
    ],
    relatedProjects: [
      {
        id: 'cognitive-mobile',
        title: 'Cognitive Assist Mobile Client',
        role: 'Cross-platform native mobile experience with Flutter reactive widget trees and Dart.',
        repoName: 'saureetc007',
        url: 'https://github.com/saureetc007',
      },
      {
        id: 'audio-mobile',
        title: 'Mobile Audio Streamer',
        role: 'AOT compiled Dart audio state architecture delivering steady 60 FPS playback.',
        repoName: 'saureetc007',
        url: 'https://github.com/saureetc007',
      },
    ],
  },
];

/**
 * Retained for backward-compatibility with SkillsUniverse 3D scene.
 */
export const skillRows: SkillRow[] = [
  {
    id: 'code-engineering',
    title: '01 — Code & Engineering',
    tagline: 'Python, JavaScript',
    skills: [
      { id: 'python', name: 'Python', description: 'Primary language for algorithms, backend scripting, and AI.' },
      { id: 'javascript', name: 'JavaScript', description: 'Modern web applications and event-driven runtimes.' },
    ],
  },
  {
    id: 'ai-data-intelligence',
    title: '02 — AI & Data Intelligence',
    tagline: 'AI/ML, Generative AI, Linear Regression, NumPy, Pandas, SQL, Data Analysis, Local AI Models',
    skills: [
      { id: 'aiml', name: 'AI/ML', description: 'Machine learning fundamentals and intelligent workflows.' },
      { id: 'generativeai', name: 'Generative AI', description: 'Prompt engineering, LLM interfaces, and structured outputs.' },
      { id: 'linearregression', name: 'Linear Regression', description: 'Supervised modeling, gradient descent, and loss optimization.' },
      { id: 'numpy', name: 'NumPy', description: 'High-performance N-dimensional array vectorization.' },
      { id: 'pandas', name: 'Pandas', description: 'DataFrames, time series slicing, and data analytics.' },
      { id: 'sql', name: 'SQL', description: 'Relational database schema design and querying.' },
      { id: 'dataanalysis', name: 'Data Analysis', description: 'Exploratory data analysis and distribution modeling.' },
      { id: 'localaimodels', name: 'Local AI Models', description: 'Private offline LLM deployment via Ollama.' },
    ],
  },
  {
    id: 'web-development',
    title: '03 — Web Development',
    tagline: 'HTML, CSS, Tailwind CSS',
    skills: [
      { id: 'html', name: 'HTML', description: 'Semantic markup, accessible trees, and web standards.' },
      { id: 'css', name: 'CSS', description: 'Modern layout systems, Grid, Flexbox, and CSS tokens.' },
      { id: 'tailwindcss', name: 'Tailwind CSS', description: 'Utility-first design tokens and responsive layout composition.' },
    ],
  },
  {
    id: 'design-digital-creation',
    title: '04 — Design & Digital Creation',
    tagline: 'UI/UX, Interface Design, Prototyping, Premiere Pro, After Effects, Content Creation, Vercel, Netlify',
    skills: [
      { id: 'uiux', name: 'UI/UX', description: 'Streaming platform aesthetics and dark-mode ergonomics.' },
      { id: 'interfacedesign', name: 'Interface Design', description: 'Visual hierarchy, design systems, and components.' },
      { id: 'prototyping', name: 'Prototyping', description: 'Interactive application prototypes and flow linking.' },
      { id: 'adobepremierepro', name: 'Adobe Premiere Pro', description: 'Timeline video editing, narrative cutting, and pacing.' },
      { id: 'adobeaftereffects', name: 'Adobe After Effects', description: 'Keyframe motion graphics, compositing, and title cards.' },
      { id: 'contentcreation', name: 'Content Creation', description: 'Technical documentation and visual engineering communication.' },
      { id: 'vercel', name: 'Vercel', description: 'Cloud deployment, edge routing, and automated previews.' },
      { id: 'netlify', name: 'Netlify', description: 'Edge hosting, webhooks, and Jamstack deployment.' },
    ],
  },
  {
    id: 'mobile-development',
    title: '05 — Mobile Development',
    tagline: 'Flutter, Dart',
    skills: [
      { id: 'flutter', name: 'Flutter', description: 'Cross-platform reactive widget architecture.' },
      { id: 'dart', name: 'Dart', description: 'Typed language powering fast multi-platform compilation.' },
    ],
  },
];
