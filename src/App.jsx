import { Suspense, lazy } from "react";
import Background from "./components/layout/Background.jsx";
import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import Hero from "./components/sections/Hero.jsx";
import AboutSection from "./components/sections/AboutSection.jsx";
import ExperienceSection from "./components/sections/ExperienceSection.jsx";
import ProjectsSection from "./components/sections/ProjectsSection.jsx";
import StackSection from "./components/sections/StackSection.jsx";
import EducationSection from "./components/sections/EducationSection.jsx";
import ContactSection from "./components/sections/ContactSection.jsx";
import Section from "./components/common/Section.jsx";

const GithubSection = lazy(
  () => import("./components/sections/GithubSection.jsx"),
);

export default function App() {
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Background />
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
    </>
  );
}
