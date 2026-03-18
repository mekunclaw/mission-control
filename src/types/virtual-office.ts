// Virtual Office Types

export type AgentRole = 'dev' | 'qa-reviewer' | 'gm';
export type AnimationState = 'idle' | 'working' | 'walking' | 'celebrating';
export type OfficeZone = 'dev-area' | 'qa-area' | 'gm-office' | 'meeting-room' | 'common';
export type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';

export interface Agent {
  id: AgentRole;
  name: string;
  displayName: string;
  role: AgentRole;
  color: string;
  avatar: string;
  position: Position;
  zone: OfficeZone;
  animationState: AnimationState;
  direction: 'left' | 'right';
  currentTask?: string;
  isOnline: boolean;
  lastSeen: Date;
}

export interface Position {
  x: number;
  y: number;
}

export interface AgentStats {
  xp: number;
  level: number;
  levelName: string;
  totalCommits: number;
  totalPRs: number;
  issuesResolved: number;
  badges: Badge[];
  dailyXP: number;
  weeklyXP: number;
  monthlyXP: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface LeaderboardEntry {
  agentId: AgentRole;
  name: string;
  xp: number;
  rank: number;
}

export interface ChatMessage {
  id: string;
  agentId: AgentRole;
  message: string;
  timestamp: Date;
  type: 'chat' | 'system' | 'action';
}

export interface OfficeEvent {
  id: string;
  type: 'pr_merged' | 'issue_resolved' | 'commit_pushed' | 'xp_earned' | 'level_up' | 'badge_earned';
  agentId: AgentRole;
  message: string;
  xp?: number;
  timestamp: Date;
}

export interface CoffeeBoost {
  active: boolean;
  multiplier: number;
  expiresAt: Date | null;
}

export interface SprintGoal {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  status: 'in-progress' | 'completed' | 'pending';
}

export interface Whiteboard {
  goals: SprintGoal[];
  lastUpdated: Date;
}

export interface StandingUp {
  id: string;
  date: Date;
  duration: number;
  participants: AgentRole[];
  notes: string;
}

export interface InteractiveElement {
  id: string;
  type: 'desk' | 'coffee' | 'whiteboard' | 'meeting-room';
  zone: OfficeZone;
  position: Position;
  width: number;
  height: number;
  isOccupied: boolean;
  occupiedBy?: AgentRole;
}

export interface VirtualOfficeState {
  agents: Record<AgentRole, Agent>;
  agentStats: Record<AgentRole, AgentStats>;
  messages: ChatMessage[];
  events: OfficeEvent[];
  currentTime: TimeOfDay;
  coffeeBoost: CoffeeBoost;
  whiteboard: Whiteboard;
  leaderboard: {
    daily: LeaderboardEntry[];
    weekly: LeaderboardEntry[];
    monthly: LeaderboardEntry[];
  };
  currentUser: AgentRole | null;
}

// Level thresholds
export const LEVEL_THRESHOLDS = [
  { level: 1, name: 'Junior', xp: 0 },
  { level: 2, name: 'Developer', xp: 100 },
  { level: 3, name: 'Senior', xp: 500 },
  { level: 4, name: 'Lead', xp: 1500 },
  { level: 5, name: 'Architect', xp: 4000 },
];

// XP rewards
export const XP_REWARDS = {
  commit: 10,
  prCreated: 50,
  prMerged: 100,
  issueResolved: 75,
  bugFixed: 150,
  featureShipped: 200,
  codeReview: 25,
  helpProvided: 50,
};

// Badge definitions
export const BADGE_DEFINITIONS: Omit<Badge, 'unlockedAt'>[] = [
  { id: 'first-commit', name: 'Code Beginner', description: 'Made your first commit', icon: '💻', rarity: 'common' },
  { id: 'commit-streak-7', name: 'Consistent Coder', description: '7-day commit streak', icon: '🔥', rarity: 'common' },
  { id: 'pr-hero', name: 'PR Hero', description: 'Created 10 pull requests', icon: '🦸', rarity: 'rare' },
  { id: 'bug-hunter', name: 'Bug Hunter', description: 'Resolved 20 bugs', icon: '🐛', rarity: 'rare' },
  { id: 'code-ninja', name: 'Code Ninja', description: '1000 XP earned', icon: '🥷', rarity: 'epic' },
  { id: 'merge-master', name: 'Merge Master', description: 'Merged 50 PRs', icon: '🔀', rarity: 'epic' },
  { id: 'team-player', name: 'Team Player', description: 'Helped teammates 20 times', icon: '🤝', rarity: 'rare' },
  { id: 'night-owl', name: 'Night Owl', description: 'Active after midnight', icon: '🦉', rarity: 'common' },
  { id: 'sprint-champion', name: 'Sprint Champion', description: 'Completed 5 sprint goals', icon: '🏆', rarity: 'legendary' },
  { id: 'clean-code', name: 'Clean Code', description: 'No bugs in 10 merged PRs', icon: '✨', rarity: 'epic' },
];

// Zone configurations
export const ZONE_CONFIG: Record<OfficeZone, { name: string; color: string; description: string }> = {
  'dev-area': { name: 'Dev Area', color: '#2196f3', description: 'Where WUT writes code' },
  'qa-area': { name: 'QA Area', color: '#ffc107', description: 'Where ORN reviews code' },
  'gm-office': { name: 'GM Office', color: '#e94560', description: 'Where GM manages' },
  'meeting-room': { name: 'Meeting Room', color: '#4caf50', description: 'Team standups and planning' },
  'common': { name: 'Common Area', color: '#9c27b0', description: 'Coffee and conversations' },
};
