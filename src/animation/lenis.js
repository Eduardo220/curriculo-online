import Lenis from "lenis";
import { easeOutQuart } from "./easings.js";
import {
  gsap,
  registerGsapPlugins,
  ScrollTrigger,
} from "./gsap.js";

export const lenisAnchorOptions = Object.freeze({
  duration: 0.9,
  easing: easeOutQuart,
});

export const lenisDefaultOptions = Object.freeze({
  autoRaf: false,
  duration: 1.05,
  easing: easeOutQuart,
  smoothWheel: true,
  syncTouch: false,
  wheelMultiplier: 0.9,
  touchMultiplier: 1,
  anchors: lenisAnchorOptions,
});

export function resolveLenisOptions(overrides = {}) {
  const anchors =
    overrides.anchors === false
      ? false
      : {
          ...lenisAnchorOptions,
          ...(typeof overrides.anchors === "object" ? overrides.anchors : {}),
        };

  return {
    ...lenisDefaultOptions,
    ...overrides,
    autoRaf: false,
    anchors,
  };
}

export function createLenis(options) {
  return new Lenis(resolveLenisOptions(options));
}

export function shouldEnableLenis(
  performanceMode,
  { enabled = true, allowTouch = false } = {},
) {
  if (!enabled || !performanceMode) return false;

  const { quality, reducedMotion, isTouch } = performanceMode;
  return (
    !reducedMotion &&
    (quality === "high" || quality === "medium") &&
    (allowTouch || !isTouch)
  );
}

export function connectLenisToGsap(
  lenis,
  { gsapInstance = gsap, scrollTrigger = ScrollTrigger } = {},
) {
  if (!lenis?.on || !lenis?.off || !lenis?.raf) {
    throw new TypeError("Uma instância válida do Lenis é obrigatória.");
  }

  registerGsapPlugins();

  const updateScrollTrigger = () => scrollTrigger.update();
  const renderLenis = (timeInSeconds) => lenis.raf(timeInSeconds * 1000);
  let connected = true;

  lenis.on("scroll", updateScrollTrigger);
  gsapInstance.ticker.add(renderLenis);
  gsapInstance.ticker.lagSmoothing(0);

  return () => {
    if (!connected) return;
    connected = false;
    gsapInstance.ticker.remove(renderLenis);
    lenis.off("scroll", updateScrollTrigger);
  };
}
