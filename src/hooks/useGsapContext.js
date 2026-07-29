import { useEffect, useLayoutEffect, useRef } from "react";
import {
  gsap,
  registerGsapPlugins,
  ScrollTrigger,
} from "../animation/gsap.js";

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export function useGsapContext(setup, { scope, enabled = true } = {}) {
  const contextRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    const scopeElement = scope?.current ?? scope;
    if (!enabled || typeof window === "undefined" || typeof setup !== "function") {
      return undefined;
    }

    registerGsapPlugins();
    let manualCleanup;
    const context = gsap.context(() => {
      manualCleanup = setup({ gsap, ScrollTrigger });
    }, scopeElement);
    contextRef.current = context;

    return () => {
      try {
        if (typeof manualCleanup === "function") manualCleanup();
      } finally {
        context.revert();
        if (contextRef.current === context) contextRef.current = null;
      }
    };
  }, [enabled, scope, setup]);

  return contextRef;
}

export default useGsapContext;
