import {
  ArrowUpRight,
  CheckCircle2,
  GitBranch,
  RadioTower,
} from "lucide-react";
import Section from "../common/Section.jsx";
import Button from "../common/Button.jsx";
import TagList from "../common/TagList.jsx";
import WayperVisual from "./WayperVisual.jsx";
import { wayper } from "../../data/portfolio.js";

export default function WayperSection() {
  return (
    <Section
      id="wayper"
      eyebrow="Projeto principal"
      title="Wayper: corrida real, território digital."
      description="Não é uma interface de demonstração. É um produto mobile em desenvolvimento que precisa lidar com sensores imperfeitos, interrupções, estado local, mapas e dados remotos."
      className="wayper-section"
    >
      <article className="wayper-showcase">
        <div className="wayper-showcase__visual">
          <WayperVisual />
        </div>

        <div className="wayper-showcase__intro">
          <span className="status-label">
            <i />
            {wayper.label}
          </span>
          <h3>{wayper.summary}</h3>
          <p>{wayper.description}</p>
          <div className="wayper-showcase__actions">
            <Button href={wayper.githubUrl} icon={GitBranch}>
              Ver código no GitHub
            </Button>
            <a className="text-link" href="#arquitetura-wayper">
              Explorar arquitetura <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </article>

      <div className="case-study-grid">
        <article>
          <span className="case-study-grid__code">problem.statement</span>
          <h3>O problema</h3>
          <p>{wayper.problem}</p>
        </article>
        <article>
          <span className="case-study-grid__code">solution.approach</span>
          <h3>A solução em construção</h3>
          <p>{wayper.solution}</p>
        </article>
      </div>

      <div className="wayper-architecture" id="arquitetura-wayper">
        <header>
          <span className="eyebrow">Arquitetura</span>
          <h3>Do sensor ao território, cada etapa tem uma responsabilidade.</h3>
        </header>

        <ol>
          {wayper.architecture.map((step) => (
            <li key={step.code}>
              <span>{step.code}</span>
              <div>
                <h4>{step.title}</h4>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="wayper-details">
        <article className="wayper-capabilities">
          <header>
            <span className="eyebrow">Produto</span>
            <h3>Funcionalidades presentes no código</h3>
          </header>
          <ul>
            {wayper.capabilities.map((capability) => (
              <li key={capability}>
                <CheckCircle2 size={17} aria-hidden="true" />
                <span>{capability}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="wayper-engineering">
          <header>
            <span className="eyebrow">Engenharia</span>
            <h3>Decisões que sustentam a experiência</h3>
          </header>
          <div>
            {wayper.engineering.map((item) => (
              <section key={item.title}>
                <RadioTower size={18} aria-hidden="true" />
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </section>
            ))}
          </div>
        </article>
      </div>

      <div className="wayper-evolution">
        <article>
          <span className="eyebrow">Próximas etapas técnicas</span>
          <h3>Riscos tratados como trabalho, não como promessa.</h3>
          <ul>
            {wayper.nextSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </article>
        <article>
          <span className="eyebrow">Aprendizados</span>
          <h3>O que o projeto já tornou concreto.</h3>
          <ul>
            {wayper.learnings.map((learning) => (
              <li key={learning}>{learning}</li>
            ))}
          </ul>
        </article>
      </div>

      <footer className="wayper-stack">
        <div>
          <span className="eyebrow">Stack verificada no repositório</span>
          <p>
            Tecnologias listadas apenas quando aparecem nas dependências e na implementação atual.
          </p>
        </div>
        <TagList items={wayper.technologies} label="Tecnologias verificadas no Wayper" />
      </footer>
    </Section>
  );
}
