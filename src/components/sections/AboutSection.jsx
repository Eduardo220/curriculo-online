import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import Section from "../common/Section.jsx";
import { profile, workingPrinciples } from "../../data/portfolio.js";

export default function AboutSection() {
  const reduceMotion = useReducedMotion();
  const portraitX = useMotionValue(0);
  const portraitY = useMotionValue(0);
  const smoothX = useSpring(portraitX, { stiffness: 160, damping: 22, mass: 0.5 });
  const smoothY = useSpring(portraitY, { stiffness: 160, damping: 22, mass: 0.5 });
  const rotateX = useTransform(smoothY, [-1, 1], [2.4, -2.4]);
  const rotateY = useTransform(smoothX, [-1, 1], [-2.8, 2.8]);

  function handlePortraitPointerMove(event) {
    if (reduceMotion || event.pointerType !== "mouse") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    portraitX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 2);
    portraitY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 2);
  }

  function resetPortrait() {
    portraitX.set(0);
    portraitY.set(0);
  }

  return (
    <Section
      id="sobre"
      eyebrow="Sobre mim"
      title="Um pouco sobre mim."
      description="Sou desenvolvedor de software com foco em backend e mobile. Gosto de entender o problema por inteiro antes de começar a mexer no código."
      className="about-section editorial-section editorial-about"
    >
      <div className="about-layout editorial-about__layout">
        <figure
          className="about-portrait editorial-portrait"
          onPointerMove={handlePortraitPointerMove}
          onPointerLeave={resetPortrait}
          onPointerCancel={resetPortrait}
        >
          <div className="editorial-portrait__coordinates" aria-hidden="true">
            <span>geo.profile</span>
            <span>SC · BR</span>
          </div>
          <motion.div
            className="about-portrait__frame editorial-portrait__frame"
            style={reduceMotion ? undefined : { rotateX, rotateY }}
          >
            <img
              src={profile.image}
              alt="Retrato de Eduardo Weissheimer"
              width="1200"
              height="1600"
              loading="lazy"
              decoding="async"
            />
            <span className="editorial-portrait__scan" aria-hidden="true" />
            <span
              className="editorial-portrait__corner editorial-portrait__corner--top"
              aria-hidden="true"
            />
            <span
              className="editorial-portrait__corner editorial-portrait__corner--bottom"
              aria-hidden="true"
            />
          </motion.div>
          <figcaption>
            <span>base.location</span>
            {profile.location}
          </figcaption>
        </figure>

        <div className="about-copy editorial-about__copy">
          <p data-editorial-index="01">
            Hoje trabalho na Venddor com APIs, serviços e aplicativos mobile usados em operações
            de e-commerce. Além de desenvolver novas partes do sistema, também faço manutenção e
            investigo problemas que aparecem no dia a dia.
          </p>
          <p data-editorial-index="02">
            Gosto bastante dessa parte mais investigativa: olhar logs, conferir dados, entender a
            regra de negócio e acompanhar o fluxo até encontrar a causa.
          </p>
          <p data-editorial-index="03">
            Fora do trabalho, mantenho projetos próprios para estudar e testar ideias. É onde
            consigo juntar backend, mobile e outras tecnologias que tenho vontade de explorar.
          </p>

          <div className="editorial-about__signal" aria-hidden="true">
            <span>observe</span>
            <i />
            <span>understand</span>
            <i />
            <span>build</span>
          </div>
        </div>
      </div>

      <div className="principles-grid editorial-principles">
        {workingPrinciples.map((principle, index) => (
          <motion.article
            key={principle.code}
            whileHover={reduceMotion ? undefined : { y: -4 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="editorial-principles__meta">
              <span>{principle.code}</span>
              <small aria-hidden="true">0{index + 1} / 03</small>
            </div>
            <h3>{principle.title}</h3>
            <p>{principle.text}</p>
            <span className="editorial-principles__line" aria-hidden="true" />
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
