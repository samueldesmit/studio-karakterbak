import { useState } from 'react';
import './TheStudio.css';

interface StudioPicture {
  image: string;
  caption?: string;
}

interface StudioSettings {
  title: string;
  aboutText: string;
  pictures: StudioPicture[];
}

// Import studio settings from CMS content at build time
const studioModule = import.meta.glob<{ default: StudioSettings }>('../../content/settings/studio.json', { eager: true });
const studioSettings: StudioSettings = Object.values(studioModule)[0]?.default || { title: '', aboutText: '', pictures: [] };

function ImageWithSkeleton({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`collage-item ${!loaded ? 'loading' : ''}`}>
      <img
        src={src}
        alt={alt}
        className={loaded ? 'loaded' : ''}
        onLoad={() => setLoaded(true)}
        loading="lazy"
      />
    </div>
  );
}

export default function TheStudio() {
  const [pictures] = useState<StudioPicture[]>(studioSettings.pictures || []);

  if (pictures.length === 0) {
    return (
      <div className="studio-page">
        <div className="studio-empty">
          <p>No studio pictures yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="studio-page">
      <h1>{studioSettings.title || 'Studio'}</h1>
      <div className="collage">
        {pictures.map((picture, index) => (
          <ImageWithSkeleton
            key={index}
            src={picture.image}
            alt={picture.caption || 'Studio picture'}
          />
        ))}
      </div>
    </div>
  );
}
