import { BriefcaseBusiness, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Section from "./Section.jsx";
import { professionalExperience, timeline } from "../data/portfolio.js";

export default function ExperienceTimeline() {
  return (
    <Section
      id="experiencia"
      eyebrow="Experiência"
      title="Evolução profissional com foco cada vez maior em engenharia."
      description="Da disciplina operacional à construção de software: processos, responsabilidade e entrega técnica conectados."
    >
      <div className="timeline">
        {timeline.map((item, index) => (
          <motion.article
            className="timeline-item"
            key={item.title}
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
          >
            <span className="timeline-marker" />
            <div>
              <span className="timeline-period">{item.period}</span>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
            </div>
          </motion.article>
        ))}
      </div>

      <article className="professional-card">
        <div className="professional-heading">
          <div className="card-icon">
            <BriefcaseBusiness size={22} aria-hidden="true" />
          </div>
          <div>
            <span className="eyebrow">Experiência profissional</span>
            <h3>
              {professionalExperience.company} · {professionalExperience.role}
            </h3>
            <p>{professionalExperience.description}</p>
          </div>
        </div>

        <div className="activity-grid">
          {professionalExperience.activities.map((activity) => (
            <div className="activity-item" key={activity}>
              <CheckCircle2 size={18} aria-hidden="true" />
              <span>{activity}</span>
            </div>
          ))}
        </div>
      </article>
    </Section>
  );
}
