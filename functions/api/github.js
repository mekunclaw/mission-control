// Cloudflare Pages Function - GitHub API Proxy
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const project = url.searchParams.get('project');
  const type = url.searchParams.get('type') || 'issues';
  
  const OWNER = 'mekunclaw';
  const GITHUB_TOKEN = env.GITHUB_TOKEN;
  const PROJECTS = ['mission-control', 'card-buff', 'shelf-count'];

  async function fetchFromGitHub(endpoint) {
    const headers = {
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

  try {
    const projectsToFetch = project ? [project] : PROJECTS;
    
    switch (type) {
      case 'issues': {
        const issuesPromises = projectsToFetch.map(async (projectName) => {
          const issues = await fetchFromGitHub(
            `/repos/${OWNER}/${projectName}/issues?state=all&per_page=100`
          );
          const filteredIssues = issues.filter(issue => !issue.pull_request);
          return filteredIssues.map(issue => ({ ...issue, project: projectName }));
        });
        
        const allIssuesArrays = await Promise.all(issuesPromises);
        const allIssues = allIssuesArrays.flat();
        
        return new Response(JSON.stringify(allIssues), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      case 'repos': {
        const repoPromises = projectsToFetch.map(async (projectName) => {
          return fetchFromGitHub(`/repos/${OWNER}/${projectName}`);
        });
        
        const repos = await Promise.all(repoPromises);
        return new Response(JSON.stringify(repos), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      case 'prs': {
        const prPromises = projectsToFetch.map(async (projectName) => {
          const prs = await fetchFromGitHub(
            `/repos/${OWNER}/${projectName}/pulls?state=open&per_page=100`
          );
          return prs.map(pr => ({ ...pr, project: projectName }));
        });
        
        const allPRsArrays = await Promise.all(prPromises);
        const allPRs = allPRsArrays.flat();
        
        return new Response(JSON.stringify(allPRs), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      default:
        return new Response(JSON.stringify({ error: 'Invalid type' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch data from GitHub' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
