'use client'

import { useState, useEffect } from 'react'
import { StatusCard } from './StatusCard'

interface DashboardStats {
  activeWork: number
  blockers: number
  readyForDev: number
  inReview: number
  completed: number
  totalAgents: number
}

export function StatusPanel() {
  const [stats, setStats] = useState<DashboardStats>({
    activeWork: 3,
    blockers: 1,
    readyForDev: 2,
    inReview: 1,
    completed: 5,
    totalAgents: 3
  })
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false)

  // Simulate fetching data from GitHub API
  const fetchDashboardData = async () => {
    setIsLoading(true)
    // In a real implementation, this would call the GitHub API
    // For now, we'll simulate with slight random variations
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setStats(prev => ({
      ...prev,
      // Simulate small variations
      activeWork: Math.max(0, prev.activeWork + (Math.random() > 0.7 ? 1 : 0)),
    }))
    setLastUpdated(new Date())
    setIsLoading(false)
  }

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <i className="nes-icon star is-small"></i>
          <h2 className="text-sm pixel-text text-nes-yellow">STATUS OVERVIEW</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-pixel-gray pixel-text">
            UPDATED: {formatTime(lastUpdated)}
          </span>
          <button 
            onClick={fetchDashboardData}
            disabled={isLoading}
            className={`nes-btn is-primary text-[8px] pixel-text ${isLoading ? 'is-disabled' : ''}`}
          >
            {isLoading ? '...' : '↻'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatusCard
          title="ACTIVE WORK"
          count={stats.activeWork}
          icon="trophy"
          color="is-primary"
          subtitle="In Progress"
          trend="up"
        />

        <StatusCard
          title="BLOCKERS"
          count={stats.blockers}
          icon="heart"
          color="is-error"
          subtitle="Needs Attention"
          trend={stats.blockers > 0 ? 'up' : 'stable'}
        />

        <StatusCard
          title="READY FOR DEV"
          count={stats.readyForDev}
          icon="like"
          color="is-success"
          subtitle="Queued"
          trend="stable"
        />

        <StatusCard
          title="IN REVIEW"
          count={stats.inReview}
          icon="star"
          color="is-warning"
          subtitle="Pending QA"
          trend="stable"
        />

        <StatusCard
          title="COMPLETED"
          count={stats.completed}
          icon="coin"
          color="is-success"
          subtitle="This Sprint"
          trend="up"
        />

        <StatusCard
          title="AGENTS"
          count={stats.totalAgents}
          icon="kirby"
          color="is-primary"
          subtitle="Online"
          trend="stable"
        />
      </div>

      <div className="mt-4 flex items-center gap-2 text-[10px] text-pixel-gray pixel-text">
        <span className="nes-icon star is-small"></span>
        <span>Auto-refresh every 30 seconds</span>
        {isLoading && <span className="animate-pixel-pulse">Syncing...</span>}
      </div>
    </section>
  )
}
