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
  project?: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  open_issues_count: number;
}

export interface GitHubPR {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  html_url: string;
  created_at: string;
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

export interface ProjectData {
  repo: GitHubRepo;
  openPRs: number;
}

const OWNER = 'mekunclaw';
const REPO = 'mission-control';

// List of projects to fetch issues from
const PROJECTS = ['mission-control', 'card-buff', 'shelf-count'];

export async function fetchIssues(): Promise<GitHubIssue[]> {
  try {
    // Fetch issues from all projects
    const issuesPromises = PROJECTS.map(async (project) => {
      const response = await fetch(
        `https://api.github.com/repos/${OWNER}/${project}/issues?state=all&per_page=100`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          },
          next: { revalidate: 30 },
        }
      );

      if (!response.ok) {
        console.warn(`Failed to fetch issues for ${project}: ${response.status}`);
        return [];
      }

      const issues: GitHubIssue[] = await response.json();
      // Add project info to each issue
      return issues.map(issue => ({
        ...issue,
        project: project,
      }));
    });

    const allIssuesArrays = await Promise.all(issuesPromises);
    const allIssues = allIssuesArrays.flat();
    
    return allIssues.filter(issue => !issue.labels.some(label => label.name === 'duplicate'));
  } catch (error) {
    console.error('Failed to fetch issues:', error);
    return [];
  }
}

export async function fetchRepos(): Promise<GitHubRepo[]> {
  try {
    // Fetch specific projects instead of all repos
    const repoPromises = PROJECTS.map(async (project) => {
      const response = await fetch(
        `https://api.github.com/repos/${OWNER}/${project}`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          },
          next: { revalidate: 60 },
        }
      );

      if (!response.ok) {
        console.warn(`Failed to fetch repo ${project}: ${response.status}`);
        return null;
      }

      return response.json();
    });

    const repos = await Promise.all(repoPromises);
    return repos.filter((repo): repo is GitHubRepo => repo !== null);
  } catch (error) {
    console.error('Failed to fetch repos:', error);
    return [];
  }
}

export async function fetchOpenPRs(repoName: string): Promise<GitHubPR[]> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${OWNER}/${repoName}/pulls?state=open&per_page=100`,
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

    const prs: GitHubPR[] = await response.json();
    return prs;
  } catch (error) {
    console.error(`Failed to fetch PRs for ${repoName}:`, error);
    return [];
  }
}

export async function fetchAllProjectData(): Promise<ProjectData[]> {
  try {
    const repos = await fetchRepos();
    const projectData: ProjectData[] = [];

    for (const repo of repos) {
      const prs = await fetchOpenPRs(repo.name);
      projectData.push({
        repo,
        openPRs: prs.length,
      });
    }

    return projectData;
  } catch (error) {
    console.error('Failed to fetch project data:', error);
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

// Agent role types
export type AgentRole = 'dev' | 'qa-reviewer' | 'gm';

export interface AgentIssues {
  role: AgentRole;
  count: number;
  issues: GitHubIssue[];
}

export function groupIssuesByAgent(issues: GitHubIssue[]): AgentIssues[] {
  const devIssues = issues.filter(i => 
    i.labels.some(l => l.name === 'role:dev')
  );
  const qaIssues = issues.filter(i => 
    i.labels.some(l => l.name === 'role:qa-reviewer')
  );
  const gmIssues = issues.filter(i => 
    i.labels.some(l => l.name === 'role:gm')
  );

  return [
    { role: 'dev', count: devIssues.length, issues: devIssues },
    { role: 'qa-reviewer', count: qaIssues.length, issues: qaIssues },
    { role: 'gm', count: gmIssues.length, issues: gmIssues },
  ];
}

// Filter types
export type StatusFilter = 'all' | 'ready-for-dev' | 'in-progress' | 'blocked' | 'verified' | 'spec-review';
export type PriorityFilter = 'all' | 'high' | 'medium' | 'low';

export interface FilterState {
  project: string;
  agent: AgentRole | 'all';
  status: StatusFilter;
  priority: PriorityFilter;
}

export function filterIssues(issues: GitHubIssue[], filters: FilterState): GitHubIssue[] {
  return issues.filter(issue => {
    // Filter by project
    if (filters.project !== 'all' && issue.project !== filters.project) {
      return false;
    }

    // Filter by agent role
    if (filters.agent !== 'all') {
      const roleLabel = `role:${filters.agent}`;
      if (!issue.labels.some(l => l.name === roleLabel)) {
        return false;
      }
    }

    // Filter by status
    if (filters.status !== 'all') {
      const statusLabels: Record<StatusFilter, string[]> = {
        'all': [],
        'ready-for-dev': ['status:ready-for-dev', 'ready-dev'],
        'in-progress': ['status:in-progress'],
        'blocked': ['status:blocked'],
        'verified': ['status:verified'],
        'spec-review': ['status:spec-review'],
      };
      const requiredLabels = statusLabels[filters.status];
      if (requiredLabels.length > 0 && !issue.labels.some(l => requiredLabels.includes(l.name))) {
        return false;
      }
    }

    // Filter by priority
    if (filters.priority !== 'all') {
      const priorityLabel = `priority:${filters.priority}`;
      if (!issue.labels.some(l => l.name === priorityLabel)) {
        return false;
      }
    }

    return true;
  });
}

export function getPriorityFromLabels(labels: GitHubIssue['labels']): 'high' | 'medium' | 'low' | null {
  if (labels.some(l => l.name === 'priority:high')) return 'high';
  if (labels.some(l => l.name === 'priority:medium')) return 'medium';
  if (labels.some(l => l.name === 'priority:low')) return 'low';
  return null;
}