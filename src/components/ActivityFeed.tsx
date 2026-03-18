'use client';

import React from 'react';
import { GitHubIssue } from '@/lib/github';

interface ActivityFeedProps {
  issues: GitHubIssue[];
}

function getActivityIcon(labels: GitHubIssue['labels']): string {
  if (labels.some(l => l.name === 'status:blocked')) return 'exclamation';
  if (labels.some(l => l.name === 'status:in-progress')) return 'hammer';
  if (labels.some(l => l.name === 'status:verified')) return 'check';
  return 'star';
}

function getActivityText(issue: GitHubIssue): string {
  const status = (labels: GitHubIssue['labels']) => {
    if (labels.some((l: { name: string }) => l.name === 'status:blocked')) return 'blocked';
    if (labels.some((l: { name: string }) => l.name === 'status:in-progress')) return 'moved to in-progress';
    if (labels.some((l: { name: string }) => l.name === 'status:verified')) return 'verified';
    if (labels.some((l: { name: string }) => l.name === 'status:ready-for-dev' || l.name === 'ready-dev')) return 'ready for dev';
    return 'updated';
  };
  return `Issue #${issue.number} ${status(issue.labels)}`;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ActivityFeed({ issues }: ActivityFeedProps) {
  const recentActivity = [...issues]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 8);

  if (recentActivity.length === 0) {
    return (
      <div className="nes-container is-dark">
        <p className="title">Activity Feed</p>
        <p className="text-center py-4">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="nes-container is-dark with-title">
      <p className="title">Activity Feed</p>
      <div className="space-y-2">
        {recentActivity.map((issue, index) => (
          <div key={`${issue.id}-${index}`} className="flex items-center gap-3 p-2">
            <i className={`nes-icon ${getActivityIcon(issue.labels)} is-small`}></i>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate" title={issue.title}>
                {getActivityText(issue)}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {issue.title}
              </p>
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {formatTimeAgo(issue.updated_at)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
