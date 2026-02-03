import { useState } from 'react';
import SpotifyEmbed from '../components/SpotifyEmbed';
import logoPng from '../assets/Logo studio.png';
import './Portfolio.css';

import xilanImg from '../assets/Xilan.jpeg';
import floraSophiImg from '../assets/flora-sophi.jpeg';
import fuisImg from '../assets/fuis-persfoto-kopie-1024x682-url_hero_lg.jpeg';
import josephinImg from '../assets/josephin.jpeg';
import julietImg from '../assets/juliet.jpeg';
import jungleByNightImg from '../assets/jungle-by-noght.jpg';
import nekoImg from '../assets/neko.jpeg';
import philipGlassImg from '../assets/philis-glass.jpeg';
import signeImg from '../assets/signe-do-ways.jpeg';
import sunsetSocietyImg from '../assets/the-sunset-society.jpeg';

interface Project {
  id: string;
  artist: string;
  title: string;
  year: number;
  services: string[];
  image: string;
  spotifyEmbed: string;
}

const SERVICES = ['Production', 'Mixing', 'Mastering', 'Drums'] as const;

const projects: Project[] = [
  {
    id: 'jungle-by-night',
    artist: 'Jungle by Night',
    title: 'Album Title',
    year: 2024,
    services: ['Mixing'],
    image: jungleByNightImg,
    spotifyEmbed: 'https://open.spotify.com/embed/artist/2StcyX3fmelae5agBHIkDO?utm_source=generator',
  },
  {
    id: 'xilan',
    artist: 'Xilan',
    title: 'Album Title',
    year: 2024,
    services: ['Production', 'Mixing', 'Mastering'],
    image: xilanImg,
    spotifyEmbed: 'https://open.spotify.com/embed/artist/4NTqnS8zPIpfzdNBcqK8Ly?utm_source=generator',
  },
  {
    id: 'flora-sophi',
    artist: 'Flora Sophi',
    title: 'Album Title',
    year: 2023,
    services: ['Mixing', 'Mastering'],
    image: floraSophiImg,
    spotifyEmbed: 'https://open.spotify.com/embed/album/7h18DzFGOFR0Sk7xk9cFul?utm_source=generator',
  },
  {
    id: 'fuis',
    artist: 'FUIS',
    title: 'Album Title',
    year: 2023,
    services: ['Production', 'Mixing'],
    image: fuisImg,
    spotifyEmbed: 'https://open.spotify.com/embed/album/7h18DzFGOFR0Sk7xk9cFul?utm_source=generator',
  },
  {
    id: 'josephin',
    artist: 'Josephin',
    title: 'Album Title',
    year: 2023,
    services: ['Production', 'Drums'],
    image: josephinImg,
    spotifyEmbed: 'https://open.spotify.com/embed/album/7h18DzFGOFR0Sk7xk9cFul?utm_source=generator',
  },
  {
    id: 'juliet',
    artist: 'Juliet',
    title: 'Album Title',
    year: 2022,
    services: ['Mixing', 'Mastering'],
    image: julietImg,
    spotifyEmbed: 'https://open.spotify.com/embed/album/7h18DzFGOFR0Sk7xk9cFul?utm_source=generator',
  },
  {
    id: 'neko',
    artist: 'Neko',
    title: 'Album Title',
    year: 2022,
    services: ['Production', 'Mixing', 'Mastering'],
    image: nekoImg,
    spotifyEmbed: 'https://open.spotify.com/embed/album/7h18DzFGOFR0Sk7xk9cFul?utm_source=generator',
  },
  {
    id: 'philip-glass',
    artist: 'Philip Glass',
    title: 'Album Title',
    year: 2022,
    services: ['Drums'],
    image: philipGlassImg,
    spotifyEmbed: 'https://open.spotify.com/embed/album/7h18DzFGOFR0Sk7xk9cFul?utm_source=generator',
  },
  {
    id: 'signe',
    artist: 'Signe',
    title: 'Album Title',
    year: 2021,
    services: ['Production', 'Mixing'],
    image: signeImg,
    spotifyEmbed: 'https://open.spotify.com/embed/album/7h18DzFGOFR0Sk7xk9cFul?utm_source=generator',
  },
  {
    id: 'sunset-society',
    artist: 'The Sunset Society',
    title: 'Album Title',
    year: 2021,
    services: ['Production', 'Mixing', 'Mastering', 'Drums'],
    image: sunsetSocietyImg,
    spotifyEmbed: 'https://open.spotify.com/embed/album/7h18DzFGOFR0Sk7xk9cFul?utm_source=generator',
  },
];

export default function Portfolio() {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (service: string) => {
    setActiveFilters((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const filteredProjects = activeFilters.length === 0
    ? projects
    : projects.filter((project) =>
        activeFilters.every((filter) => project.services.includes(filter))
      );

  return (
    <div className="portfolio">
      <img src={logoPng} alt="" className="page-bg-logo" aria-hidden="true" />
      <h1>Portfolio</h1>

      <div className="filters">
        {SERVICES.map((service) => (
          <button
            key={service}
            className={`filter-btn ${activeFilters.includes(service) ? 'active' : ''}`}
            onClick={() => toggleFilter(service)}
          >
            {service}
          </button>
        ))}
      </div>

      <div className="projects">
        {filteredProjects.map((project) => (
          <article key={project.id} className="project">
            <div className="project-image">
              <img src={project.image} alt={project.artist} />
            </div>
            <div className="project-info">
              <div className="project-header">
                <h2>{project.artist}</h2>
                <span className="project-year">{project.year}</span>
              </div>
              <div className="project-services">
                {project.services.map((service) => (
                  <span key={service} className="service-tag">{service}</span>
                ))}
              </div>
            </div>
            <div className="project-spotify">
              <SpotifyEmbed src={project.spotifyEmbed} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
