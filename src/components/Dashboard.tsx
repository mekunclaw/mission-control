'use client';

import React, { useState, useEffect } from 'react';
import { DashboardStats } from './DashboardStats';
import { IssuesList } from './IssuesList';
import { ActivityFeed } from './ActivityFeed';

interface RefreshIndicatorProps {
  lastRefresh: Date;
}

const RefreshIndicator: React.FC<RefreshIndicatorProps> = ({ lastRefresh }) => {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const updateTimeAgo = () => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - lastRefresh.getTime()) / 1000);
      const mins = Math.floor(diff / 60);
      const secs = diff % 60;
      
      if (mins > 0) {
        setTimeAgo(`${mins}M ${secs.toString().padStart(2, '0')}S AGO`);
      } else {
        setTimeAgo(`${secs}S AGO`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 1000);
    
    return () => clearInterval(interval);
  }, [lastRefresh]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] pixel-text text-pixel-gray">
        LAST UPDATED:
      </span>
      <span className="text-[10px] pixel-text text-pixel-cyan">
        {timeAgo}
      </span>
      <span className="text-pixel-red animate-pixel-pulse">❤</span>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Simulate data fetch
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setLastRefresh(new Date());
    setIsRefreshing(false);
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-pixel-dark scanlines crt">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="nes-container is-dark with-title p-4">
            <p className="title text-xs pixel-text">SYSTEM</p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Pixel Logo */}
                <div className="w-12 h-12 bg-pixel-blue flex items-center justify-center border-4 border-black shadow-pixel">
                  <span className="font-pixel text-white text-xl">M</span>
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl pixel-text text-pixel-light mb-2">
                    MISSION CONTROL
                  </h1>
                  <p className="text-[10px] text-pixel-gray pixel-text">
                    AGENT WORKFORCE DASHBOARD v1.0
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-pixel-green border border-black animate-pixel-pulse" />
                  <span className="text-[10px] text-pixel-green pixel-text">SYSTEMS ONLINE</span>
                </div>
                
                <RefreshIndicator lastRefresh={lastRefresh} />
                
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="nes-btn is-primary text-[10px] pixel-text py-2 px-4 disabled:opacity-50"
                >
                  {isRefreshing ? '...' : '↻'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          {/* Status Overview Cards */}
          <DashboardStats />

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Issues List - Takes 2 columns */}
            <div className="lg:col-span-2">
              <IssuesList />
            </div>

            {/* Activity Feed - Takes 1 column */}
            <div className="lg:col-span-1">
              <ActivityFeed />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <div className="nes-container is-dark p-4">
            <p className="text-[10px] text-pixel-gray pixel-text">
              © 2026 MISSION CONTROL SYSTEM
            </p>
            <p className="text-[8px] text-pixel-gray mt-2 pixel-text">
              SECURE CONNECTION ESTABLISHED | STATUS: NOMINAL
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
