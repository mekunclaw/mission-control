'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Agent, AgentRole, AnimationState, OfficeZone, TimeOfDay, AgentStats,
  ChatMessage, OfficeEvent, CoffeeBoost, SprintGoal, LeaderboardEntry,
  VirtualOfficeState, LEVEL_THRESHOLDS, XP_REWARDS, BADGE_DEFINITIONS,
  Badge, Position
} from '@/types/virtual-office';

// Default agent configurations
const DEFAULT_AGENTS: Record<AgentRole, Agent> = {
  'dev': {
    id: 'dev',
    name: 'WUT',
    displayName: 'WUT',
    role: 'dev',
    color: '#2196f3',
    avatar: '/agents/wut.svg',
    position: { x: 150, y: 180 },
    zone: 'dev-area',
    animationState: 'idle',
    direction: 'right',
    currentTask: 'Implementing feature #15',
    isOnline: true,
    lastSeen: new Date(),
  },
  'qa-reviewer': {
    id: 'qa-reviewer',
    name: 'ORN',
    displayName: 'ORN',
    role: 'qa-reviewer',
    color: '#ffc107',
    avatar: '/agents/orn.svg',
    position: { x: 450, y: 180 },
    zone: 'qa-area',
    animationState: 'working',
    direction: 'left',
    currentTask: 'Reviewing pull requests',
    isOnline: true,
    lastSeen: new Date(),
  },
  'gm': {
    id: 'gm',
    name: 'GM',
    displayName: 'GM',
    role: 'gm',
    color: '#e94560',
    avatar: '/agents/gm.svg',
    position: { x: 300, y: 80 },
    zone: 'gm-office',
    animationState: 'idle',
    direction: 'right',
    currentTask: 'Planning sprint goals',
    isOnline: true,
    lastSeen: new Date(),
  },
};

const DEFAULT_STATS: AgentStats = {
  xp: 0,
  level: 1,
  levelName: 'Junior',
  totalCommits: 0,
  totalPRs: 0,
  issuesResolved: 0,
  badges: [],
  dailyXP: 0,
  weeklyXP: 0,
  monthlyXP: 0,
};

const DEFAULT_SPRINT_GOALS: SprintGoal[] = [
  { id: '1', title: 'Complete MVP Features', description: 'Finish core functionality', progress: 12, total: 20, status: 'in-progress' },
  { id: '2', title: 'Fix Critical Bugs', description: 'Resolve P0 and P1 issues', progress: 8, total: 10, status: 'in-progress' },
  { id: '3', title: 'Code Review Queue', description: 'Review all pending PRs', progress: 15, total: 25, status: 'in-progress' },
  { id: '4', title: 'Documentation', description: 'Update project docs', progress: 3, total: 5, status: 'pending' },
];

export function useVirtualOffice() {
  const [mounted, setMounted] = useState(false);
  const [agents, setAgents] = useState<Record<AgentRole, Agent>>(DEFAULT_AGENTS);
  const [agentStats, setAgentStats] = useState<Record<AgentRole, AgentStats>>({
    'dev': { ...DEFAULT_STATS, xp: 1250, totalCommits: 45, totalPRs: 12, issuesResolved: 8, level: 3, levelName: 'Senior', badges: [
      { id: 'first-commit', name: 'Code Beginner', description: 'Made your first commit', icon: '💻', unlockedAt: new Date('2024-01-15'), rarity: 'common' },
      { id: 'pr-hero', name: 'PR Hero', description: 'Created 10 pull requests', icon: '🦸', unlockedAt: new Date('2024-02-01'), rarity: 'rare' },
      { id: 'code-ninja', name: 'Code Ninja', description: '1000 XP earned', icon: '🥷', unlockedAt: new Date('2024-03-10'), rarity: 'epic' },
    ]},
    'qa-reviewer': { ...DEFAULT_STATS, xp: 980, totalCommits: 28, totalPRs: 18, issuesResolved: 15, level: 3, levelName: 'Senior', badges: [
      { id: 'bug-hunter', name: 'Bug Hunter', description: 'Resolved 20 bugs', icon: '🐛', unlockedAt: new Date('2024-02-20'), rarity: 'rare' },
    ]},
    'gm': { ...DEFAULT_STATS, xp: 2100, totalCommits: 62, totalPRs: 25, issuesResolved: 22, level: 4, levelName: 'Lead', badges: [
      { id: 'team-player', name: 'Team Player', description: 'Helped teammates 20 times', icon: '🤝', unlockedAt: new Date('2024-01-25'), rarity: 'rare' },
      { id: 'merge-master', name: 'Merge Master', description: 'Merged 50 PRs', icon: '🔀', unlockedAt: new Date('2024-03-01'), rarity: 'epic' },
    ]},
  });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [events, setEvents] = useState<OfficeEvent[]>([]);
  const [currentTime, setCurrentTime] = useState<TimeOfDay>('day');
  const [coffeeBoost, setCoffeeBoost] = useState<CoffeeBoost>({ active: false, multiplier: 1.5, expiresAt: null });
  const [sprintGoals] = useState<SprintGoal[]>(DEFAULT_SPRINT_GOALS);
  const [leaderboard, setLeaderboard] = useState<{ daily: LeaderboardEntry[]; weekly: LeaderboardEntry[]; monthly: LeaderboardEntry[] }>({
    daily: [],
    weekly: [],
    monthly: [],
  });
  const [currentUser, setCurrentUser] = useState<AgentRole | null>('dev');
  const [selectedAgent, setSelectedAgent] = useState<AgentRole | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate time of day based on real time
  const getTimeOfDay = useCallback((): TimeOfDay => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) return 'morning';
    if (hour >= 10 && hour < 17) return 'day';
    if (hour >= 17 && hour < 20) return 'evening';
    return 'night';
  }, []);

  // Update time of day every minute
  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      setCurrentTime(getTimeOfDay());
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [getTimeOfDay]);

  // Animation cycle for agents
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => {
        const updated = { ...prev };
        (Object.keys(updated) as AgentRole[]).forEach(role => {
          const agent = updated[role];
          // Random animation changes
          if (Math.random() > 0.7) {
            const states: AnimationState[] = ['idle', 'working', 'idle', 'working', 'idle'];
            agent.animationState = states[Math.floor(Math.random() * states.length)];
          }
        });
        return { ...updated };
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Simulate WebSocket/polling for real-time updates
  useEffect(() => {
    // Simulate real-time events
    const simulateEvent = () => {
      const eventTypes: OfficeEvent['type'][] = ['commit_pushed', 'pr_merged', 'issue_resolved', 'xp_earned'];
      const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const randomAgent = (['dev', 'qa-reviewer', 'gm'] as AgentRole[])[Math.floor(Math.random() * 3)];
      
      const messages: Record<OfficeEvent['type'], string> = {
        'commit_pushed': 'pushed a commit',
        'pr_merged': 'merged a pull request',
        'issue_resolved': 'resolved an issue',
        'xp_earned': 'earned XP',
        'level_up': 'leveled up!',
        'badge_earned': 'earned a new badge',
      };

      const newEvent: OfficeEvent = {
        id: Date.now().toString(),
        type: randomType,
        agentId: randomAgent,
        message: messages[randomType],
        xp: randomType === 'xp_earned' ? Math.floor(Math.random() * 50) + 10 : undefined,
        timestamp: new Date(),
      };

      setEvents(prev => [newEvent, ...prev.slice(0, 19)]);

      // Award XP for events
      if (randomType === 'xp_earned' && newEvent.xp) {
        awardXP(randomAgent, newEvent.xp);
      }
    };

    // Poll every 5 seconds for simulated real-time updates
    pollingRef.current = setInterval(simulateEvent, 5000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  // Update leaderboard periodically
  useEffect(() => {
    const updateLeaderboard = () => {
      const entries = (Object.keys(agentStats) as AgentRole[]).map(role => ({
        agentId: role,
        name: agents[role].name,
        xp: agentStats[role].xp,
        rank: 0,
      })).sort((a, b) => b.xp - a.xp);

      const ranked = entries.map((e, i) => ({ ...e, rank: i + 1 }));

      setLeaderboard({
        daily: ranked,
        weekly: ranked,
        monthly: ranked,
      });
    };

    updateLeaderboard();
  }, [agentStats, agents]);

  const getLevelFromXP = (xp: number): { level: number; name: string } => {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (xp >= LEVEL_THRESHOLDS[i].xp) {
        return { level: LEVEL_THRESHOLDS[i].level, name: LEVEL_THRESHOLDS[i].name };
      }
    }
    return { level: 1, name: 'Junior' };
  };

  const awardXP = useCallback((agentId: AgentRole, amount: number) => {
    const multiplier = coffeeBoost.active ? coffeeBoost.multiplier : 1;
    const finalAmount = Math.floor(amount * multiplier);

    setAgentStats(prev => {
      const current = prev[agentId];
      const newXP = current.xp + finalAmount;
      const { level, name: levelName } = getLevelFromXP(newXP);

      // Check for level up
      if (level > current.level) {
        const levelUpEvent: OfficeEvent = {
          id: Date.now().toString(),
          type: 'level_up',
          agentId,
          message: `leveled up to ${levelName}!`,
          timestamp: new Date(),
        };
        setEvents(e => [levelUpEvent, ...e.slice(0, 19)]);
      }

      return {
        ...prev,
        [agentId]: {
          ...current,
          xp: newXP,
          level,
          levelName,
          dailyXP: current.dailyXP + finalAmount,
          weeklyXP: current.weeklyXP + finalAmount,
          monthlyXP: current.monthlyXP + finalAmount,
        },
      };
    });
  }, [coffeeBoost.active, coffeeBoost.multiplier]);

  const unlockBadge = useCallback((agentId: AgentRole, badgeId: string) => {
    const badgeDef = BADGE_DEFINITIONS.find(b => b.id === badgeId);
    if (!badgeDef) return;

    setAgentStats(prev => {
      const current = prev[agentId];
      if (current.badges.some(b => b.id === badgeId)) return prev;

      const newBadge: Badge = { ...badgeDef, unlockedAt: new Date() };

      const badgeEvent: OfficeEvent = {
        id: Date.now().toString(),
        type: 'badge_earned',
        agentId,
        message: `earned the ${badgeDef.name} badge!`,
        timestamp: new Date(),
      };
      setEvents(e => [badgeEvent, ...e.slice(0, 19)]);

      return {
        ...prev,
        [agentId]: {
          ...current,
          badges: [...current.badges, newBadge],
        },
      };
    });
  }, []);

  const sendMessage = useCallback((agentId: AgentRole, message: string, type: ChatMessage['type'] = 'chat') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      agentId,
      message,
      timestamp: new Date(),
      type,
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const activateCoffeeBoost = useCallback(() => {
    setCoffeeBoost({
      active: true,
      multiplier: 1.5,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });

    // Show chat message
    if (currentUser) {
      sendMessage(currentUser, '☕ Coffee boost activated! XP x1.5 for 5 minutes!', 'action');
    }

    // Auto-disable after 5 minutes
    setTimeout(() => {
      setCoffeeBoost({ active: false, multiplier: 1, expiresAt: null });
    }, 5 * 60 * 1000);
  }, [currentUser, sendMessage]);

  const moveAgent = useCallback((agentId: AgentRole, zone: OfficeZone, position: Position) => {
    setAgents(prev => ({
      ...prev,
      [agentId]: {
        ...prev[agentId],
        zone,
        position,
        animationState: 'walking',
      },
    }));

    // Return to idle after movement
    setTimeout(() => {
      setAgents(prev => ({
        ...prev,
        [agentId]: {
          ...prev[agentId],
          animationState: 'idle',
        },
      }));
    }, 1000);
  }, []);

  const highFive = useCallback((agent1Id: AgentRole, agent2Id: AgentRole) => {
    // Set celebrating animation for both
    setAgents(prev => ({
      ...prev,
      [agent1Id]: { ...prev[agent1Id], animationState: 'celebrating' },
      [agent2Id]: { ...prev[agent2Id], animationState: 'celebrating' },
    }));

    // Award XP for teamwork
    awardXP(agent1Id, XP_REWARDS.helpProvided);
    awardXP(agent2Id, XP_REWARDS.helpProvided);

    // Send celebration message
    sendMessage(agent1Id, '🙌 High-five!', 'action');

    // Return to idle after celebration
    setTimeout(() => {
      setAgents(prev => ({
        ...prev,
        [agent1Id]: { ...prev[agent1Id], animationState: 'idle' },
        [agent2Id]: { ...prev[agent2Id], animationState: 'idle' },
      }));
    }, 2000);
  }, [awardXP, sendMessage]);

  const requestHelp = useCallback((agentId: AgentRole) => {
    sendMessage(agentId, 'needs help!', 'action');
    // Notify other agents
    (Object.keys(agents) as AgentRole[]).forEach(role => {
      if (role !== agentId) {
        sendMessage(role, `${agents[agentId].name} needs assistance`, 'system');
      }
    });
  }, [agents, sendMessage]);

  const getBackgroundClass = () => {
    switch (currentTime) {
      case 'morning': return 'from-orange-300 to-blue-300';
      case 'day': return 'from-blue-400 to-blue-200';
      case 'evening': return 'from-purple-500 to-orange-400';
      case 'night': return 'from-gray-900 to-blue-900';
      default: return 'from-blue-400 to-blue-200';
    }
  };

  const getLightingClass = () => {
    switch (currentTime) {
      case 'morning': return 'opacity-90';
      case 'day': return 'opacity-100';
      case 'evening': return 'opacity-75 brightness-90';
      case 'night': return 'opacity-50 brightness-75';
      default: return 'opacity-100';
    }
  };

  return {
    mounted,
    agents,
    agentStats,
    messages,
    events,
    currentTime,
    coffeeBoost,
    sprintGoals,
    leaderboard,
    currentUser,
    selectedAgent,
    showChat,
    showLeaderboard,
    showWhiteboard,
    setSelectedAgent,
    setShowChat,
    setShowLeaderboard,
    setShowWhiteboard,
    setCurrentUser,
    awardXP,
    unlockBadge,
    sendMessage,
    activateCoffeeBoost,
    moveAgent,
    highFive,
    requestHelp,
    getBackgroundClass,
    getLightingClass,
  };
}
