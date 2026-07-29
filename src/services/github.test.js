import assert from "node:assert/strict";
import test from "node:test";
import {
  getGithubOverview,
  selectRelevantRepos,
  summarizeLanguages,
} from "./github.js";

function installGithubRequestHarness(cachedValue = null) {
  const previousWindow = globalThis.window;
  const previousFetch = globalThis.fetch;

  globalThis.window = {
    localStorage: {
      getItem: () => cachedValue,
      setItem: () => {},
    },
    setTimeout,
    clearTimeout,
  };
  globalThis.fetch = async () => ({
    ok: false,
    status: 503,
    headers: { get: () => null },
  });

  return () => {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;

    if (previousFetch === undefined) delete globalThis.fetch;
    else globalThis.fetch = previousFetch;
  };
}

test("seleciona apenas repositórios públicos relevantes na ordem editorial", () => {
  const repos = [
    { name: "curriculo-online", fork: false, archived: false },
    { name: "antigo", fork: false, archived: false },
    { name: "wayper", fork: false, archived: false },
    { name: "Banco_Laravel", fork: true, archived: false },
  ];

  const selected = selectRelevantRepos(repos, [
    "wayper",
    "Banco_Laravel",
    "curriculo-online",
  ]);

  assert.deepEqual(
    selected.map((repo) => repo.name),
    ["wayper", "curriculo-online"],
  );
});

test("resume linguagens ignorando mapas vazios e valores inválidos", () => {
  const languages = summarizeLanguages([
    { JavaScript: 300, CSS: 100 },
    { PHP: 400, JavaScript: 100 },
    null,
    { Markdown: 0 },
  ]);

  assert.deepEqual(languages, [
    { name: "JavaScript", value: 44 },
    { name: "PHP", value: 44 },
    { name: "CSS", value: 11 },
  ]);
});

test("retorna lista vazia quando a API não entrega dados utilizáveis", () => {
  assert.deepEqual(selectRelevantRepos(null, ["wayper"]), []);
  assert.deepEqual(summarizeLanguages([{}, null]), []);
});

test("propaga falha da API quando não existe cache utilizável", async () => {
  const restore = installGithubRequestHarness();

  try {
    await assert.rejects(
      getGithubOverview("Eduardo220", ["wayper"], new AbortController().signal),
      /github_503/,
    );
  } finally {
    restore();
  }
});

test("usa cache expirado como fallback quando a API falha", async () => {
  const cachedOverview = {
    publicRepos: 2,
    followers: 1,
    languages: [{ name: "JavaScript", value: 100 }],
    recentRepos: [],
    updatedAt: "2026-01-01T00:00:00.000Z",
    fromFallback: false,
    fromStaleCache: false,
  };
  const restore = installGithubRequestHarness(
    JSON.stringify({ timestamp: 0, value: cachedOverview }),
  );

  try {
    const overview = await getGithubOverview(
      "Eduardo220",
      ["wayper"],
      new AbortController().signal,
    );

    assert.deepEqual(overview, {
      ...cachedOverview,
      fromStaleCache: true,
    });
  } finally {
    restore();
  }
});
