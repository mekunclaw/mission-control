import { NextRequest, NextResponse } from 'next/server';
import { GitHubIssue, GitHubPR, GitHubRepo, PROJECTS } from '@/lib/github';

const OWNER = 'mekunclaw';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function fetchFromGitHub(endpoint: string) {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
  };
  
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
  }

  const response = await fetch(`https://api.github.com${endpoint}`, { headers });
  
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const project = searchParams.get('project');
  const type = searchParams.get('type') || 'issues';

  try {
    const projectsToFetch = project ? [project] : PROJECTS;
    
    switch (type) {
      case 'issues': {
        const issuesPromises = projectsToFetch.map(async (projectName) => {
          const issues: GitHubIssue[] = await fetchFromGitHub(
            `/repos/${OWNER}/${projectName}/issues?state=all&per_page=100`
          );
          // Filter out pull requests
          const filteredIssues = issues.filter(issue => !issue.pull_request);
          return filteredIssues.map(issue => ({ ...issue, project: projectName }));
        });
        
        const allIssuesArrays = await Promise.all(issuesPromises);
        const allIssues = allIssuesArrays.flat();
        
        return NextResponse.json(allIssues);
      }
      
      case 'repos': {
        const repoPromises = projectsToFetch.map(async (projectName) => {
          return fetchFromGitHub(`/repos/${OWNER}/${projectName}`);
        });
        
        const repos = await Promise.all(repoPromises);
        return NextResponse.json(repos);
      }
      
      case 'prs': {
        const prPromises = projectsToFetch.map(async (projectName) => {
          const prs: GitHubPR[] = await fetchFromGitHub(
            `/repos/${OWNER}/${projectName}/pulls?state=open&per_page=100`
          );
          return prs.map(pr => ({ ...pr, project: projectName }));
        });
        
        const allPRsArrays = await Promise.all(prPromises);
        const allPRs = allPRsArrays.flat();
        
        return NextResponse.json(allPRs);
      }
      
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from GitHub' },
      { status: 500 }
    );
  }
}
