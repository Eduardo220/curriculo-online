import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { usePerformanceMode } from "../../hooks/usePerformanceMode.js";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);
  const { quality, reducedMotion, isTouch } = usePerformanceMode();

  useEffect(() => {
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    if (!finePointer || isTouch || reducedMotion || quality === "low") {
      return undefined;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return undefined;

    document.documentElement.classList.add("has-custom-cursor");
    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.3, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.3, ease: "power3.out" });

    const handlePointerMove = (event) => {
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);

      const interactive = event.target.closest?.(
        "a, button, input, textarea, [data-cursor]",
      );
      const cursorLabel = interactive?.dataset.cursor ?? "";
      ring.classList.toggle("is-interactive", Boolean(interactive));
      ring.classList.toggle("has-label", Boolean(cursorLabel));
      label.textContent = cursorLabel;
    };

    const handlePointerLeave = () => {
      dot.classList.add("is-hidden");
      ring.classList.add("is-hidden");
    };
    const handlePointerEnter = () => {
      dot.classList.remove("is-hidden");
      ring.classList.remove("is-hidden");
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", handlePointerLeave);
    document.documentElement.addEventListener("mouseenter", handlePointerEnter);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("mouseleave", handlePointerLeave);
      document.documentElement.removeEventListener("mouseenter", handlePointerEnter);
      gsap.killTweensOf([dot, ring]);
    };
  }, [isTouch, quality, reducedMotion]);

  return (
    <div className="custom-cursor" aria-hidden="true">
      <span ref={dotRef} className="custom-cursor__dot" />
      <span ref={ringRef} className="custom-cursor__ring">
        <i ref={labelRef} />
      </span>
    </div>
  );
}
