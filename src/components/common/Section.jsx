import { useCallback, useRef } from "react";
import { useGsapContext } from "../../hooks/useGsapContext.js";
import { useReducedMotion } from "../../hooks/useReducedMotion.js";

export default function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className = "",
}) {
  const rootRef = useRef(null);
  const reducedMotion = useReducedMotion();

  const setupReveal = useCallback(({ gsap, ScrollTrigger }) => {
    const headingItems = gsap.utils.toArray(
      ".section-heading > *",
      rootRef.current,
    );
    if (!headingItems.length) return undefined;

    const timeline = gsap.timeline({ paused: true });
    timeline.fromTo(
      headingItems,
      { opacity: 0, y: 34, clipPath: "inset(0 0 24% 0)" },
      {
        opacity: 1,
        y: 0,
        clipPath: "inset(0 0 0% 0)",
        duration: 0.72,
        stagger: 0.09,
        ease: "power3.out",
      },
    );

    const trigger = ScrollTrigger.create({
      trigger: rootRef.current,
      start: "top 78%",
      once: true,
      animation: timeline,
    });

    return () => {
      trigger.kill();
      timeline.kill();
    };
  }, []);

  useGsapContext(setupReveal, {
    scope: rootRef,
    enabled: !reducedMotion,
  });

  return (
    <section
      ref={rootRef}
      id={id}
      className={`section ${className}`.trim()}
      data-portfolio-section={id}
    >
      <div className="container">
        {(eyebrow || title || description) && (
          <header className="section-heading">
            {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
            {title ? <h2>{title}</h2> : null}
            {description ? <p>{description}</p> : null}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
