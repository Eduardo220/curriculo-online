import { useEffect, useRef } from "react";
import { useMediaQuery } from "./useMediaQuery.js";
import { usePerformanceMode } from "./usePerformanceMode.js";

const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
const EMPTY_OPTIONS = Object.freeze({});
const CSS_PROPERTIES = [
  "--pointer-x",
  "--pointer-y",
  "--parallax-x",
  "--parallax-y",
];

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function restoreProperties(element, previousValues) {
  CSS_PROPERTIES.forEach((property) => {
    const value = previousValues.get(property);
    if (value) element.style.setProperty(property, value);
    else element.style.removeProperty(property);
  });
}

export function usePointerParallax(options = EMPTY_OPTIONS) {
  const elementRef = useRef(null);
  const finePointer = useMediaQuery(FINE_POINTER_QUERY);
  const { quality, reducedMotion, isTouch } = usePerformanceMode();
  const {
    enabled = true,
    maxOffset = 12,
    smoothing = 0.14,
    onUpdate,
  } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (
      !element ||
      !enabled ||
      !finePointer ||
      isTouch ||
      reducedMotion ||
      quality === "low" ||
      quality === "reduced"
    ) {
      return undefined;
    }

    const offset = Math.max(0, Number(maxOffset) || 0);
    const interpolation = clamp(Number(smoothing) || 0.14, 0.01, 1);
    const previousValues = new Map(
      CSS_PROPERTIES.map((property) => [
        property,
        element.style.getPropertyValue(property),
      ]),
    );
    const position = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let animationFrame = 0;

    const render = () => {
      position.x += (position.targetX - position.x) * interpolation;
      position.y += (position.targetY - position.y) * interpolation;

      if (Math.abs(position.targetX - position.x) < 0.001) {
        position.x = position.targetX;
      }
      if (Math.abs(position.targetY - position.y) < 0.001) {
        position.y = position.targetY;
      }

      const x = position.x * offset;
      const y = position.y * offset;
      element.style.setProperty("--pointer-x", position.x.toFixed(4));
      element.style.setProperty("--pointer-y", position.y.toFixed(4));
      element.style.setProperty("--parallax-x", `${x.toFixed(3)}px`);
      element.style.setProperty("--parallax-y", `${y.toFixed(3)}px`);
      onUpdate?.({ x, y, normalizedX: position.x, normalizedY: position.y });

      const moving =
        position.x !== position.targetX || position.y !== position.targetY;
      animationFrame = moving ? window.requestAnimationFrame(render) : 0;
    };

    const scheduleRender = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(render);
    };

    const handlePointerMove = (event) => {
      if (!event.isPrimary || event.pointerType === "touch") return;
      const bounds = element.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      position.targetX = clamp(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        -1,
        1,
      );
      position.targetY = clamp(
        ((event.clientY - bounds.top) / bounds.height) * 2 - 1,
        -1,
        1,
      );
      scheduleRender();
    };

    const resetPointer = () => {
      position.targetX = 0;
      position.targetY = 0;
      scheduleRender();
    };

    element.addEventListener("pointermove", handlePointerMove, { passive: true });
    element.addEventListener("pointerleave", resetPointer, { passive: true });
    render();

    return () => {
      element.removeEventListener("pointermove", handlePointerMove);
      element.removeEventListener("pointerleave", resetPointer);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      restoreProperties(element, previousValues);
    };
  }, [
    enabled,
    finePointer,
    isTouch,
    maxOffset,
    onUpdate,
    quality,
    reducedMotion,
    smoothing,
  ]);

  return elementRef;
}

export default usePointerParallax;
