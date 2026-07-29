import { useMediaQuery } from "./useMediaQuery.js";

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function useReducedMotion(fallback = false) {
  return useMediaQuery(REDUCED_MOTION_QUERY, fallback);
}

export default useReducedMotion;
