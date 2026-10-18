export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  updated_at: string;
  topics: string[];
}

export interface SearchResult {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepo[];
}

export async function searchRepos(query: string, sort: string = 'stars', page: number = 1, language: string = ''): Promise<SearchResult> {
  if (!query) return { total_count: 0, incomplete_results: false, items: [] };

  let q = encodeURIComponent(query);
  if (language) {
    q += `+language:${encodeURIComponent(language)}`;
  }

  const response = await fetch(
    `https://api.github.com/search/repositories?q=${q}&sort=${sort}&page=${page}&per_page=12`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch repositories');
  }

  return response.json();
}
