import assert from "node:assert/strict";
import test from "node:test";
import { easeOutQuart } from "./easings.js";
import {
  createRevealVariants,
  getMotionTransition,
} from "./motionConfig.js";

test("easeOutQuart mantém valores dentro do intervalo normalizado", () => {
  assert.equal(easeOutQuart(-1), 0);
  assert.equal(easeOutQuart(0), 0);
  assert.equal(easeOutQuart(1), 1);
  assert.equal(easeOutQuart(2), 1);
  assert.ok(easeOutQuart(0.5) > 0.5);
});

test("cria variantes de entrada previsíveis por eixo", () => {
  const variants = createRevealVariants({ axis: "x", distance: 18, delay: 0.2 });

  assert.deepEqual(variants.hidden, { opacity: 0, x: 18 });
  assert.equal(variants.visible.x, 0);
  assert.equal(variants.visible.y, 0);
  assert.equal(variants.visible.transition.delay, 0.2);
});

test("remove duração quando movimento reduzido está ativo", () => {
  assert.deepEqual(getMotionTransition(true, { delay: 4 }), { duration: 0 });
  assert.equal(getMotionTransition(false, { delay: 0.1 }).delay, 0.1);
});
