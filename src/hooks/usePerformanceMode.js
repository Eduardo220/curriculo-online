import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  getPerformanceProfile,
  measureFramePerformance,
  performanceSignalsEqual,
  readPerformanceSignals,
} from "../utils/performance.js";
import { useMediaQuery } from "./useMediaQuery.js";
import { useReducedMotion } from "./useReducedMotion.js";

const TOUCH_QUERY = "(hover: none), (pointer: coarse)";
const framePerformanceListeners = new Set();
let framePerformanceStatus = "idle";
let framePerformanceController = null;
let measuredAverageFrameTime = null;

function notifyFramePerformanceListeners() {
  framePerformanceListeners.forEach((listener) => listener());
}

function startFramePerformanceMeasurement() {
  if (framePerformanceStatus !== "idle" || typeof window === "undefined") {
    return;
  }

  const controller = new AbortController();
  framePerformanceController = controller;
  framePerformanceStatus = "sampling";

  measureFramePerformance({ signal: controller.signal }).then((measurement) => {
    if (framePerformanceController !== controller) return;
    framePerformanceController = null;
    framePerformanceStatus = "complete";
    measuredAverageFrameTime = measurement?.averageFrameTime ?? null;
    notifyFramePerformanceListeners();
  });
}

function subscribeToFramePerformance(listener) {
  framePerformanceListeners.add(listener);
  startFramePerformanceMeasurement();

  return () => {
    framePerformanceListeners.delete(listener);
    if (!framePerformanceListeners.size && framePerformanceStatus === "sampling") {
      const controller = framePerformanceController;
      framePerformanceController = null;
      framePerformanceStatus = "idle";
      controller?.abort();
    }
  };
}

const getFramePerformanceSnapshot = () => measuredAverageFrameTime;
const getServerFramePerformanceSnapshot = () => null;

function getConnection() {
  if (typeof navigator === "undefined") return null;
  return (
    navigator.connection || navigator.mozConnection || navigator.webkitConnection
  );
}

export function usePerformanceMode() {
  const reducedMotion = useReducedMotion();
  const coarsePointer = useMediaQuery(TOUCH_QUERY);
  const [signals, setSignals] = useState(() => readPerformanceSignals());
  const averageFrameTime = useSyncExternalStore(
    subscribeToFramePerformance,
    getFramePerformanceSnapshot,
    getServerFramePerformanceSnapshot,
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const connection = getConnection();
    let animationFrame = 0;

    const updateSignals = () => {
      animationFrame = 0;
      const nextSignals = readPerformanceSignals();
      setSignals((current) =>
        performanceSignalsEqual(current, nextSignals) ? current : nextSignals,
      );
    };

    const scheduleUpdate = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateSignals);
    };

    window.addEventListener("resize", scheduleUpdate, { passive: true });
    window.visualViewport?.addEventListener("resize", scheduleUpdate, {
      passive: true,
    });
    document.addEventListener("visibilitychange", scheduleUpdate);
    connection?.addEventListener?.("change", scheduleUpdate);

    return () => {
      window.removeEventListener("resize", scheduleUpdate);
      window.visualViewport?.removeEventListener("resize", scheduleUpdate);
      document.removeEventListener("visibilitychange", scheduleUpdate);
      connection?.removeEventListener?.("change", scheduleUpdate);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  const isTouch = coarsePointer || signals.isTouch;

  return useMemo(
    () =>
      getPerformanceProfile({
        ...signals,
        averageFrameTime,
        reducedMotion,
        isTouch,
      }),
    [averageFrameTime, isTouch, reducedMotion, signals],
  );
}

export default usePerformanceMode;
