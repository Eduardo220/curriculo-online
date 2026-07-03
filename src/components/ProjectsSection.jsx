import { ArrowUpRight, Github, LockKeyhole, Map, RadioTower } from "lucide-react";
import { motion } from "framer-motion";
import Button from "./Button.jsx";
import Section from "./Section.jsx";
import { projects } from "../data/portfolio.js";

function WayperVisual() {
  return (
    <div className="wayper-visual" aria-label="Prévia visual abstrata do Wayper">
      <div className="territory-grid">
        {Array.from({ length: 36 }).map((_, index) => (
          <span key={index} className={index % 5 === 0 || index % 7 === 0 ? "is-active" : ""} />
        ))}
      </div>
      <div className="gps-card">
        <Map size={18} aria-hidden="true" />
        <strong>Território</strong>
        <span>GPS em tempo real</span>
      </div>
      <div className="signal-card">
        <RadioTower size={18} aria-hidden="true" />
        <span>offline cache</span>
      </div>
    </div>
  );
}

function ProjectMedia({ project }) {
  if (project.featured) return <WayperVisual />;

  return (
    <div className="project-image">
      <img src={project.image} alt="" loading="lazy" />
    </div>
  );
}

export default function ProjectsSection() {
  const featured = projects.find((project) => project.featured);
  const regularProjects = projects.filter((project) => !project.featured);

  return (
    <Section
      id="projetos"
      eyebrow="Projetos"
      title="Projetos que mostram arquitetura, produto e resolução de problemas."
      description="A vitrine principal é o Wayper, porque ele reúne mobile, mapas, geolocalização, performance, sincronização e produto próprio."
    >
      {featured && (
        <motion.article
          className="featured-project"
          whileHover={{ y: -8 }}
          transition={{ duration: 0.22 }}
        >
          <ProjectMedia project={featured} />
          <div className="featured-content">
            <span className="eyebrow">{featured.label}</span>
            <h3>{featured.title}</h3>
            <p>{featured.description}</p>
            <div className="tag-row">
              {featured.technologies.map((tech) => (
                <span className="tech-tag" key={tech}>
                  {tech}
                </span>
              ))}
            </div>
            <div className="project-details">
              <div>
                <h4>Desafios técnicos</h4>
                <ul>
                  {featured.problems.map((problem) => (
                    <li key={problem}>{problem}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4>Resultado</h4>
                <p>{featured.result}</p>
              </div>
            </div>
            <div className="project-actions">
              <Button href={featured.githubUrl} icon={Github} variant="secondary">
                GitHub
              </Button>
              <Button href={featured.demoUrl} icon={ArrowUpRight} variant="ghost" disabled={!featured.demoUrl}>
                Demo em breve
              </Button>
            </div>
          </div>
        </motion.article>
      )}

      <div className="projects-grid">
        {regularProjects.map((project) => (
          <motion.article
            className="project-card"
            key={project.title}
            whileHover={{ y: -8, scale: 1.01 }}
            transition={{ duration: 0.22 }}
          >
            <ProjectMedia project={project} />
            <div className="project-card-content">
              <span className="project-label">{project.label}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="tag-row">
                {project.technologies.map((tech) => (
                  <span className="tech-tag" key={tech}>
                    {tech}
                  </span>
                ))}
              </div>
              <div className="project-problem">
                <h4>Problemas resolvidos</h4>
                <p>{project.problems.join(" ")}</p>
              </div>
              <div className="project-result">
                <h4>Resultado</h4>
                <p>{project.result}</p>
              </div>
              <div className="project-actions">
                <Button
                  href={project.githubUrl}
                  icon={project.githubUrl ? Github : LockKeyhole}
                  variant="secondary"
                  disabled={!project.githubUrl}
                >
                  {project.githubUrl ? "GitHub" : "Privado"}
                </Button>
                <Button href={project.demoUrl} icon={ArrowUpRight} variant="ghost" disabled={!project.demoUrl}>
                  {project.demoUrl ? "Demo" : "Sem demo"}
                </Button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
