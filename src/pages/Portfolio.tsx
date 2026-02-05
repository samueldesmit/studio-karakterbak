import { useState, useEffect } from 'react';
import SpotifyEmbed from '../components/SpotifyEmbed';
import logoPng from '../assets/Logo studio.png';
import './Portfolio.css';

interface Project {
  id: string;
  artist: string;
  title: string;
  year: number;
  services: string[];
  image: string;
  spotifyEmbed: string;
  releaseType?: string;
  featured?: boolean;
  order?: number;
}

const SERVICES = ['Production', 'Mixing', 'Mastering', 'Drums', 'Songwriting'] as const;

// Import all project JSON files from the content folder
const projectModules = import.meta.glob<{ default: Project }>('../../content/projects/*.json', { eager: true });

// Convert modules to projects array and sort by order
const loadedProjects: Project[] = Object.values(projectModules)
  .map((module) => module.default)
  .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

export default function Portfolio() {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>(loadedProjects);

  useEffect(() => {
    setProjects(loadedProjects);
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
          </article>
        ))}
      </div>
    </div>
  );
}
