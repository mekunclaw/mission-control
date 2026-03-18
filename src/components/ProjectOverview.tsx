'use client';

import React from 'react';
import { ProjectData } from '@/lib/github';

interface ProjectOverviewProps {
  projects: ProjectData[];
  selectedProject: string;
  onSelectProject: (project: string) => void;
}

export default function ProjectOverview({ projects, selectedProject, onSelectProject }: ProjectOverviewProps) {
  if (projects.length === 0) {
    return (
      <div className="nes-container is-dark with-title mb-6">
        <p className="title">📁 Projects</p>
        <p className="text-center py-4">No projects found</p>
      </div>
    );
  }

  return (
    <div className="nes-container is-dark with-title mb-6">
      <p className="title">📁 Projects ({projects.length})</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <button
            key={project.repo.id}
            onClick={() => onSelectProject(project.repo.name)}
            className={`nes-btn text-left ${
              selectedProject === project.repo.name ? 'is-primary' : ''
            }`}
          >
            <div className="flex flex-col">
              <span className="font-bold truncate" style={{ fontFamily: 'monospace' }}>
                {project.repo.name}
              </span>
              {project.repo.description && (
                <span className="text-xs text-gray-400 truncate mt-1">
                  {project.repo.description}
                </span>
              )}
              <div className="flex gap-4 mt-2 text-xs">
                <span className="text-yellow-400">
                  🐛 {project.repo.open_issues_count} issues
                </span>
                <span className="text-green-400">
                  🔀 {project.openPRs} PRs
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}