'use client';

import React, { useState } from 'react';
import { ProjectData, PROJECT_METADATA, GitHubIssue, GitHubPR } from '@/lib/github';

interface ProjectOverviewProps {
  projects: ProjectData[];
  selectedProject: string;
  onSelectProject: (project: string) => void;
}

function getProjectColor(projectName: string): string {
  return PROJECT_METADATA[projectName]?.color || '#6c757d';
}

function getProjectDescription(projectName: string): string {
  return PROJECT_METADATA[projectName]?.description || '';
}

function getStatusBadgeColor(labels: GitHubIssue['labels']): string {
  if (labels.some(l => l.name === 'status:blocked')) return 'bg-red-500';
  if (labels.some(l => l.name === 'status:in-progress')) return 'bg-blue-500';
  if (labels.some(l => l.name === 'status:ready-for-dev' || l.name === 'ready-dev')) return 'bg-green-500';
  if (labels.some(l => l.name === 'status:verified')) return 'bg-cyan-500';
  if (labels.some(l => l.name === 'status:ready-for-test')) return 'bg-orange-500';
  return 'bg-gray-500';
}

function getStatusText(labels: GitHubIssue['labels']): string {
  if (labels.some(l => l.name === 'status:blocked')) return 'Blocked';
  if (labels.some(l => l.name === 'status:in-progress')) return 'In Progress';
  if (labels.some(l => l.name === 'status:ready-for-dev' || l.name === 'ready-dev')) return 'Ready';
  if (labels.some(l => l.name === 'status:verified')) return 'Verified';
  if (labels.some(l => l.name === 'status:ready-for-test')) return 'Ready for Test';
  if (labels.some(l => l.name === 'status:spec-review')) return 'Spec Review';
  return 'Open';
}

function getRoleFromLabels(labels: GitHubIssue['labels']): string {
  if (labels.some(l => l.name === 'role:dev')) return 'WUT';
  if (labels.some(l => l.name === 'role:qa-reviewer' || l.name === 'role:qa')) return 'ORN';
  if (labels.some(l => l.name === 'role:gm')) return 'GM';
  return 'Unassigned';
}

export default function ProjectOverview({ projects, selectedProject, onSelectProject }: ProjectOverviewProps) {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  if (projects.length === 0) {
    return (
      <div className="nes-container is-dark with-title mb-6">
        <p className="title">📁 Projects</p>
        <p className="text-center py-4">No projects found</p>
      </div>
    );
  }

  const toggleExpand = (projectName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedProject(expandedProject === projectName ? null : projectName);
  };

  const handleSelectProject = (projectName: string) => {
    onSelectProject(selectedProject === projectName ? 'all' : projectName);
  };

  return (
    <div className="nes-container is-dark with-title mb-6">
      <p className="title">📁 Projects ({projects.length})</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => {
          const isSelected = selectedProject === project.repo.name;
          const isExpanded = expandedProject === project.repo.name;
          const projectColor = getProjectColor(project.repo.name);
          const totalPhaseIssues = project.phaseProgress.total || 1;
          
          return (
            <div key={project.repo.id} className="relative">
              <button
                onClick={() => handleSelectProject(project.repo.name)}
                className={`nes-btn text-left w-full ${
                  isSelected ? 'is-primary' : ''
                }`}
              >
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="font-bold truncate" style={{ fontFamily: 'monospace', color: projectColor }}>
                      {project.repo.name}
                    </span>
                    <button
                      onClick={(e) => toggleExpand(project.repo.name, e)}
                      className="nes-btn is-primary text-xs px-2 py-1"
                      style={{ minWidth: 'auto' }}
                    >
                      {isExpanded ? '▼' : '▶'}
                    </button>
                  </div>
                  <span className="text-xs text-gray-400 truncate mt-1">
                    {getProjectDescription(project.repo.name)}
                  </span>
                  
                  {/* Stats Row */}
                  <div className="flex gap-4 mt-2 text-xs">
                    <span className="text-yellow-400">
                      🐛 {project.repo.open_issues_count} issues
                    </span>
                    <span className="text-green-400">
                      🔀 {project.openPRs} PRs
                    </span>
                  </div>

                  {/* Phase Progress Bar */}
                  <div className="mt-3">
                    <div className="flex text-xs text-gray-400 mb-1 justify-between">
                      <span>Phase Progress</span>
                      <span>{project.phaseProgress.phase1 + project.phaseProgress.phase2 + project.phaseProgress.phase3} issues</span>
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden flex">
                      <div 
                        className="h-full bg-blue-500"
                        style={{ width: `${(project.phaseProgress.phase1 / totalPhaseIssues) * 100}%` }}
                        title={`Phase 1: ${project.phaseProgress.phase1} issues`}
                      />
                      <div 
                        className="h-full bg-purple-500"
                        style={{ width: `${(project.phaseProgress.phase2 / totalPhaseIssues) * 100}%` }}
                        title={`Phase 2: ${project.phaseProgress.phase2} issues`}
                      />
                      <div 
                        className="h-full bg-amber-500"
                        style={{ width: `${(project.phaseProgress.phase3 / totalPhaseIssues) * 100}%` }}
                        title={`Phase 3: ${project.phaseProgress.phase3} issues`}
                      />
                    </div>
                    <div className="flex gap-3 mt-1 text-xs">
                      <span className="text-blue-400">P1: {project.phaseProgress.phase1}</span>
                      <span className="text-purple-400">P2: {project.phaseProgress.phase2}</span>
                      <span className="text-amber-400">P3: {project.phaseProgress.phase3}</span>
                    </div>
                  </div>
                </div>
              </button>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="absolute z-10 left-0 right-0 mt-2 nes-container is-dark"
                  style={{ top: '100%' }}
                >
                  <div className="max-h-64 overflow-y-auto">
                    {/* Open Issues by Role */}
                    <div className="mb-4">
                      <h4 className="text-sm font-bold mb-2 text-gray-300">Open Issues by Role</h4>
                      <div className="space-y-1">
                        {['WUT', 'ORN', 'GM'].map((role) => {
                          const roleIssues = project.openIssues.filter(i => 
                            getRoleFromLabels(i.labels) === role
                          );
                          if (roleIssues.length === 0) return null;
                          return (
                            <div key={role} className="text-xs">
                              <span className="font-bold" style={{ 
                                color: role === 'WUT' ? '#6f42c1' : role === 'ORN' ? '#20c997' : '#fd7e14'
                              }}>
                                {role}:
                              </span>
                              <span className="ml-1">{roleIssues.length} issues</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Open PRs */}
                    {project.prs.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-bold mb-2 text-gray-300">Open Pull Requests</h4>
                        <div className="space-y-2">
                          {project.prs.map((pr) => (
                            <a
                              key={pr.id}
                              href={pr.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-xs p-2 bg-gray-800 rounded hover:bg-gray-700"
                            >
                              <span className="text-gray-400">#{pr.number}</span>
                              <span className="ml-2 truncate">{pr.title}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recent Issues */}
                    {project.openIssues.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold mb-2 text-gray-300">Recent Open Issues</h4>
                        <div className="space-y-2">
                          {project.openIssues.slice(0, 5).map((issue) => (
                            <a
                              key={issue.id}
                              href={issue.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <span className={`px-1.5 py-0.5 rounded text-white ${getStatusBadgeColor(issue.labels)}`}>
                                  {getStatusText(issue.labels)}
                                </span>
                                <span className="text-gray-400">#{issue.number}</span>
                              </div>
                              <div className="truncate mt-1 text-gray-300">{issue.title}</div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
