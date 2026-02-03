import { useState, useEffect } from 'react';
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

export default function TheStudio() {
  const [pictures] = useState<StudioPicture[]>(studioSettings.pictures || []);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);

  const openModal = (image: { src: string; alt: string }) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (selectedImage) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedImage]);

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
      <div className="collage">
        {pictures.map((picture, index) => (
          <div 
            key={index} 
            className="collage-item"
            onClick={() => openModal({ src: picture.image, alt: picture.caption || 'Studio picture' })}
          >
            <img src={picture.image} alt={picture.caption || 'Studio picture'} />
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={closeModal}>
          <button className="modal-close" onClick={closeModal}>×</button>
          <img 
            src={selectedImage.src} 
            alt={selectedImage.alt} 
            onClick={(e) => e.stopPropagation()}
          />
          {selectedImage.alt && selectedImage.alt !== 'Studio picture' && (
            <p className="modal-caption">{selectedImage.alt}</p>
          )}
        </div>
      )}
    </div>
  );
}
