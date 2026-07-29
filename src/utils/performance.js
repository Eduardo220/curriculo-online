export const PERFORMANCE_QUALITIES = Object.freeze([
  "high",
  "medium",
  "low",
  "reduced",
]);

const CONNECTIONS_WITH_LIMITED_BANDWIDTH = new Set(["slow-2g", "2g"]);
const webglSupportCache = new WeakMap();

function finitePositive(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

export function clampDevicePixelRatio(value, maximum = 2) {
  const ratio = finitePositive(value) ?? 1;
  const cap = finitePositive(maximum) ?? 2;
  return Math.min(Math.max(ratio, 1), cap);
}

export function summarizeFrameDurations(durations) {
  if (!Array.isArray(durations)) return null;

  const validDurations = durations
    .map(Number)
    .filter((duration) => Number.isFinite(duration) && duration >= 4 && duration <= 100)
    .sort((left, right) => left - right);
  if (!validDurations.length) return null;

  const trim = validDurations.length >= 10 ? Math.floor(validDurations.length * 0.1) : 0;
  const trimmedDurations = validDurations.slice(
    trim,
    trim ? validDurations.length - trim : undefined,
  );
  const average =
    trimmedDurations.reduce((total, duration) => total + duration, 0) /
    trimmedDurations.length;
  const percentileIndex = Math.min(
    validDurations.length - 1,
    Math.floor(validDurations.length * 0.9),
  );

  return {
    averageFrameTime: average,
    p90FrameTime: validDurations[percentileIndex],
    approximateFps: Math.round(1000 / average),
    samples: validDurations.length,
  };
}

export function measureFramePerformance({
  windowRef = globalThis.window,
  documentRef = globalThis.document,
  sampleSize = 36,
  signal,
} = {}) {
  return new Promise((resolve) => {
    if (!windowRef?.requestAnimationFrame) {
      resolve(null);
      return;
    }

    const targetSamples = Math.max(12, Math.min(120, Number(sampleSize) || 36));
    const durations = [];
    let previousTime = null;
    let animationFrame = 0;
    let settled = false;

    const finish = (result) => {
      if (settled) return;
      settled = true;
      if (animationFrame) windowRef.cancelAnimationFrame?.(animationFrame);
      signal?.removeEventListener?.("abort", handleAbort);
      resolve(result);
    };

    const handleAbort = () => finish(null);

    if (signal?.aborted) {
      finish(null);
      return;
    }
    signal?.addEventListener?.("abort", handleAbort, { once: true });

    const sample = (time) => {
      if (settled) return;
      if (documentRef?.hidden) {
        previousTime = null;
        animationFrame = windowRef.requestAnimationFrame(sample);
        return;
      }

      if (previousTime !== null) durations.push(time - previousTime);
      previousTime = time;

      if (durations.length >= targetSamples) {
        finish(summarizeFrameDurations(durations));
        return;
      }

      animationFrame = windowRef.requestAnimationFrame(sample);
    };

    try {
      animationFrame = windowRef.requestAnimationFrame(sample);
    } catch {
      finish(null);
    }
  });
}

export function detectWebGLSupport(documentRef = globalThis.document) {
  if (!documentRef?.createElement) return false;

  try {
    const canvas = documentRef.createElement("canvas");
    if (!canvas?.getContext) return false;
    const context =
      canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ||
      canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true }) ||
      canvas.getContext("experimental-webgl");
    if (!context) return false;

    context.getExtension?.("WEBGL_lose_context")?.loseContext?.();
    return true;
  } catch {
    return false;
  }
}

export function getWebGLSupport(documentRef = globalThis.document) {
  if (
    !documentRef ||
    (typeof documentRef !== "object" && typeof documentRef !== "function")
  ) {
    return false;
  }
  if (webglSupportCache.has(documentRef)) {
    return webglSupportCache.get(documentRef);
  }

  const supported = detectWebGLSupport(documentRef);
  webglSupportCache.set(documentRef, supported);
  return supported;
}

export function readPerformanceSignals({
  windowRef = globalThis.window,
  navigatorRef = globalThis.navigator,
  documentRef = globalThis.document,
} = {}) {
  const connection =
    navigatorRef?.connection ||
    navigatorRef?.mozConnection ||
    navigatorRef?.webkitConnection;
  let coarsePointer;

  try {
    coarsePointer = Boolean(
      windowRef?.matchMedia?.("(hover: none), (pointer: coarse)").matches,
    );
  } catch {
    coarsePointer = false;
  }

  return {
    webgl: getWebGLSupport(documentRef),
    dpr: finitePositive(windowRef?.devicePixelRatio) ?? 1,
    isTouch:
      coarsePointer ||
      (finitePositive(navigatorRef?.maxTouchPoints) ?? 0) > 0,
    hardwareConcurrency: finitePositive(navigatorRef?.hardwareConcurrency),
    deviceMemory: finitePositive(navigatorRef?.deviceMemory),
    saveData: Boolean(connection?.saveData),
    effectiveType: connection?.effectiveType ?? null,
  };
}

export function getPerformanceProfile({
  reducedMotion = false,
  webgl = false,
  isTouch = false,
  dpr = 1,
  hardwareConcurrency = null,
  deviceMemory = null,
  saveData = false,
  effectiveType = null,
  averageFrameTime = null,
} = {}) {
  const touch = Boolean(isTouch);

  if (reducedMotion) {
    return {
      quality: "reduced",
      webgl: false,
      reducedMotion: true,
      isTouch: touch,
      dpr: 1,
    };
  }

  const cores = finitePositive(hardwareConcurrency);
  const memory = finitePositive(deviceMemory);
  const pixelRatio = finitePositive(dpr) ?? 1;
  const limitedConnection = CONNECTIONS_WITH_LIMITED_BANDWIDTH.has(
    String(effectiveType).toLowerCase(),
  );
  let constraintScore = 0;

  if (saveData) constraintScore += 2;
  if (limitedConnection) constraintScore += 2;
  if (touch) constraintScore += 1;
  if (pixelRatio > 2) constraintScore += 1;
  if (cores !== null) constraintScore += cores <= 2 ? 2 : cores <= 4 ? 1 : 0;
  if (memory !== null) constraintScore += memory <= 2 ? 2 : memory <= 4 ? 1 : 0;
  const measuredFrameTime = finitePositive(averageFrameTime);
  if (measuredFrameTime !== null) {
    constraintScore +=
      measuredFrameTime >= 30 ? 2 : measuredFrameTime >= 20 ? 1 : 0;
  }

  const severelyConstrained = !webgl || constraintScore >= 3;

  if (severelyConstrained) {
    return {
      quality: "low",
      webgl: false,
      reducedMotion: false,
      isTouch: touch,
      dpr: 1,
    };
  }

  const moderatelyConstrained = constraintScore > 0;

  if (moderatelyConstrained) {
    return {
      quality: "medium",
      webgl: true,
      reducedMotion: false,
      isTouch: touch,
      dpr: clampDevicePixelRatio(dpr, 1.5),
    };
  }

  return {
    quality: "high",
    webgl: true,
    reducedMotion: false,
    isTouch: touch,
    dpr: clampDevicePixelRatio(dpr, 2),
  };
}

export function performanceSignalsEqual(left, right) {
  if (left === right) return true;
  if (!left || !right) return false;

  return (
    left.webgl === right.webgl &&
    left.dpr === right.dpr &&
    left.isTouch === right.isTouch &&
    left.hardwareConcurrency === right.hardwareConcurrency &&
    left.deviceMemory === right.deviceMemory &&
    left.saveData === right.saveData &&
    left.effectiveType === right.effectiveType
  );
}
