import {
  Component,
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import WayperFallback from "./WayperFallback.jsx";

const LazyWayperCanvas = lazy(() => import("./WayperCanvas.jsx"));

class WayperSceneBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    this.props.onError?.(error);
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

function useSceneActivity(rootRef) {
  const [viewportState, setViewportState] = useState(
    () => {
      const observerUnavailable =
        typeof window === "undefined" || !("IntersectionObserver" in window);
      return {
        inViewport: observerUnavailable,
        activated: observerUnavailable,
      };
    },
  );
  const [pageVisible, setPageVisible] = useState(
    () => typeof document === "undefined" || document.visibilityState !== "hidden",
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !("IntersectionObserver" in window)) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setViewportState((current) => ({
          inViewport: entry.isIntersecting,
          activated: current.activated || entry.isIntersecting,
        }));
      },
      { rootMargin: "240px 0px", threshold: 0.01 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [rootRef]);

  useEffect(() => {
    const updateVisibility = () => setPageVisible(document.visibilityState !== "hidden");
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  return {
    active: viewportState.inViewport && pageVisible,
    activated: viewportState.activated,
  };
}

export default function WayperVisual({
  activeChapter = 0,
  performance,
  sceneStateRef,
}) {
  const rootRef = useRef(null);
  const [contextLost, setContextLost] = useState(false);
  const { active: sceneActive, activated: sceneActivated } = useSceneActivity(rootRef);
  const {
    quality = "medium",
    webgl = true,
    reducedMotion = false,
    isTouch = false,
    dpr = 1,
  } = performance ?? {};
  const fallbackRequired =
    contextLost || !webgl || reducedMotion || quality === "low" || quality === "reduced";

  const resetPointer = useCallback(() => {
    if (!sceneStateRef?.current) return;
    sceneStateRef.current.pointerX = 0;
    sceneStateRef.current.pointerY = 0;
  }, [sceneStateRef]);

  const updatePointer = useCallback(
    (event) => {
      if (!sceneStateRef?.current || reducedMotion) return;
      if (isTouch && event.type === "pointermove") return;

      const bounds = event.currentTarget.getBoundingClientRect();
      sceneStateRef.current.pointerX = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      sceneStateRef.current.pointerY = -(((event.clientY - bounds.top) / bounds.height) * 2 - 1);
    },
    [isTouch, reducedMotion, sceneStateRef],
  );

  return (
    <div
      className="wayper-visual-frame"
      ref={rootRef}
      role="img"
      aria-label="Cena tridimensional demonstrativa do Wayper. Um celular exibe uma rota de corrida que fecha e eleva um território antes de representar a sincronização dos dados."
      onPointerDown={isTouch ? updatePointer : undefined}
      onPointerLeave={resetPointer}
      onPointerMove={!isTouch ? updatePointer : undefined}
      onPointerUp={isTouch ? resetPointer : undefined}
    >
      {fallbackRequired ? (
        <WayperFallback
          activeChapter={reducedMotion ? 6 : activeChapter}
          reason={contextLost ? "context-lost" : reducedMotion ? "reduced-motion" : "capability"}
        />
      ) : sceneActivated ? (
        <WayperSceneBoundary
          fallback={<WayperFallback activeChapter={activeChapter} reason="render-error" />}
        >
          <Suspense fallback={<WayperFallback activeChapter={activeChapter} reason="loading" />}>
            <LazyWayperCanvas
              active={sceneActive}
              activeChapter={activeChapter}
              dpr={dpr}
              onContextLost={() => setContextLost(true)}
              quality={quality}
              stateRef={sceneStateRef}
            />
          </Suspense>
        </WayperSceneBoundary>
      ) : (
        <WayperFallback activeChapter={activeChapter} reason="standby" />
      )}
      <span className="wayper-visually-hidden">
        Os sete capítulos ao lado descrevem em texto todo o conteúdo representado na cena.
      </span>
    </div>
  );
}
