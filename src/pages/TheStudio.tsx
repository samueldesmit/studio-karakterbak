import { useState, useEffect } from 'react';
import './TheStudio.css';

// Import images from assets
import floraSophi from '../assets/flora-sophi.jpeg';
import josephin from '../assets/josephin.jpeg';
import juliet from '../assets/juliet.jpeg';
import jungleByNight from '../assets/jungle-by-noght.jpg';
import mauritsNijhuis from '../assets/maurits_nijhuis.jpeg';
import neko from '../assets/neko.jpeg';
import philisGlass from '../assets/philis-glass.jpeg';
import signeDoWays from '../assets/signe-do-ways.jpeg';
import theSunsetSociety from '../assets/the-sunset-society.jpeg';
import xilan from '../assets/Xilan.jpeg';

const images = [
  { src: floraSophi, alt: 'Flora Sophi' },
  { src: josephin, alt: 'Josephin' },
  { src: juliet, alt: 'Juliet' },
  { src: jungleByNight, alt: 'Jungle by Night' },
  { src: mauritsNijhuis, alt: 'Maurits Nijhuis' },
  { src: neko, alt: 'Neko' },
  { src: philisGlass, alt: 'Philis Glass' },
  { src: signeDoWays, alt: 'Signe do Ways' },
  { src: theSunsetSociety, alt: 'The Sunset Society' },
  { src: xilan, alt: 'Xilan' },
];

export default function TheStudio() {
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

  return (
    <div className="studio-page">
      <div className="collage">
        {images.map((image, index) => (
          <div 
            key={index} 
            className="collage-item"
            onClick={() => openModal(image)}
          >
            <img src={image.src} alt={image.alt} />
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
        </div>
      )}
    </div>
  );
}
