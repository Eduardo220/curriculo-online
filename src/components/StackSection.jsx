import { Boxes, Braces, CloudCog, Database, PlugZap } from "lucide-react";
import { motion } from "framer-motion";
import Section from "./Section.jsx";
import { stackGroups } from "../data/portfolio.js";

const icons = {
  Backend: Braces,
  Integrações: PlugZap,
  Banco: Database,
  Frontend: Boxes,
  DevOps: CloudCog,
};

export default function StackSection() {
  return (
    <Section
      id="stack"
      eyebrow="Stack"
      title="Tecnologias organizadas por contexto de uso."
      description="Em vez de uma lista solta, a stack aparece como capacidades: construir, integrar, persistir, entregar e evoluir produto."
    >
      <div className="stack-grid">
        {stackGroups.map((group) => {
          const Icon = icons[group.title] ?? Braces;

          return (
            <motion.article
              className="stack-card"
              key={group.title}
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ duration: 0.22 }}
            >
              <div className="card-icon">
                <Icon size={22} aria-hidden="true" />
              </div>
              <h3>{group.title}</h3>
              <p>{group.description}</p>
              <div className="tag-row">
                {group.items.map((item) => (
                  <span className="tech-tag" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </motion.article>
          );
        })}
      </div>
    </Section>
  );
}
