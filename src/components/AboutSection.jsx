import { Code2, Layers, Route, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Section from "./Section.jsx";
import { profile, professionalExperience } from "../data/portfolio.js";

const pillars = [
  { icon: Code2, title: "Backend", text: "C#, .NET, APIs REST, workers e serviços." },
  { icon: Layers, title: "Arquitetura", text: "Soluções organizadas, escaláveis e fáceis de manter." },
  { icon: Route, title: "Integrações", text: "Magento, filas, webhooks, ERPs e automações críticas." },
  { icon: Sparkles, title: "Produto", text: "Projetos próprios, mobile, experiência e evolução contínua." },
];

export default function AboutSection() {
  return (
    <Section
      id="sobre"
      eyebrow="Sobre mim"
      title="Engenharia aplicada a produto, integração e impacto real."
      description="Minha base é backend. Meu interesse é transformar sistemas complexos em experiências confiáveis para quem usa e para quem mantém."
    >
      <div className="about-layout">
        <motion.div
          className="about-photo"
          whileHover={{ scale: 1.015 }}
          transition={{ duration: 0.25 }}
        >
          <img src={profile.image} alt="Eduardo Weissheimer" loading="lazy" />
        </motion.div>

        <div className="about-content">
          <p>
            Sou desenvolvedor backend especializado em C#, .NET, APIs REST, workers,
            microsserviços e integrações. Gosto de entender o problema por trás do código,
            organizar fluxos com clareza e construir soluções que sobrevivem ao uso real.
          </p>
          <p>
            Hoje atuo como {professionalExperience.role} na {professionalExperience.company},
            trabalhando com integrações, correções críticas, filas, bancos de dados e sistemas
            conectados. Em paralelo, crio produtos próprios para testar ideias, arquitetura e
            experiência de ponta a ponta.
          </p>
          <p>
            O principal deles é o Wayper, um app mobile gamificado que transforma caminhadas e
            corridas em conquista territorial usando GPS em tempo real.
          </p>
        </div>
      </div>

      <div className="pillar-grid">
        {pillars.map(({ icon: Icon, title, text }) => (
          <motion.article
            className="pillar-card"
            key={title}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.22 }}
          >
            <Icon size={22} aria-hidden="true" />
            <h3>{title}</h3>
            <p>{text}</p>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
