import { useEffect, useRef } from "react";
import {
  connectLenisToGsap,
  createLenis,
  shouldEnableLenis,
} from "../animation/lenis.js";
import { ScrollTrigger } from "../animation/gsap.js";
import { usePerformanceMode } from "./usePerformanceMode.js";

const EMPTY_CONFIG = Object.freeze({});
const EMPTY_OPTIONS = Object.freeze({});

export function useLenis(config = EMPTY_CONFIG) {
  const detectedPerformanceMode = usePerformanceMode();
  const lenisRef = useRef(null);
  const {
    enabled = true,
    allowTouch = false,
    performanceMode: performanceModeOverride,
    options = EMPTY_OPTIONS,
    onScroll,
  } = config;
  const performanceMode = performanceModeOverride ?? detectedPerformanceMode;
  const { quality, reducedMotion, isTouch } = performanceMode;

  useEffect(() => {
    const activeMode = { quality, reducedMotion, isTouch };
    if (
      typeof window === "undefined" ||
      !shouldEnableLenis(activeMode, { enabled, allowTouch })
    ) {
      lenisRef.current = null;
      return undefined;
    }

    const lenis = createLenis(options);
    const disconnectGsap = connectLenisToGsap(lenis);
    const handleScroll = typeof onScroll === "function" ? onScroll : null;
    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());

    if (handleScroll) lenis.on("scroll", handleScroll);
    lenisRef.current = lenis;

    return () => {
      window.cancelAnimationFrame(refreshFrame);
      if (handleScroll) lenis.off("scroll", handleScroll);
      disconnectGsap();
      lenis.stop();
      lenis.destroy();
      if (lenisRef.current === lenis) lenisRef.current = null;
    };
  }, [allowTouch, enabled, isTouch, onScroll, options, quality, reducedMotion]);

  return lenisRef;
}

export default useLenis;
