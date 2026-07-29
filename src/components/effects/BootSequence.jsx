import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion.js";

const BOOT_KEY = "portfolio.boot.v1";

function shouldShowBoot(reducedMotion) {
  if (reducedMotion || typeof window === "undefined") return false;
  if (new URLSearchParams(window.location.search).has("skipIntro")) return false;
  try {
    return window.sessionStorage.getItem(BOOT_KEY) !== "complete";
  } catch {
    return true;
  }
}

export default function BootSequence() {
  const reducedMotion = useReducedMotion();
  const rootRef = useRef(null);
  const skipRef = useRef(null);
  const [visible, setVisible] = useState(() => shouldShowBoot(reducedMotion));

  const finish = useCallback(() => {
    try {
      window.sessionStorage.setItem(BOOT_KEY, "complete");
    } catch {
      // Session storage is an enhancement, never a requirement.
    }
    setVisible(false);
    window.dispatchEvent(new CustomEvent("portfolio:ready"));
  }, []);

  useEffect(() => {
    if (!visible || reducedMotion) {
      window.dispatchEvent(new CustomEvent("portfolio:ready"));
      return undefined;
    }

    const inertTargets = [
      document.querySelector(".site-header"),
      document.querySelector("main"),
      document.querySelector(".site-footer"),
    ].filter(Boolean);
    inertTargets.forEach((target) => target.setAttribute("inert", ""));
    document.documentElement.classList.add("is-booting");
    skipRef.current?.focus({ preventScroll: true });

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: finish,
      });

      timeline
        .fromTo(
          ".boot-sequence__grid",
          { opacity: 0 },
          { opacity: 1, duration: 0.22 },
        )
        .fromTo(
          ".boot-sequence__route path",
          { strokeDasharray: 520, strokeDashoffset: 520 },
          { strokeDashoffset: 0, duration: 0.68, ease: "power2.inOut" },
          0.08,
        )
        .fromTo(
          ".boot-sequence__readout span",
          { yPercent: 120, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.32, stagger: 0.08 },
          0.18,
        )
        .fromTo(
          ".boot-sequence__name span",
          { yPercent: 110 },
          { yPercent: 0, duration: 0.48 },
          0.38,
        )
        .to(
          ".boot-sequence__panel",
          { opacity: 0, y: -18, duration: 0.3, ease: "power2.in" },
          "+=0.12",
        );
    }, rootRef);
    const safetyTimeout = window.setTimeout(finish, 1800);

    return () => {
      window.clearTimeout(safetyTimeout);
      context.revert();
      inertTargets.forEach((target) => target.removeAttribute("inert"));
      document.documentElement.classList.remove("is-booting");
    };
  }, [finish, reducedMotion, visible]);

  if (reducedMotion) return null;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          ref={rootRef}
          className="boot-sequence"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24 }}
          role="status"
          aria-label="Preparando a interface do portfólio"
        >
          <div className="boot-sequence__grid" aria-hidden="true" />
          <div className="boot-sequence__panel">
            <div className="boot-sequence__readout" aria-hidden="true">
              <span>29° 06′ S</span>
              <span>49° 35′ W</span>
              <span>sistema / disponível</span>
            </div>

            <svg
              className="boot-sequence__route"
              viewBox="0 0 640 180"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M8 138 C92 32 164 166 250 82 S420 22 474 92 S574 174 632 46" />
              <circle cx="8" cy="138" r="4" />
              <circle cx="632" cy="46" r="4" />
            </svg>

            <p className="boot-sequence__name">
              <span>Eduardo Weissheimer</span>
            </p>
            <p className="boot-sequence__status">carregando interface cartográfica</p>
          </div>

          <button ref={skipRef} type="button" onClick={finish}>
            Pular abertura
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
