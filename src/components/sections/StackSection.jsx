import {
  Boxes,
  Braces,
  Database,
  SearchCheck,
} from "lucide-react";
import Section from "../common/Section.jsx";
import TagList from "../common/TagList.jsx";
import { stackGroups } from "../../data/portfolio.js";

const icons = {
  Backend: Braces,
  Dados: Database,
  "Mobile e front": Boxes,
  "Entrega e diagnóstico": SearchCheck,
};

export default function StackSection() {
  const technologyCount = stackGroups.reduce(
    (total, group) => total + group.items.length,
    0,
  );

  return (
    <Section
      id="stack"
      eyebrow="Stack"
      title="Tecnologias que uso no dia a dia."
      description="Separei por área para ficar mais fácil de entender onde cada uma entra."
      className="stack-section editorial-section editorial-stack"
    >
      <div
        className="editorial-stack__constellation"
        role="img"
        aria-label={`Mapa da stack com ${stackGroups.length} áreas e ${technologyCount} tecnologias organizadas`}
      >
        <div className="editorial-stack__map-header" aria-hidden="true">
          <span>capability.map / {String(stackGroups.length).padStart(2, "0")}</span>
          <span><i /> stack em uso</span>
        </div>

        <svg
          viewBox="0 0 1000 320"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
          focusable="false"
        >
          <g className="editorial-stack__guides">
            <path d="M78 160 H922" />
            <circle cx="500" cy="160" r="92" />
            <circle cx="500" cy="160" r="116" />
          </g>
          <g className="editorial-stack__links">
            <path d="M196 86 H320 C374 86 402 132 452 148" />
            <path d="M196 234 H320 C374 234 402 188 452 172" />
            <path d="M804 86 H680 C626 86 598 132 548 148" />
            <path d="M804 234 H680 C626 234 598 188 548 172" />
          </g>
          <g className="editorial-stack__flow">
            <path d="M196 86 H320 C374 86 402 132 452 148" />
            <path d="M196 234 H320 C374 234 402 188 452 172" />
            <path d="M804 86 H680 C626 86 598 132 548 148" />
            <path d="M804 234 H680 C626 234 598 188 548 172" />
          </g>
          <g className="editorial-stack__terminals">
            <circle cx="196" cy="86" r="4" />
            <circle cx="196" cy="234" r="4" />
            <circle cx="804" cy="86" r="4" />
            <circle cx="804" cy="234" r="4" />
          </g>
        </svg>

        <div className="editorial-stack__core" aria-hidden="true">
          <i />
          <small>capability.map</small>
          <strong>{stackGroups.length} áreas</strong>
          <span>{technologyCount} tecnologias</span>
        </div>

        {stackGroups.map((group, index) => (
          <div
            className={`editorial-stack__coordinate editorial-stack__coordinate--${index + 1}`}
            key={`map-${group.title}`}
            aria-hidden="true"
          >
            <small>
              <b>{String(index + 1).padStart(2, "0")}</b>
              {group.code}
            </small>
            <strong>{group.title}</strong>
          </div>
        ))}

        <div className="editorial-stack__map-footer" aria-hidden="true">
          <span>{String(stackGroups.length).padStart(2, "0")} áreas conectadas</span>
          <span>{technologyCount} tecnologias organizadas</span>
        </div>
      </div>

      <div className="stack-list editorial-stack__list">
        {stackGroups.map((group, index) => {
          const Icon = icons[group.title] ?? Braces;

          return (
            <article
              className={`editorial-stack__node editorial-stack__node--${index + 1}`}
              key={group.title}
            >
              <div className="editorial-stack__node-heading">
                <div className="stack-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="stack-icon">
                  <Icon size={21} aria-hidden="true" />
                </div>
                <div className="stack-copy">
                  <span>{group.code}</span>
                  <h3>{group.title}</h3>
                  <p>{group.description}</p>
                </div>
              </div>

              <div className="editorial-stack__toolkit">
                <div className="editorial-stack__toolkit-meta" aria-hidden="true">
                  <span>toolkit</span>
                  <span>{String(group.items.length).padStart(2, "0")} itens</span>
                </div>
                <TagList items={group.items} label={`Tecnologias de ${group.title}`} />
              </div>
              <span className="editorial-stack__node-signal" aria-hidden="true" />
            </article>
          );
        })}
      </div>
    </Section>
  );
}
