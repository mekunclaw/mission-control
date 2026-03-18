'use client';

import React from 'react';

export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type IssueStatus = 'in_progress' | 'pending' | 'backlog' | 'ready';

export interface Issue {
  id: string;
  title: string;
  priority: Priority;
  status: IssueStatus;
  assignee?: string;
}

interface IssueBadgeProps {
  priority: Priority;
}

const IssueBadge: React.FC<IssueBadgeProps> = ({ priority }) => {
  const priorityConfig = {
    critical: {
      bg: 'bg-pixel-red',
      text: 'text-white',
      label: 'CRITICAL',
    },
    high: {
      bg: 'bg-pixel-blue',
      text: 'text-white',
      label: 'HIGH',
    },
    medium: {
      bg: 'bg-pixel-yellow',
      text: 'text-black',
      label: 'MEDIUM',
    },
    low: {
      bg: 'bg-pixel-gray',
      text: 'text-white',
      label: 'LOW',
    },
  };

  const config = priorityConfig[priority];

  return (
    <span className={`text-[8px] pixel-text px-2 py-1 ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

interface StatusIndicatorProps {
  status: IssueStatus;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const statusConfig = {
    in_progress: {
      color: 'bg-pixel-blue',
      label: 'IN_PROGRESS',
      animate: true,
    },
    pending: {
      color: 'bg-pixel-gray',
      label: 'PENDING',
      animate: false,
    },
    backlog: {
      color: 'bg-pixel-darker',
      label: 'BACKLOG',
      animate: false,
    },
    ready: {
      color: 'bg-pixel-green',
      label: 'READY',
      animate: false,
    },
  };

  const config = statusConfig[status];

  return (
    <span className="flex items-center gap-2">
      <span className={`w-2 h-2 ${config.color} ${config.animate ? 'animate-pixel-pulse' : ''}`} />
      <span className="text-[10px] pixel-text text-pixel-light">
        {config.label}
      </span>
    </span>
  );
};

// Mock issues data
const mockIssues: Issue[] = [
  {
    id: '#MC-1024',
    title: 'Database connection latency in sector 7G',
    priority: 'critical',
    status: 'in_progress',
  },
  {
    id: '#MC-1105',
    title: 'UI Glitch in navigation subsystem',
    priority: 'high',
    status: 'pending',
  },
  {
    id: '#MC-0982',
    title: 'Refactor propulsion logic loops',
    priority: 'low',
    status: 'backlog',
  },
  {
    id: '#MC-1201',
    title: 'Optimizing fuel consumption algorithms',
    priority: 'medium',
    status: 'ready',
  },
  {
    id: '#MC-1205',
    title: 'Update telemetry dashboard styling',
    priority: 'high',
    status: 'in_progress',
  },
  {
    id: '#MC-1210',
    title: 'Fix memory leak in data processor',
    priority: 'critical',
    status: 'pending',
  },
];

export const IssuesList: React.FC = () => {
  return (
    <section className="mb-8">
      <h2 className="text-sm pixel-text text-pixel-blue flex items-center gap-3 mb-4">
        <span className="w-2 h-4 bg-pixel-blue" />
        PRIORITY_ISSUES.EXE
      </h2>
      
      <div className="nes-container is-dark with-title p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-pixel-darker">
              <tr>
                <th className="p-4 border-b-4 border-black text-[10px] pixel-text text-pixel-gray">
                  ISSUE_ID
                </th>
                <th className="p-4 border-b-4 border-black text-[10px] pixel-text text-pixel-gray">
                  DESCRIPTION
                </th>
                <th className="p-4 border-b-4 border-black text-[10px] pixel-text text-pixel-gray">
                  PRIORITY
                </th>
                <th className="p-4 border-b-4 border-black text-[10px] pixel-text text-pixel-gray">
                  STATUS
                </th>
              </tr>
            </thead>
            <tbody>
              {mockIssues.map((issue, index) => (
                <tr 
                  key={issue.id}
                  className={`border-b-2 border-black hover:bg-pixel-darker/50 transition-colors ${
                    index === mockIssues.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className="p-4 font-mono text-pixel-blue text-sm">
                    {issue.id}
                  </td>
                  <td className="p-4 text-pixel-light text-sm">
                    {issue.title}
                  </td>
                  <td className="p-4">
                    <IssueBadge priority={issue.priority} />
                  </td>
                  <td className="p-4">
                    <StatusIndicator status={issue.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default IssuesList;
