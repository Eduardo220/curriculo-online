const freezePoint = ([x, y]) => Object.freeze({ x, y });

export const DEMO_ROUTE = Object.freeze(
  [
    [0.2, 0.65],
    [0.2, 0.34],
    [0.4, 0.34],
    [0.4, 0.24],
    [0.6, 0.24],
    [0.6, 0.34],
    [0.8, 0.34],
    [0.8, 0.55],
    [0.6, 0.55],
    [0.6, 0.76],
    [0.4, 0.76],
    [0.4, 0.65],
    [0.2, 0.65],
  ].map(freezePoint),
);

export function clamp01(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

export function sampleRoute(points = DEMO_ROUTE, progress = 0) {
  if (!Array.isArray(points) || points.length === 0) return null;
  if (points.length === 1) return { ...points[0] };

  const position = clamp01(progress) * (points.length - 1);
  const startIndex = Math.min(Math.floor(position), points.length - 2);
  const localProgress = position - startIndex;
  const start = points[startIndex];
  const end = points[startIndex + 1];

  return {
    x: start.x + (end.x - start.x) * localProgress,
    y: start.y + (end.y - start.y) * localProgress,
  };
}

export function getVisibleRoute(points = DEMO_ROUTE, progress = 0) {
  if (!Array.isArray(points) || points.length === 0) return [];
  if (points.length === 1) return [{ ...points[0] }];

  const position = clamp01(progress) * (points.length - 1);
  const wholeSegments = Math.floor(position);
  const visible = points
    .slice(0, Math.min(wholeSegments + 1, points.length))
    .map((point) => ({ ...point }));

  if (wholeSegments < points.length - 1 && position > wholeSegments) {
    visible.push(sampleRoute(points, progress));
  }

  return visible;
}

export function isRouteClosed(points = DEMO_ROUTE, tolerance = 0.001) {
  if (!Array.isArray(points) || points.length < 4) return false;

  const first = points[0];
  const last = points.at(-1);
  return Math.hypot(last.x - first.x, last.y - first.y) <= Math.max(0, tolerance);
}

export function isOrthogonalRoute(points = DEMO_ROUTE, tolerance = 0.001) {
  if (!Array.isArray(points) || points.length < 2) return false;

  const safeTolerance = Math.max(0, tolerance);
  return points.slice(1).every((point, index) => {
    const previous = points[index];
    const deltaX = Math.abs(point.x - previous.x);
    const deltaY = Math.abs(point.y - previous.y);
    const hasLength = deltaX > safeTolerance || deltaY > safeTolerance;

    return hasLength && (deltaX <= safeTolerance || deltaY <= safeTolerance);
  });
}

export function getPolygonArea(points = DEMO_ROUTE) {
  if (!Array.isArray(points) || points.length < 4) return 0;

  let twiceArea = 0;
  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    twiceArea += current.x * next.y - next.x * current.y;
  }

  if (!isRouteClosed(points)) {
    const last = points.at(-1);
    const first = points[0];
    twiceArea += last.x * first.y - first.x * last.y;
  }

  return Math.abs(twiceArea) / 2;
}

export function createRouteSamples(points = DEMO_ROUTE, sampleCount = 160) {
  const safeCount = Math.max(2, Math.floor(sampleCount));
  return Array.from({ length: safeCount }, (_, index) =>
    sampleRoute(points, index / (safeCount - 1)),
  );
}
