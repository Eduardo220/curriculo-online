import { motion, useReducedMotion } from "framer-motion";
import { BriefcaseBusiness, Check, ShieldCheck } from "lucide-react";
import Section from "../common/Section.jsx";
import TagList from "../common/TagList.jsx";
import { experiences } from "../../data/portfolio.js";

export default function ExperienceSection() {
  const reduceMotion = useReducedMotion();

  return (
    <Section
      id="experiencia"
      eyebrow="Experiência profissional"
      title="Sistemas em operação pedem contexto, precisão e responsabilidade."
      description="Duas experiências diferentes, apresentadas sem misturar emprego com conceito: desenvolvimento de software em operações digitais e uma base anterior em ambiente operacional estruturado."
      className="experience-section"
    >
      <div className="experience-list">
        {experiences.map((experience, index) => {
          const Icon = experience.current ? BriefcaseBusiness : ShieldCheck;

          return (
            <motion.article
              className={`experience-item${experience.current ? " experience-item--current" : ""}`}
              key={experience.company}
              initial={reduceMotion ? false : { opacity: 0, x: -22 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <div className="experience-rail">
                <span>
                  <Icon size={19} aria-hidden="true" />
                </span>
              </div>

              <div className="experience-content">
                <header>
                  <div>
                    <span className="experience-period">
                      {experience.period}
                      {experience.current ? <i>atual</i> : null}
                    </span>
                    <h3>{experience.company}</h3>
                    <p>{experience.role}</p>
                  </div>
                </header>

                <p className="experience-summary">{experience.summary}</p>

                <div className="experience-groups">
                  {experience.groups.map((group) => (
                    <div key={group.title}>
                      <h4>{group.title}</h4>
                      <ul>
                        {group.items.map((item) => (
                          <li key={item}>
                            <Check size={15} aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {experience.tools.length ? (
                  <TagList items={experience.tools} label={`Tecnologias usadas na ${experience.company}`} />
                ) : null}
              </div>
            </motion.article>
          );
        })}
      </div>
    </Section>
  );
}
