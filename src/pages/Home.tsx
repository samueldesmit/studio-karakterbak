import { useEffect } from 'react';
import Logo3D from '../components/Logo3D';
import './Home.css';

interface HomeSettings {
  backgroundImage: string;
}

const homeModule = import.meta.glob<{ default: HomeSettings }>('../../content/settings/home.json', { eager: true });
const homeSettings: HomeSettings = Object.values(homeModule)[0]?.default || { backgroundImage: '/uploads/DSC00213.JPG' };

export default function Home() {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="hero">
      <div
        className="hero-bg-image"
        style={{ backgroundImage: `url('${homeSettings.backgroundImage}')` }}
      />
      <div className="hero-gradient-overlay" />
      <Logo3D />
    </div>
  );
}
