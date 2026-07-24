import { motion, useReducedMotion } from "framer-motion";
import Section from "../common/Section.jsx";
import { profile, workingPrinciples } from "../../data/portfolio.js";

export default function AboutSection() {
  const reduceMotion = useReducedMotion();

  return (
    <Section
      id="sobre"
      eyebrow="Sobre mim"
      title="Um pouco sobre mim."
      description="Sou desenvolvedor de software com foco em backend e mobile. Gosto de entender o problema por inteiro antes de começar a mexer no código."
      className="about-section"
    >
      <div className="about-layout">
        <figure className="about-portrait">
          <div className="about-portrait__frame">
            <img
              src={profile.image}
              alt="Eduardo Weissheimer em retrato profissional"
              width="1200"
              height="1600"
              loading="lazy"
              decoding="async"
            />
          </div>
          <figcaption>
            <span>base.location</span>
            {profile.location}
          </figcaption>
        </figure>

        <div className="about-copy">
          <p>
            Hoje trabalho na Venddor com APIs, serviços e aplicativos mobile usados em operações
            de e-commerce. Além de desenvolver novas partes do sistema, também faço manutenção e
            investigo problemas que aparecem no dia a dia.
          </p>
          <p>
            Gosto bastante dessa parte mais investigativa: olhar logs, conferir dados, entender a
            regra de negócio e acompanhar o fluxo até encontrar a causa.
          </p>
          <p>
            Fora do trabalho, mantenho projetos próprios para estudar e testar ideias. É onde
            consigo juntar backend, mobile e outras tecnologias que tenho vontade de explorar.
          </p>
        </div>
      </div>

      <div className="principles-grid">
        {workingPrinciples.map((principle, index) => (
          <motion.article
            key={principle.code}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
          >
            <span>{principle.code}</span>
            <h3>{principle.title}</h3>
            <p>{principle.text}</p>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
