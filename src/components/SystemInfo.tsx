'use client'

import { useState, useEffect } from 'react'

interface SystemStatus {
  githubApi: 'connected' | 'disconnected' | 'error'
  database: 'connected' | 'disconnected' | 'error'
  lastSync: Date
  uptime: string
  version: string
}

export function SystemInfo() {
  const [systemStatus] = useState<SystemStatus>({
    githubApi: 'connected',
    database: 'connected',
    lastSync: new Date(),
    uptime: '2d 4h 32m',
    version: 'v1.0.0'
  })

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return '●'
      case 'error':
        return '✕'
      default:
        return '○'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-nes-green'
      case 'error':
        return 'text-nes-red'
      default:
        return 'text-pixel-gray'
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <i className="nes-icon cog is-small"></i>
        <h2 className="text-sm pixel-text text-nes-yellow">SYSTEM STATUS</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="nes-container is-dark">
          <h3 className="text-[10px] pixel-text text-pixel-gray mb-3">SERVICES</h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs pixel-text text-nes-white">GitHub API</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm pixel-text ${getStatusColor(systemStatus.githubApi)}`}>
                  {getStatusIcon(systemStatus.githubApi)}
                </span>
                <span className="text-[10px] pixel-text text-nes-green">
                  {systemStatus.githubApi.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs pixel-text text-nes-white">Database</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm pixel-text ${getStatusColor(systemStatus.database)}`}>
                  {getStatusIcon(systemStatus.database)}
                </span>
                <span className="text-[10px] pixel-text text-nes-green">
                  {systemStatus.database.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="nes-container is-dark">
          <h3 className="text-[10px] pixel-text text-pixel-gray mb-3">METRICS</h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs pixel-text text-nes-white">Version</span>
              <span className="text-[10px] pixel-text text-nes-cyan">
                {systemStatus.version}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs pixel-text text-nes-white">Uptime</span>
              <span className="text-[10px] pixel-text text-nes-yellow">
                {systemStatus.uptime}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs pixel-text text-nes-white">Last Sync</span>
              <span className="text-[10px] pixel-text text-nes-cyan">
                {formatTime(systemStatus.lastSync)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 nes-container is-rounded is-dark p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="nes-icon star is-small"></i>
            <span className="text-[10px] pixel-text text-pixel-gray">
              SYSTEM HEALTH: <span className="text-nes-green">OPTIMAL</span>
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] pixel-text text-pixel-gray">
              {formatTime(currentTime)}
            </span>
            <span className="animate-pixel-pulse text-nes-green">●</span>
          </div>
        </div>
      </div>
    </section>
  )
}
