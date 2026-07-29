import { Suspense, lazy } from "react";
import { MotionConfig } from "framer-motion";
import Background from "./components/layout/Background.jsx";
import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import BootSequence from "./components/effects/BootSequence.jsx";
import CustomCursor from "./components/effects/CustomCursor.jsx";
import Hero from "./components/sections/Hero.jsx";
import AboutSection from "./components/sections/AboutSection.jsx";
import ExperienceSection from "./components/sections/ExperienceSection.jsx";
import ProjectsSection from "./components/sections/ProjectsSection.jsx";
import StackSection from "./components/sections/StackSection.jsx";
import EducationSection from "./components/sections/EducationSection.jsx";
import ContactSection from "./components/sections/ContactSection.jsx";
import Section from "./components/common/Section.jsx";
import { motionConfig } from "./animation/motionConfig.js";
import { useLenis } from "./hooks/useLenis.js";

const GithubSection = lazy(
  () => import("./components/sections/GithubSection.jsx"),
);

const lenisOptions = Object.freeze({
  anchors: Object.freeze({ offset: -80 }),
});

export default function App() {
  useLenis({ options: lenisOptions });

  return (
    <MotionConfig {...motionConfig}>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <BootSequence />
      <Background />
      <CustomCursor />
      <Header />
      <main id="conteudo" tabIndex="-1">
        <Hero />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <StackSection />
        <EducationSection />
        <Suspense
          fallback={
            <Section
              id="github"
              eyebrow="GitHub público"
              title="Carregando os projetos do GitHub."
              className="github-section"
            >
              <div className="github-loading" aria-label="Carregando dados do GitHub">
                <span />
                <span />
                <span />
              </div>
            </Section>
          }
        >
          <GithubSection />
        </Suspense>
        <ContactSection />
      </main>
      <Footer />
    </MotionConfig>
  );
}
