import logoPng from '../assets/Logo studio.png';
import './Over.css';

interface OverSettings {
  title: string;
  image: string;
  paragraphs: string[];
}

const overModule = import.meta.glob<{ default: OverSettings }>('../../content/settings/over.json', { eager: true });
const overSettings: OverSettings = Object.values(overModule)[0]?.default || {
  title: 'Over',
  image: '/uploads/DSC00186.JPG',
  paragraphs: [],
};

export default function Over() {
  return (
    <div className="over">
      <img src={logoPng} alt="" className="page-bg-logo" aria-hidden="true" />
      <h1>{overSettings.title || 'Over'}</h1>
      <div className="over-content">
        <div className="over-text">
          {overSettings.paragraphs.map((text, i) => (
            <p key={i}>{text}</p>
          ))}
        </div>
        <div className="over-image">
          <img src={overSettings.image} alt="Maurits" />
        </div>
      </div>
    </div>
  );
}
