import type { HeroSlide } from '@/types/content';

export const heroSlides: HeroSlide[] = [
  {
    id: 'developer-spotlight',
    badge: 'SAUREET CHAKRABARTI // DEVELOPER SPOTLIGHT',
    titleFirst: 'Saureet',
    titleLast: 'Chakrabarti',
    title: 'Saureet Chakrabarti',
    subtitle: 'CS & AI Developer · Building systems that turn ideas into reality.',
    description:
      'Computer Science & Artificial Intelligence student at Newton School of Technology. Exploring low-level systems, local neural inference, and responsive web experiences.',
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
    badge: 'FEATURED ARCHITECTURE // BY SAUREET CHAKRABARTI',
    title: 'DecisionVault',
    subtitle: 'Architecture decision recovery engine by Saureet.',
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
    badge: 'APPLIED AI // BY SAUREET CHAKRABARTI',
    title: 'Cognitive Support Platform',
    subtitle: 'Accessible cognitive support system designed by Saureet.',
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
    badge: 'PORTFOLIO SHOWCASE // SAUREET CHAKRABARTI',
    title: 'Project Collection',
    subtitle: 'Curated software engineering portfolio of Saureet.',
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
