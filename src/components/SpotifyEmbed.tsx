import { useState } from 'react';
import './SpotifyEmbed.css';

interface SpotifyEmbedProps {
  src: string;
}

export default function SpotifyEmbed({ src }: SpotifyEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="spotify-embed">
      {!isLoaded && <div className="spotify-placeholder" />}
      <iframe
        className={`spotify-iframe ${isLoaded ? 'loaded' : ''}`}
        style={{ borderRadius: '12px' }}
        src={src}
        width="100%"
        height="80"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}
