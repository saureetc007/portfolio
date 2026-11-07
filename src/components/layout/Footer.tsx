import { profile, socialLinks } from '@/data';
import { SocialIcon } from '@/components/ui/SocialIcon';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <span className="brand__logo-mark" aria-hidden="true">
              <span className="brand__logo-accent" />
            </span>
            <span className="brand__name">
              SAUREET<span className="brand__dot">.</span>
            </span>
          </div>

          <ul className="footer__links-nav" aria-label="Footer Navigation">
            <li>
              <a href="#top" className="footer__nav-link">
                Home
              </a>
            </li>
            <li>
              <a href="#skills" className="footer__nav-link">
                Skills
              </a>
            </li>
            <li>
              <a href="#projects" className="footer__nav-link">
                Projects
              </a>
            </li>
            <li>
              <a href="#universe" className="footer__nav-link">
                3D Universe
              </a>
            </li>
            <li>
              <a href="#about" className="footer__nav-link">
                About
              </a>
            </li>
            <li>
              <a href="#contact" className="footer__nav-link">
                Contact
              </a>
            </li>
          </ul>

          <ul className="footer__socials" aria-label="Social links">
            {socialLinks.map((link) => (
              <li key={link.id}>
                <a
                  className="icon-link"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${link.label} (opens in a new tab)`}
                >
                  <SocialIcon name={link.id} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            © {new Date().getFullYear()} {profile.name}. Designed & built with React 19, TypeScript, Vite & Three.js.
          </p>
          <p className="footer__disclaimer">
            Streaming-inspired developer showcase. Built for personal educational & portfolio presentation.
          </p>
        </div>
      </div>
    </footer>
  );
}
