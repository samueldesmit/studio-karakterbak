import { useState, useEffect } from 'react';
import SpotifyEmbed from '../components/SpotifyEmbed';
import './Portfolio.css';

interface Project {
  id: string;
  artist: string;
  title: string;
  year: number;
  services: string[];
  image?: string;
  spotifyEmbed?: string;
  youtubeUrl?: string;
  releaseType?: string;
  featured?: boolean;
  order?: number;
}

const SERVICES = ['Production', 'Mixing', 'Mastering', 'Drums', 'Songwriting'] as const;

function getYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

// Import all project JSON files from the content folder
const projectModules = import.meta.glob<{ default: Project }>('../../content/projects/*.json', { eager: true });

// Convert modules to projects array and sort by order
const loadedProjects: Project[] = Object.values(projectModules)
  .map((module) => module.default)
  .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

export default function Portfolio() {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [projects, setProjects] = useState<Project[]>(loadedProjects);

  useEffect(() => {
    setProjects(loadedProjects);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setViewMode('grid');
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      <img src="/logo.svg" alt="" className="page-bg-logo" aria-hidden="true" />
      <h1>Portfolio</h1>

      <div className="toolbar">
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
        {!isMobile && (
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
              </svg>
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className={`projects ${viewMode === 'list' ? 'projects--list' : ''}`}>
        {filteredProjects.map((project) => (
          <article key={project.id} className="project">
            {project.spotifyEmbed ? (
              <>
                <div className="project-image">
                  <img src={project.image || ''} alt={project.artist} />
                </div>
                <div className="project-info">
                  <div className="project-header">
                    <h2>{project.artist} — {project.title}{project.releaseType ? ` (${project.releaseType})` : ''}</h2>
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
              </>
            ) : project.youtubeUrl && getYoutubeId(project.youtubeUrl) ? (
              <>
                <div className="youtube-embed">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYoutubeId(project.youtubeUrl)}`}
                    title={`${project.artist} — ${project.title}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <div className="project-info">
                  <div className="project-header">
                    <h2>{project.artist} — {project.title}{project.releaseType ? ` (${project.releaseType})` : ''}</h2>
                    <span className="project-year">{project.year}</span>
                  </div>
                  <div className="project-services">
                    {project.services.map((service) => (
                      <span key={service} className="service-tag">{service}</span>
                    ))}
                  </div>
                </div>
                <a
                  href={project.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="youtube-link"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  Bekijk op YouTube
                </a>
              </>
            ) : (
              <>
                <div className="project-image">
                  <img src={project.image || ''} alt={project.artist} />
                </div>
                <div className="project-info">
                  <div className="project-header">
                    <h2>{project.artist} — {project.title}{project.releaseType ? ` (${project.releaseType})` : ''}</h2>
                    <span className="project-year">{project.year}</span>
                  </div>
                  <div className="project-services">
                    {project.services.map((service) => (
                      <span key={service} className="service-tag">{service}</span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
