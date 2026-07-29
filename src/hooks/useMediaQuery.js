import { useCallback, useSyncExternalStore } from "react";

const subscribeToNothing = () => () => {};

function getMediaQueryList(query, windowRef = globalThis.window) {
  if (!windowRef?.matchMedia) return null;

  try {
    return windowRef.matchMedia(query);
  } catch {
    return null;
  }
}

export function getMediaQueryMatch(
  query,
  fallback = false,
  windowRef = globalThis.window,
) {
  return getMediaQueryList(query, windowRef)?.matches ?? fallback;
}

export function useMediaQuery(query, fallback = false) {
  const subscribe = useCallback(
    (onStoreChange) => {
      const mediaQueryList = getMediaQueryList(query);
      if (!mediaQueryList) return subscribeToNothing();

      if (mediaQueryList.addEventListener) {
        mediaQueryList.addEventListener("change", onStoreChange);
        return () => mediaQueryList.removeEventListener("change", onStoreChange);
      }

      if (mediaQueryList.addListener) {
        mediaQueryList.addListener(onStoreChange);
        return () => mediaQueryList.removeListener(onStoreChange);
      }

      return subscribeToNothing();
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => getMediaQueryMatch(query, fallback),
    [fallback, query],
  );
  const getServerSnapshot = useCallback(() => fallback, [fallback]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default useMediaQuery;
