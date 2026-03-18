export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  labels: Array<{
    name: string;
    color: string;
  }>;
  assignee: {
    login: string;
    avatar_url: string;
  } | null;
  created_at: string;
  updated_at: string;
  html_url: string;
  body: string | null;
}

export interface DashboardData {
  totalIssues: number;
  openIssues: number;
  closedIssues: number;
  activeWork: number;
  blockers: number;
  readyForDev: number;
  recentIssues: GitHubIssue[];
}

const OWNER = 'mekunclaw';
const REPO = 'mission-control';

export async function fetchIssues(): Promise<GitHubIssue[]> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/issues?state=all&per_page=100`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
        next: { revalidate: 30 },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const issues: GitHubIssue[] = await response.json();
    return issues.filter(issue => !issue.labels.some(label => label.name === 'duplicate'));
  } catch (error) {
    console.error('Failed to fetch issues:', error);
    return [];
  }
}

export function processDashboardData(issues: GitHubIssue[]): DashboardData {
  const openIssues = issues.filter(i => i.state === 'open');
  const closedIssues = issues.filter(i => i.state === 'closed');
  
  const activeWork = openIssues.filter(i => 
    i.labels.some(l => l.name === 'status:in-progress')
  ).length;
  
  const blockers = openIssues.filter(i => 
    i.labels.some(l => l.name === 'status:blocked')
  ).length;
  
  const readyForDev = openIssues.filter(i => 
    i.labels.some(l => l.name === 'status:ready-for-dev' || l.name === 'ready-dev')
  ).length;

  const recentIssues = [...issues]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 10);

  return {
    totalIssues: issues.length,
    openIssues: openIssues.length,
    closedIssues: closedIssues.length,
    activeWork,
    blockers,
    readyForDev,
    recentIssues,
  };
}
