'use client'

import { useState } from 'react'

interface ActivityItem {
  id: number
  type: 'commit' | 'pr' | 'issue' | 'agent'
  message: string
  timestamp: string
  actor: string
}

const mockActivities: ActivityItem[] = [
  {
    id: 1,
    type: 'agent',
    message: 'Agent [DEV] started working on Issue #1.4',
    timestamp: '2 min ago',
    actor: 'DEV'
  },
  {
    id: 2,
    type: 'pr',
    message: 'PR #5 merged: Initialize Next.js with pixel art theme',
    timestamp: '15 min ago',
    actor: 'QA-REVIEWER'
  },
  {
    id: 3,
    type: 'issue',
    message: 'Issue #1.3 marked as ready for dev',
    timestamp: '1 hour ago',
    actor: 'GM'
  },
  {
    id: 4,
    type: 'commit',
    message: 'feat: Add pixel art styling to dashboard',
    timestamp: '2 hours ago',
    actor: 'DEV'
  },
  {
    id: 5,
    type: 'agent',
    message: 'Agent [GM] reviewed Issue #1.2',
    timestamp: '3 hours ago',
    actor: 'GM'
  }
]

export function ActivityFeed() {
  const [activities] = useState<ActivityItem[]>(mockActivities)
  const [isExpanded, setIsExpanded] = useState(true)

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'commit':
        return '▼'
      case 'pr':
        return '◆'
      case 'issue':
        return '○'
      case 'agent':
        return '●'
      default:
        return '■'
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'commit':
        return 'text-nes-blue'
      case 'pr':
        return 'text-nes-purple'
      case 'issue':
        return 'text-nes-green'
      case 'agent':
        return 'text-nes-yellow'
      default:
        return 'text-pixel-gray'
    }
  }

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <i className="nes-icon bell is-small"></i>
          <h2 className="text-sm pixel-text text-nes-yellow">ACTIVITY FEED</h2>
          <span className="nes-badge">
            <span className="is-primary text-[8px] pixel-text">{activities.length}</span>
          </span>
        </div>
        
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="nes-btn is-primary text-[8px] pixel-text"
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {isExpanded && (
        <div className="nes-container is-dark">
          <div className="space-y-2">
            {activities.map((activity, index) => (
              <div 
                key={activity.id}
                className={`flex items-start gap-3 p-2 ${index !== activities.length - 1 ? 'border-b border-pixel-gray border-opacity-30' : ''}`}
              >
                <div className={`text-sm pixel-text ${getActivityColor(activity.type)} mt-0.5`}>
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-xs pixel-text text-nes-white leading-relaxed">
                    {activity.message}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-nes-cyan pixel-text">
                      {activity.actor}
                    </span>
                    <span className="text-[10px] text-pixel-gray pixel-text">
                      • {activity.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-3 border-t border-pixel-gray border-opacity-30 text-center">
            <button className="nes-btn is-primary text-[8px] pixel-text">
              VIEW ALL ACTIVITY
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
