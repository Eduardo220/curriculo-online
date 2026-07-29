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
      className="education-section editorial-section editorial-education"
    >
      <div className="editorial-education__rail" aria-hidden="true">
        <span>learning.path</span>
        <i />
        <strong>em evolução</strong>
      </div>

      <div className="education-layout editorial-education__layout">
        <article className="degree-card editorial-education__degree">
          <span className="editorial-education__index" aria-hidden="true">
            01
          </span>
          <div className="degree-card__icon">
            <GraduationCap size={26} aria-hidden="true" />
          </div>
          <div>
            <span>Graduação</span>
            <h3>{education.degree}</h3>
            <p>{education.institution}</p>
          </div>
          <strong>{education.period}</strong>
          <span className="editorial-education__progress" aria-hidden="true">
            <i />
          </span>
        </article>

        <article className="courses-card editorial-education__courses">
          <header>
            <BookOpen size={20} aria-hidden="true" />
            <div>
              <span aria-hidden="true">02 · complemento</span>
              <h3>Cursos complementares</h3>
            </div>
          </header>
          <ul>
            {education.complementary.map((course, index) => (
              <li key={course}>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                {course}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </Section>
  );
}
