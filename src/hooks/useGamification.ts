import { useState, useEffect } from 'react';
import { gamification, CORE_SECTIONS, type Achievement } from '@/lib/gamification';

export function useGamification() {
  const [progress, setProgress] = useState(() => gamification.getExplorationPercentage());
  const [unlockedAchievements, setUnlockedAchievements] = useState(() =>
    gamification.getUnlockedAchievements()
  );
  const [activeToast, setActiveToast] = useState<Achievement | null>(() =>
    gamification.getActiveToast()
  );

  useEffect(() => {
    const unsubscribe = gamification.subscribe(() => {
      setProgress(gamification.getExplorationPercentage());
      setUnlockedAchievements(gamification.getUnlockedAchievements());
      setActiveToast(gamification.getActiveToast());
    });
    return unsubscribe;
  }, []);

  // Set up viewport observer for all core sections
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
            gamification.markSectionExplored(entry.target.id);
          }
        });
      },
      { threshold: [0.2, 0.5] }
    );

    CORE_SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return {
    progress,
    unlockedAchievements,
    activeToast,
    dismissToast: () => gamification.dismissToast(),
    unlockAchievement: (id: string) => gamification.unlockAchievement(id),
  };
}

