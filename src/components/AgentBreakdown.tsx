'use client';

import React, { useState } from 'react';
import { CrossProjectAgentWorkload, AgentRole, PROJECTS, PROJECT_METADATA } from '@/lib/github';

interface AgentBreakdownProps {
  agentWorkload: CrossProjectAgentWorkload[];
  selectedAgent: AgentRole | 'all';
  onSelectAgent: (agent: AgentRole | 'all') => void;
}

const agentConfig: Record<AgentRole, { name: string; icon: string; color: string; description: string }> = {
  dev: {
    name: 'WUT',
    icon: '/agents/wut.svg',
    color: '#2196f3',
    description: 'The Builder',
  },
  'qa-reviewer': {
    name: 'ORN',
    icon: '/agents/orn.svg',
    color: '#ffc107',
    description: 'The Inspector',
  },
  gm: {
    name: 'GM',
    icon: '/agents/gm.svg',
    color: '#e94560',
    description: 'The Manager',
  },
};

function getProjectColor(projectName: string): string {
  return PROJECT_METADATA[projectName]?.color || '#6c757d';
}

function getProjectDisplayName(projectName: string): string {
  return PROJECT_METADATA[projectName]?.name || projectName;
}

export default function AgentBreakdown({ agentWorkload, selectedAgent, onSelectAgent }: AgentBreakdownProps) {
  const [expandedAgent, setExpandedAgent] = useState<AgentRole | null>(null);

  const toggleExpand = (role: AgentRole, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedAgent(expandedAgent === role ? null : role);
  };

  return (
    <div className="nes-container is-dark with-title mb-6">
      <p className="title">👥 Cross-Project Agent Workload</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {agentWorkload.map((agent) => {
          const config = agentConfig[agent.role];
          const isSelected = selectedAgent === agent.role;
          const isExpanded = expandedAgent === agent.role;
          const maxCount = Math.max(...agentWorkload.map(a => a.totalIssues), 1);
          
          return (
            <div key={agent.role} className="relative">
              <button
                onClick={() => onSelectAgent(isSelected ? 'all' : agent.role)}
                className={`nes-btn p-4 text-left transition-all w-full ${
                  isSelected ? 'is-primary' : ''
                }`}
                style={{
                  borderColor: isSelected ? undefined : config.color,
                }}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={config.icon}
                    alt={config.name}
                    width="48"
                    height="48"
                    className="pixelated"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold" style={{ color: config.color }}>
                          {config.name}
                        </span>
                        <span className="text-2xl font-bold">
                          {agent.totalIssues.toString().padStart(2, '0')}
                        </span>
                      </div>
                      <button
                        onClick={(e) => toggleExpand(agent.role, e)}
                        className="nes-btn is-primary text-xs px-2 py-1"
                        style={{ minWidth: 'auto' }}
                      >
                        {isExpanded ? '▼' : '▶'}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400">{config.description}</p>
                    
                    {/* Cross-project breakdown */}
                    <div className="mt-2 flex gap-2 text-xs flex-wrap">
                      {PROJECTS.map((project) => {
                        const count = agent.byProject[project] || 0;
                        if (count === 0) return null;
                        return (
                          <span 
                            key={project}
                            className="px-1.5 py-0.5 rounded"
                            style={{ 
                              backgroundColor: getProjectColor(project),
                              color: '#ffffff',
                            }}
                          >
                            {getProjectDisplayName(project)}: {count}
                          </span>
                        );
                      })}
                    </div>

                    <div className="mt-2">
                      <progress
                        className="nes-progress is-primary"
                        value={agent.totalIssues}
                        max={maxCount}
                        style={{ 
                          '--progress-color': config.color } as React.CSSProperties
                      }></progress>
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
                    {/* Workload by Project */}
                    <div className="mb-4">
                      <h4 className="text-sm font-bold mb-2 text-gray-300">Workload by Project</h4>
                      <div className="space-y-2">
                        {PROJECTS.map((project) => {
                          const count = agent.byProject[project] || 0;
                          return (
                            <div key={project} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: getProjectColor(project) }}
                                />
                                <span className="text-xs">{getProjectDisplayName(project)}</span>
                              </div>
                              <span className="text-xs font-bold">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* ORN's Review Queue */}
                    {agent.role === 'qa-reviewer' && agent.reviewQueue.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold mb-2 text-gray-300">🔍 Review Queue ({agent.reviewQueue.length} PRs)</h4>
                        <div className="space-y-2">
                          {agent.reviewQueue.map((pr) => (
                            <a
                              key={pr.id}
                              href={pr.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-xs p-2 bg-gray-800 rounded hover:bg-gray-700"
                            >
                              <div className="flex items-center gap-2">
                                <span 
                                  className="px-1.5 py-0.5 rounded text-white text-xs"
                                  style={{ backgroundColor: getProjectColor(pr.project || '') }}
                                >
                                  {getProjectDisplayName(pr.project || '')}
                                </span>
                                <span className="text-gray-400">#{pr.number}</span>
                              </div>
                              <div className="truncate mt-1">{pr.title}</div>
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

      {selectedAgent !== 'all' && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => onSelectAgent('all')}
            className="nes-btn is-error"
          >
            Clear Agent Filter
          </button>
        </div>
      )}
    </div>
  );
}
