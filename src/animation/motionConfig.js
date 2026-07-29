import { EASE_EMPHASIZED, EASE_ENTER } from "./easings.js";

export const motionConfig = Object.freeze({
  reducedMotion: "user",
  transition: Object.freeze({
    duration: 0.58,
    ease: EASE_EMPHASIZED,
  }),
});

export const viewportConfig = Object.freeze({
  once: true,
  amount: 0.22,
  margin: "0px 0px -8% 0px",
});

export const springConfig = Object.freeze({
  type: "spring",
  stiffness: 180,
  damping: 24,
  mass: 0.8,
});

export const reducedTransition = Object.freeze({ duration: 0 });

export function createRevealVariants({
  axis = "y",
  distance = 24,
  delay = 0,
} = {}) {
  const safeDistance = Number.isFinite(Number(distance)) ? Number(distance) : 24;
  const safeDelay = Math.max(0, Number(delay) || 0);
  const offset = axis === "x" ? { x: safeDistance } : { y: safeDistance };

  return {
    hidden: {
      opacity: 0,
      ...offset,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: motionConfig.transition.duration,
        delay: safeDelay,
        ease: EASE_ENTER,
      },
    },
  };
}

export function getMotionTransition(reducedMotion, overrides = {}) {
  if (reducedMotion) return reducedTransition;
  return { ...motionConfig.transition, ...overrides };
}
