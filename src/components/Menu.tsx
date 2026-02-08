import { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import LogoSVG from './LogoSVG';
import './Menu.css';

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const openMenu = () => {
    setIsOpen(true);

    // Animate hamburger to X
    gsap.to(line1Ref.current, { rotation: 45, y: 7, duration: 0.3, ease: 'power3.inOut' });
    gsap.to(line2Ref.current, { opacity: 0, duration: 0.2, ease: 'power2.inOut' });
    gsap.to(line3Ref.current, { rotation: -45, y: -7, duration: 0.3, ease: 'power3.inOut' });

    // Animate nav expansion
    if (navRef.current) {
      gsap.to(navRef.current, {
        maxHeight: 300,
        maxWidth: 200,
        opacity: 1,
        paddingTop: '1rem',
        duration: 0.35,
        ease: 'power3.out'
      });

      // Animate nav links
      gsap.fromTo(navRef.current.children,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power3.out', delay: 0.15 }
      );
    }
  };

  const closeMenu = () => {
    // Animate X to hamburger
    gsap.to(line1Ref.current, { rotation: 0, y: 0, duration: 0.25, ease: 'power3.inOut' });
    gsap.to(line2Ref.current, { opacity: 1, duration: 0.2, ease: 'power2.inOut', delay: 0.1 });
    gsap.to(line3Ref.current, { rotation: 0, y: 0, duration: 0.25, ease: 'power3.inOut' });

    // Animate nav collapse
    if (navRef.current) {
      gsap.to(navRef.current.children, {
        opacity: 0,
        y: -8,
        duration: 0.15,
        ease: 'power2.in'
      });

      gsap.to(navRef.current, {
        maxHeight: 0,
        maxWidth: 0,
        opacity: 0,
        paddingTop: 0,
        duration: 0.3,
        ease: 'power3.inOut',
        delay: 0.1,
        onComplete: () => setIsOpen(false)
      });
    }
  };

  const handleLinkClick = () => {
    closeMenu();
  };

  return (
    <>
      <header className="header">
        {!isHomePage && (
          <Link to="/" className="header-logo">
            <LogoSVG style={{ width: '80px', height: '80px' }} />
          </Link>
        )}

        {/* Desktop navigation */}
        <nav className="desktop-nav">
          <Link to="/portfolio" className={location.pathname === '/portfolio' ? 'active' : ''}>Portfolio</Link>
          <Link to="/the-studio" className={location.pathname === '/the-studio' ? 'active' : ''}>Studio</Link>
          <Link to="/over" className={location.pathname === '/over' ? 'active' : ''}>Over</Link>
          <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link>
        </nav>

        {/* Mobile menu container with glassmorphic background */}
        <div ref={menuRef} className={`mobile-menu-container ${isOpen ? 'menu-open' : ''}`}>
          <div className="mobile-menu-top">
            <button
              className="hamburger"
              onClick={isOpen ? closeMenu : openMenu}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              <span ref={line1Ref} className="hamburger-line"></span>
              <span ref={line2Ref} className="hamburger-line"></span>
              <span ref={line3Ref} className="hamburger-line"></span>
            </button>
          </div>

          <nav ref={navRef} className={`menu-nav ${isOpen ? 'menu-nav-open' : ''}`}>
            <Link to="/portfolio" onClick={handleLinkClick}>Portfolio</Link>
            <Link to="/the-studio" onClick={handleLinkClick}>Studio</Link>
            <Link to="/over" onClick={handleLinkClick}>Over</Link>
            <Link to="/contact" onClick={handleLinkClick}>Contact</Link>
          </nav>
        </div>
      </header>
    </>
  );
}
