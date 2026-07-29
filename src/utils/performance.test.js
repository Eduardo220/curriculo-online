import assert from "node:assert/strict";
import test from "node:test";
import {
  clampDevicePixelRatio,
  detectWebGLSupport,
  getPerformanceProfile,
  measureFramePerformance,
  performanceSignalsEqual,
  readPerformanceSignals,
  summarizeFrameDurations,
} from "./performance.js";

test("prioriza movimento reduzido e desliga WebGL", () => {
  assert.deepEqual(
    getPerformanceProfile({
      reducedMotion: true,
      webgl: true,
      isTouch: true,
      dpr: 3,
      hardwareConcurrency: 16,
      deviceMemory: 16,
    }),
    {
      quality: "reduced",
      webgl: false,
      reducedMotion: true,
      isTouch: true,
      dpr: 1,
    },
  );
});

test("classifica economia de dados e hardware severamente limitado como low", () => {
  const saveData = getPerformanceProfile({
    webgl: true,
    saveData: true,
    isTouch: true,
    hardwareConcurrency: 12,
    deviceMemory: 16,
  });
  const limitedHardware = getPerformanceProfile({
    webgl: true,
    hardwareConcurrency: 2,
    deviceMemory: 2,
  });

  assert.equal(saveData.quality, "low");
  assert.equal(saveData.webgl, false);
  assert.equal(limitedHardware.quality, "low");
  assert.equal(limitedHardware.dpr, 1);
});

test("limita touch a medium e preserva high em dispositivos capazes", () => {
  const touch = getPerformanceProfile({
    webgl: true,
    isTouch: true,
    dpr: 3,
    hardwareConcurrency: 8,
    deviceMemory: 8,
  });
  const desktop = getPerformanceProfile({
    webgl: true,
    dpr: 2,
    hardwareConcurrency: 8,
    deviceMemory: 8,
  });

  assert.deepEqual(touch, {
    quality: "medium",
    webgl: true,
    reducedMotion: false,
    isTouch: true,
    dpr: 1.5,
  });
  assert.equal(desktop.quality, "high");
  assert.equal(desktop.dpr, 2);
});

test("não bloqueia um dispositivo por uma única heurística de hardware", () => {
  const profile = getPerformanceProfile({
    webgl: true,
    dpr: 1,
    hardwareConcurrency: 2,
    deviceMemory: 8,
  });

  assert.equal(profile.quality, "medium");
  assert.equal(profile.webgl, true);
});

test("resume tempo de frame sem deixar outliers dominarem a classificação", () => {
  const durations = [...Array(18).fill(16), 80, 95];
  const summary = summarizeFrameDurations(durations);

  assert.equal(summary.samples, 20);
  assert.ok(summary.averageFrameTime < 20);
  assert.ok(summary.approximateFps >= 50);
  assert.equal(
    getPerformanceProfile({
      webgl: true,
      dpr: 3,
      hardwareConcurrency: 8,
      deviceMemory: 8,
      averageFrameTime: 31,
    }).quality,
    "low",
  );
});

test("mede uma amostra curta de frames e permite cancelamento", async () => {
  const callbacks = new Map();
  let frameId = 0;
  const windowRef = {
    requestAnimationFrame: (callback) => {
      frameId += 1;
      callbacks.set(frameId, callback);
      return frameId;
    },
    cancelAnimationFrame: (id) => callbacks.delete(id),
  };
  const measurementPromise = measureFramePerformance({
    windowRef,
    documentRef: { hidden: false },
    sampleSize: 12,
  });

  for (let index = 0; index <= 12; index += 1) {
    const [id, callback] = callbacks.entries().next().value;
    callbacks.delete(id);
    callback(index * 16);
  }

  const measurement = await measurementPromise;
  assert.equal(measurement.samples, 12);
  assert.equal(measurement.averageFrameTime, 16);
  assert.equal(measurement.approximateFps, 63);

  const controller = new AbortController();
  const cancelled = measureFramePerformance({
    windowRef,
    documentRef: { hidden: false },
    signal: controller.signal,
  });
  controller.abort();
  assert.equal(await cancelled, null);
  assert.equal(callbacks.size, 0);
});

test("detecta WebGL e lê sinais do ambiente de forma defensiva", () => {
  const context = {};
  let canvasCount = 0;
  const documentRef = {
    createElement: () => {
      canvasCount += 1;
      return {
        getContext: (type) => (type === "webgl2" ? context : null),
      };
    },
  };
  const signals = readPerformanceSignals({
    documentRef,
    windowRef: {
      devicePixelRatio: 2.5,
      matchMedia: () => ({ matches: true }),
    },
    navigatorRef: {
      hardwareConcurrency: 8,
      deviceMemory: 4,
      maxTouchPoints: 0,
      connection: { saveData: true, effectiveType: "4g" },
    },
  });

  assert.equal(detectWebGLSupport(documentRef), true);
  readPerformanceSignals({ documentRef, windowRef: {}, navigatorRef: {} });
  assert.equal(canvasCount, 2);
  assert.deepEqual(signals, {
    webgl: true,
    dpr: 2.5,
    isTouch: true,
    hardwareConcurrency: 8,
    deviceMemory: 4,
    saveData: true,
    effectiveType: "4g",
  });
  assert.equal(clampDevicePixelRatio(4, 1.5), 1.5);
  assert.equal(performanceSignalsEqual(signals, { ...signals }), true);
});
