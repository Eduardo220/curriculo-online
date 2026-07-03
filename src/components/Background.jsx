import { useEffect, useRef } from "react";

export default function Background() {
  const glowRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const handlePointerMove = (event) => {
      if (frameRef.current) return;

      frameRef.current = window.requestAnimationFrame(() => {
        if (glowRef.current) {
          glowRef.current.style.setProperty("--glow-x", `${event.clientX}px`);
          glowRef.current.style.setProperty("--glow-y", `${event.clientY}px`);
        }
        frameRef.current = null;
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div className="background" aria-hidden="true">
      <div className="background-grid" />
      <div className="background-aurora" />
      <div ref={glowRef} className="mouse-glow" />
    </div>
  );
}
