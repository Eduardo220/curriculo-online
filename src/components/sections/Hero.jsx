import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ArrowDown,
  ContactRound,
  Download,
  GitBranch,
  Mail,
  MapPin,
} from "lucide-react";
import Button from "../common/Button.jsx";
import SceneErrorBoundary from "../three/SceneErrorBoundary.jsx";
import RevealText from "../transitions/RevealText.jsx";
import { profile } from "../../data/portfolio.js";
import { useGsapContext } from "../../hooks/useGsapContext.js";
import { usePerformanceMode } from "../../hooks/usePerformanceMode.js";

const HeroCanvas = lazy(() => import("../three/HeroCanvas.jsx"));

function HeroFallback() {
  return (
    <div className="hero-cinematic__fallback" aria-hidden="true">
      <div className="hero-cinematic__fallback-grid" />
      <svg
        className="hero-cinematic__fallback-route"
        viewBox="0 0 600 500"
        preserveAspectRatio="none"
      >
        <path d="M18 418 C110 330 94 176 206 230 S328 408 398 270 S480 84 580 126" />
      </svg>
    </div>
  );
}

export default function Hero() {
  const rootRef = useRef(null);
  const sceneProgressRef = useRef(0);
  const [sceneFailed, setSceneFailed] = useState(false);
  const performanceMode = usePerformanceMode();
  const { quality, webgl, reducedMotion, dpr } = performanceMode;
  const staticPreview = new URLSearchParams(window.location.search).has("static");
  const shouldRenderScene = webgl && quality !== "low" && !reducedMotion && !sceneFailed;

  const setupHeroMotion = useCallback(
    ({ gsap, ScrollTrigger }) => {
      const intro = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });

      intro
        .fromTo(
          ".hero-cinematic__meta > *, .hero-cinematic__role",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.46, stagger: 0.06 },
        )
        .fromTo(
          ".hero-cinematic__title .reveal-text__line",
          { yPercent: 112 },
          { yPercent: 0, duration: 0.84, stagger: 0.08 },
          0.1,
        )
        .fromTo(
          ".hero-cinematic__lead",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.58 },
          0.34,
        )
        .fromTo(
          ".hero-cinematic__actions, .hero-cinematic__contact-line",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.48, stagger: 0.08 },
          0.48,
        )
        .fromTo(
          ".hero-cinematic__visual",
          { opacity: 0, scale: 0.94, y: 28 },
          { opacity: 1, scale: 1, y: 0, duration: 0.92 },
          0.18,
        )
        .fromTo(
          ".hero-cinematic__hud > *, .hero-cinematic__readout",
          { opacity: 0 },
          { opacity: 1, duration: 0.38, stagger: 0.08 },
          0.62,
        );

      const playIntro = () => intro.play(0);
      let bootPending = document.documentElement.classList.contains("is-booting");
      try {
        bootPending ||= window.sessionStorage.getItem("portfolio.boot.v1") !== "complete";
      } catch {
        // If storage is unavailable, the loader event remains the source of truth.
      }

      if (bootPending) {
        window.addEventListener("portfolio:ready", playIntro, { once: true });
      } else {
        playIntro();
      }

      const exitTimeline = gsap.timeline({ paused: true });
      exitTimeline
        .to(
          ".hero-cinematic__copy",
          { yPercent: -8, opacity: 0.45, duration: 1, ease: "none" },
          0,
        )
        .to(
          ".hero-cinematic__visual-stage",
          {
            yPercent: 9,
            scale: 0.965,
            opacity: 0.18,
            duration: 1,
            ease: "none",
          },
          0,
        );

      const trigger = ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 0.7,
        animation: exitTimeline,
        onUpdate: (self) => {
          sceneProgressRef.current = self.progress;
        },
      });

      return () => {
        window.removeEventListener("portfolio:ready", playIntro);
        trigger.kill();
        intro.kill();
        exitTimeline.kill();
      };
    },
    [],
  );

  useGsapContext(setupHeroMotion, {
    scope: rootRef,
    enabled: !reducedMotion && !staticPreview,
  });

  useEffect(() => {
    if (!reducedMotion) return;
    sceneProgressRef.current = 0;
  }, [reducedMotion]);

  return (
    <section
      ref={rootRef}
      className="hero-cinematic"
      id="top"
      aria-labelledby="hero-title"
    >
      <div className="container hero-cinematic__layout">
        <div className="hero-cinematic__copy">
          <div className="hero-cinematic__meta">
            <span>
              <MapPin size={14} aria-hidden="true" />
              {profile.location}
            </span>
            <span>
              <i /> sistema disponível
            </span>
          </div>

          <h1 className="hero-cinematic__title" id="hero-title">
            <RevealText>Eduardo</RevealText>
            <RevealText>Weissheimer</RevealText>
          </h1>

          <p className="hero-cinematic__role">{profile.role}</p>

          <p className="hero-cinematic__lead">
            Sou desenvolvedor de software e trabalho principalmente com backend e aplicativos
            mobile. Aqui reuni um pouco da minha experiência, das tecnologias que uso e dos
            projetos que construo.
          </p>

          <div className="hero-cinematic__actions">
            <Button href="#projetos" icon={ArrowDown} cursorLabel="projetos">
              Ver projetos
            </Button>
            <Button
              href={profile.githubUrl}
              icon={GitBranch}
              variant="secondary"
              cursorLabel="GitHub"
            >
              GitHub
            </Button>
            <Button
              href={profile.linkedinUrl}
              icon={ContactRound}
              variant="secondary"
              cursorLabel="LinkedIn"
            >
              LinkedIn
            </Button>
            <Button href={profile.cvUrl} icon={Download} variant="ghost" download>
              Baixar currículo
            </Button>
          </div>

          <div className="hero-cinematic__contact-line">
            <a className="hero-cinematic__email" href={`mailto:${profile.email}`}>
              <Mail size={15} aria-hidden="true" />
              {profile.email}
            </a>
            <span className="hero-cinematic__availability">Experiência atual · Venddor</span>
          </div>
        </div>

        <div
          className="hero-cinematic__visual"
          role="img"
          aria-label="Terreno cartográfico abstrato com uma rota conectando sistemas backend, dados e mobile"
        >
          <div className="hero-cinematic__visual-stage">
            <SceneErrorBoundary
              fallback={<HeroFallback />}
              resetKeys={[quality, webgl]}
              onError={() => setSceneFailed(true)}
            >
              {shouldRenderScene ? (
                <Suspense fallback={<HeroFallback />}>
                  <HeroCanvas
                    quality={quality}
                    dpr={dpr}
                    progressRef={sceneProgressRef}
                    onFailure={() => setSceneFailed(true)}
                  />
                </Suspense>
              ) : (
                <HeroFallback />
              )}
            </SceneErrorBoundary>

            <div className="hero-cinematic__hud" aria-hidden="true">
              <div className="hero-cinematic__hud-top">
                <span>geo.workspace / 01</span>
                <span>{shouldRenderScene ? "WebGL ativo" : "modo essencial"}</span>
              </div>
              <div className="hero-cinematic__hud-bottom">
                <span>backend → mobile → dados</span>
                <span>qualidade / {quality}</span>
              </div>
            </div>

            <div className="hero-cinematic__readout" aria-hidden="true">
              <div>
                <small>especialidade</small>
                <strong>Backend</strong>
              </div>
              <div>
                <small>interface</small>
                <strong>Mobile</strong>
              </div>
              <div>
                <small>stack</small>
                <strong>C# · .NET</strong>
              </div>
              <div>
                <small>mapas</small>
                <strong>MapLibre</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-cinematic__scroll" aria-hidden="true">
        explorar <i />
      </div>
    </section>
  );
}
