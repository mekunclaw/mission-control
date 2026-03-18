'use client';

import React from 'react';

export type AgentStatus = 'idle' | 'working' | 'blocked' | 'offline';

export interface Agent {
  id: string;
  name: 'TIM' | 'WUT' | 'ORN';
  code: string;
  role: string;
  description: string;
  status: AgentStatus;
  currentTask: string | null;
  avatarColor: string;
  taskCount?: number;
  lastUpdate: string;
}

interface AgentCardProps {
  agent: Agent;
}

// Agent configuration with pixel art styling
const agentConfig = {
  TIM: {
    name: 'TIM',
    role: 'GENERAL MANAGER',
    description: 'System Analyst & Facilitator',
    color: 'is-warning',
    pixelColor: 'text-pixel-yellow',
    bgColor: 'bg-pixel-yellow',
    borderColor: 'border-pixel-yellow',
    avatarColor: '#ffc107', // pixel-yellow
  },
  WUT: {
    name: 'WUT',
    role: 'FULLSTACK DEV',
    description: 'The Builder',
    color: 'is-success',
    pixelColor: 'text-pixel-green',
    bgColor: 'bg-pixel-green',
    borderColor: 'border-pixel-green',
    avatarColor: '#28a745', // pixel-green
  },
  ORN: {
    name: 'ORN',
    role: 'QA REVIEWER',
    description: 'The Gatekeeper',
    color: 'is-primary',
    pixelColor: 'text-pixel-cyan',
    bgColor: 'bg-pixel-cyan',
    borderColor: 'border-pixel-cyan',
    avatarColor: '#17a2b8', // pixel-cyan
  },
} as const;

// Pixel art avatar component using CSS grid
const PixelAvatar: React.FC<{ name: 'TIM' | 'WUT' | 'ORN'; status: AgentStatus }> = ({ 
  name, 
  status 
}) => {
  const config = agentConfig[name];
  
  // 8x8 pixel art face patterns (1 = filled, 0 = empty)
  const pixelPatterns = {
    TIM: [ // Crown/Manager face
      [0, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 1, 1, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 0, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [0, 1, 1, 1, 1, 1, 1, 0],
    ],
    WUT: [ // Builder/Dev face with tools
      [0, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 0, 1, 1, 0, 1, 1],
      [1, 0, 0, 1, 1, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 1, 1, 0, 0, 1],
      [0, 1, 1, 1, 1, 1, 1, 0],
    ],
    ORN: [ // Inspector/QA face with glasses
      [0, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 1, 1, 0, 0, 1],
      [1, 1, 0, 0, 0, 0, 1, 1],
      [1, 0, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [0, 1, 1, 1, 1, 1, 1, 0],
    ],
  };

  const pixelPattern = pixelPatterns[name];

  const getStatusGlow = (status: AgentStatus) => {
    switch (status) {
      case 'working':
        return 'animate-working';
      case 'blocked':
        return 'animate-pixel-pulse';
      default:
        return '';
    }
  };

  return (
    <div className={`relative ${getStatusGlow(status)}`}>
      <div
        className="grid grid-cols-8 gap-0 p-1 border-2 border-black"
        style={{ backgroundColor: config.avatarColor }}
      >
        {pixelPattern.flat().map((filled, index) => (
          <div
            key={index}
            className={`w-2 h-2 ${filled ? 'bg-black' : 'bg-transparent'}`}
          />
        ))}
      </div>
    </div>
  );
};

// Status indicator with pixel art icon
const StatusIndicator: React.FC<{ status: AgentStatus }> = ({ status }) => {
  const statusConfig = {
    idle: {
      color: 'bg-pixel-gray',
      icon: '○',
      label: 'IDLE',
      textColor: 'text-pixel-gray',
    },
    working: {
      color: 'bg-pixel-green',
      icon: '◈',
      label: 'WORKING',
      textColor: 'text-pixel-green',
    },
    blocked: {
      color: 'bg-pixel-red',
      icon: '✕',
      label: 'BLOCKED',
      textColor: 'text-pixel-red',
    },
    offline: {
      color: 'bg-pixel-gray',
      icon: '◌',
      label: 'OFFLINE',
      textColor: 'text-pixel-gray',
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-4 h-4 border-2 border-black ${config.color} flex items-center justify-center`}
      >
        <span className="text-[8px] leading-none text-white font-bold">
          {config.icon}
        </span>
      </div>
      <span
        className={`text-[10px] pixel-text ${config.textColor} ${
          status === 'working' ? 'animate-pixel-pulse' : ''
        }`}
      >
        {config.label}
      </span>
    </div>
  );
};

// Animated dots for working state
const WorkingAnimation: React.FC = () => {
  return (
    <div className="flex gap-1">
      <span className="animate-blink text-pixel-green">.</span>
      <span
        className="animate-blink text-pixel-green"
        style={{ animationDelay: '0.2s' }}
      >
        .
      </span>
      <span
        className="animate-blink text-pixel-green"
        style={{ animationDelay: '0.4s' }}
      >
        .
      </span>
    </div>
  );
};

// Helper function to format last update time
function formatLastUpdate(lastUpdate: string): string {
  const date = new Date(lastUpdate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'NOW';
  if (diffMins < 60) return `${diffMins}M AGO`;
  if (diffHours < 24) return `${diffHours}H AGO`;
  if (diffDays < 7) return `${diffDays}D AGO`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const config = agentConfig[agent.name];
  
  return (
    <div className="nes-container is-dark with-title p-4 m-0">
      <p className={`title text-xs pixel-text mb-2 ${config.pixelColor}`}>
        {agent.code}
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Avatar Section */}
        <div className="flex-shrink-0">
          <PixelAvatar name={agent.name} status={agent.status} />
        </div>

        {/* Info Section */}
        <div className="flex-1 min-w-0">
          {/* Agent Name & Role */}
          <div className="mb-2">
            <h3 className="text-sm pixel-text text-pixel-light truncate">
              {agent.name}
            </h3>
            <p className={`text-[8px] ${config.pixelColor} pixel-text`}>
              {config.role}
            </p>
            <p className="text-[8px] text-pixel-gray pixel-text">
              {config.description}
            </p>
          </div>

          {/* Status */}
          <div className="mb-3">
            <StatusIndicator status={agent.status} />
          </div>

          {/* Current Task */}
          <div className="bg-pixel-darker border-2 border-black p-2 mb-2">
            <p className="text-[8px] text-pixel-cyan mb-1 pixel-text">
              CURRENT TASK:
            </p>
            <p className="text-[10px] text-pixel-light pixel-text leading-relaxed">
              {agent.currentTask || 'NO ACTIVE TASK'}
              {agent.status === 'working' && <WorkingAnimation />}
            </p>
          </div>

          {/* Task Count (if available) */}
          {agent.taskCount !== undefined && agent.taskCount > 0 && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-[8px] text-pixel-gray pixel-text">QUEUE</span>
              <span className={`text-[10px] pixel-text ${config.pixelColor}`}>
                {agent.taskCount} TASKS
              </span>
            </div>
          )}

          {/* Last Update */}
          <div className="flex items-center justify-between border-t border-pixel-gray pt-2 mt-2">
            <span className="text-[8px] text-pixel-gray pixel-text">UPDATED</span>
            <span className="text-[8px] text-pixel-light pixel-text">
              {formatLastUpdate(agent.lastUpdate)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading Skeleton for Agent Cards
export function AgentCardSkeleton() {
  return (
    <div className="nes-container is-dark with-title p-4">
      <div className="title text-pixel-gray">
        <span className="animate-pixel-pulse">LOADING...</span>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-pixel-gray opacity-20 animate-pixel-pulse" />
        <div className="h-8 bg-pixel-gray opacity-20 animate-pixel-pulse" />
        <div className="h-12 bg-pixel-gray opacity-20 animate-pixel-pulse" />
      </div>
    </div>
  );
}

// Empty State Component
export function AgentCardEmpty() {
  return (
    <div className="nes-container is-dark p-8 text-center">
      <p className="text-pixel-gray pixel-text text-sm mb-4">NO AGENTS FOUND</p>
      <p className="text-[10px] text-pixel-gray pixel-text">
        SYSTEM INITIALIZATION REQUIRED
      </p>
    </div>
  );
}

export default AgentCard;
