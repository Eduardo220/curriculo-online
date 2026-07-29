import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function Button({
  href,
  children,
  icon: Icon = ArrowUpRight,
  variant = "primary",
  download = false,
  className = "",
  cursorLabel,
}) {
  const anchorRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const external = href?.startsWith("http");
  const downloadName =
    download === true ? "Curriculo-Eduardo-Weissheimer.pdf" : download || undefined;

  function handlePointerMove(event) {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const bounds = anchorRef.current?.getBoundingClientRect();
    if (!bounds) return;
    x.set((event.clientX - (bounds.left + bounds.width / 2)) * 0.11);
    y.set((event.clientY - (bounds.top + bounds.height / 2)) * 0.11);
  }

  function resetPosition() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      ref={anchorRef}
      className={`button button--${variant} ${className}`.trim()}
      href={href}
      download={downloadName}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      data-cursor={cursorLabel || undefined}
      style={reduceMotion ? undefined : { x, y }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 320, damping: 24, mass: 0.35 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPosition}
      onBlur={resetPosition}
    >
      <span>{children}</span>
      {Icon ? <Icon size={17} strokeWidth={1.8} aria-hidden="true" /> : null}
    </motion.a>
  );
}
