const GITHUB_API = "https://api.github.com";
const CACHE_TTL = 1000 * 60 * 30;

function readCache(key) {
  try {
    const cached = window.localStorage.getItem(key);
    if (!cached) return null;

    const parsed = JSON.parse(cached);
    if (Date.now() - parsed.timestamp > CACHE_TTL) return null;

    return parsed.value;
  } catch {
    return null;
  }
}

function writeCache(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), value }));
  } catch {
    // Cache is optional.
  }
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { Accept: "application/vnd.github+json" },
  });

  if (!response.ok) {
    throw new Error(`GitHub request failed: ${response.status}`);
  }

  return response.json();
}

function summarizeLanguages(languageMaps) {
  const totals = new Map();

  languageMaps.forEach((languages) => {
    Object.entries(languages).forEach(([name, value]) => {
      totals.set(name, (totals.get(name) ?? 0) + value);
    });
  });

  const totalBytes = Array.from(totals.values()).reduce((sum, value) => sum + value, 0) || 1;

  return Array.from(totals.entries())
    .map(([name, value]) => ({ name, value: Math.round((value / totalBytes) * 100) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);
}

export async function getGithubOverview(username) {
  const cacheKey = `portfolio.github.${username}`;
  const cached = readCache(cacheKey);
  if (cached) return cached;

  const [user, repos, events] = await Promise.all([
    fetchJson(`${GITHUB_API}/users/${username}`),
    fetchJson(`${GITHUB_API}/users/${username}/repos?sort=pushed&per_page=100`),
    fetchJson(`${GITHUB_API}/users/${username}/events/public?per_page=50`),
  ]);

  const relevantRepos = repos
    .filter((repo) => !repo.fork)
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

  const languageMaps = await Promise.all(
    relevantRepos.slice(0, 8).map((repo) => fetchJson(repo.languages_url).catch(() => ({}))),
  );

  const recentCommits = events
    .filter((event) => event.type === "PushEvent")
    .reduce((sum, event) => sum + (event.payload?.commits?.length ?? 0), 0);

  const value = {
    publicRepos: user.public_repos,
    followers: user.followers,
    recentCommits,
    publicEvents: events.length,
    languages: summarizeLanguages(languageMaps),
    recentRepos: relevantRepos.slice(0, 4).map((repo) => ({
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      language: repo.language,
      stars: repo.stargazers_count,
      updatedAt: repo.pushed_at,
    })),
    updatedAt: new Date().toISOString(),
    fromFallback: false,
  };

  writeCache(cacheKey, value);
  return value;
}
