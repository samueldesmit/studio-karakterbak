import { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import Logo3DSmall from './Logo3DSmall';
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
    gsap.to(line1Ref.current, { rotation: 45, y: 7, duration: 0.15, ease: 'power2.inOut' });
    gsap.to(line2Ref.current, { opacity: 0, duration: 0.1, ease: 'power2.inOut' });
    gsap.to(line3Ref.current, { rotation: -45, y: -7, duration: 0.15, ease: 'power2.inOut' });

    // Animate modal in
    gsap.fromTo(menuRef.current,
      { opacity: 0, scale: 0.9, transformOrigin: 'top right' },
      { opacity: 1, scale: 1, duration: 0.2, ease: 'power3.out' }
    );

    // Animate nav links
    if (navRef.current) {
      gsap.fromTo(navRef.current.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.2, stagger: 0.05, ease: 'power2.out', delay: 0.05 }
      );
    }
  };

  const closeMenu = () => {
    // Animate X to hamburger
    gsap.to(line1Ref.current, { rotation: 0, y: 0, duration: 0.15, ease: 'power2.inOut' });
    gsap.to(line2Ref.current, { opacity: 1, duration: 0.1, ease: 'power2.inOut', delay: 0.05 });
    gsap.to(line3Ref.current, { rotation: 0, y: 0, duration: 0.15, ease: 'power2.inOut' });

    // Animate modal out
    gsap.to(menuRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.15,
      ease: 'power2.in',
      onComplete: () => setIsOpen(false)
    });
  };

  const handleLinkClick = () => {
    closeMenu();
  };

  return (
    <>
      <header className="header">
        {!isHomePage && (
          <Link to="/" className="header-logo">
            <Logo3DSmall />
          </Link>
        )}

        <button
          className="hamburger"
          onClick={isOpen ? closeMenu : openMenu}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          <span ref={line1Ref} className="hamburger-line"></span>
          <span ref={line2Ref} className="hamburger-line"></span>
          <span ref={line3Ref} className="hamburger-line"></span>
        </button>
      </header>

      <div ref={menuRef} className={`menu-modal ${isOpen ? 'menu-open' : 'menu-closed'}`}>
        <nav ref={navRef} className="menu-nav">
          <Link to="/" onClick={handleLinkClick}>Home</Link>
          <Link to="/portfolio" onClick={handleLinkClick}>Portfolio</Link>
          <Link to="/the-studio" onClick={handleLinkClick}>The Studio</Link>
          <Link to="/contact" onClick={handleLinkClick}>Contact</Link>
        </nav>
      </div>
    </>
  );
}
