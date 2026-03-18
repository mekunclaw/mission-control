'use client';

import React from 'react';

// Agent configuration with pixel art styling
const agentConfig = {
  TIM: {
    name: 'TIM',
    role: 'GENERAL MANAGER',
    color: 'is-warning',
    pixelColor: 'text-pixel-yellow',
    bgColor: 'bg-pixel-yellow',
    borderColor: 'border-pixel-yellow',
    icon: '👑',
    description: 'System Analyst & Facilitator',
  },
  WUT: {
    name: 'WUT',
    role: 'FULLSTACK DEV',
    color: 'is-success',
    pixelColor: 'text-pixel-green',
    bgColor: 'bg-pixel-green',
    borderColor: 'border-pixel-green',
    icon: '🔧',
    description: 'The Builder',
  },
  ORN: {
    name: 'ORN',
    role: 'QA REVIEWER',
    color: 'is-primary',
    pixelColor: 'text-pixel-cyan',
    bgColor: 'bg-pixel-cyan',
    borderColor: 'border-pixel-cyan',
    icon: '🔍',
    description: 'The Gatekeeper',
  },
} as const;

type AgentType = keyof typeof agentConfig;
type StatusType = 'idle' | 'working' | 'blocked' | 'offline';

interface AgentStatus {
  agent: AgentType;
  status: StatusType;
  currentTask: string | null;
  lastUpdate: string;
  taskCount?: number;
}

interface AgentStatusCardProps {
  agent: AgentStatus;
}

const statusConfig: Record<StatusType, { label: string; color: string; animate: boolean }> = {
  idle: { label: 'IDLE', color: 'text-pixel-gray', animate: false },
  working: { label: 'WORKING', color: 'text-pixel-green', animate: true },
  blocked: { label: 'BLOCKED', color: 'text-pixel-red', animate: false },
  offline: { label: 'OFFLINE', color: 'text-pixel-gray', animate: false },
};

export function AgentStatusCard({ agent }: AgentStatusCardProps) {
  const config = agentConfig[agent.agent];
  const status = statusConfig[agent.status];

  return (
    <div className="nes-container is-dark with-title agent-card">
      {/* Card Header with Agent Icon and Name */}
      <div className={`title flex items-center gap-2 ${config.pixelColor}`}>
        <span className="text-lg">{config.icon}</span>
        <span className="text-xs">{config.name}</span>
      </div>

      {/* Agent Info Section */}
      <div className="mb-4">
        <div className={`text-[10px] ${config.pixelColor} mb-1 pixel-text`}>
          {config.role}
        </div>
        <div className="text-[8px] text-pixel-gray pixel-text">
          {config.description}
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              agent.status === 'working'
                ? 'bg-pixel-green animate-pixel-pulse'
                : agent.status === 'blocked'
                ? 'bg-pixel-red'
                : agent.status === 'offline'
                ? 'bg-pixel-gray'
                : 'bg-pixel-gray'
            }`}
          />
          <span
            className={`text-[10px] pixel-text ${status.color} ${
              status.animate ? 'animate-pixel-pulse' : ''
            }`}
          >
            {status.label}
          </span>
        </div>
      </div>

      {/* Current Task Section */}
      <div className="nes-container is-dark p-3 mb-3">
        <p className="text-[8px] text-pixel-cyan pixel-text mb-2">CURRENT TASK</p>
        <p className="text-[10px] text-pixel-light pixel-text leading-relaxed">
          {agent.currentTask || 'NO ACTIVE TASK'}
        </p>
      </div>

      {/* Task Count (if available) */}
      {agent.taskCount !== undefined && agent.taskCount > 0 && (
        <div className="flex items-center justify-between mb-3">
          <span className="text-[8px] text-pixel-gray pixel-text">QUEUE</span>
          <span className={`text-[10px] pixel-text ${config.pixelColor}`}>
            {agent.taskCount} TASKS
          </span>
        </div>
      )}

      {/* Last Update */}
      <div className="flex items-center justify-between border-t border-pixel-gray pt-3 mt-3">
        <span className="text-[8px] text-pixel-gray pixel-text">LAST UPDATE</span>
        <span className="text-[8px] text-pixel-light pixel-text">
          {formatLastUpdate(agent.lastUpdate)}
        </span>
      </div>
    </div>
  );
}

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

// Agent Status Cards Grid Component
interface AgentStatusGridProps {
  agents: AgentStatus[];
}

export function AgentStatusGrid({ agents }: AgentStatusGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {agents.map((agent) => (
        <AgentStatusCard key={agent.agent} agent={agent} />
      ))}
    </div>
  );
}

// Loading Skeleton for Agent Cards
export function AgentStatusCardSkeleton() {
  return (
    <div className="nes-container is-dark with-title agent-card">
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
export function AgentStatusEmpty() {
  return (
    <div className="nes-container is-dark p-8 text-center">
      <p className="text-pixel-gray pixel-text text-sm mb-4">NO AGENTS FOUND</p>
      <p className="text-[10px] text-pixel-gray pixel-text">
        SYSTEM INITIALIZATION REQUIRED
      </p>
    </div>
  );
}

export default AgentStatusCard;
