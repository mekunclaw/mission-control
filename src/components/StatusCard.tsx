'use client'

interface StatusCardProps {
  title: string
  count: number
  icon: 'trophy' | 'heart' | 'like' | 'star' | 'coin' | 'kirby'
  color: 'is-primary' | 'is-success' | 'is-warning' | 'is-error' | 'is-disabled'
  subtitle?: string
  trend?: 'up' | 'down' | 'stable'
}

export function StatusCard({ title, count, icon, color, subtitle, trend }: StatusCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '▲'
      case 'down':
        return '▼'
      default:
        return '●'
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-nes-green'
      case 'down':
        return 'text-nes-red'
      default:
        return 'text-pixel-gray'
    }
  }

  return (
    <div className={`nes-container ${color} with-title`}>
      <p className="title text-[10px] pixel-text">{title}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <i className={`nes-icon ${icon} is-medium`}></i>
          <div>
            <div className="text-2xl sm:text-3xl pixel-text text-nes-white">
              {count.toString().padStart(2, '0')}
            </div>
            {subtitle && (
              <div className="text-[10px] text-nes-white opacity-80 pixel-text mt-1">
                {subtitle}
              </div>
            )}
          </div>
        </div>
        {trend && (
          <div className={`text-lg pixel-text ${getTrendColor()}`}>
            {getTrendIcon()}
          </div>
        )}
      </div>
    </div>
  )
}
