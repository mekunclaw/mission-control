'use client';

import { Agent, AgentStats, Badge } from '@/types/virtual-office';

interface AgentStatsModalProps {
  agent: Agent;
  stats: AgentStats;
  onClose: () => void;
  onRequestHelp: () => void;
}

export default function AgentStatsModal({ agent, stats, onClose, onRequestHelp }: AgentStatsModalProps) {
  const getRarityColor = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-500/20';
      case 'rare': return 'border-blue-400 bg-blue-500/20';
      case 'epic': return 'border-purple-400 bg-purple-500/20';
      case 'legendary': return 'border-yellow-400 bg-yellow-500/20';
    }
  };

  const getRarityLabel = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'common': return 'Common';
      case 'rare': return 'Rare';
      case 'epic': return 'Epic';
      case 'legendary': return 'Legendary';
    }
  };

  const nextLevelXP = [100, 500, 1500, 4000, 10000][stats.level - 1] || 10000;
  const currentLevelXP = [0, 100, 500, 1500, 4000][stats.level - 1] || 0;
  const xpProgress = stats.level >= 5 ? 100 : ((stats.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="nes-container is-dark with-title w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <p className="title">👤 {agent.name} - {agent.displayName}</p>
        
        <div className="space-y-6">
          {/* Agent Header */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={agent.avatar}
                alt={agent.name}
                className="w-24 h-24 rounded-lg"
                style={{ 
                  imageRendering: 'pixelated',
                  border: `4px solid ${agent.color}`,
                  boxShadow: `0 4px 20px ${agent.color}40`,
                }}
              />
              <div 
                className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold border-4 border-gray-800"
                style={{ backgroundColor: agent.color }}
              >
                {stats.level}
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1" style={{ color: agent.color }}>
                {stats.levelName}
              </h2>
              <p className="text-gray-400 mb-4">{agent.currentTask || 'No active task'}</p>
              
              {/* XP Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>XP Progress</span>
                  <span>{stats.xp} / {stats.level >= 5 ? '∞' : nextLevelXP}</span>
                </div>
                <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-500 relative"
                    style={{ 
                      width: `${xpProgress}%`,
                      background: `linear-gradient(90deg, ${agent.color}, ${agent.color}80)`,
                    }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Total Commits" value={stats.totalCommits} icon="📝" />
            <StatCard label="Pull Requests" value={stats.totalPRs} icon="🔀" />
            <StatCard label="Issues Resolved" value={stats.issuesResolved} icon="✅" />
            <StatCard label="Total XP" value={stats.xp} icon="⭐" />
          </div>

          {/* XP Breakdown */}
          <div className="nes-container is-rounded">
            <p className="text-sm font-bold mb-3">📊 XP Breakdown</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{stats.dailyXP}</div>
                <div className="text-xs text-gray-400">Today</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{stats.weeklyXP}</div>
                <div className="text-xs text-gray-400">This Week</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{stats.monthlyXP}</div>
                <div className="text-xs text-gray-400">This Month</div>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div>
            <p className="text-sm font-bold mb-3">🏅 Badges ({stats.badges.length})</p>
            {stats.badges.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {stats.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`nes-container is-rounded p-3 text-center border-2 ${getRarityColor(badge.rarity)}`}
                    title={badge.description}
                  >
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <div className="text-xs font-bold">{badge.name}</div>
                    <div className="text-[10px] opacity-70">{getRarityLabel(badge.rarity)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                No badges earned yet. Keep shipping! 🚀
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <button 
              onClick={onRequestHelp}
              className="nes-btn is-warning"
            >
              🆘 Request Help
            </button>
            <button 
              onClick={onClose}
              className="nes-btn"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="nes-container is-rounded p-3 text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xl font-bold">{value.toLocaleString()}</div>
      <div className="text-[10px] text-gray-400">{label}</div>
    </div>
  );
}
