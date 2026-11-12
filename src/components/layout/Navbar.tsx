import { useEffect, useState } from 'react';
import { navLinks, sectionIds } from '@/data';
import { useActiveSection } from '@/hooks/useActiveSection';
import { gamification } from '@/lib/gamification';
import { cx } from '@/lib/cx';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [logoClicks, setLogoClicks] = useState(0);
  const active = useActiveSection(sectionIds);

  const handleBrandClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setOpen(false);
    const nextClicks = logoClicks + 1;
    setLogoClicks(nextClicks);

    if (nextClicks >= 5) {
      setLogoClicks(0);
      gamification.triggerEasterEgg(
        "Easter Egg Unlocked: 'Learn by building. Stay curious, break things thoughtfully.' — Saureet"
      );
      window.dispatchEvent(
        new CustomEvent('emit-global-burst', {
          detail: { x: e.clientX, y: e.clientY, count: 24 },
        })
      );
    }
  };

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 20);
      const totalDocHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalDocHeight > 0 ? (scrollY / totalDocHeight) * 100 : 0;
      setScrollProgress(progress);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className={cx('navbar', scrolled && 'is-scrolled', open && 'is-open')}>
      <div className="container navbar__inner">
        <a className="brand" href="#top" onClick={handleBrandClick} aria-label="Saureet Chakrabarti - Home">
          <span className="brand__logo-mark" aria-hidden="true">
            <span className="brand__logo-accent" />
          </span>
          <span className="brand__name">
            SAUREET<span className="brand__dot">.</span>
          </span>
        </a>

        <button
          type="button"
          className="navbar__toggle"
          aria-expanded={open}
          aria-controls="primary-nav"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="navbar__bars" aria-hidden="true" />
        </button>

        <nav id="primary-nav" className="navbar__nav" aria-label="Primary">
          <ul className="navbar__links">
            {navLinks.map((link) => (
              <li key={link.target}>
                <a
                  href={`#${link.target}`}
                  className={cx('navbar__link', active === link.target && 'is-active')}
                  aria-current={active === link.target ? 'true' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Real-Time Glowing Scroll Progress Indicator */}
      <div
        className="navbar__scroll-progress"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />
    </header>
  );
}
