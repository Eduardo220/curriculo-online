import { useId } from "react";
import { CloudOff, LocateFixed, RefreshCw } from "lucide-react";
import {
  DEMO_ROUTE,
  getVisibleRoute,
  sampleRoute,
} from "../../utils/wayperRoute.js";

const chapterProgress = [0.04, 0.24, 0.68, 1, 1, 1, 1];

function toCanvasPoint(point) {
  return {
    x: 92 + point.x * 616,
    y: 70 + point.y * 630,
  };
}

function toPath(points) {
  return points
    .map((point, index) => {
      const mapped = toCanvasPoint(point);
      return `${index === 0 ? "M" : "L"} ${mapped.x.toFixed(2)} ${mapped.y.toFixed(2)}`;
    })
    .join(" ");
}

export default function WayperFallback({ activeChapter = 6, reason = "fallback" }) {
  const instanceId = useId().replaceAll(":", "");
  const territoryGradientId = `${instanceId}-territory`;
  const routeGlowId = `${instanceId}-glow`;
  const routeProgress = chapterProgress[activeChapter] ?? 1;
  const visibleRoute = getVisibleRoute(DEMO_ROUTE, routeProgress);
  const marker = toCanvasPoint(sampleRoute(DEMO_ROUTE, routeProgress));
  const territoryPath = `${toPath(DEMO_ROUTE)} Z`;
  const routePath = toPath(visibleRoute);
  const territoryVisible = activeChapter >= 3;
  const syncing = activeChapter >= 4;

  return (
    <div
      className="wayper-fallback"
      data-fallback-reason={reason}
      role="img"
      aria-label="Mapa demonstrativo do Wayper: uma rota fecha uma área, registra o território localmente e depois sincroniza os dados."
    >
      <div className="wayper-fallback__topography" aria-hidden="true" />
      <svg
        className="wayper-fallback__map"
        viewBox="0 0 800 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id={territoryGradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#b8ff3d" stopOpacity=".32" />
            <stop offset="1" stopColor="#55c7f3" stopOpacity=".13" />
          </linearGradient>
          <filter id={routeGlowId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className="wayper-fallback__blocks">
          {Array.from({ length: 42 }, (_, index) => {
            const column = index % 7;
            const row = Math.floor(index / 7);
            return (
              <rect
                x={86 + column * 92}
                y={100 + row * 102}
                width="70"
                height="76"
                rx="7"
                key={index}
              />
            );
          })}
        </g>

        <path
          className={`wayper-fallback__territory${territoryVisible ? " is-visible" : ""}`}
          d={territoryPath}
          fill={`url(#${territoryGradientId})`}
        />
        <path
          className="wayper-fallback__route-shadow"
          d={routePath}
        />
        <path
          className="wayper-fallback__route"
          d={routePath}
          filter={`url(#${routeGlowId})`}
        />
        <circle className="wayper-fallback__marker-ring" cx={marker.x} cy={marker.y} r="19" />
        <circle className="wayper-fallback__marker" cx={marker.x} cy={marker.y} r="7" />
      </svg>

      <div className="wayper-fallback__hud" aria-hidden="true">
        <span className="wayper-demo-badge">DEMO</span>
        <span><LocateFixed size={14} /> GPS visual</span>
        <strong>{territoryVisible ? "território fechado" : "rota em andamento"}</strong>
      </div>

      <div className={`wayper-fallback__sync${syncing ? " is-visible" : ""}`} aria-hidden="true">
        {syncing ? <RefreshCw size={15} /> : <CloudOff size={15} />}
        <span>{syncing ? "sincronização demonstrativa" : "persistência local"}</span>
      </div>
    </div>
  );
}
