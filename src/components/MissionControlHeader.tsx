'use client'

import { useState, useEffect } from 'react'

export function MissionControlHeader() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [blink, setBlink] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      setBlink(prev => !prev)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '.')
  }

  return (
    <header className="nes-container is-dark with-title mb-6">
      <p className="title bg-pixel-dark">MISSION CONTROL</p>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <i className="nes-icon trophy is-medium"></i>
          <div>
            <h1 className="text-lg sm:text-xl text-nes-yellow pixel-text">
              AGENT WORKFORCE
            </h1>
            <p className="text-xs text-pixel-gray mt-1 pixel-text">
              DASHBOARD v1.0
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-right">
          <div className="nes-container is-rounded is-dark p-2">
            <div className="text-xs text-nes-cyan pixel-text">
              {formatDate(currentTime)}
            </div>
            <div className="text-sm text-nes-green pixel-text mt-1">
              {formatTime(currentTime)}
              <span className={`inline-block w-2 h-4 ml-1 ${blink ? 'bg-nes-green' : 'bg-transparent'}`}></span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="nes-badge">
              <span className="is-success pixel-text text-[8px]">ONLINE</span>
            </span>
            <span className="nes-badge">
              <span className="is-primary pixel-text text-[8px]">LIVE</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
