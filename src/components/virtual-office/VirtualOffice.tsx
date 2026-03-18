'use client';

import { useVirtualOffice } from '@/hooks/useVirtualOffice';
import { OfficeZone, AgentRole, TimeOfDay } from '@/types/virtual-office';
import AgentAvatar from './AgentAvatar';
import OfficeElement from './OfficeElement';
import ChatPanel from './ChatPanel';
import LeaderboardPanel from './LeaderboardPanel';
import WhiteboardPanel from './WhiteboardPanel';
import AgentStatsModal from './AgentStatsModal';
import CoffeeMachine from './CoffeeMachine';
import MeetingRoom from './MeetingRoom';
import { useState } from 'react';

export default function VirtualOffice() {
  const office = useVirtualOffice();

  if (!office.mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-900">
        <div className="nes-container is-dark text-center p-8">
          <p className="text-xl mb-4">Loading Virtual Office...</p>
          <div className="flex justify-center gap-2">
            <i className="nes-icon coin is-large animate"></i>
          </div>
        </div>
      </div>
    );
  }

  const getTimeLabel = (time: TimeOfDay) => {
    const labels: Record<TimeOfDay, string> = {
      'morning': '🌅 Morning',
      'day': '☀️ Day',
      'evening': '🌆 Evening',
      'night': '🌙 Night',
    };
    return labels[time];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br ${office.getBackgroundClass()} transition-all duration-1000">
      {/* Header */}
      <header className="p-4 md:p-6">
        <div className="nes-container is-dark with-title">
          <p className="title">🏢 Virtual Office</p>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-2xl">{getTimeLabel(office.currentTime)}</div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">XP Boost:</span>
                {office.coffeeBoost.active ? (
                  <span className="nes-badge is-splint">
                    <span className="is-warning">☕ Active x{office.coffeeBoost.multiplier}</span>
                  </span>
                ) : (
                  <span className="text-gray-500">Inactive</span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => office.setShowChat(!office.showChat)}
                className={`nes-btn ${office.showChat ? 'is-primary' : ''} text-xs py-2 px-4`}
              >
                💬 Chat
              </button>
              <button 
                onClick={() => office.setShowLeaderboard(!office.showLeaderboard)}
                className={`nes-btn ${office.showLeaderboard ? 'is-primary' : ''} text-xs py-2 px-4`}
              >
                🏆 Leaderboard
              </button>
              <button 
                onClick={() => office.setShowWhiteboard(!office.showWhiteboard)}
                className={`nes-btn ${office.showWhiteboard ? 'is-primary' : ''} text-xs py-2 px-4`}
              
              >
                📋 Whiteboard
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Office Area */}
      <main className="p-4 md:p-6">
        <div className="nes-container is-dark with-title relative overflow-hidden">
          <p className="title">Office Floor Plan</p>
          
          {/* Office Grid */}
          <div 
            className={`relative w-full aspect-[2/1] min-h-[400px] rounded-lg overflow-hidden ${office.getLightingClass()} transition-all duration-1000`}
            style={{
              background: `
                linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px),
                linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                #1a1a2e
              `,
              backgroundSize: '40px 40px',
            }}
          >
            {/* Zone Labels */}
            <div className="absolute top-4 left-4 px-3 py-1 bg-blue-500/30 rounded text-xs font-bold text-blue-300 border border-blue-500/50">
              🖥️ Dev Area
            </div>
            <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-500/30 rounded text-xs font-bold text-yellow-300 border border-yellow-500/50">
              🔍 QA Area
            </div>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-red-500/30 rounded text-xs font-bold text-red-300 border border-red-500/50">
              👔 GM Office
            </div>
            <div className="absolute bottom-20 left-4 px-3 py-1 bg-green-500/30 rounded text-xs font-bold text-green-300 border border-green-500/50">
              ☕ Common Area
            </div>
            <div className="absolute bottom-20 right-4 px-3 py-1 bg-purple-500/30 rounded text-xs font-bold text-purple-300 border border-purple-500/50">
              📊 Meeting Room
            </div>

            {/* Office Elements - Desks */}
            <OfficeElement 
              type="desk"
              zone="dev-area"
              position={{ x: 50, y: 120 }}
              width={80}
              height={60}
              label="Dev Desk"
              isOccupied={office.agents['dev'].zone === 'dev-area'}
              occupant="dev"
              onClick={() => console.log('Dev desk clicked')}
            />
            
            <OfficeElement 
              type="desk"
              zone="qa-area"
              position={{ x: 450, y: 120 }}
              width={80}
              height={60}
              label="QA Desk"
              isOccupied={office.agents['qa-reviewer'].zone === 'qa-area'}
              occupant="qa-reviewer"
              onClick={() => console.log('QA desk clicked')}
            />
            
            <OfficeElement 
              type="desk"
              zone="gm-office"
              position={{ x: 250, y: 60 }}
              width={100}
              height={50}
              label="GM Desk"
              isOccupied={office.agents['gm'].zone === 'gm-office'}
              occupant="gm"
              onClick={() => console.log('GM desk clicked')}
            />

            {/* Coffee Machine */}
            <CoffeeMachine 
              position={{ x: 80, y: 200 }}
              onActivate={office.activateCoffeeBoost}
              isActive={office.coffeeBoost.active}
            />

            {/* Whiteboard */}
            <OfficeElement 
              type="whiteboard"
              zone="meeting-room"
              position={{ x: 420, y: 60 }}
              width={120}
              height={80}
              label="📊 Sprint Goals"
              onClick={() => office.setShowWhiteboard(true)}
            />

            {/* Meeting Room Table */}
            <MeetingRoom 
              position={{ x: 450, y: 180 }}
              _onEnter={() => console.log('Entered meeting room')}
            />

            {/* Animated Elements */}
            <AnimatedPlants />
            <AnimatedScreens />

            {/* Agent Avatars */}
            {(Object.keys(office.agents) as AgentRole[]).map(role => (
              <AgentAvatar
                key={role}
                agent={office.agents[role]}
                stats={office.agentStats[role]}
                onClick={() => office.setSelectedAgent(role)}
                onHighFive={() => {
                  const otherRole = role === 'dev' ? 'qa-reviewer' : 'dev';
                  office.highFive(role, otherRole);
                }}
              />
            ))}

            {/* Event Notifications */}
            <div className="absolute top-2 right-2 space-y-1 pointer-events-none">
              {office.events.slice(0, 3).map(event => (
                <div 
                  key={event.id}
                  className="nes-badge is-splint animate-pulse"
                >
                  <span className={event.type === 'xp_earned' ? 'is-success' : event.type === 'level_up' ? 'is-warning' : 'is-primary'}>
                    {office.agents[event.agentId].name} {event.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Panels */}
      {office.showChat && (
        <ChatPanel 
          messages={office.messages}
          agents={office.agents}
          currentUser={office.currentUser}
          onSendMessage={office.sendMessage}
          onClose={() => office.setShowChat(false)}
        />
      )}

      {office.showLeaderboard && (
        <LeaderboardPanel
          leaderboard={office.leaderboard}
          onClose={() => office.setShowLeaderboard(false)}
        />
      )}

      {office.showWhiteboard && (
        <WhiteboardPanel
          goals={office.sprintGoals}
          onClose={() => office.setShowWhiteboard(false)}
        />
      )}

      {office.selectedAgent && (
        <AgentStatsModal
          agent={office.agents[office.selectedAgent]}
          stats={office.agentStats[office.selectedAgent]}
          onClose={() => office.setSelectedAgent(null)}
          onRequestHelp={() => office.requestHelp(office.selectedAgent!)}
        />
      )}
    </div>
  );
}

// Animated Plants
function AnimatedPlants() {
  return (
    <>
      <div className="absolute left-[20%] top-[45%] animate-sway">
        <div className="text-2xl">🪴</div>
      </div>
      <div className="absolute right-[25%] top-[40%] animate-sway"
        style={{ animationDelay: '0.5s' }}
      >
        <div className="text-2xl">🌿</div>
      </div>
      <div className="absolute left-[60%] bottom-[30%] animate-sway"
        style={{ animationDelay: '1s' }}
      >
        <div className="text-xl">🌱</div>
      </div>
    </>
  );
}

// Animated Screens
function AnimatedScreens() {
  return (
    <>
      <div className="absolute left-[22%] top-[38%] animate-flicker"
        style={{ transform: 'scale(0.8)' }}
      >
        <div className="w-8 h-6 bg-blue-400/50 rounded-sm"></div>
      </div>
      <div className="absolute right-[18%] top-[38%] animate-flicker"
        style={{ animationDelay: '0.3s', transform: 'scale(0.8)' }}
      >
        <div className="w-8 h-6 bg-yellow-400/50 rounded-sm"></div>
      </div>
    </>
  );
}
