"use client";

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

// TypeScript interfaces for Coda API
interface CodaRow {
  id: string;
  type: string;
  href: string;
  name: string;
  values: {
    'c-ZJnRSHN57I': string; // Name
    'c-XTBof-RnLk': { display: string }; // Type (relation)
    'c-TYFrdpvKvq': string; // Summary/Overview
    'c-qgddQJ2vl4': string; // Impact
    'c-unM4iGWb1m': string; // Key Features
    'c-UpecEZo58M': string[]; // Images
    'c-oZ9MT4CMqI': string; // Live Site
    'c-ftYEpVsCyh': string; // Code Samples
    'c-WIAWKYBqCl': string; // Explainer Video
    'c-EMTQtgeVuP': string[]; // Skills
    'c-ZrGXoOyahn': string; // Date
    'c-1sypaYxPdn': boolean; // Visible
  };
}

interface CodaApiResponse {
  items: CodaRow[];
  href: string;
  nextPageLink?: string;
  previousPageLink?: string;
}

interface Project {
  title: string;
  type: string;
  summary: string;
  technologies: string[];
  impact?: string;
  keyFeatures?: string[];
  imageUrls?: string[];
  liveSiteUrl?: string;
  codeSamples?: string;
  explainerVideo?: string;
  date: string;
  visible: boolean;
}

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

// Coda API functions
const CODA_API_TOKEN = '50598e8a-fd5d-49e0-9996-a47cf5fdea86';
const DOC_ID = 'ukvIYGL9UJ';
const TABLE_ID = 'grid-ZKKcULTwR_';

async function fetchProjects(): Promise<Project[]> {
  try {
    const response = await fetch(`https://coda.io/apis/v1/docs/${DOC_ID}/tables/${TABLE_ID}/rows`, {
      headers: {
        'Authorization': `Bearer ${CODA_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }

    const data = await response.json() as CodaApiResponse;
    
    return data.items
      .filter(item => item.values['c-1sypaYxPdn'] === true) // Only visible projects
      .map(item => ({
        title: item.values['c-ZJnRSHN57I'] || '',
        type: item.values['c-XTBof-RnLk']?.display || '', // Handle relation field
        summary: item.values['c-TYFrdpvKvq'] || '',
        impact: item.values['c-qgddQJ2vl4'] || '',
        keyFeatures: item.values['c-unM4iGWb1m']?.split('\n').filter(Boolean) || [],
        imageUrls: item.values['c-UpecEZo58M'] || [],
        liveSiteUrl: item.values['c-oZ9MT4CMqI'] || '',
        codeSamples: item.values['c-ftYEpVsCyh'] || '',
        explainerVideo: item.values['c-WIAWKYBqCl'] || '',
        technologies: item.values['c-EMTQtgeVuP'] || [],
        date: item.values['c-ZrGXoOyahn'] || '',
        visible: item.values['c-1sypaYxPdn'] || false
      }));
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

// ProjectCard Component
const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => (
  <div 
    onClick={onClick}
    className="p-6 bg-white rounded-lg shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-100"
  >
    {project.imageUrls?.[0] && (
      <div className="mb-4 w-full h-48 relative overflow-hidden rounded-lg">
        <img
          src={project.imageUrls[0]}
          alt={project.title}
          className="object-cover w-full h-full"
          onError={(e) => {
            e.currentTarget.src = '/api/placeholder/400/320';
          }}
        />
      </div>
    )}
    <div className="flex justify-between items-start mb-3">
      <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
      <span className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full">
        {project.type}
      </span>
    </div>
    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.summary}</p>
    <div className="flex flex-wrap gap-2">
      {project.technologies.slice(0, 4).map((tech, index) => (
        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
          {tech}
        </span>
      ))}
      {project.technologies.length > 4 && (
        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
          +{project.technologies.length - 4} more
        </span>
      )}
    </div>
  </div>
);

// ProjectModal Component
const ProjectModal: React.FC<{project: Project; onClose: () => void}> = ({ project, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{project.title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        {project.imageUrls && project.imageUrls.length > 0 && (
          <div className="mb-6 grid grid-cols-2 gap-4">
            {project.imageUrls.map((url, index) => (
              <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                <img
                  src={url}
                  alt={`${project.title} screenshot ${index + 1}`}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.currentTarget.src = '/api/placeholder/400/320';
                  }}
                />
              </div>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Overview</h3>
            <p className="text-gray-700">{project.summary}</p>
          </div>
          
          {project.impact && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Impact</h3>
              <p className="text-gray-700">{project.impact}</p>
            </div>
          )}
          
          {project.keyFeatures && project.keyFeatures.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Key Features</h3>
              <ul className="list-disc pl-5 space-y-1">
                {project.keyFeatures.map((feature, index) => (
                  <li key={index} className="text-gray-700">{feature}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-2">Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {project.liveSiteUrl && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Live Site</h3>
              <a 
                href={project.liveSiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                View Project →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

// Main Portfolio Component
export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const fetchedProjects = await fetchProjects();
        setProjects(fetchedProjects);
        setError(null);
      } catch (err) {
        setError('Failed to load projects. Please try again later.');
        console.error('Error loading projects:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Get unique technologies across all projects
  const allTechnologies = Array.from(
    new Set(projects.flatMap(project => project.technologies))
  ).sort();

  // Filter projects based on search term and selected technology
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTech = !selectedTech || project.technologies.includes(selectedTech);
    return matchesSearch && matchesTech;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Jon Dallas</h1>
          <p className="mt-2 text-lg text-gray-600">
            AI Integration Specialist & Full-Stack Developer
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTech(null)}
              className={`px-3 py-1 rounded-full text-sm ${
                !selectedTech 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {allTechnologies.map((tech) => (
              <button
                key={tech}
                onClick={() => setSelectedTech(tech === selectedTech ? null : tech)}
                className={`px-3 py-1 rounded-full text-sm ${
                  tech === selectedTech 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading projects...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={index}
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        )}

        {/* Project Modal */}
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </main>
    </div>
  );
}