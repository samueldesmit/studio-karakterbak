import Logo3D from '../components/Logo3D';
import './Home.css';

export default function Home() {
  return (
    <div className="hero">
      <div className="hero-bg-image" aria-hidden="true" />
      <Logo3D />
    </div>
  );
}
