import assert from "node:assert/strict";
import test from "node:test";
import {
  DEMO_ROUTE,
  clamp01,
  createRouteSamples,
  getPolygonArea,
  getVisibleRoute,
  isOrthogonalRoute,
  isRouteClosed,
  sampleRoute,
} from "./wayperRoute.js";

test("clamp01 mantém o progresso da rota em um intervalo seguro", () => {
  assert.equal(clamp01(-2), 0);
  assert.equal(clamp01(0.42), 0.42);
  assert.equal(clamp01(4), 1);
  assert.equal(clamp01(Number.NaN), 0);
});

test("sampleRoute interpola a rota e preserva os extremos", () => {
  const route = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
  ];

  assert.deepEqual(sampleRoute(route, 0), route[0]);
  assert.deepEqual(sampleRoute(route, 0.25), { x: 0.5, y: 0 });
  assert.deepEqual(sampleRoute(route, 0.75), { x: 1, y: 0.5 });
  assert.deepEqual(sampleRoute(route, 1), route[2]);
});

test("getVisibleRoute acrescenta somente o trecho percorrido", () => {
  const route = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
  ];

  assert.deepEqual(getVisibleRoute(route, 0), [{ x: 0, y: 0 }]);
  assert.deepEqual(getVisibleRoute(route, 0.25), [
    { x: 0, y: 0 },
    { x: 0.5, y: 0 },
  ]);
  assert.deepEqual(getVisibleRoute(route, 1), route);
});

test("a rota demonstrativa fecha uma região estável com área positiva", () => {
  assert.equal(isRouteClosed(DEMO_ROUTE), true);
  assert.equal(isOrthogonalRoute(DEMO_ROUTE), true);
  assert.ok(getPolygonArea(DEMO_ROUTE) > 0.2);

  const samples = createRouteSamples(DEMO_ROUTE, 64);
  assert.equal(samples.length, 64);
  assert.deepEqual(samples[0], DEMO_ROUTE[0]);
  assert.deepEqual(samples.at(-1), DEMO_ROUTE.at(-1));
});

test("isOrthogonalRoute rejeita diagonais e segmentos sem comprimento", () => {
  assert.equal(
    isOrthogonalRoute([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ]),
    true,
  );
  assert.equal(
    isOrthogonalRoute([
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ]),
    false,
  );
  assert.equal(
    isOrthogonalRoute([
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ]),
    false,
  );
});
