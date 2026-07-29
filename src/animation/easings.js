const freezeBezier = (values) => Object.freeze([...values]);

export const EASE_STANDARD = freezeBezier([0.2, 0, 0, 1]);
export const EASE_EMPHASIZED = freezeBezier([0.22, 1, 0.36, 1]);
export const EASE_ENTER = freezeBezier([0, 0, 0.2, 1]);
export const EASE_EXIT = freezeBezier([0.4, 0, 1, 1]);

export const easings = Object.freeze({
  standard: EASE_STANDARD,
  emphasized: EASE_EMPHASIZED,
  enter: EASE_ENTER,
  exit: EASE_EXIT,
});

export const cssEasings = Object.freeze({
  standard: "cubic-bezier(0.2, 0, 0, 1)",
  emphasized: "cubic-bezier(0.22, 1, 0.36, 1)",
  enter: "cubic-bezier(0, 0, 0.2, 1)",
  exit: "cubic-bezier(0.4, 0, 1, 1)",
});

export const gsapEasings = Object.freeze({
  standard: "power2.out",
  emphasized: "power4.out",
  enter: "power3.out",
  exit: "power2.in",
});

export function easeOutQuart(value) {
  const progress = Math.min(1, Math.max(0, Number(value) || 0));
  return 1 - (1 - progress) ** 4;
}
