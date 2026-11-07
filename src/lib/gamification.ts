/**
 * Gamification & Discovery System for Saureet's Portfolio
 * Tracks exploration progress, achievement unlocks, and hidden easter eggs.
 */

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // unicode or glyph identifier
}

export const ACHIEVEMENTS: Record<string, Achievement> = {
  'first-contact': {
    id: 'first-contact',
    title: 'FIRST CONTACT',
    description: 'Visited the Get in Touch transmission station.',
    icon: '📡',
  },
  'code-explorer': {
    id: 'code-explorer',
    title: 'CODE EXPLORER',
    description: 'Inspected a technical project architecture breakdown.',
    icon: '⚡',
  },
  'skill-hunter': {
    id: 'skill-hunter',
    title: 'SKILL HUNTER',
    description: 'Explored the interactive 3D technology universe.',
    icon: '🪐',
  },
  'full-tour': {
    id: 'full-tour',
    title: 'THE FULL TOUR',
    description: 'Explored every major sector of the developer portfolio.',
    icon: '🏆',
  },
  'curious-mind': {
    id: 'curious-mind',
    title: 'CURIOUS MIND',
    description: 'Discovered a hidden developer easter egg or secret console.',
    icon: '🔮',
  },
};

export const CORE_SECTIONS = ['top', 'skills', 'projects', 'universe', 'about', 'contact'] as const;
export type CoreSection = (typeof CORE_SECTIONS)[number];

const STORAGE_KEY_SECTIONS = 'saureet_portfolio_sections_v1';
const STORAGE_KEY_ACHIEVEMENTS = 'saureet_portfolio_achievements_v1';

class GamificationManager {
  private exploredSections: Set<string> = new Set();
  private unlockedAchievements: Set<string> = new Set();
  private listeners: Set<() => void> = new Set();
  private activeToast: Achievement | null = null;
  private toastTimer: number | null = null;

  constructor() {
    this.loadState();
  }

  private loadState() {
    if (typeof window === 'undefined') return;
    try {
      const savedSections = sessionStorage.getItem(STORAGE_KEY_SECTIONS);
      if (savedSections) {
        JSON.parse(savedSections).forEach((s: string) => this.exploredSections.add(s));
      }

      const savedAchievements = localStorage.getItem(STORAGE_KEY_ACHIEVEMENTS);
      if (savedAchievements) {
        JSON.parse(savedAchievements).forEach((a: string) => this.unlockedAchievements.add(a));
      }
    } catch {
      // Storage unavailable or blocked
    }
  }

  private saveState() {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(
        STORAGE_KEY_SECTIONS,
        JSON.stringify(Array.from(this.exploredSections))
      );
      localStorage.setItem(
        STORAGE_KEY_ACHIEVEMENTS,
        JSON.stringify(Array.from(this.unlockedAchievements))
      );
    } catch {
      // Storage unavailable
    }
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getExplorationPercentage(): number {
    const validExplored = CORE_SECTIONS.filter((s) => this.exploredSections.has(s)).length;
    return Math.round((validExplored / CORE_SECTIONS.length) * 100);
  }

  public getExploredSections(): Set<string> {
    return new Set(this.exploredSections);
  }

  public getUnlockedAchievements(): Set<string> {
    return new Set(this.unlockedAchievements);
  }

  public getActiveToast(): Achievement | null {
    return this.activeToast;
  }

  public dismissToast() {
    this.activeToast = null;
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
      this.toastTimer = null;
    }
    this.notify();
  }

  public markSectionExplored(sectionId: string) {
    if (!CORE_SECTIONS.includes(sectionId as CoreSection)) return;

    if (!this.exploredSections.has(sectionId)) {
      this.exploredSections.add(sectionId);
      this.saveState();

      // Trigger section-specific achievements
      if (sectionId === 'contact') {
        this.unlockAchievement('first-contact');
      } else if (sectionId === 'universe') {
        this.unlockAchievement('skill-hunter');
      }

      // Check if full tour completed
      if (CORE_SECTIONS.every((s) => this.exploredSections.has(s))) {
        this.unlockAchievement('full-tour');
      }

      this.notify();
    }
  }

  public unlockAchievement(id: string) {
    const achievement = ACHIEVEMENTS[id];
    if (!achievement) return;

    if (!this.unlockedAchievements.has(id)) {
      this.unlockedAchievements.add(id);
      this.saveState();

      // Trigger achievement notification toast
      this.activeToast = achievement;
      if (this.toastTimer) clearTimeout(this.toastTimer);
      this.toastTimer = window.setTimeout(() => {
        this.activeToast = null;
        this.toastTimer = null;
        this.notify();
      }, 4500);

      // Dispatch global DOM event for soundless particle burst
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('achievement-unlocked', { detail: { achievement } })
        );
      }

      this.notify();
    }
  }

  public triggerEasterEgg(message?: string) {
    this.unlockAchievement('curious-mind');
    if (message && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('portfolio-easter-egg', { detail: { message } }));
    }
  }
}

export const gamification = new GamificationManager();

