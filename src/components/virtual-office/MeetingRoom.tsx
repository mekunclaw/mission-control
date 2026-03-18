'use client';

import { Position } from '@/types/virtual-office';
import { useState } from 'react';

interface MeetingRoomProps {
  position: Position;
  _onEnter: () => void;
}

export default function MeetingRoom({ position, _onEnter }: MeetingRoomProps) {
  const [showStandup, setShowStandup] = useState(false);
  const [participants] = useState(['dev', 'qa-reviewer']);

  return (
    <div
      className="absolute z-10"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Meeting Table */}
      <div 
        className="relative w-28 h-20 cursor-pointer group"
        onClick={() => setShowStandup(!showStandup)}
      >
        {/* Table Surface */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-purple-800/60 to-purple-900/60 rounded-xl border-2 border-purple-500/50 
            shadow-lg shadow-purple-500/20 transition-all duration-300 group-hover:shadow-purple-500/40"
        >
          {/* Table Pattern */}
          <div className="absolute inset-0 rounded-xl opacity-20"
            style={{
              backgroundImage: 'linear-gradient(90deg, transparent 49%, rgba(255,255,255,0.1) 50%, transparent 51%)',
              backgroundSize: '20px 100%',
            }}
          />
        </div>

        {/* Chairs */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-700 rounded-full border-2 border-gray-500 flex items-center justify-center">
          🪑
        </div>
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-700 rounded-full border-2 border-gray-500 flex items-center justify-center">
          🪑
        </div>
        <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-gray-700 rounded-full border-2 border-gray-500 flex items-center justify-center">
          🪑
        </div>
        <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-gray-700 rounded-full border-2 border-gray-500 flex items-center justify-center">
          🪑
        </div>

        {/* Center Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-2xl animate-pulse">📹</div>
        </div>

        {/* Label */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="text-xs font-medium text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded">
            Standups
          </span>
        </div>

        {/* Standup Info Tooltip */}
        <div className={`absolute -top-20 left-1/2 -translate-x-1/2 transition-all duration-300 ${
          showStandup ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}>
          <div className="nes-container is-rounded is-dark p-2 text-xs whitespace-nowrap">
            <div className="font-bold mb-1">🗓️ Daily Standup</div>
            <div className="text-gray-400">10:00 AM - 10:15 AM</div>
            <div className="mt-1 flex gap-1">
              {participants.map(p => (
                <span key={p} className="text-lg">
                  {p === 'dev' ? '🧑‍💻' : p === 'qa-reviewer' ? '🔍' : '👔'}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
