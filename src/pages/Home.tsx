import Logo3D from '../components/Logo3D';
import logoPng from '../assets/Logo studio.png';
import './Home.css';

export default function Home() {
  return (
    <div className="hero">
      <img src={logoPng} alt="" className="hero-bg-logo" aria-hidden="true" />
      <Logo3D />
    </div>
  );
}
