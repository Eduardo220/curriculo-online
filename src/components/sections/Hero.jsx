import { motion, useReducedMotion } from "framer-motion";
import {
  ContactRound,
  Download,
  GitBranch,
  Mail,
  MapPin,
  RadioTower,
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
            Desenvolvo sistemas, integrações e aplicativos que precisam funcionar fora do ambiente
            de demonstração. Trabalho com backend, APIs e processamento assíncrono — e construo o
            Wayper, um app que transforma corridas em territórios usando GPS e mapas reais.
          </motion.p>

          <motion.div className="hero-actions" variants={heroItems}>
            <Button href="#wayper" icon={RadioTower}>
              Conhecer o Wayper
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
            <span>operation.trace</span>
            <i>online</i>
          </div>

          <div className="hero-system__map">
            <div className="hero-system__cells">
              {Array.from({ length: 30 }, (_, index) => (
                <span
                  className={[7, 8, 12, 13, 14, 18, 19, 24].includes(index) ? "is-active" : ""}
                  key={index}
                />
              ))}
            </div>
            <svg viewBox="0 0 420 260" focusable="false">
              <motion.path
                d="M18 224 C 82 192, 68 120, 142 144 S 230 196, 244 118 S 332 102, 402 28"
                fill="none"
                initial={reduceMotion ? false : { pathLength: 0 }}
                animate={reduceMotion ? undefined : { pathLength: 1 }}
                transition={{ duration: 2, delay: 0.6, ease: "easeInOut" }}
              />
            </svg>
            <span className="hero-system__pulse" />
          </div>

          <div className="hero-system__pipeline">
            <span>API</span>
            <i />
            <span>Worker</span>
            <i />
            <span>Queue</span>
            <i />
            <span>Data</span>
          </div>

          <div className="hero-system__metrics">
            <div>
              <small>trabalho atual</small>
              <strong>Venddor</strong>
            </div>
            <div>
              <small>produto próprio</small>
              <strong>Wayper</strong>
            </div>
            <div>
              <small>foco</small>
              <strong>sistemas reais</strong>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
