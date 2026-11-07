import type { HeroSlide } from '@/types/content';

export const heroSlides: HeroSlide[] = [
  {
    id: 'developer-spotlight',
    badge: 'DEVELOPER SPOTLIGHT',
    titleFirst: 'Saureet',
    titleLast: 'Chakrabarti',
    title: 'Saureet Chakrabarti',
    subtitle: 'Building ideas into reality.',
    description:
      'CS & AI student exploring software engineering, intelligent systems, and creative technology. Building projects that turn ideas into working experiences.',
    primaryCta: {
      label: 'Explore My Work',
      target: 'projects',
    },
    secondaryCta: {
      label: 'More About Me',
      target: 'about',
    },
    visualType: 'developer-stack',
    altText:
      'Layered multi-card composition featuring developer profile HUD, code workspace, and system telemetry',
  },
  {
    id: 'decisionvault',
    badge: 'FEATURED ARCHITECTURE',
    title: 'DecisionVault',
    subtitle: 'Engineering decisions, preserved.',
    description:
      'A developer-focused tool for extracting structured engineering decisions from technical discussions and retaining their supporting evidence.',
    primaryCta: {
      label: 'Explore Project',
      target: 'projects',
      isModal: true,
      projectId: 'decisiontrace',
    },
    secondaryCta: {
      label: 'View on GitHub',
      external: true,
      href: 'https://github.com/saureetc007',
    },
    visualType: 'decisionvault-stack',
    altText:
      'Multi-card stack displaying GitHub thread parser, LLM extraction pipeline, knowledge graph, and structured ADR card',
  },
  {
    id: 'cognitive-support',
    badge: 'APPLIED AI // HEALTHCARE',
    title: 'Cognitive Support Platform',
    subtitle: 'Accessible AI for older adults.',
    description:
      'An applied AI project exploring accessible assistive interfaces, cognitive exercises, and supportive tooling designed specifically for older adults and caregivers.',
    primaryCta: {
      label: 'Explore Project',
      target: 'projects',
      isModal: true,
      projectId: 'cognitive-support',
    },
    secondaryCta: {
      label: 'View Details',
      target: 'projects',
    },
    visualType: 'cognitive-stack',
    altText:
      'Multi-card stack showing accessible assistive interface, memory exercise module, caregiver dashboard, and system architecture',
  },
  {
    id: 'project-collection',
    badge: 'ENGINEERING SHOWCASE',
    title: 'Project Collection',
    subtitle: 'From algorithms to streaming interfaces.',
    description:
      'A dynamic showcase highlighting 10 curated projects spanning local LLM architecture, cognitive assistive tools, streaming web applications, and algorithmic experiments.',
    primaryCta: {
      label: 'Browse All Projects',
      target: 'projects',
    },
    secondaryCta: {
      label: 'View My Skills',
      target: 'skills',
    },
    visualType: 'collection-stack',
    altText:
      'Multi-card stack featuring Python algorithms lab, Simon memory sequencer, Spotify-inspired music player, and project catalog',
  },
];
