'use client';

import React from 'react';

export type AgentStatus = 'idle' | 'working' | 'blocked';

export interface Agent {
  id: string;
  name: string;
  code: string;
  status: AgentStatus;
  currentTask: string;
  avatarColor: string;
}

interface AgentCardProps {
  agent: Agent;
}

// Pixel art avatar component using CSS grid
const PixelAvatar: React.FC<{ color: string; status: AgentStatus }> = ({ color, status }) => {
  // 8x8 pixel art face pattern (1 = filled, 0 = empty)
  // Simple robot/agent face
  const pixelPattern = [
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 1, 0, 0, 1],
    [1, 0, 0, 1, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
  ];

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
        style={{ backgroundColor: color }}
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
    },
    working: {
      color: 'bg-pixel-green',
      icon: '◈',
      label: 'WORKING',
    },
    blocked: {
      color: 'bg-pixel-red',
      icon: '✕',
      label: 'BLOCKED',
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
        className={`text-[10px] pixel-text ${
          status === 'working'
            ? 'text-pixel-green'
            : status === 'blocked'
            ? 'text-pixel-red'
            : 'text-pixel-gray'
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

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  return (
    <div className="nes-container is-dark with-title p-4 m-0">
      <p className="title text-xs pixel-text mb-4">{agent.code}</p>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Avatar Section */}
        <div className="flex-shrink-0">
          <PixelAvatar color={agent.avatarColor} status={agent.status} />
        </div>

        {/* Info Section */}
        <div className="flex-1 min-w-0">
          {/* Agent Name */}
          <h3 className="text-sm pixel-text text-pixel-light mb-2 truncate">
            {agent.name}
          </h3>

          {/* Status */}
          <div className="mb-3">
            <StatusIndicator status={agent.status} />
          </div>

          {/* Current Task */}
          <div className="bg-pixel-darker border-2 border-black p-2">
            <p className="text-[8px] text-pixel-gray mb-1 pixel-text">
              CURRENT TASK:
            </p>
            <p className="text-[10px] text-pixel-light pixel-text leading-relaxed">
              {agent.currentTask}
              {agent.status === 'working' && <WorkingAnimation />}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;
