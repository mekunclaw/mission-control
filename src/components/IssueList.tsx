'use client'

import { useState } from 'react'

interface Issue {
  id: number
  number: number
  title: string
  state: 'open' | 'closed'
  labels: { name: string; color: string }[]
  assignee?: string
  createdAt: string
  priority: 'high' | 'medium' | 'low'
}

const mockIssues: Issue[] = [
  {
    id: 1,
    number: 1,
    title: 'Build Dashboard main view with pixel art UI',
    state: 'open',
    labels: [
      { name: 'role:dev', color: 'BFD4F2' },
      { name: 'priority:high', color: 'B60205' },
      { name: 'phase:1-mvp', color: '5319E7' }
    ],
    assignee: 'DEV',
    createdAt: '2024-03-18',
    priority: 'high'
  },
  {
    id: 2,
    number: 2,
    title: 'Create Agent Status Cards component',
    state: 'open',
    labels: [
      { name: 'role:dev', color: 'BFD4F2' },
      { name: 'priority:high', color: 'B60205' }
    ],
    assignee: 'DEV',
    createdAt: '2024-03-17',
    priority: 'high'
  },
  {
    id: 3,
    number: 3,
    title: 'QA: Verify pixel art styling',
    state: 'open',
    labels: [
      { name: 'role:qa-reviewer', color: '1D76DB' },
      { name: 'priority:high', color: 'B60205' }
    ],
    assignee: 'QA-REVIEWER',
    createdAt: '2024-03-16',
    priority: 'medium'
  },
  {
    id: 4,
    number: 4,
    title: 'Build GitHub API integration layer',
    state: 'closed',
    labels: [
      { name: 'role:dev', color: 'BFD4F2' },
      { name: 'priority:high', color: 'B60205' }
    ],
    assignee: 'DEV',
    createdAt: '2024-03-15',
    priority: 'high'
  }
]

export function IssueList() {
  const [issues] = useState<Issue[]>(mockIssues)
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('open')

  const filteredIssues = issues.filter(issue => 
    filter === 'all' ? true : issue.state === filter
  )

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'is-error'
      case 'medium':
        return 'is-warning'
      case 'low':
        return 'is-success'
      default:
        return 'is-disabled'
    }
  }

  const getStateIcon = (state: string) => {
    return state === 'open' ? '○' : '●'
  }

  const getStateColor = (state: string) => {
    return state === 'open' ? 'text-nes-green' : 'text-pixel-gray'
  }

  return (
    <section className="mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <i className="nes-icon list is-small"></i>
          <h2 className="text-sm pixel-text text-nes-yellow">ISSUES</h2>
          <span className="nes-badge">
            <span className="is-primary text-[8px] pixel-text">{filteredIssues.length}</span>
          </span>
        </div>

        <div className="flex gap-2">
          {(['open', 'closed', 'all'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`nes-btn text-[8px] pixel-text ${filter === f ? 'is-primary' : ''}`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="nes-container is-dark">
        <div className="space-y-3">
          {filteredIssues.map((issue) => (
            <div 
              key={issue.id}
              className="nes-container is-rounded is-dark p-3 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className={`text-lg pixel-text ${getStateColor(issue.state)} mt-1`}>
                  {getStateIcon(issue.state)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[10px] text-pixel-gray pixel-text">
                      #{issue.number}
                    </span>
                    <span className={`nes-badge`}>
                      <span className={`${getPriorityColor(issue.priority)} text-[8px] pixel-text`}>
                        {issue.priority.toUpperCase()}
                      </span>
                    </span>
                  </div>
                  
                  <h3 className="text-xs pixel-text text-nes-white mb-2 truncate">
                    {issue.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {issue.labels.map((label) => (
                      <span 
                        key={label.name}
                        className="text-[8px] px-2 py-1 rounded pixel-text"
                        style={{ 
                          backgroundColor: `#${label.color}`,
                          color: parseInt(label.color, 16) > 0x808080 ? '#000' : '#fff'
                        }}
                      >
                        {label.name}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-[10px] text-pixel-gray pixel-text">
                    <div className="flex items-center gap-2">
                      <i className="nes-icon star is-small"></i>
                      <span>{issue.assignee || 'Unassigned'}</span>
                    </div>
                    <span>{issue.createdAt}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredIssues.length === 0 && (
            <div className="text-center py-8">
              <i className="nes-octocat animate"></i>
              <p className="text-sm pixel-text text-pixel-gray mt-4">
                NO ISSUES FOUND
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
