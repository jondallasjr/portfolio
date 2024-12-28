"use client";

import React, { useState } from 'react';
import { Search } from 'lucide-react';

// TypeScript interfaces
interface Project {
  title: string;
  type: string;
  summary: string;
  technologies: string[];
  significance: number;
  impact?: string;
  keyFeatures?: string[];
}

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

// ProjectCard Component with improved styling
const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => (
  <div 
    onClick={onClick}
    className="p-6 bg-white rounded-lg shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-100"
  >
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
    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
          {project.keyFeatures && (
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
        </div>
      </div>
    </div>
  </div>
);

// Main Portfolio Component
export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  // Project data
  const projects: Project[] = [
    {
      title: "AI Property Description Generator",
      type: "Chrome Extension",
      summary: "A sophisticated Google Chrome extension that automates and enhances the process of generating real estate property descriptions with AI image analysis and text generation.",
      significance: 1,
      impact: "Reduced property description writing time from 60+ minutes to under 10 minutes, an 80+% reduction, while improving quality, accuracy, and personalization.",
      technologies: ["Chrome Extension APIs", "OpenAI Vision", "Coda.io API", "Anthropic API", "JavaScript"],
      keyFeatures: [
        "Advanced Data Scraping",
        "Multi-API Integration",
        "Intelligent Prompt Engineering",
        "Quality Assurance",
        "Customization"
      ]
    },
    {
      title: "Task Management System",
      type: "Web App",
      summary: "An all-encompassing task, project, and time-tracking tool built using low-code in Coda.io.",
      significance: 1,
      impact: "Reduced time spent on task management, increased project completion rates, improved time management, streamlined workflows.",
      technologies: ["Coda.io", "Low-Code Development", "Workflow Optimization"],
      keyFeatures: [
        "Task Information Management",
        "Easy Time Tracking",
        "Recurring Task Scheduler",
        "Comprehensive Reporting"
      ]
    },
    {
      title: "AI-Enhanced SEO Content Optimization",
      type: "Web App",
      summary: "A web app that chooses existing published articles with the highest rewrite ROI potential and optimizes them using AI.",
      significance: 1,
      impact: "Increased average article traffic by 10.5% in 3 months. Reduced time spent on each article SEO keyword update by 80%.",
      technologies: ["OpenAI API", "Google Search Console", "ahrefs API", "Coda.io", "Google Apps Script"],
      keyFeatures: [
        "Data-Driven Optimization",
        "AI-Powered Suggestions",
        "Workflow Automation",
        "Content Quality Assurance"
      ]
    }
  ];

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

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={index}
              project={project}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>

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