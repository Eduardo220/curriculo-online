import { useCallback, useRef } from "react";
import { BriefcaseBusiness, Check, ShieldCheck } from "lucide-react";
import Section from "../common/Section.jsx";
import TagList from "../common/TagList.jsx";
import { experiences } from "../../data/portfolio.js";
import { useGsapContext } from "../../hooks/useGsapContext.js";
import { useReducedMotion } from "../../hooks/useReducedMotion.js";

export default function ExperienceSection() {
  const timelineRef = useRef(null);
  const reducedMotion = useReducedMotion();

  const setupTimeline = useCallback(({ gsap, ScrollTrigger }) => {
    const timeline = timelineRef.current;
    if (!timeline) return undefined;

    const items = gsap.utils.toArray(".editorial-experience__item", timeline);
    const reveal = gsap.fromTo(
      items,
      { opacity: 0.42, y: 54 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.34,
        ease: "none",
        paused: true,
      },
    );
    const trigger = ScrollTrigger.create({
      trigger: timeline,
      start: "top 76%",
      end: "bottom 48%",
      scrub: 0.7,
      animation: reveal,
      onUpdate: (self) => {
        timeline.style.setProperty("--experience-progress", self.progress.toFixed(4));
      },
    });

    return () => {
      trigger.kill();
      reveal.kill();
      timeline.style.removeProperty("--experience-progress");
    };
  }, []);

  useGsapContext(setupTimeline, {
    scope: timelineRef,
    enabled: !reducedMotion,
  });

  return (
    <Section
      id="experiencia"
      eyebrow="Experiência profissional"
      title="Minha experiência até aqui."
      description="O que tenho feito profissionalmente e um pouco da experiência que veio antes da área de tecnologia."
      className="experience-section editorial-section editorial-experience"
    >
      <div className="editorial-experience__overview" aria-hidden="true">
        <span>career.timeline</span>
        <div>
          <i />
          <i />
        </div>
        <strong>{String(experiences.length).padStart(2, "0")} capítulos</strong>
      </div>

      <div
        className="experience-list editorial-experience__timeline"
        ref={timelineRef}
      >
        {experiences.map((experience, index) => {
          const Icon = experience.current ? BriefcaseBusiness : ShieldCheck;

          return (
            <article
              className={`experience-item editorial-experience__item${
                experience.current ? " experience-item--current" : ""
              }`}
              key={experience.company}
            >
              <div className="experience-rail">
                <span>
                  <Icon size={19} aria-hidden="true" />
                </span>
                <small aria-hidden="true">{String(index + 1).padStart(2, "0")}</small>
              </div>

              <div className="experience-content">
                <header>
                  <div>
                    <span className="experience-period">
                      {experience.period}
                      {experience.current && experience.period.toLowerCase() !== "atual" ? (
                        <i>atual</i>
                      ) : null}
                    </span>
                    <h3>{experience.company}</h3>
                    <p>{experience.role}</p>
                  </div>
                  <span className="editorial-experience__chapter" aria-hidden="true">
                    capítulo {String(index + 1).padStart(2, "0")}
                  </span>
                </header>

                <p className="experience-summary">{experience.summary}</p>

                <div className="experience-groups">
                  {experience.groups.map((group, groupIndex) => (
                    <div key={group.title}>
                      <h4>
                        <span aria-hidden="true">{String(groupIndex + 1).padStart(2, "0")}</span>
                        {group.title}
                      </h4>
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
                  <TagList
                    items={experience.tools}
                    label={`Tecnologias usadas na ${experience.company}`}
                  />
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
