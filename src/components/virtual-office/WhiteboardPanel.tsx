'use client';

import { SprintGoal } from '@/types/virtual-office';

interface WhiteboardPanelProps {
  goals: SprintGoal[];
  onClose: () => void;
}

export default function WhiteboardPanel({ goals, onClose }: WhiteboardPanelProps) {
  const getStatusColor = (status: SprintGoal['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 border-green-500 text-green-400';
      case 'in-progress': return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
      case 'pending': return 'bg-gray-500/20 border-gray-500 text-gray-400';
    }
  };

  const getStatusLabel = (status: SprintGoal['status']) => {
    switch (status) {
      case 'completed': return '✅ Completed';
      case 'in-progress': return '🔄 In Progress';
      case 'pending': return '⏳ Pending';
    }
  };

  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const overallProgress = goals.reduce((sum, g) => sum + g.progress, 0);
  const totalProgress = goals.reduce((sum, g) => sum + g.total, 0);
  const percentage = totalProgress > 0 ? Math.round((overallProgress / totalProgress) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="nes-container is-dark with-title w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <p className="title">📋 Sprint Goals</p>
        
        <div className="space-y-6">
          {/* Overall Progress */}
          <div className="nes-container is-rounded">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">📊 Overall Progress</span>
              <span className="text-lg font-bold text-green-400">{percentage}%</span>
            </div>
            <div className="h-6 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500 relative"
                style={{ width: `${percentage}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-shimmer" />
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-400">
              {completedGoals} of {totalGoals} goals completed • {overallProgress}/{totalProgress} tasks done
            </div>
          </div>

          {/* Goals Grid */}
          <div className="grid gap-4">
            {goals.map((goal) => (
              <div 
                key={goal.id}
                className={`nes-container is-rounded border-2 ${getStatusColor(goal.status)}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-lg">{goal.title}</h4>
                    <p className="text-sm opacity-80">{goal.description}</p>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded ${getStatusColor(goal.status)}`}>
                    {getStatusLabel(goal.status)}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span className="font-mono">{goal.progress}/{goal.total}</span>
                  </div>
                  <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-500"
                      style={{ 
                        width: `${(goal.progress / goal.total) * 100}%`,
                        backgroundColor: goal.status === 'completed' ? '#4caf50' : 
                                        goal.status === 'in-progress' ? '#ffc107' : '#9e9e9e',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button 
              onClick={() => {}}
              className="nes-btn is-primary"
            >
              🔄 Refresh Goals
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
