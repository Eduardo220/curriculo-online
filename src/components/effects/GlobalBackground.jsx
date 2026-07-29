import { useEffect, useRef, useState } from "react";

const sceneIds = [
  "top",
  "sobre",
  "experiencia",
  "projetos",
  "stack",
  "formacao",
  "github",
  "contato",
];

export default function GlobalBackground() {
  const rootRef = useRef(null);
  const frameRef = useRef(0);
  const pointerRef = useRef({ x: 0.5, y: 0.5 });
  const [scene, setScene] = useState("top");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const handlePointer = (event) => {
      pointerRef.current = {
        x: event.clientX / Math.max(window.innerWidth, 1),
        y: event.clientY / Math.max(window.innerHeight, 1),
      };
      if (frameRef.current) return;
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = 0;
        root.style.setProperty("--pointer-x", pointerRef.current.x.toFixed(4));
        root.style.setProperty("--pointer-y", pointerRef.current.y.toFixed(4));
      });
    };

    window.addEventListener("pointermove", handlePointer, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointer);
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return undefined;
    const sections = sceneIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const candidate = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (candidate) setScene(candidate.target.id);
      },
      { rootMargin: "-24% 0px -54%", threshold: [0.01, 0.2, 0.5] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className="global-background"
      data-scene={scene}
      aria-hidden="true"
    >
      <div className="global-background__aurora" />
      <div className="global-background__grid" />
      <div className="global-background__topography" />
      <svg
        className="global-background__route"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="none"
        focusable="false"
      >
        <path d="M-80 810 C210 680 210 350 480 420 S770 900 990 610 S1280 90 1700 260" />
        <path className="global-background__route-glow" d="M-80 810 C210 680 210 350 480 420 S770 900 990 610 S1280 90 1700 260" />
      </svg>
      <div className="global-background__noise" />
      <div className="global-background__coordinates">
        <span>29.1028° S</span>
        <span>49.6345° W</span>
      </div>
    </div>
  );
}
