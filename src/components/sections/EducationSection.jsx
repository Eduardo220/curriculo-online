import { BookOpen, GraduationCap } from "lucide-react";
import Section from "../common/Section.jsx";
import { education } from "../../data/portfolio.js";

export default function EducationSection() {
  return (
    <Section
      id="formacao"
      eyebrow="Formação"
      title="Formação e cursos."
      description="Minha graduação e alguns cursos que complementam o que uso no dia a dia."
      className="education-section"
    >
      <div className="education-layout">
        <article className="degree-card">
          <div className="degree-card__icon">
            <GraduationCap size={26} aria-hidden="true" />
          </div>
          <div>
            <span>Graduação</span>
            <h3>{education.degree}</h3>
            <p>{education.institution}</p>
          </div>
          <strong>{education.period}</strong>
        </article>

        <article className="courses-card">
          <header>
            <BookOpen size={20} aria-hidden="true" />
            <h3>Cursos complementares</h3>
          </header>
          <ul>
            {education.complementary.map((course) => (
              <li key={course}>{course}</li>
            ))}
          </ul>
        </article>
      </div>
    </Section>
  );
}
