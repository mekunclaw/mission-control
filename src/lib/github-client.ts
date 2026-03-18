import { GitHubIssue, GitHubPR, GitHubRepo, ProjectData } from './github';
export * from './github';

// Client-side fetch functions that use the API route
export async function fetchIssues(project?: string): Promise<GitHubIssue[]> {
  try {
    const url = project 
      ? `/api/github?type=issues&project=${project}`
      : '/api/github?type=issues';
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const issues: GitHubIssue[] = await response.json();
    return issues.filter(issue => !issue.labels.some(label => label.name === 'duplicate'));
  } catch (error) {
    console.error('Failed to fetch issues:', error);
    return [];
  }
}

export async function fetchRepos(): Promise<GitHubRepo[]> {
  try {
    const response = await fetch('/api/github?type=repos');
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const repos = await response.json();
    return repos.filter((repo: GitHubRepo | null) => repo !== null);
  } catch (error) {
    console.error('Failed to fetch repos:', error);
    return [];
  }
}

export async function fetchOpenPRs(repoName: string): Promise<GitHubPR[]> {
  try {
    const response = await fetch(`/api/github?type=prs&project=${repoName}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const prs: GitHubPR[] = await response.json();
    return prs.map(pr => ({ ...pr, project: repoName }));
  } catch (error) {
    console.error(`Failed to fetch PRs for ${repoName}:`, error);
    return [];
  }
}

export async function fetchAllOpenPRs(): Promise<GitHubPR[]> {
  try {
    const response = await fetch('/api/github?type=prs');
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const prs: GitHubPR[] = await response.json();
    return prs;
  } catch (error) {
    console.error('Failed to fetch all PRs:', error);
    return [];
  }
}

export async function fetchAllProjectData(): Promise<ProjectData[]> {
  try {
    const [repos, allIssues, allPRs] = await Promise.all([
      fetchRepos(),
      fetchIssues(),
      fetchAllOpenPRs(),
    ]);
    
    const projectData: ProjectData[] = [];

    for (const repo of repos) {
      const repoIssues = allIssues.filter(i => i.project === repo.name);
      const repoPRs = allPRs.filter(pr => pr.project === repo.name);
      
      // Calculate phase progress
      const phase1Issues = repoIssues.filter(i => 
        i.labels.some(l => l.name.includes('phase:1') || l.name.includes('phase:1-mvp'))
      ).length;
      const phase2Issues = repoIssues.filter(i => 
        i.labels.some(l => l.name.includes('phase:2') || l.name.includes('phase:2-prod'))
      ).length;
      const phase3Issues = repoIssues.filter(i => 
        i.labels.some(l => l.name.includes('phase:3') || l.name.includes('phase:3-prod'))
      ).length;
      const totalIssues = repoIssues.length;
      
      projectData.push({
        repo,
        openPRs: repoPRs.length,
        openIssues: repoIssues.filter(i => i.state === 'open'),
        prs: repoPRs,
        phaseProgress: {
          phase1: phase1Issues,
          phase2: phase2Issues,
          phase3: phase3Issues,
          total: totalIssues,
        },
      });
    }

    return projectData;
  } catch (error) {
    console.error('Failed to fetch project data:', error);
    return [];
  }
}
