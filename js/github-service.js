/**
 * github-service.js — live GitHub metadata with a local-first fallback.
 *
 * Design constraints (Review Notes #4):
 *  - Unauthenticated api.github.com calls are capped at 60/hr per client IP,
 *    so successful responses are cached in localStorage with a short TTL
 *    before ever re-hitting the network.
 *  - Never blocks first paint: the static registry in projects-data.js
 *    already has everything needed to render; this only *adds* live
 *    stars/forks/pushed-date on top, and fails silently (console.info, not
 *    console.error) if the API is unreachable or rate-limited.
 *  - Private repos (isPrivate: true) are skipped entirely — there is no
 *    client-side credential to authenticate with, by design.
 */

const API_BASE = "https://api.github.com/repos/emiliorl";
const CACHE_PREFIX = "portfolio:gh-cache:";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function readCache(repoName) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + repoName);
    if (!raw) return null;
    const entry = JSON.parse(raw);
    if (Date.now() - entry.cachedAt > CACHE_TTL_MS) return null;
    return entry.data;
  } catch {
    return null; // storage unavailable/blocked — just skip caching
  }
}

function writeCache(repoName, data) {
  try {
    localStorage.setItem(
      CACHE_PREFIX + repoName,
      JSON.stringify({ cachedAt: Date.now(), data })
    );
  } catch {
    /* storage full or blocked — non-fatal, live sync still worked this load */
  }
}

async function fetchRepoMeta(repoName) {
  const cached = readCache(repoName);
  if (cached) return cached;

  try {
    const res = await fetch(`${API_BASE}/${repoName}`, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const json = await res.json();
    const data = {
      stars: json.stargazers_count,
      forks: json.forks_count,
      pushedAt: json.pushed_at,
    };
    writeCache(repoName, data);
    return data;
  } catch (err) {
    console.info(`[github-service] live sync skipped for ${repoName}:`, err.message);
    return null;
  }
}

/**
 * Hydrates a list of project objects in place with `.liveMeta` once
 * resolved, then invokes `onUpdate(project)` per project so the caller can
 * re-render just that card. Never awaited by the caller — fire and forget.
 */
export function hydrateProjectsWithGitHubData(projectList, onUpdate) {
  for (const project of projectList) {
    if (project.isPrivate || !project.github) continue;
    const repoName = project.github.split("/").pop();
    fetchRepoMeta(repoName).then((meta) => {
      if (!meta) return;
      project.liveMeta = meta;
      onUpdate?.(project);
    });
  }
}
