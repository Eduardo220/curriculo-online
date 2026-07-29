import assert from "node:assert/strict";
import test from "node:test";
import {
  connectLenisToGsap,
  resolveLenisOptions,
  shouldEnableLenis,
} from "./lenis.js";

const highPerformance = {
  quality: "high",
  reducedMotion: false,
  isTouch: false,
};

test("mantém RAF externo e mescla configuração de âncoras", () => {
  const options = resolveLenisOptions({
    autoRaf: true,
    duration: 0.7,
    anchors: { offset: -72 },
  });

  assert.equal(options.autoRaf, false);
  assert.equal(options.duration, 0.7);
  assert.equal(options.anchors.offset, -72);
  assert.equal(typeof options.anchors.easing, "function");
  assert.equal(resolveLenisOptions({ anchors: false }).anchors, false);
});

test("habilita Lenis somente em modos adequados", () => {
  assert.equal(shouldEnableLenis(highPerformance), true);
  assert.equal(
    shouldEnableLenis({ ...highPerformance, quality: "low" }),
    false,
  );
  assert.equal(
    shouldEnableLenis({ ...highPerformance, reducedMotion: true }),
    false,
  );
  assert.equal(
    shouldEnableLenis({ ...highPerformance, quality: "unknown" }),
    false,
  );
  assert.equal(
    shouldEnableLenis({ ...highPerformance, isTouch: true }),
    false,
  );
  assert.equal(
    shouldEnableLenis(
      { ...highPerformance, isTouch: true },
      { allowTouch: true },
    ),
    true,
  );
});

test("conecta um único ticker ao GSAP e limpa listeners de forma idempotente", () => {
  const listeners = new Map();
  const tickerCallbacks = new Set();
  const renderedTimes = [];
  let updates = 0;
  let lagSmoothingValue;

  const lenis = {
    on: (event, listener) => listeners.set(event, listener),
    off: (event, listener) => {
      if (listeners.get(event) === listener) listeners.delete(event);
    },
    raf: (time) => renderedTimes.push(time),
  };
  const gsapInstance = {
    ticker: {
      add: (listener) => tickerCallbacks.add(listener),
      remove: (listener) => tickerCallbacks.delete(listener),
      lagSmoothing: (value) => {
        lagSmoothingValue = value;
      },
    },
  };
  const disconnect = connectLenisToGsap(lenis, {
    gsapInstance,
    scrollTrigger: { update: () => updates++ },
  });

  listeners.get("scroll")();
  tickerCallbacks.values().next().value(1.25);
  assert.equal(updates, 1);
  assert.deepEqual(renderedTimes, [1250]);
  assert.equal(lagSmoothingValue, 0);

  disconnect();
  disconnect();
  assert.equal(listeners.size, 0);
  assert.equal(tickerCallbacks.size, 0);
});
