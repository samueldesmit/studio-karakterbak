import { useEffect } from 'react';
import Logo3D from '../components/Logo3D';
import './Home.css';

export default function Home() {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="hero">
      <div className="hero-bg-image" />
      <div className="hero-gradient-overlay" />
      <Logo3D />
    </div>
  );
}
