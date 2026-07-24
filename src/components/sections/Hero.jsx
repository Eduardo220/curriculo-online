import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ContactRound,
  Download,
  GitBranch,
  Mail,
  MapPin,
} from "lucide-react";
import Button from "../common/Button.jsx";
import { profile } from "../../data/portfolio.js";

const heroItems = {
  hidden: { y: 22 },
  visible: {
    y: 0,
    transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
  },
};

const activeWorkspaceCells = new Set([8, 9, 13, 14, 15, 16, 19, 20, 21]);

const linkedWorkspaceCells = new Set([3, 4, 10, 17, 22, 27]);

const workspaceCellLabels = new Map([
  [8, "api"],
  [14, "core"],
  [16, "db"],
  [20, "app"],
]);

const workspaceBoundary = "M2 1 H4 V2 H5 V3 H4 V4 H1 V2 H2 Z";

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? false : "hidden";
  const animate = reduceMotion ? undefined : "visible";

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <motion.div
          className="hero-copy"
          initial={initial}
          animate={animate}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1, delayChildren: 0.05 },
            },
          }}
        >
          <motion.div className="hero-location" variants={heroItems}>
            <MapPin size={14} aria-hidden="true" />
            {profile.location}
          </motion.div>

          <motion.p className="eyebrow" variants={heroItems}>
            {profile.specialty}
          </motion.p>

          <motion.h1 id="hero-title" variants={heroItems}>
            <span>{profile.name}</span>
            {profile.role}
          </motion.h1>

          <motion.p className="hero-lead" variants={heroItems}>
            Sou desenvolvedor de software e trabalho principalmente com backend e aplicativos
            mobile. Aqui reuni um pouco da minha experiência, das tecnologias que uso e dos
            projetos que construo.
          </motion.p>

          <motion.div className="hero-actions" variants={heroItems}>
            <Button href="#projetos" icon={ArrowDown}>
              Ver projetos
            </Button>
            <Button href={profile.githubUrl} icon={GitBranch} variant="secondary">
              GitHub
            </Button>
            <Button href={profile.linkedinUrl} icon={ContactRound} variant="secondary">
              LinkedIn
            </Button>
            <Button href={profile.cvUrl} icon={Download} variant="ghost" download>
              Baixar currículo
            </Button>
          </motion.div>

          <motion.a className="hero-email" href={`mailto:${profile.email}`} variants={heroItems}>
            <Mail size={15} aria-hidden="true" />
            {profile.email}
          </motion.a>
        </motion.div>

        <motion.div
          className="hero-system"
          aria-hidden="true"
          initial={reduceMotion ? false : { scale: 0.96, y: 18 }}
          animate={reduceMotion ? undefined : { scale: 1, y: 0 }}
          transition={{ duration: 0.72, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero-system__header">
            <span>dev.workspace</span>
            <i>branch / dev</i>
          </div>

          <div className="hero-system__map">
            <div className="hero-system__cells">
              {Array.from({ length: 30 }, (_, index) => {
                const state = activeWorkspaceCells.has(index)
                  ? "is-active"
                  : linkedWorkspaceCells.has(index)
                    ? "is-linked"
                    : "";

                return (
                  <span className={state} key={index}>
                    {workspaceCellLabels.has(index) ? (
                      <small className="hero-system__cell-label">
                        {workspaceCellLabels.get(index)}
                      </small>
                    ) : null}
                  </span>
                );
              })}

              <svg
                className="hero-system__workspace"
                viewBox="0 0 6 5"
                preserveAspectRatio="none"
                focusable="false"
              >
                <path
                  className="hero-system__workspace-shadow"
                  d={workspaceBoundary}
                />
                <path
                  className="hero-system__workspace-glow"
                  d={workspaceBoundary}
                />
                <motion.path
                  className="hero-system__workspace-boundary"
                  d={workspaceBoundary}
                  initial={reduceMotion ? false : { opacity: 0, fillOpacity: 0 }}
                  animate={reduceMotion ? undefined : { opacity: 1, fillOpacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.55, ease: "easeOut" }}
                />
                <circle
                  className="hero-system__workspace-node hero-system__workspace-node--lime"
                  cx="2"
                  cy="1"
                  r=".07"
                />
                <circle
                  className="hero-system__workspace-node hero-system__workspace-node--blue"
                  cx="5"
                  cy="3"
                  r=".07"
                />
                <circle
                  className="hero-system__workspace-node hero-system__workspace-node--lime"
                  cx="1"
                  cy="4"
                  r=".07"
                />
              </svg>
            </div>

            <div className="hero-system__map-readout">
              <small>workspace.scope</small>
              <strong>backend + mobile</strong>
            </div>

            <div className="hero-system__map-health">
              <i />
              <span>04 módulos ativos</span>
            </div>
          </div>

          <div className="hero-system__pipeline">
            <span>API</span>
            <i />
            <span>Serviço</span>
            <i />
            <span>Mobile</span>
            <i />
            <span>Dados</span>
          </div>

          <div className="hero-system__metrics">
            <div>
              <small>trabalho atual</small>
              <strong>Venddor</strong>
            </div>
            <div>
              <small>backend</small>
              <strong>C# e .NET</strong>
            </div>
            <div>
              <small>mobile</small>
              <strong>React Native</strong>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
