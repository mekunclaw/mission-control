'use client';

import React from 'react';
import { FilterState, AgentRole, StatusFilter, PriorityFilter, ProjectData } from '@/lib/github';
import { LABEL_COLORS } from './IssueList';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  projects: ProjectData[];
}

const statusOptions: { value: StatusFilter; label: string; color: string }[] = [
  { value: 'all', label: 'All Status', color: '#9e9e9e' },
  { value: 'ready-for-dev', label: 'Ready for Dev', color: LABEL_COLORS['status:ready-for-dev'].bg },
  { value: 'in-progress', label: 'In Progress', color: LABEL_COLORS['status:in-progress'].bg },
  { value: 'blocked', label: 'Blocked', color: LABEL_COLORS['status:blocked'].bg },
  { value: 'verified', label: 'Verified', color: LABEL_COLORS['status:verified'].bg },
  { value: 'spec-review', label: 'Spec Review', color: LABEL_COLORS['status:spec-review'].bg },
];

const priorityOptions: { value: PriorityFilter; label: string; bg: string; text: string }[] = [
  { value: 'all', label: 'All Priorities', bg: '#9e9e9e', text: '#ffffff' },
  { value: 'high', label: '🔥 High', bg: LABEL_COLORS['priority:high'].bg, text: LABEL_COLORS['priority:high'].text },
  { value: 'medium', label: '⚡ Medium', bg: LABEL_COLORS['priority:medium'].bg, text: LABEL_COLORS['priority:medium'].text },
  { value: 'low', label: '📌 Low', bg: LABEL_COLORS['priority:low'].bg, text: LABEL_COLORS['priority:low'].text },
];

const agentOptions: { value: AgentRole | 'all'; label: string; icon: string; bg: string; text: string }[] = [
  { value: 'all', label: 'All Agents', icon: '👥', bg: '#9e9e9e', text: '#ffffff' },
  { value: 'dev', label: 'WUT (DEV)', icon: '/agents/wut.svg', bg: LABEL_COLORS['role:dev'].bg, text: LABEL_COLORS['role:dev'].text },
  { value: 'qa-reviewer', label: 'ORN (QA)', icon: '/agents/orn.svg', bg: LABEL_COLORS['role:qa-reviewer'].bg, text: LABEL_COLORS['role:qa-reviewer'].text },
  { value: 'gm', label: 'GM', icon: '/agents/gm.svg', bg: LABEL_COLORS['role:gm'].bg, text: LABEL_COLORS['role:gm'].text },
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
                style={filters.agent !== option.value && option.value !== 'all' ? {
                  backgroundColor: option.bg,
                  color: option.text,
                  borderColor: option.bg,
                } : undefined}
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
          <div className="flex gap-2 flex-wrap">
            {priorityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onFilterChange({ ...filters, priority: option.value })}
                className={`nes-btn text-xs ${
                  filters.priority === option.value ? 'is-primary' : ''
                }`}
                style={filters.priority !== option.value && option.value !== 'all' ? {
                  backgroundColor: option.bg,
                  color: option.text,
                  borderColor: option.bg,
                } : undefined}
              >
                {option.label}
              </button>
            ))}
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