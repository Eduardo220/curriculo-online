import { GitBranch, Info, TerminalSquare } from "lucide-react";
import Button from "../common/Button.jsx";
import Section from "../common/Section.jsx";
import TagList from "../common/TagList.jsx";
import WayperSection from "../wayper/WayperSection.jsx";
import { projects } from "../../data/portfolio.js";

export default function ProjectsSection() {
  return (
    <Section
      id="projetos"
      eyebrow="Projetos"
      title="Projetos que estou construindo."
      description="O Wayper é o projeto em que mais tenho trabalhado hoje. Depois dele, estão outros projetos que também fazem parte do meu GitHub."
      className="projects-section"
    >
      <WayperSection />

      <div className="other-projects">
        <header className="other-projects__heading">
          <span className="eyebrow">Outros projetos</span>
          <p>Mais alguns projetos públicos que fizeram parte dos meus estudos.</p>
        </header>

        <div className="projects-list">
          {projects.map((project) => (
            <article className="project-feature" key={project.name}>
              <div className="project-terminal" aria-hidden="true">
                <header>
                  <span />
                  <span />
                  <span />
                  <small>backend.study</small>
                </header>
                <div>
                  <p>
                    <i>$</i> php artisan about
                  </p>
                  <p>
                    <span>framework</span> Laravel 12
                  </p>
                  <p>
                    <span>domain</span> accounts / transactions
                  </p>
                  <p>
                    <span>auth</span> session protected
                  </p>
                  <p>
                    <span>status</span> repository public
                  </p>
                </div>
                <TerminalSquare size={26} />
              </div>

              <div className="project-feature__content">
                <span className="project-label">{project.label}</span>
                <h3>{project.name}</h3>
                <p className="project-context">{project.context}</p>

                <dl className="project-facts">
                  <div>
                    <dt>O que é</dt>
                    <dd>{project.problem}</dd>
                  </div>
                  <div>
                    <dt>Como foi feito</dt>
                    <dd>{project.solution}</dd>
                  </div>
                  <div>
                    <dt>O que fiz</dt>
                    <dd>{project.responsibility}</dd>
                  </div>
                  <div>
                    <dt>O que aprendi</dt>
                    <dd>{project.result}</dd>
                  </div>
                </dl>

                <TagList items={project.technologies} />

                <div className="project-feature__footer">
                  <Button href={project.githubUrl} icon={GitBranch} variant="secondary">
                    Ver repositório
                  </Button>
                  <span>
                    <Info size={15} aria-hidden="true" />
                    {project.status}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
