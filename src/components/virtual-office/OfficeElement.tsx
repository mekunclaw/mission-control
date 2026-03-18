'use client';

import { OfficeZone, AgentRole } from '@/types/virtual-office';

interface OfficeElementProps {
  type: 'desk' | 'whiteboard' | 'plant';
  zone: OfficeZone;
  position: { x: number; y: number };
  width: number;
  height: number;
  label?: string;
  isOccupied?: boolean;
  occupant?: AgentRole;
  onClick?: () => void;
}

export default function OfficeElement({ 
  type, 
  zone, 
  position, 
  width, 
  height, 
  label,
  isOccupied,
  occupant,
  onClick 
}: OfficeElementProps) {
  const getElementIcon = () => {
    switch (type) {
      case 'desk': return '💻';
      case 'whiteboard': return '📊';
      case 'plant': return '🪴';
      default: return '📦';
    }
  };

  const getZoneColor = () => {
    const colors: Record<OfficeZone, string> = {
      'dev-area': '#2196f3',
      'qa-area': '#ffc107',
      'gm-office': '#e94560',
      'meeting-room': '#4caf50',
      'common': '#9c27b0',
    };
    return colors[zone];
  };

  return (
    <div
      className={`absolute flex flex-col items-center justify-center cursor-pointer
        transition-all duration-300 hover:scale-105`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
      onClick={onClick}
    >
      {/* Element Container */}
      <div 
        className={`relative w-full h-full rounded-lg flex flex-col items-center justify-center
          border-2 transition-all duration-300 hover:shadow-lg ${
            isOccupied ? 'bg-opacity-40' : 'bg-opacity-20'
          }`}
        style={{
          backgroundColor: `${getZoneColor()}20`,
          borderColor: getZoneColor(),
          boxShadow: isOccupied ? `0 4px 20px ${getZoneColor()}40` : 'none',
        }}
      >
        {/* Icon */}
        <div 
          className={`text-3xl transition-transform duration-300 ${
            type === 'desk' && isOccupied ? 'animate-pulse' : ''
          }`}
        >
          {getElementIcon()}
        </div>

        {/* Occupied Indicator */}
        {isOccupied && occupant && (
          <div 
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs border-2 border-gray-800 animate-pulse"
            style={{ backgroundColor: getZoneColor() }}
          >
            👤
          </div>
        )}

        {/* Label */}
        {label && (
          <div className="mt-2 text-xs font-medium text-center px-2 py-1 rounded" style={{ color: getZoneColor() }}>
            {label}
          </div>
        )}

        {/* Hover Tooltip */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          <div className="nes-tooltip is-left" style={{ width: 'auto', whiteSpace: 'nowrap' }}>
            {isOccupied ? `Occupied by ${occupant}` : `Click to view ${type}`}
          </div>
        </div>
      </div>
    </div>
  );
}
