import assert from "node:assert/strict";
import test from "node:test";
import { selectRelevantRepos, summarizeLanguages } from "./github.js";

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
