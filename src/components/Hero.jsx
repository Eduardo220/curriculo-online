import { Download, Github, Linkedin, Mail, ServerCog } from "lucide-react";
import { motion } from "framer-motion";
import Button from "./Button.jsx";
import { profile } from "../data/portfolio.js";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.11, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero() {
  return (
    <section className="hero section" id="top">
      <div className="container hero-grid">
        <motion.div className="hero-copy" variants={container} initial="hidden" animate="visible">
          <motion.span className="eyebrow" variants={item}>
            Backend, integrações e arquitetura
          </motion.span>
          <motion.h1 variants={item}>
            {profile.name}
            <span>{profile.role}</span>
          </motion.h1>
          <motion.p className="hero-subtitle" variants={item}>
            Desenvolvimento produtos digitais com APIs confiáveis, integrações bem desenhadas e
            backend preparado para crescer.
          </motion.p>

          <motion.div className="hero-focus" variants={item}>
            {profile.focus.map((focus) => (
              <span key={focus}>{focus}</span>
            ))}
          </motion.div>

          <motion.div className="hero-actions" variants={item}>
            <Button href={profile.githubUrl} icon={Github}>
              GitHub
            </Button>
            <Button href={profile.linkedinUrl} icon={Linkedin} variant="secondary">
              LinkedIn
            </Button>
            <Button href={profile.cvUrl} icon={Download} variant="secondary" download>
              Download CV
            </Button>
            <Button href={`mailto:${profile.email}`} icon={Mail} variant="ghost">
              Contato
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          <div className="architecture-card">
            <div className="architecture-header">
              <span />
              <span />
              <span />
              <strong>system.flow</strong>
            </div>
            <div className="architecture-body">
              <motion.div
                className="node node-primary"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ServerCog size={20} />
                <span>API Gateway</span>
              </motion.div>
              <div className="node-grid">
                <motion.div
                  className="node"
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  .NET Worker
                </motion.div>
                <motion.div
                  className="node"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  RabbitMQ
                </motion.div>
                <motion.div
                  className="node"
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  SQL Server
                </motion.div>
                <motion.div
                  className="node"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  Wayper GPS
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
