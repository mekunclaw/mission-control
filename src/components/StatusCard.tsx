'use client';

import React from 'react';

interface StatusCardProps {
  title: string;
  count: number;
  icon: string;
  color: 'primary' | 'success' | 'warning' | 'error';
}

const colorClasses = {
  primary: 'is-primary',
  success: 'is-success',
  warning: 'is-warning',
  error: 'is-error',
};

export default function StatusCard({ title, count, icon, color }: StatusCardProps) {
  return (
    <div className={`nes-container ${colorClasses[color]} with-title`}>
      <p className="title" style={{ marginBottom: '0.5rem' }}>{title}</p>
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold" style={{ fontFamily: 'monospace' }}>
          {count.toString().padStart(2, '0')}
        </span>
        <i className={`nes-icon ${icon} is-medium`}></i>
      </div>
    </div>
  );
}
