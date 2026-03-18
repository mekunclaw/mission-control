'use client';

import React, { useState, useEffect } from 'react';
import { AgentCard, Agent, AgentStatus } from './AgentCard';

// Initial agent data
const initialAgents: Agent[] = [
  {
    id: '1',
    name: 'TIM',
    code: 'AGENT-001',
    role: 'GENERAL MANAGER',
    description: 'System Analyst & Facilitator',
    status: 'working',
    currentTask: 'Reviewing PR #45 - Rich Menu Deployment',
    avatarColor: '#ffc107',
    taskCount: 3,
    lastUpdate: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: '2',
    name: 'WUT',
    code: 'AGENT-002',
    role: 'FULLSTACK DEV',
    description: 'The Builder',
    status: 'working',
    currentTask: 'Implementing Card OCR Recognition',
    avatarColor: '#28a745',
    taskCount: 5,
    lastUpdate: new Date(Date.now() - 2 * 60000).toISOString(),
  },
  {
    id: '3',
    name: 'ORN',
    code: 'AGENT-003',
    role: 'QA REVIEWER',
    description: 'The Gatekeeper',
    status: 'idle',
    currentTask: null,
    avatarColor: '#17a2b8',
    taskCount: 0,
    lastUpdate: new Date(Date.now() - 30 * 60000).toISOString(),
  },
];

export const AgentStatusPanel: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Simulate real-time status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      
      // Occasionally update a random agent's status for demo
      if (Math.random() > 0.7) {
        setAgents((prevAgents) => {
          const newAgents = [...prevAgents];
          const randomIndex = Math.floor(Math.random() * newAgents.length);
          const statuses: AgentStatus[] = ['idle', 'working', 'blocked'];
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
          
          newAgents[randomIndex] = {
            ...newAgents[randomIndex],
            status: randomStatus,
            currentTask: getTaskForStatus(randomStatus, newAgents[randomIndex].name),
            lastUpdate: new Date().toISOString(),
          };
          
          return newAgents;
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getTaskForStatus = (status: AgentStatus, agentName: string): string | null => {
    const tasks: Record<string, Record<AgentStatus, (string | null)[]>> = {
      TIM: {
        idle: ['Awaiting instructions', 'Ready for assignment', null],
        working: ['Reviewing PR #45', 'Analyzing system architecture', 'Clearing blockers'],
        blocked: ['Waiting for approval', 'Dependency resolution', 'Awaiting feedback'],
        offline: [null],
      },
      WUT: {
        idle: ['Awaiting instructions', 'Standby mode', null],
        working: ['Implementing Card OCR', 'Building API endpoints', 'Writing tests'],
        blocked: ['Waiting for API response', 'Dependency resolution', 'Code review pending'],
        offline: [null],
      },
      ORN: {
        idle: ['Awaiting assignments', 'Ready for audit', null],
        working: ['Running security audit', 'Reviewing test coverage', 'Validating PRs'],
        blocked: ['Waiting for test results', 'Build failure investigation', 'Awaiting deployment'],
        offline: [null],
      },
    };
    
    const taskList = tasks[agentName][status];
    return taskList[Math.floor(Math.random() * taskList.length)];
  };

  // Calculate active agents
  const activeAgents = agents.filter(a => a.status === 'working').length;
  const totalTasks = agents.reduce((sum, a) => sum + (a.taskCount || 0), 0);

  return (
    <section className="mb-8">
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm pixel-text text-pixel-light">
          <span className="text-pixel-cyan">◈</span> AGENT STATUS
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[8px] text-pixel-gray pixel-text">
              ACTIVE:
            </span>
            <span className="text-[8px] text-pixel-green pixel-text">
              {activeAgents}/{agents.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[8px] text-pixel-gray pixel-text">
              TASKS:
            </span>
            <span className="text-[8px] text-pixel-yellow pixel-text">
              {totalTasks}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[8px] text-pixel-gray pixel-text">
              UPDATED:
            </span>
            <span className="text-[8px] text-pixel-cyan pixel-text">
              {lastUpdate.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      {/* Status Legend */}
      <div className="mt-4 p-3 bg-pixel-darker border-2 border-black">
        <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-pixel-green border border-black" />
            <span className="text-[8px] text-pixel-gray pixel-text">WORKING</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-pixel-gray border border-black" />
            <span className="text-[8px] text-pixel-gray pixel-text">IDLE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-pixel-red border border-black" />
            <span className="text-[8px] text-pixel-gray pixel-text">BLOCKED</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-pixel-gray border border-black opacity-50" />
            <span className="text-[8px] text-pixel-gray pixel-text">OFFLINE</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgentStatusPanel;
