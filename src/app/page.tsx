'use client';

import { useState, useEffect, useCallback } from 'react';
import StatusCard from '@/components/StatusCard';
import IssueList from '@/components/IssueList';
import ActivityFeed from '@/components/ActivityFeed';
import { fetchIssues, processDashboardData, GitHubIssue, DashboardData } from '@/lib/github';

export default function Dashboard() {
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedIssues = await fetchIssues();
      setIssues(fetchedIssues);
      setData(processDashboardData(fetchedIssues));
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadData();
    }, 30000);

    return () => clearInterval(interval);
  }, [loadData]);

  const openIssues = issues.filter(i => i.state === 'open');
  const inProgressIssues = openIssues.filter(i => 
    i.labels.some(l => l.name === 'status:in-progress')
  );
  const blockedIssues = openIssues.filter(i => 
    i.labels.some(l => l.name === 'status:blocked')
  );
  const readyIssues = openIssues.filter(i => 
    i.labels.some(l => l.name === 'status:ready-for-dev' || l.name === 'ready-dev')
  );

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Pixel Art Header */}
      <header className="mb-8">
        <div className="nes-container is-dark with-title">
          <p className="title">Mission Control</p>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <i className="nes-octocat animate"></i>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'monospace' }}>
                  Agent Workforce Dashboard
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                  mekunclaw/mission-control
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {lastUpdated && (
                <span className="text-xs text-gray-500">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={loadData}
                disabled={loading}
                className={`nes-btn is-primary ${loading ? 'is-disabled' : ''}`}
              >
                {loading ? '...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="nes-container is-error mb-6">
          <p>{error}</p>
          <button onClick={loadData} className="nes-btn mt-2">
            Retry
          </button>
        </div>
      )}

      {/* Status Overview Cards */}
      {data && (
        <section className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatusCard
              title="Active Work"
              count={data.activeWork}
              icon="trophy"
              color="warning"
            />
            <StatusCard
              title="Blockers"
              count={data.blockers}
              icon="close"
              color="error"
            />
            <StatusCard
              title="Ready for Dev"
              count={data.readyForDev}
              icon="like"
              color="success"
            />
            <StatusCard
              title="Total Open"
              count={data.openIssues}
              icon="star"
              color="primary"
            />
          </div>
        </section>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Issue Lists */}
        <div className="lg:col-span-2 space-y-6">
          {inProgressIssues.length > 0 && (
            <IssueList
              issues={inProgressIssues}
              title="🎮 In Progress"
            />
          )}
          
          {blockedIssues.length > 0 && (
            <IssueList
              issues={blockedIssues}
              title="🚫 Blocked"
            />
          )}
          
          {readyIssues.length > 0 && (
            <IssueList
              issues={readyIssues}
              title="✅ Ready for Dev"
            />
          )}
          
          {openIssues.length > 0 && (
            <IssueList
              issues={openIssues.slice(0, 10)}
              title="📋 All Open Issues"
            />
          )}
          
          {openIssues.length === 0 && !loading && (
            <div className="nes-container is-dark">
              <p className="text-center py-8">No open issues found 🎉</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <ActivityFeed issues={issues} />
          
          {/* Quick Stats */}
          {data && (
            <div className="nes-container is-dark with-title">
              <p className="title">Quick Stats</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Issues:</span>
                  <span className="font-bold">{data.totalIssues}</span>
                </div>
                <div className="flex justify-between">
                  <span>Open:</span>
                  <span className="font-bold text-green-400">{data.openIssues}</span>
                </div>
                <div className="flex justify-between">
                  <span>Closed:</span>
                  <span className="font-bold text-gray-400">{data.closedIssues}</span>
                </div>
                <div className="mt-4">
                  <progress 
                    className="nes-progress is-success" 
                    value={data.closedIssues} 
                    max={data.totalIssues}
                  ></progress>
                  <p className="text-xs text-center mt-1">
                    {data.totalIssues > 0 
                      ? Math.round((data.closedIssues / data.totalIssues) * 100) 
                      : 0}% Complete
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center">
        <div className="nes-container is-dark">
          <p className="text-sm text-gray-500">
            Mission Control Dashboard • Auto-refreshes every 30 seconds
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <a 
              href="https://github.com/mekunclaw/mission-control" 
              target="_blank" 
              rel="noopener noreferrer"
              className="nes-btn"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
