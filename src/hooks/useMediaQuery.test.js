import assert from "node:assert/strict";
import test from "node:test";
import { getMediaQueryMatch } from "./useMediaQuery.js";
import { REDUCED_MOTION_QUERY } from "./useReducedMotion.js";

test("lê a preferência de mídia usando matchMedia", () => {
  const queries = [];
  const windowRef = {
    matchMedia: (query) => {
      queries.push(query);
      return { matches: true };
    },
  };

  assert.equal(getMediaQueryMatch(REDUCED_MOTION_QUERY, false, windowRef), true);
  assert.deepEqual(queries, ["(prefers-reduced-motion: reduce)"]);
});

test("usa fallback quando matchMedia não existe ou rejeita a consulta", () => {
  assert.equal(getMediaQueryMatch("(pointer: fine)", true, {}), true);
  assert.equal(
    getMediaQueryMatch("consulta inválida", false, {
      matchMedia: () => {
        throw new TypeError("invalid query");
      },
    }),
    false,
  );
});
