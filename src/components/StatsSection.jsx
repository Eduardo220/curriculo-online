import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import Section from "./Section.jsx";
import { stats } from "../data/portfolio.js";

function AnimatedNumber({ value, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;

    const controls = animate(0, value, {
      duration: 1.35,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });

    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref}>
      {display.toLocaleString("pt-BR")}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <Section
      id="impacto"
      eyebrow="Impacto"
      title="Números simples para contextualizar a trajetória."
      description="A seção mostra volume e amplitude técnica sem transformar o portfólio em uma planilha."
    >
      <div className="stats-grid">
        {stats.map((stat) => (
          <motion.article
            className="stat-card"
            key={stat.label}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.22 }}
          >
            <strong>
              <AnimatedNumber value={stat.value} suffix={stat.suffix} />
            </strong>
            <span>{stat.label}</span>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
