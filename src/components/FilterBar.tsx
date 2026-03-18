'use client';

import React from 'react';
import { FilterState, AgentRole, StatusFilter, PriorityFilter, ProjectData } from '@/lib/github';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  projects: ProjectData[];
}

const statusOptions: { value: StatusFilter; label: string; color: string }[] = [
  { value: 'all', label: 'All Status', color: '#9e9e9e' },
  { value: 'ready-for-dev', label: 'Ready for Dev', color: '#4ecca3' },
  { value: 'in-progress', label: 'In Progress', color: '#ffc107' },
  { value: 'blocked', label: 'Blocked', color: '#ff6b6b' },
  { value: 'verified', label: 'Verified', color: '#2196f3' },
  { value: 'spec-review', label: 'Spec Review', color: '#9c27b0' },
];

const priorityOptions: { value: PriorityFilter; label: string }[] = [
  { value: 'all', label: 'All Priorities' },
  { value: 'high', label: '🔥 High' },
  { value: 'medium', label: '⚡ Medium' },
  { value: 'low', label: '📌 Low' },
];

const agentOptions: { value: AgentRole | 'all'; label: string; icon: string }[] = [
  { value: 'all', label: 'All Agents', icon: '👥' },
  { value: 'dev', label: 'WUT (DEV)', icon: '/agents/wut.svg' },
  { value: 'qa-reviewer', label: 'ORN (QA)', icon: '/agents/orn.svg' },
  { value: 'gm', label: 'GM', icon: '/agents/gm.svg' },
];

export default function FilterBar({ filters, onFilterChange, projects }: FilterBarProps) {
  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, project: e.target.value });
  };

  const handleAgentChange = (agent: AgentRole | 'all') => {
    onFilterChange({ ...filters, agent });
  };

  const handleStatusChange = (status: StatusFilter) => {
    onFilterChange({ ...filters, status });
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, priority: e.target.value as PriorityFilter });
  };

  const clearFilters = () => {
    onFilterChange({
      project: 'all',
      agent: 'all',
      status: 'all',
      priority: 'all',
    });
  };

  const hasActiveFilters = filters.project !== 'all' || filters.agent !== 'all' || 
                          filters.status !== 'all' || filters.priority !== 'all';

  return (
    <div className="nes-container is-dark with-title mb-6">
      <p className="title">🔍 Filters</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Project Dropdown */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400">Project</label>
          <div className="nes-select">
            <select value={filters.project} onChange={handleProjectChange}>
              <option value="all">📁 All Projects</option>
              {projects.map((p) => (
                <option key={p.repo.name} value={p.repo.name}>
                  {p.repo.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Agent Buttons */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400">Agent</label>
          <div className="flex gap-2 flex-wrap">
            {agentOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAgentChange(option.value)}
                className={`nes-btn text-xs ${
                  filters.agent === option.value ? 'is-primary' : ''
                }`}
                title={option.label}
              >
                {option.value === 'all' ? (
                  option.icon
                ) : (
                  <img
                    src={option.icon}
                    alt={option.label}
                    width="24"
                    height="24"
                    className="pixelated"
                    style={{ imageRendering: 'pixelated' }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400">Status</label>
          <div className="flex gap-2 flex-wrap">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStatusChange(option.value)}
                className={`nes-btn text-xs ${
                  filters.status === option.value ? 'is-primary' : ''
                }`}
                style={{
                  borderColor: filters.status === option.value ? undefined : option.color,
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Priority Dropdown */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400">Priority</label>
          <div className="nes-select">
            <select value={filters.priority} onChange={handlePriorityChange}>
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex justify-end">
          <button onClick={clearFilters} className="nes-btn is-error">
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}