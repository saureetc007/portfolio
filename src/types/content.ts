/** Shared content types. All site content is described here and lives in src/data. */

export type ProjectStatus = 'completed' | 'in-progress' | 'experiment' | 'learning-project';
export type ActivityStatus = 'building' | 'learning' | 'exploring';
/** Optional label for a skill card. Never implies expertise. */
export type LearningStatus = 'learning' | 'exploring';

export interface SocialLink {
  id: 'github' | 'linkedin';
  label: string;
  href: string;
}

export interface NavLink {
  label: string;
  /** id of the target section (without the #) */
  target: string;
}

export interface Profile {
  name: string;
  firstName: string;
  degree: string;
  university: string;
  institution: string;
  graduationYear: number;
  /** null until the real address is provided. */
  email: string | null;
  about: string[];
}

export interface HeroSlide {
  id: string;
  badge?: string;
  titleFirst?: string;
  titleLast?: string;
  title: string;
  subtitle: string;
  description: string;
  primaryCta: {
    label: string;
    target: string;
    isModal?: boolean;
    projectId?: string;
  };
  secondaryCta: {
    label: string;
    target?: string;
    isModal?: boolean;
    projectId?: string;
    external?: boolean;
    href?: string;
  };
  visualType:
    | 'developer-stack'
    | 'decisionvault-stack'
    | 'cognitive-stack'
    | 'collection-stack'
    | 'developer'
    | 'decisionvault'
    | 'ai-systems'
    | string;
  altText: string;
}

export interface Skill {
  id: string;
  name: string;
  description?: string;
  iconName?: string;
  status?: LearningStatus;
}

export interface SkillRow {
  id: string;
  title: string;
  tagline: string;
  skills: Skill[];
}

export interface ProjectDetail {
  /** null = not written yet; the modal will show an explicit honest indicator. */
  problem: string | null;
  approach: string | null;
  techChoices: string | null;
  implementation: string | null;
  lessons: string | null;
}

export interface Project {
  id: string;
  /** Position in the Top 10 (1–10). */
  rank: number;
  title: string;
  tagline: string;
  status: ProjectStatus;
  technologies: string[];
  /** Short technical explanation shown on the card. */
  summary: string;
  thumbnail: string;
  detail: ProjectDetail;
  links: {
    /** null = unverified; render a disabled link marked unverified. */
    repo: string | null;
    demo: string | null;
  };
}

export interface LearningActivity {
  id: string;
  title: string;
  description: string;
  status: ActivityStatus;
  /** 0–100, only when accurate. null = show no progress indicator. */
  progress: number | null;
  tags?: string[];
}

export interface TimelineEntry {
  id: string;
  title: string;
  description: string;
  /** null = date not provided; never invent one. */
  date: string | null;
}

export interface RepositoryItem {
  id: string;
  name: string;
  fullName: string;
  description: string;
  htmlUrl: string;
  language: string;
  languageColor: string;
  stars?: number;
  forks?: number;
  isRealRepo: boolean;
  status: 'active' | 'completed' | 'experiment';
  topics: string[];
}

export interface TechItem {
  id: string;
  name: string;
  category: 'language' | 'framework' | 'tool' | 'library' | 'database';
  role: string;
  color: string;
  iconName: string;
}
