'use client';

import { useState } from 'react';
import { Position } from '@/types/virtual-office';

interface CoffeeMachineProps {
  position: Position;
  onActivate: () => void;
  isActive: boolean;
}

export default function CoffeeMachine({ position, onActivate, isActive }: CoffeeMachineProps) {
  const [showSteam, setShowSteam] = useState(false);
  const [isBrewing, setIsBrewing] = useState(false);

  const handleClick = () => {
    if (isActive || isBrewing) return;
    
    setIsBrewing(true);
    setShowSteam(true);
    
    // Simulate brewing time
    setTimeout(() => {
      onActivate();
      setIsBrewing(false);
      setTimeout(() => setShowSteam(false), 2000);
    }, 1500);
  };

  return (
    <div
      className="absolute z-20 cursor-pointer group"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
      onClick={handleClick}
    >
      {/* Steam Animation */}
      {(showSteam || isActive) && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-6 bg-white/60 rounded-full animate-steam"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Machine Body */}
      <div 
        className={`relative w-12 h-14 transition-all duration-300 ${
          isBrewing ? 'animate-pulse scale-105' : 'group-hover:scale-110'
        }`}
      >
        {/* Coffee Cup Icon */}
        <div 
          className={`w-12 h-14 rounded-lg flex items-center justify-center text-2xl transition-all duration-300 ${
            isActive 
              ? 'bg-amber-600/80 border-2 border-amber-400 shadow-lg shadow-amber-500/50' 
              : isBrewing
              ? 'bg-amber-700/80 border-2 border-amber-500'
              : 'bg-gray-700/80 border-2 border-gray-500 hover:border-amber-400'
          }`}
        >
          {isActive ? '☕' : '🫖'}
        </div>

        {/* Status Indicator */}
        <div 
          className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-gray-800 ${
            isActive 
              ? 'bg-green-400 animate-pulse' 
              : isBrewing 
              ? 'bg-yellow-400 animate-pulse'
              : 'bg-gray-500'
          }`}
        />
      </div>

      {/* Tooltip */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="nes-container is-rounded is-dark p-1 text-xs">
          {isActive ? '☕ Active! XP x1.5' : isBrewing ? 'Brewing...' : 'Click for XP Boost'}
        </div>
      </div>

      {/* Label */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className="text-[10px] font-medium text-amber-400">
          Coffee
        </span>
      </div>
    </div>
  );
}
