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
      <Logo3D />
    </div>
  );
}
