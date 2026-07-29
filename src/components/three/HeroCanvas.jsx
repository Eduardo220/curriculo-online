import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import HeroScene from "./HeroScene.jsx";

export default function HeroCanvas({ quality, dpr, progressRef, onFailure }) {
  const shellRef = useRef(null);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(!document.hidden);

  useEffect(() => {
    const node = shellRef.current;
    if (!node || !("IntersectionObserver" in window)) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "18% 0px", threshold: 0.01 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return (
    <div ref={shellRef} className="hero-canvas-shell" aria-hidden="true">
      <Canvas
        dpr={[1, dpr]}
        camera={{ position: [0, 2.25, 6.9], fov: 39, near: 0.1, far: 40 }}
        frameloop={inView && pageVisible ? "always" : "demand"}
        gl={{
          alpha: true,
          antialias: quality === "high",
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          const handleContextLost = (event) => {
            event.preventDefault();
            onFailure?.();
          };
          gl.domElement.addEventListener("webglcontextlost", handleContextLost, {
            once: true,
          });
        }}
      >
        <HeroScene quality={quality} progressRef={progressRef} />
      </Canvas>
    </div>
  );
}
