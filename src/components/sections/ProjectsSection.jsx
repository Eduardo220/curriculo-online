import { GitBranch, Info, TerminalSquare } from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import Button from "../common/Button.jsx";
import Section from "../common/Section.jsx";
import TagList from "../common/TagList.jsx";
import WayperSection from "../wayper/WayperSection.jsx";
import { projects } from "../../data/portfolio.js";

function ProjectFeature({ project, index }) {
  const reduceMotion = useReducedMotion();
  const rotateXTarget = useMotionValue(0);
  const rotateYTarget = useMotionValue(0);
  const rotateX = useSpring(rotateXTarget, { stiffness: 180, damping: 24, mass: 0.55 });
  const rotateY = useSpring(rotateYTarget, { stiffness: 180, damping: 24, mass: 0.55 });

  function handlePointerMove(event) {
    if (reduceMotion || event.pointerType !== "mouse") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    rotateXTarget.set(y * -3.2);
    rotateYTarget.set(x * 4.2);
    event.currentTarget.style.setProperty("--project-pointer-x", `${(x + 0.5) * 100}%`);
    event.currentTarget.style.setProperty("--project-pointer-y", `${(y + 0.5) * 100}%`);
  }

  function resetTilt(event) {
    rotateXTarget.set(0);
    rotateYTarget.set(0);
    event.currentTarget.style.removeProperty("--project-pointer-x");
    event.currentTarget.style.removeProperty("--project-pointer-y");
  }

  return (
    <motion.article
      className="project-feature editorial-project"
      style={
        reduceMotion
          ? undefined
          : { rotateX, rotateY, transformPerspective: 1400 }
      }
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onPointerCancel={resetTilt}
    >
      <span className="editorial-project__light" aria-hidden="true" />
      <div className="project-terminal editorial-project__terminal" aria-hidden="true">
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
        <span className="editorial-project__terminal-grid" />
      </div>

      <div className="project-feature__content editorial-project__content">
        <div className="editorial-project__meta">
          <span className="project-label">{project.label}</span>
          <span aria-hidden="true">project.{String(index + 1).padStart(2, "0")}</span>
        </div>
        <h3>{project.name}</h3>
        <p className="project-context">{project.context}</p>

        <dl className="project-facts editorial-project__facts">
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
    </motion.article>
  );
}

export default function ProjectsSection() {
  return (
    <Section
      id="projetos"
      eyebrow="Projetos"
      title="Projetos que estou construindo."
      description="O Wayper é o projeto em que mais tenho trabalhado hoje. Depois dele, estão outros projetos que também fazem parte do meu GitHub."
      className="projects-section editorial-section editorial-projects"
    >
      <WayperSection />

      <div className="other-projects editorial-projects__secondary">
        <header className="other-projects__heading">
          <span className="eyebrow">Outros projetos</span>
          <p>Mais alguns projetos públicos que fizeram parte dos meus estudos.</p>
          <span className="editorial-projects__heading-line" aria-hidden="true" />
        </header>

        <div className="projects-list">
          {projects.map((project, index) => (
            <ProjectFeature project={project} index={index} key={project.name} />
          ))}
        </div>
      </div>
    </Section>
  );
}
