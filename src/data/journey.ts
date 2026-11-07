import type { LearningActivity, TimelineEntry } from '@/types/content';

/**
 * Netflix-inspired "Continue Building" queue.
 * Represents ongoing learning pursuits and development milestones.
 * Progress indicators are displayed only when accurate data is available;
 * null values display an honest active status without fabricated percentages.
 */
export const learningActivities: LearningActivity[] = [
  {
    id: 'decisionvault',
    title: 'Building DecisionVault / DecisionTrace',
    description:
      'Developing an evidence-first system to extract engineering decisions from GitHub pull requests and discussions with local LLM pipelines.',
    status: 'building',
    progress: null, // Active development
    tags: ['Python', 'Local LLMs', 'Ollama', 'SQLite'],
  },
  {
    id: 'ai-engineering',
    title: 'Exploring AI Engineering & LLM Pipelines',
    description:
      'Learning the mechanics of prompt chains, structured JSON outputs, embeddings, and private model inference for practical developer tools.',
    status: 'exploring',
    progress: null,
    tags: ['Machine Learning', 'Local Models', 'RAG Concepts'],
  },
  {
    id: 'dsa-mastery',
    title: 'Improving Data Structures and Algorithms',
    description:
      'Working through algorithmic patterns, time-space complexity optimization, and rigorous problem-solving exercises in Python.',
    status: 'learning',
    progress: null,
    tags: ['Algorithms', 'Data Structures', 'Python'],
  },
  {
    id: 'modern-web',
    title: 'Learning Modern Web Development',
    description:
      'Mastering React 19, TypeScript architecture, fluid responsive systems, and accessible interactive interfaces.',
    status: 'learning',
    progress: null,
    tags: ['React 19', 'TypeScript', 'CSS Tokens', 'A11y'],
  },
  {
    id: 'threejs-graphics',
    title: 'Exploring Three.js & Spatial WebGL',
    description:
      'Investigating 3D spatial data visualization, raycasting, camera projection, and performant GPU rendering in the browser.',
    status: 'exploring',
    progress: null,
    tags: ['Three.js', 'WebGL', '3D Constellations'],
  },
];

/**
 * About section development timeline.
 * Honest dates without invented employment or awards.
 */
export const timeline: TimelineEntry[] = [
  {
    id: 'degree-start',
    title: 'B.Tech in Computer Science and AI',
    description: 'Pursuing B.Tech in CS & AI at Newton School of Technology (First Year).',
    date: 'Present',
  },
  {
    id: 'practical-exploration',
    title: 'Hands-on Software & Applied AI Projects',
    description: 'Building practical web applications, games, algorithms, and AI tooling.',
    date: 'Ongoing',
  },
  {
    id: 'graduation-target',
    title: 'Expected Degree Completion',
    description: 'Completing the B.Tech undergraduate programme in CS & AI.',
    date: '2030',
  },
];
