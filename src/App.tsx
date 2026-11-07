import { useState, useCallback } from 'react';
import { SplashScreen } from '@/components/splash/SplashScreen';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SkipLink } from '@/components/layout/SkipLink';
import { Hero } from '@/components/hero/Hero';
import { SkillsSection } from '@/components/skills/SkillsSection';
import { ProjectsSection } from '@/components/projects/ProjectsSection';
import { SkillsUniverse } from '@/components/universe/SkillsUniverse';
import { About } from '@/components/about/About';
import { Contact } from '@/components/contact/Contact';

export default function App() {
  // Splash screen plays before the website becomes visible
  const [isSplashActive, setIsSplashActive] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return false;
    }
    return true;
  });

  const handleSplashComplete = useCallback(() => {
    setIsSplashActive(false);
  }, []);

  return (
    <>
      {/* 1. Full-Screen Cinematic Splash Screen Overlay */}
      {isSplashActive && <SplashScreen onComplete={handleSplashComplete} />}

      {/* 2. Underlying Portfolio — 100% hidden until splash screen sequence finishes */}
      <div
        className={`app-wrapper ${
          isSplashActive ? 'is-splash-active' : 'is-splash-ready'
        }`}
      >
        <SkipLink />
        <Navbar />
        <main id="main" tabIndex={-1}>
          <Hero />
          <SkillsSection />
          <ProjectsSection />
          <SkillsUniverse />
          <About />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
