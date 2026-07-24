import {
  ArrowUpRight,
  CheckCircle2,
  GitBranch,
  RadioTower,
} from "lucide-react";
import Button from "../common/Button.jsx";
import TagList from "../common/TagList.jsx";
import WayperVisual from "./WayperVisual.jsx";
import { wayper } from "../../data/portfolio.js";

export default function WayperSection() {
  return (
    <section
      id="wayper"
      className="wayper-project"
      aria-labelledby="wayper-project-title"
    >
      <header className="project-group-heading">
        <span className="eyebrow">Projeto em destaque</span>
        <h3 id="wayper-project-title">{wayper.name}</h3>
        <p>É o projeto pessoal em que mais tenho trabalhado hoje.</p>
      </header>

      <article className="wayper-showcase">
        <div className="wayper-showcase__visual">
          <WayperVisual />
        </div>

        <div className="wayper-showcase__intro">
          <span className="status-label">
            <i />
            {wayper.label}
          </span>
          <h4>{wayper.summary}</h4>
          <p>{wayper.description}</p>
          <div className="wayper-showcase__actions">
            <Button href={wayper.githubUrl} icon={GitBranch}>
              Ver código no GitHub
            </Button>
            <a className="text-link" href="#arquitetura-wayper">
              Como ele funciona <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </article>

      <div className="case-study-grid">
        <article>
          <span className="case-study-grid__code">contexto</span>
          <h4>A parte difícil</h4>
          <p>{wayper.problem}</p>
        </article>
        <article>
          <span className="case-study-grid__code">estado atual</span>
          <h4>Como estou resolvendo</h4>
          <p>{wayper.solution}</p>
        </article>
      </div>

      <div className="wayper-architecture" id="arquitetura-wayper">
        <header>
          <span className="eyebrow">Por dentro do projeto</span>
          <h4>Como os dados passam pelo app.</h4>
        </header>

        <ol>
          {wayper.architecture.map((step) => (
            <li key={step.code}>
              <span>{step.code}</span>
              <div>
                <h5>{step.title}</h5>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="wayper-details">
        <article className="wayper-capabilities">
          <header>
            <span className="eyebrow">O que já funciona</span>
            <h4>O que já está no projeto</h4>
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
            <span className="eyebrow">Parte técnica</span>
            <h4>Algumas decisões do projeto</h4>
          </header>
          <div>
            {wayper.engineering.map((item) => (
              <section key={item.title}>
                <RadioTower size={18} aria-hidden="true" />
                <h5>{item.title}</h5>
                <p>{item.text}</p>
              </section>
            ))}
          </div>
        </article>
      </div>

      <div className="wayper-evolution">
        <article>
          <span className="eyebrow">Próximos passos</span>
          <h4>O que quero melhorar</h4>
          <ul>
            {wayper.nextSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </article>
        <article>
          <span className="eyebrow">Aprendizados</span>
          <h4>O que aprendi até aqui</h4>
          <ul>
            {wayper.learnings.map((learning) => (
              <li key={learning}>{learning}</li>
            ))}
          </ul>
        </article>
      </div>

      <footer className="wayper-stack">
        <div>
          <span className="eyebrow">Tecnologias usadas</span>
          <p>A stack atual do projeto.</p>
        </div>
        <TagList items={wayper.technologies} label="Tecnologias usadas no Wayper" />
      </footer>
    </section>
  );
}
