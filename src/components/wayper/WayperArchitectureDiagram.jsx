import { useEffect, useRef } from "react";
import { animate, stagger, svg as animeSvg } from "animejs";

const flowSteps = [
  { code: "01", label: "GPS" },
  { code: "02", label: "Captura" },
  { code: "03", label: "Validação" },
  { code: "04", label: "Estado local" },
  { code: "05", label: "Território" },
  { code: "06", label: "Sincronização" },
  { code: "07", label: "Aplicativo" },
];

export default function WayperArchitectureDiagram({ reducedMotion = false }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return undefined;

    let animations = [];

    const play = () => {
      const lines = animeSvg.createDrawable(
        root.querySelectorAll(".wayper-flow__line"),
      );
      animations = [
        animate(lines, {
          draw: ["0 0", "0 1"],
          duration: 850,
          delay: stagger(90),
          ease: "inOutQuad",
        }),
        animate(root.querySelectorAll(".wayper-flow__node"), {
          opacity: [0, 1],
          scale: [0.9, 1],
          duration: 520,
          delay: stagger(85, { start: 170 }),
          ease: "out(3)",
        }),
      ];
    };

    if (!("IntersectionObserver" in window)) {
      play();
      return () => animations.forEach((animation) => animation.cancel());
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        play();
      },
      { threshold: 0.35 },
    );

    observer.observe(root);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
  }, [reducedMotion]);

  return (
    <div className="wayper-flow" ref={rootRef}>
      <div className="wayper-flow__viewport" aria-hidden="true">
        <svg viewBox="0 0 980 240" focusable="false">
          <defs>
            <linearGradient id="wayper-flow-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#55c7f3" />
              <stop offset="0.52" stopColor="#b8ff3d" />
              <stop offset="1" stopColor="#55c7f3" />
            </linearGradient>
          </defs>

          {flowSteps.slice(0, -1).map((step, index) => {
            const startX = 82 + index * 136;
            const endX = startX + 88;
            const bend = index % 2 === 0 ? 86 : 154;

            return (
              <path
                className="wayper-flow__line"
                d={`M ${startX} 120 C ${startX + 30} ${bend}, ${endX - 30} ${bend}, ${endX} 120`}
                key={step.code}
              />
            );
          })}

          {flowSteps.map((step, index) => {
            const x = 54 + index * 136;
            return (
              <g className="wayper-flow__node" key={step.code} transform={`translate(${x} 88)`}>
                <rect width="56" height="64" rx="14" />
                <circle cx="28" cy="20" r="5" />
                <path d="M17 40 H39" />
                <path d="M20 48 H36" />
              </g>
            );
          })}
        </svg>
      </div>

      <ol className="wayper-flow__labels" aria-label="Fluxo técnico demonstrado">
        {flowSteps.map((step) => (
          <li key={step.code}>
            <span>{step.code}</span>
            {step.label}
          </li>
        ))}
      </ol>
    </div>
  );
}
