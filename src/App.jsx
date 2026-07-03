import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import Background from "./components/Background.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import AboutSection from "./components/AboutSection.jsx";
import StackSection from "./components/StackSection.jsx";
import ExperienceTimeline from "./components/ExperienceTimeline.jsx";
import ProjectsSection from "./components/ProjectsSection.jsx";
import StatsSection from "./components/StatsSection.jsx";
import ContactSection from "./components/ContactSection.jsx";
import Footer from "./components/Footer.jsx";
import Section from "./components/Section.jsx";
import { profile } from "./data/portfolio.js";

const GithubSection = lazy(() => import("./components/GithubSection.jsx"));

export default function App() {
  return (
    <>
      <Background />
      <Header />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <Hero />
        <AboutSection />
        <StackSection />
        <ExperienceTimeline />
        <ProjectsSection />
        <StatsSection />
        <Suspense
          fallback={
            <Section eyebrow="GitHub" title="Atividade técnica em carregamento">
              <div className="surface-panel github-skeleton" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            </Section>
          }
        >
          <GithubSection username={profile.githubUsername} />
        </Suspense>
        <ContactSection />
      </motion.main>
      <Footer />
    </>
  );
}
