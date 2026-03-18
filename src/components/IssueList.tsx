'use client';

import React from 'react';
import { GitHubIssue } from '@/lib/github';

// Label color definitions with high contrast
export const LABEL_COLORS: Record<string, { bg: string; text: string }> = {
  'priority:high': { bg: '#dc3545', text: '#ffffff' },
  'priority:medium': { bg: '#ffc107', text: '#000000' },
  'priority:low': { bg: '#6c757d', text: '#ffffff' },
  'status:ready-for-dev': { bg: '#28a745', text: '#ffffff' },
  'status:in-progress': { bg: '#007bff', text: '#ffffff' },
  'status:blocked': { bg: '#dc3545', text: '#ffffff' },
  'status:verified': { bg: '#17a2b8', text: '#ffffff' },
  'status:spec-review': { bg: '#6f42c1', text: '#ffffff' },
  'role:dev': { bg: '#6f42c1', text: '#ffffff' },
  'role:qa-reviewer': { bg: '#20c997', text: '#000000' },
  'role:gm': { bg: '#fd7e14', text: '#000000' },
};

function getStatusBadgeColor(labels: GitHubIssue['labels']): string {
  if (labels.some(l => l.name === 'status:blocked')) return 'is-error';
  if (labels.some(l => l.name === 'status:in-progress')) return 'is-primary';
  if (labels.some(l => l.name === 'status:ready-for-dev' || l.name === 'ready-dev')) return 'is-success';
  if (labels.some(l => l.name === 'status:verified')) return 'is-primary';
  return 'is-dark';
}

function getStatusText(labels: GitHubIssue['labels']): string {
  if (labels.some(l => l.name === 'status:blocked')) return 'BLOCKED';
  if (labels.some(l => l.name === 'status:in-progress')) return 'IN PROGRESS';
  if (labels.some(l => l.name === 'status:ready-for-dev' || l.name === 'ready-dev')) return 'READY';
  if (labels.some(l => l.name === 'status:verified')) return 'VERIFIED';
  if (labels.some(l => l.name === 'status:spec-review')) return 'SPEC REVIEW';
  return 'OPEN';
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function IssueList({ issues, title }: IssueListProps) {
  if (issues.length === 0) {
    return (
      <div className="nes-container is-dark">
        <p className="title">{title}</p>
        <p className="text-center py-8">No issues found</p>
      </div>
    );
  }

  return (
    <div className="nes-container is-dark with-title">
      <p className="title">{title}</p>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {issues.map((issue) => (
          <a
            key={issue.id}
            href={issue.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block no-underline"
          >
            <div className="nes-container is-dark p-3 hover:brightness-110 transition-all">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-400">
                      #{issue.number}
                    </span>
                    <span className={`nes-badge ${getStatusBadgeColor(issue.labels)}`}>
                      <span className="is-splited">{getStatusText(issue.labels)}</span>
                    </span>
                  </div>
                  <p className="text-sm truncate" title={issue.title}>
                    {issue.title}
                  </p>
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap">
                  {formatDate(issue.updated_at)}
                </div>
              </div>
              {issue.assignee && (
                <div className="flex items-center gap-2 mt-2">
                  <img
                    src={issue.assignee.avatar_url}
                    alt={issue.assignee.login}
                    className="w-5 h-5 rounded-full"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <span className="text-xs text-gray-400">{issue.assignee.login}</span>
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
