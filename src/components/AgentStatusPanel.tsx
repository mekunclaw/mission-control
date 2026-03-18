'use client';

import React, { useState, useEffect } from 'react';
import { AgentCard, Agent, AgentStatus } from './AgentCard';

// Initial agent data
const initialAgents: Agent[] = [
  {
    id: '1',
    name: 'TIM',
    code: 'AGENT-001',
    status: 'working',
    currentTask: 'Processing data stream',
    avatarColor: '#007bff', // pixel-blue
  },
  {
    id: '2',
    name: 'WUT',
    code: 'AGENT-002',
    status: 'idle',
    currentTask: 'Awaiting instructions',
    avatarColor: '#28a745', // pixel-green
  },
  {
    id: '3',
    name: 'ORN',
    code: 'AGENT-003',
    status: 'blocked',
    currentTask: 'Waiting for API response',
    avatarColor: '#fd7e14', // pixel-orange
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
            currentTask: getTaskForStatus(randomStatus),
          };
          
          return newAgents;
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getTaskForStatus = (status: AgentStatus): string => {
    const tasks = {
      idle: ['Awaiting instructions', 'Standby mode', 'Ready for assignment'],
      working: ['Processing data stream', 'Analyzing patterns', 'Compiling report', 'Syncing databases'],
      blocked: ['Waiting for API response', 'Dependency resolution', 'Awaiting user input'],
    };
    const taskList = tasks[status];
    return taskList[Math.floor(Math.random() * taskList.length)];
  };

  return (
    <section className="mb-8">
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm pixel-text text-pixel-light">
          <span className="text-pixel-cyan">◈</span> AGENT STATUS
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-[8px] text-pixel-gray pixel-text">
            LAST UPDATE:
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
        </div>
      </div>
    </section>
  );
};

export default AgentStatusPanel;
