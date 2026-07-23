import {
  Boxes,
  Braces,
  Database,
  PlugZap,
  SearchCheck,
} from "lucide-react";
import Section from "../common/Section.jsx";
import TagList from "../common/TagList.jsx";
import { stackGroups } from "../../data/portfolio.js";

const icons = {
  Backend: Braces,
  Integrações: PlugZap,
  Dados: Database,
  "Mobile e frontend": Boxes,
  "Entrega e diagnóstico": SearchCheck,
};

export default function StackSection() {
  return (
    <Section
      id="stack"
      eyebrow="Stack e capacidades"
      title="Tecnologia organizada pelo trabalho que ela resolve."
      description="Sem parede de logos e sem ferramentas listadas por aparência. Cada grupo representa um contexto em que a tecnologia foi usada."
      className="stack-section"
    >
      <div className="stack-list">
        {stackGroups.map((group, index) => {
          const Icon = icons[group.title] ?? Braces;

          return (
            <article key={group.title}>
              <div className="stack-index">{String(index + 1).padStart(2, "0")}</div>
              <div className="stack-icon">
                <Icon size={21} aria-hidden="true" />
              </div>
              <div className="stack-copy">
                <span>{group.code}</span>
                <h3>{group.title}</h3>
                <p>{group.description}</p>
              </div>
              <TagList items={group.items} label={`Tecnologias de ${group.title}`} />
            </article>
          );
        })}
      </div>
    </Section>
  );
}
