import logoPng from '../assets/Logo studio.png';
import './Over.css';

interface OverSettings {
  title: string;
  image: string;
  paragraphs: string[];
  downloadFile?: string;
  downloadLabel?: string;
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
          {overSettings.downloadFile && (
            <a
              href={overSettings.downloadFile}
              download
              className="download-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {overSettings.downloadLabel || 'Download'}
            </a>
          )}
        </div>
        <div className="over-image">
          <img src={overSettings.image} alt="Maurits" />
        </div>
      </div>
    </div>
  );
}
