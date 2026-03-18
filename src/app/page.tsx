'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import StatusCard from '@/components/StatusCard';
import IssueList from '@/components/IssueList';
import ActivityFeed from '@/components/ActivityFeed';
import ProjectOverview from '@/components/ProjectOverview';
import AgentBreakdown from '@/components/AgentBreakdown';
import FilterBar from '@/components/FilterBar';
import { 
  fetchIssues, 
  fetchAllProjectData, 
  processDashboardData, 
  groupIssuesByAgent,
  filterIssues,
  GitHubIssue, 
  DashboardData,
  ProjectData,
  AgentRole,
  StatusFilter,
  PriorityFilter,
  FilterState,
} from '@/lib/github';

// URL param helpers
function filtersToParams(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.project !== 'all') params.set('project', filters.project);
  if (filters.agent !== 'all') params.set('agent', filters.agent);
  if (filters.status !== 'all') params.set('status', filters.status);
  if (filters.priority !== 'all') params.set('priority', filters.priority);
  return params;
}

function paramsToFilters(searchParams: URLSearchParams): FilterState {
  return {
    project: searchParams.get('project') || 'all',
    agent: (searchParams.get('agent') as AgentRole | 'all') || 'all',
    status: (searchParams.get('status') as StatusFilter) || 'all',
    priority: (searchParams.get('priority') as PriorityFilter) || 'all',
  };
}

function DashboardContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Filters from URL
  const [filters, setFilters] = useState<FilterState>(() => paramsToFilters(searchParams));

  // Update URL when filters change
  const updateFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    const params = filtersToParams(newFilters);
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [pathname, router]);

  // Sync filters with URL on mount
  useEffect(() => {
    setFilters(paramsToFilters(searchParams));
  }, [searchParams]);

  // Load data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [fetchedIssues, fetchedProjects] = await Promise.all([
        fetchIssues(),
        fetchAllProjectData(),
      ]);
      
      setIssues(fetchedIssues);
      setProjects(fetchedProjects);
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

  // Filtered issues
  const filteredIssues = filterIssues(issues, filters);
  const agentIssues = groupIssuesByAgent(filteredIssues);

  // Stats for filtered view
  const openIssues = filteredIssues.filter(i => i.state === 'open');
  const inProgressIssues = openIssues.filter(i => 
    i.labels.some(l => l.name === 'status:in-progress')
  );
  const blockedIssues = openIssues.filter(i => 
    i.labels.some(l => l.name === 'status:blocked')
  );
  const readyIssues = openIssues.filter(i => 
    i.labels.some(l => l.name === 'status:ready-for-dev' || l.name === 'ready-dev')
  );

  // Handle project selection
  const handleSelectProject = (project: string) => {
    updateFilters({ ...filters, project: filters.project === project ? 'all' : project });
  };

  // Handle agent selection
  const handleSelectAgent = (agent: AgentRole | 'all') => {
    updateFilters({ ...filters, agent });
  };

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

      {/* Project Overview */}
      <ProjectOverview 
        projects={projects}
        selectedProject={filters.project}
        onSelectProject={handleSelectProject}
      />

      {/* Agent Breakdown */}
      <AgentBreakdown
        agentIssues={agentIssues}
        selectedAgent={filters.agent}
        onSelectAgent={handleSelectAgent}
      />

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={updateFilters}
        projects={projects}
      />

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

      {/* Filtered Results Count */}
      {(filters.project !== 'all' || filters.agent !== 'all' || 
        filters.status !== 'all' || filters.priority !== 'all') && (
        <div className="nes-container is-dark mb-6">
          <p className="text-center">
            Showing <span className="text-green-400 font-bold">{filteredIssues.length}</span> issues 
            {filters.project !== 'all' && <span> in <span className="text-yellow-400">{filters.project}</span></span>}
            {filters.agent !== 'all' && <span> for <span className="text-blue-400">{filters.agent}</span></span>}
          </p>
        </div>
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
          <ActivityFeed issues={filteredIssues} />
          
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

// Loading fallback
function DashboardLoading() {
  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
      <div className="nes-container is-dark text-center">
        <p className="text-xl">Loading Dashboard...</p>
        <div className="mt-4">
          <i className="nes-icon coin is-large animate"></i>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}