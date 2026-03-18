'use client';

import React from 'react';
import { AgentIssues, AgentRole } from '@/lib/github';

interface AgentBreakdownProps {
  agentIssues: AgentIssues[];
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

export default function AgentBreakdown({ agentIssues, selectedAgent, onSelectAgent }: AgentBreakdownProps) {
  return (
    <div className="nes-container is-dark with-title mb-6">
      <p className="title">👥 Agent Workload</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {agentIssues.map((agent) => {
          const config = agentConfig[agent.role];
          const isSelected = selectedAgent === agent.role;
          
          return (
            <button
              key={agent.role}
              onClick={() => onSelectAgent(agent.role)}
              className={`nes-btn p-4 text-left transition-all ${
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
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: config.color }}>
                      {config.name}
                    </span>
                    <span className="text-2xl font-bold">
                      {agent.count.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{config.description}</p>
                  <div className="mt-2">
                    <progress
                      className="nes-progress is-primary"
                      value={agent.count}
                      max={Math.max(...agentIssues.map(a => a.count), 1)}
                      style={{ 
                        '--progress-color': config.color } as React.CSSProperties
                    }></progress>
                  </div>
                </div>
              </div>
            </button>
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