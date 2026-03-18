'use client';

import { LeaderboardEntry } from '@/types/virtual-office';

interface LeaderboardPanelProps {
  leaderboard: {
    daily: LeaderboardEntry[];
    weekly: LeaderboardEntry[];
    monthly: LeaderboardEntry[];
  };
  onClose: () => void;
}

export default function LeaderboardPanel({ leaderboard, onClose }: LeaderboardPanelProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-400';
      case 2: return 'text-gray-300';
      case 3: return 'text-amber-600';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="nes-container is-dark with-title w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <p className="title">🏆 Leaderboard</p>
        
        <div className="space-y-6">
          {/* Daily Leaderboard */}
          <div>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              📅 Daily Rankings
            </h3>
            <LeaderboardTable entries={leaderboard.daily} getRankIcon={getRankIcon} getRankColor={getRankColor} />
          </div>

          {/* Weekly Leaderboard */}
          <div>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              📊 Weekly Rankings
            </h3>
            <LeaderboardTable entries={leaderboard.weekly} getRankIcon={getRankIcon} getRankColor={getRankColor} />
          </div>

          {/* Monthly Leaderboard */}
          <div>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              📈 Monthly Rankings
            </h3>
            <LeaderboardTable entries={leaderboard.monthly} getRankIcon={getRankIcon} getRankColor={getRankColor} />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="nes-btn">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function LeaderboardTable({ 
  entries, 
  getRankIcon, 
  getRankColor 
}: { 
  entries: LeaderboardEntry[]; 
  getRankIcon: (rank: number) => string;
  getRankColor: (rank: number) => string;
}) {
  if (entries.length === 0) {
    return (
      <div className="nes-container is-rounded p-4 text-center text-gray-500">
        No data available yet
      </div>
    );
  }

  return (
    <div className="nes-container is-rounded overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="text-left p-2 text-sm">Rank</th>
            <th className="text-left p-2 text-sm">Agent</th>
            <th className="text-right p-2 text-sm">XP</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr 
              key={entry.agentId}
              className="border-b border-gray-700 last:border-0 hover:bg-white/5 transition-colors"
            >
              <td className={`p-2 font-bold ${getRankColor(entry.rank)}`}>
                <span className="text-lg">{getRankIcon(entry.rank)}</span>
              </td>
              <td className="p-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{entry.name}</span>
                </div>
              </td>
              <td className="p-2 text-right font-mono text-green-400">
                {entry.xp.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
