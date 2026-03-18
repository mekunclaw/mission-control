'use client';

import { useState, useEffect } from 'react';
import { Agent, AgentStats, AnimationState } from '@/types/virtual-office';

interface AgentAvatarProps {
  agent: Agent;
  stats: AgentStats;
  onClick: () => void;
  onHighFive: () => void;
}

const ANIMATION_FRAMES: Record<AnimationState, string[]> = {
  'idle': ['idle_1', 'idle_2', 'idle_1'],
  'working': ['work_1', 'work_2', 'work_1', 'work_3'],
  'walking': ['walk_1', 'walk_2', 'walk_3', 'walk_2'],
  'celebrating': ['celebrate_1', 'celebrate_2', 'celebrate_1', 'celebrate_3'],
};

export default function AgentAvatar({ agent, stats, onClick, onHighFive }: AgentAvatarProps) {
  const [, setFrameIndex] = useState(0);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState('');

  // Animation cycle
  useEffect(() => {
    const frames = ANIMATION_FRAMES[agent.animationState];
    const interval = setInterval(() => {
      setFrameIndex(prev => (prev + 1) % frames.length);
    }, agent.animationState === 'celebrating' ? 150 : agent.animationState === 'walking' ? 200 : 800);

    return () => clearInterval(interval);
  }, [agent.animationState]);

  // Random speech bubbles
  useEffect(() => {
    if (agent.animationState === 'working' && Math.random() > 0.95) {
      const workMessages = [
        'Coding...',
        'Testing...',
        'Reviewing...',
        'Almost done!',
        'Let\'s ship it!',
        '🤔 Thinking...',
        '✨ Polishing...',
      ];
      setBubbleText(workMessages[Math.floor(Math.random() * workMessages.length)]);
      setShowSpeechBubble(true);
      setTimeout(() => setShowSpeechBubble(false), 3000);
    }
  }, [agent.animationState, agent.position]);

  const getAnimationStyles = () => {
    const base = 'transition-all duration-300 ease-in-out';
    
    switch (agent.animationState) {
      case 'idle':
        return `${base} animate-bounce-subtle`;
      case 'working':
        return `${base} animate-pulse-subtle`;
      case 'walking':
        return `${base} transition-transform`;
      case 'celebrating':
        return `${base} animate-bounce`;
      default:
        return base;
    }
  };

  const getLevelColor = (level: number) => {
    if (level >= 5) return '#ffd700'; // Legendary - Gold
    if (level >= 4) return '#e94560'; // Epic - Red
    if (level >= 3) return '#9c27b0'; // Rare - Purple
    if (level >= 2) return '#2196f3'; // Uncommon - Blue
    return '#4caf50'; // Common - Green
  };

  return (
    <div
      className="absolute transition-all duration-500 ease-out cursor-pointer group z-10"
      style={{
        left: `${agent.position.x}px`,
        top: `${agent.position.y}px`,
        transform: `translate(-50%, -50%) ${agent.direction === 'left' ? 'scaleX(-1)' : ''}`,
      }}
      onClick={onClick}
    >
      {/* Speech Bubble */}
      {showSpeechBubble && (
        <div 
          className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap z-20 animate-fade-in-out"
          style={{ transform: `translateX(-50%) ${agent.direction === 'left' ? 'scaleX(-1)' : ''}` }}
        >
          <div className="nes-container is-dark is-rounded p-2 text-xs max-w-[150px] text-center">
            {bubbleText}
          </div>
        </div>
      )}

      {/* Agent Container */}
      <div className="relative">
        {/* Level Badge */}
        <div 
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg z-10"
          style={{ backgroundColor: getLevelColor(stats.level) }}
        >
          {stats.level}
        </div>

        {/* Online Status */}
        <div 
          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 z-10 ${
            agent.isOnline ? 'bg-green-500' : 'bg-gray-500'
          }`}
        />

        {/* Avatar */}
        <div 
          className={`relative w-16 h-16 ${getAnimationStyles()} group-hover:scale-110`}
        >
          {/* Pixel Art Avatar Background */}
          <div 
            className="absolute inset-0 rounded-lg overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${agent.color}40, ${agent.color}20)`,
              border: `2px solid ${agent.color}`,
              boxShadow: `0 4px 15px ${agent.color}40`,
            }}
          >
            {/* Agent SVG */}
            <img
              src={agent.avatar}
              alt={agent.name}
              className="w-full h-full object-contain p-1"
              style={{ 
                imageRendering: 'pixelated',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
              }}
            />
          </div>

          {/* Animation Overlay */}
          {agent.animationState === 'working' && (
            <div className="absolute -top-1 -right-1 text-xs animate-pulse">
              💻
            </div>
          )}
          {agent.animationState === 'celebrating' && (
            <div className="absolute -top-1 -right-1 text-xs animate-bounce">
              🎉
            </div>
          )}
        </div>

        {/* Name Label */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span 
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ 
              backgroundColor: `${agent.color}30`,
              color: agent.color,
              border: `1px solid ${agent.color}`,
            }}
          >
            {agent.name}
          </span>
        </div>

        {/* Hover Actions */}
        <div className="absolute -left-16 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onHighFive();
            }}
            className="nes-btn is-success text-xs p-1"
            title="High Five"
          >
            🙌
          </button>
        </div>
      </div>

      {/* XP Bar */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-20">
        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-500"
            style={{ 
              width: `${(stats.xp % 100) || 10}%`,
              backgroundColor: agent.color,
            }}
          />
        </div>
        <div className="text-[8px] text-center text-gray-400 mt-0.5">XP: {stats.xp}</div>
      </div>
    </div>
  );
}
