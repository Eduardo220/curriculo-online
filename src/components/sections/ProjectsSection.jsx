import { GitBranch, LockKeyhole, TerminalSquare } from "lucide-react";
import Button from "../common/Button.jsx";
import Section from "../common/Section.jsx";
import TagList from "../common/TagList.jsx";
import { projects } from "../../data/portfolio.js";

export default function ProjectsSection() {
  return (
    <Section
      id="projetos"
      eyebrow="Outros projetos"
      title="Poucos projetos, com contexto suficiente para serem avaliados."
      description="A seleção prioriza código público e responsabilidade comprovável. Trabalhos profissionais privados aparecem na experiência, sem fingir que são cases abertos."
      className="projects-section"
    >
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
                  <dt>Problema</dt>
                  <dd>{project.problem}</dd>
                </div>
                <div>
                  <dt>Solução</dt>
                  <dd>{project.solution}</dd>
                </div>
                <div>
                  <dt>Responsabilidade</dt>
                  <dd>{project.responsibility}</dd>
                </div>
                <div>
                  <dt>Resultado</dt>
                  <dd>{project.result}</dd>
                </div>
              </dl>

              <TagList items={project.technologies} />

              <div className="project-feature__footer">
                <Button href={project.githubUrl} icon={GitBranch} variant="secondary">
                  Ver repositório
                </Button>
                <span>
                  <LockKeyhole size={15} aria-hidden="true" />
                  {project.status}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <aside className="private-work-note">
        <span>Sobre código profissional</span>
        <p>
          Integrações e sistemas desenvolvidos na Venddor não são apresentados como projetos
          públicos. O portfólio descreve apenas responsabilidades e tecnologias, sem código,
          clientes, credenciais ou detalhes internos.
        </p>
      </aside>
    </Section>
  );
}
