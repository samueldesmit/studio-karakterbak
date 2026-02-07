import { useState, useCallback, useEffect } from 'react';
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

function ImageWithSkeleton({ src, alt, onClick }: { src: string; alt: string; onClick: () => void }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const imgRef = useCallback((img: HTMLImageElement | null) => {
    if (img && img.complete) {
      if (img.naturalWidth > 0) setLoaded(true);
      else setFailed(true);
    }
  }, []);

  if (failed) return null;

  return (
    <div className={`collage-item ${!loaded ? 'loading' : ''}`} onClick={loaded ? onClick : undefined}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={loaded ? 'loaded' : ''}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export default function TheStudio() {
  const [pictures] = useState<StudioPicture[]>(studioSettings.pictures || []);
  const [modalImage, setModalImage] = useState<StudioPicture | null>(null);

  useEffect(() => {
    if (modalImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [modalImage]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalImage(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

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
            onClick={() => setModalImage(picture)}
          />
        ))}
      </div>

      {modalImage && (
        <div className="image-modal" onClick={() => setModalImage(null)}>
          <button className="modal-close" aria-label="Sluiten">&times;</button>
          <img
            src={modalImage.image}
            alt={modalImage.caption || 'Studio picture'}
            onClick={(e) => e.stopPropagation()}
          />
          {modalImage.caption && (
            <div className="modal-caption">{modalImage.caption}</div>
          )}
        </div>
      )}
    </div>
  );
}
