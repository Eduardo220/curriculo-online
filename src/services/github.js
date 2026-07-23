const GITHUB_API = "https://api.github.com";
const CACHE_TTL = 1000 * 60 * 30;
const REQUEST_TIMEOUT = 8000;
const CACHE_VERSION = "v3";

function readCache(key, allowExpired = false) {
  if (typeof window === "undefined") return null;

  try {
    const cached = window.localStorage.getItem(key);
    if (!cached) return null;

    const parsed = JSON.parse(cached);
    const expired = Date.now() - parsed.timestamp > CACHE_TTL;
    if (expired && !allowExpired) return null;

    return parsed.value;
  } catch {
    return null;
  }
}

function writeCache(key, value) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      key,
      JSON.stringify({ timestamp: Date.now(), value }),
    );
  } catch {
    // A ausência de cache não pode impedir a seção de funcionar.
  }
}

async function fetchJson(url, signal) {
  const response = await fetch(url, {
    headers: { Accept: "application/vnd.github+json" },
    signal,
  });

  if (!response.ok) {
    const rateLimited =
      response.status === 403 &&
      response.headers.get("x-ratelimit-remaining") === "0";
    throw new Error(rateLimited ? "github_rate_limit" : `github_${response.status}`);
  }

  return response.json();
}

export function selectRelevantRepos(repos, selectedNames = []) {
  if (!Array.isArray(repos)) return [];

  const order = new Map(
    selectedNames.map((name, index) => [name.toLowerCase(), index]),
  );

  return repos
    .filter(
      (repo) =>
        repo &&
        !repo.fork &&
        !repo.archived &&
        order.has(String(repo.name).toLowerCase()),
    )
    .sort(
      (a, b) =>
        order.get(String(a.name).toLowerCase()) -
        order.get(String(b.name).toLowerCase()),
    );
}

export function summarizeLanguages(languageMaps) {
  const totals = new Map();

  languageMaps.forEach((languages) => {
    if (!languages || typeof languages !== "object") return;
    Object.entries(languages).forEach(([name, value]) => {
      const bytes = Number(value);
      if (!Number.isFinite(bytes) || bytes <= 0) return;
      totals.set(name, (totals.get(name) ?? 0) + bytes);
    });
  });

  const totalBytes = Array.from(totals.values()).reduce(
    (sum, value) => sum + value,
    0,
  );
  if (!totalBytes) return [];

  return Array.from(totals.entries())
    .map(([name, value]) => ({
      name,
      value: Math.round((value / totalBytes) * 100),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}

function normalizeRepo(repo) {
  return {
    name: String(repo.name ?? ""),
    description: repo.description ? String(repo.description) : null,
    url: String(repo.html_url ?? ""),
    language: repo.language ? String(repo.language) : null,
    stars: Number.isFinite(Number(repo.stargazers_count))
      ? Number(repo.stargazers_count)
      : null,
    updatedAt: repo.pushed_at ?? null,
  };
}

export async function getGithubOverview(
  username,
  selectedNames,
  externalSignal,
) {
  const cacheKey = `portfolio.github.${CACHE_VERSION}.${username}`;
  const cached = readCache(cacheKey);
  if (cached) return cached;

  const controller = new AbortController();
  const timeoutId = window.setTimeout(
    () => controller.abort(new Error("github_timeout")),
    REQUEST_TIMEOUT,
  );
  const abortFromExternal = () =>
    controller.abort(externalSignal?.reason ?? new Error("github_aborted"));

  if (externalSignal) {
    if (externalSignal.aborted) abortFromExternal();
    else externalSignal.addEventListener("abort", abortFromExternal, { once: true });
  }

  try {
    const encodedUsername = encodeURIComponent(username);
    const rateLimit = await fetchJson(
      `${GITHUB_API}/rate_limit`,
      controller.signal,
    );
    const remaining = Number(rateLimit?.resources?.core?.remaining);
    const requiredRequests = 2 + selectedNames.length;

    if (Number.isFinite(remaining) && remaining < requiredRequests) {
      throw new Error("github_rate_limit");
    }

    const [user, repos] = await Promise.all([
      fetchJson(`${GITHUB_API}/users/${encodedUsername}`, controller.signal),
      fetchJson(
        `${GITHUB_API}/users/${encodedUsername}/repos?sort=pushed&per_page=100`,
        controller.signal,
      ),
    ]);

    const relevantRepos = selectRelevantRepos(repos, selectedNames);
    const languageResults = await Promise.allSettled(
      relevantRepos.map((repo) => fetchJson(repo.languages_url, controller.signal)),
    );
    const languageMaps = languageResults
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);

    const value = {
      publicRepos: Number.isFinite(Number(user?.public_repos))
        ? Number(user.public_repos)
        : null,
      followers: Number.isFinite(Number(user?.followers))
        ? Number(user.followers)
        : null,
      languages: summarizeLanguages(languageMaps),
      recentRepos: relevantRepos.map(normalizeRepo),
      updatedAt: new Date().toISOString(),
      fromFallback: false,
      fromStaleCache: false,
    };

    writeCache(cacheKey, value);
    return value;
  } catch (error) {
    const staleCache = readCache(cacheKey, true);
    if (staleCache && !externalSignal?.aborted) {
      return { ...staleCache, fromStaleCache: true };
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
    externalSignal?.removeEventListener("abort", abortFromExternal);
  }
}
