'use client';

import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'red' | 'green' | 'yellow';
  progress?: number;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, progress, subtitle }) => {
  const colorClasses = {
    blue: {
      border: 'border-pixel-blue/50',
      text: 'text-pixel-blue',
      bg: 'bg-pixel-blue',
      glow: 'shadow-[0_0_8px_rgba(0,123,255,0.5)]',
    },
    red: {
      border: 'border-pixel-red/50',
      text: 'text-pixel-red',
      bg: 'bg-pixel-red',
      glow: 'shadow-[0_0_8px_rgba(220,53,69,0.5)]',
    },
    green: {
      border: 'border-pixel-green/50',
      text: 'text-pixel-green',
      bg: 'bg-pixel-green',
      glow: 'shadow-[0_0_8px_rgba(40,167,69,0.5)]',
    },
    yellow: {
      border: 'border-pixel-yellow/50',
      text: 'text-pixel-yellow',
      bg: 'bg-pixel-yellow',
      glow: 'shadow-[0_0_8px_rgba(255,193,7,0.5)]',
    },
  };

  const colors = colorClasses[color];

  return (
    <div className={`nes-container is-dark with-title p-4 m-0 ${colors.border}`}>
      <div className="flex justify-between items-start mb-3">
        <span className={`text-[10px] pixel-text ${colors.text} uppercase tracking-widest`}>
          {title}
        </span>
        <div className="w-8 h-8 bg-pixel-darker flex items-center justify-center border-2 border-black">
          {icon}
        </div>
      </div>
      
      <div className={`font-pixel text-3xl text-white ${color === 'red' ? colors.glow : ''}`}>
        {value}
      </div>
      
      {subtitle && (
        <p className="text-[10px] pixel-text text-pixel-gray mt-2 uppercase">
          {subtitle}
        </p>
      )}
      
      {progress !== undefined && (
        <div className="mt-3">
          <div className="h-2 w-full bg-pixel-darker border border-black">
            <div 
              className={`h-full ${colors.bg}`} 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      
      {!progress && color === 'green' && (
        <div className="flex gap-1 mt-3">
          <div className={`h-2 flex-1 ${colors.bg}`} />
          <div className={`h-2 flex-1 ${colors.bg}`} />
          <div className="h-2 flex-1 bg-pixel-darker" />
          <div className="h-2 flex-1 bg-pixel-darker" />
        </div>
      )}
    </div>
  );
};

// Icons as pixel-style SVG components
const LightningIcon = () => (
  <svg className="w-5 h-5 text-pixel-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const WarningIcon = () => (
  <svg className="w-5 h-5 text-pixel-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5 text-pixel-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const DashboardStats: React.FC = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <StatCard
        title="Active Work"
        value="12"
        icon={<LightningIcon />}
        color="blue"
        progress={65}
      />
      <StatCard
        title="Blockers"
        value="03"
        icon={<WarningIcon />}
        color="red"
        subtitle="Attention Required"
      />
      <StatCard
        title="Ready for Dev"
        value="08"
        icon={<CheckIcon />}
        color="green"
      />
    </section>
  );
};

export default DashboardStats;
