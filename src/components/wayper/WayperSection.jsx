import { useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  CloudOff,
  Database,
  GitBranch,
  LocateFixed,
  MapPinned,
  RadioTower,
  Route,
  Satellite,
  Sparkles,
} from "lucide-react";
import Button from "../common/Button.jsx";
import TagList from "../common/TagList.jsx";
import usePerformanceMode from "../../hooks/usePerformanceMode.js";
import {
  gsap,
  registerGsapPlugins,
} from "../../animation/gsap.js";
import WayperArchitectureDiagram from "./WayperArchitectureDiagram.jsx";
import WayperFallback from "./WayperFallback.jsx";
import WayperVisual from "./WayperVisual.jsx";
import { wayper } from "../../data/portfolio.js";

const chapterIcons = [Satellite, LocateFixed, Route, MapPinned, CloudOff, Database, Sparkles];

const initialSceneState = {
  route: 0,
  territory: 0,
  burst: 0,
  sync: 0,
  architecture: 0,
  glow: 0,
  phoneX: 0,
  phoneY: 0.08,
  phoneZ: 0.25,
  phoneRotX: -0.06,
  phoneRotY: -0.34,
  phoneRotZ: -0.04,
  cameraX: 0,
  cameraY: 0.12,
  cameraZ: 9.7,
  pointerX: 0,
  pointerY: 0,
  pointerInfluence: 0.8,
};

const finalSceneState = {
  ...initialSceneState,
  route: 1,
  territory: 1,
  burst: 1,
  sync: 0.34,
  architecture: 0.18,
  glow: 0.32,
  phoneZ: 0,
  phoneRotX: -0.04,
  phoneRotY: 0.24,
  phoneRotZ: 0.025,
  cameraZ: 10.2,
};

function buildChapters() {
  const territoryDecision = wayper.engineering.find(
    (item) => item.title === "Território geoespacial",
  );
  const continuityDecision = wayper.engineering.find(
    (item) => item.title === "Continuidade da corrida",
  );

  return [
    {
      code: "01",
      eyebrow: "Descoberta",
      title: "Uma corrida começa a redesenhar o mapa.",
      text: wayper.description,
      notes: ["Cena e valores estritamente demonstrativos", "Conteúdo equivalente disponível no DOM"],
    },
    {
      code: "02",
      eyebrow: "Início da corrida",
      title: "O sinal vira uma rota em movimento.",
      text: wayper.capabilities[0],
      notes: [wayper.capabilities[1], "A HUD está marcada como DEMO"],
    },
    {
      code: "03",
      eyebrow: "Área aberta",
      title: "Registrar pontos não basta: é preciso confiar neles.",
      text: wayper.problem,
      notes: [wayper.engineering[0].text, wayper.engineering[3].text],
    },
    {
      code: "04",
      eyebrow: "Fechamento territorial",
      title: "A rota fecha. O território ganha volume.",
      text: territoryDecision?.text ?? wayper.solution,
      notes: ["A forma mostrada é uma simulação visual", wayper.capabilities[2]],
      climax: true,
    },
    {
      code: "05",
      eyebrow: "Persistência e sincronização",
      title: "A atividade continua mesmo quando a rede não acompanha.",
      text: continuityDecision?.text ?? wayper.solution,
      notes: [wayper.architecture[2].text, wayper.architecture[3].text],
    },
    {
      code: "06",
      eyebrow: "Arquitetura",
      title: "Cada etapa tem uma responsabilidade clara.",
      text: wayper.solution,
      notes: wayper.architecture.map((step) => `${step.title}: ${step.text}`),
      architecture: true,
    },
    {
      code: "07",
      eyebrow: "Encerramento",
      title: "O mapa guarda o resultado e o projeto continua evoluindo.",
      text: wayper.learnings[0],
      notes: [wayper.learnings[1], wayper.learnings[2]],
      final: true,
    },
  ];
}

export default function WayperSection() {
  const rootRef = useRef(null);
  const storyRef = useRef(null);
  const stageRef = useRef(null);
  const sceneStateRef = useRef({ ...initialSceneState });
  const activeChapterRef = useRef(0);
  const [activeChapter, setActiveChapter] = useState(0);
  const performance = usePerformanceMode();
  const chapters = useMemo(() => buildChapters(), []);
  const renderedChapter = performance.reducedMotion
    ? chapters.length - 1
    : activeChapter;

  useLayoutEffect(() => {
    const root = rootRef.current;
    const story = storyRef.current;
    const stage = stageRef.current;
    const scene = sceneStateRef.current;
    if (!root || !story || !stage) return undefined;

    if (performance.reducedMotion) {
      Object.assign(scene, finalSceneState);
      activeChapterRef.current = chapters.length - 1;
      root.dataset.wayperChapter = String(chapters.length - 1);
      return undefined;
    }

    registerGsapPlugins();
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(
        {
          desktop: "(min-width: 64rem)",
          compact: "(max-width: 63.999rem)",
        },
        ({ conditions }) => {
          const desktop = Boolean(conditions.desktop);
          Object.assign(scene, initialSceneState);
          activeChapterRef.current = 0;
          setActiveChapter(0);

          const syncPresentation = (timeline) => {
            const progress = timeline.progress();
            const nextChapter = Math.min(
              chapters.length - 1,
              Math.floor(progress * chapters.length),
            );

            stage.style.setProperty("--wayper-route-progress", scene.route.toFixed(4));
            stage.style.setProperty("--wayper-territory-progress", scene.territory.toFixed(4));
            stage.style.setProperty("--wayper-sync-progress", scene.sync.toFixed(4));
            root.dataset.wayperChapter = String(nextChapter);

            if (nextChapter !== activeChapterRef.current) {
              activeChapterRef.current = nextChapter;
              setActiveChapter(nextChapter);
            }
          };

          let timeline;
          timeline = gsap.timeline({
            defaults: { duration: 1, ease: "none" },
            onUpdate: () => syncPresentation(timeline),
            scrollTrigger: {
              trigger: story,
              start: desktop ? "top top+=72" : "top 82%",
              end: desktop ? "bottom bottom" : "bottom 18%",
              scrub: desktop ? 1.05 : 0.45,
              pin: desktop ? stage : false,
              pinSpacing: false,
              anticipatePin: desktop ? 1 : 0,
              invalidateOnRefresh: true,
            },
          });

          timeline
            .to(scene, {
              cameraZ: 9.15,
              phoneZ: 0,
              phoneRotY: -0.2,
              glow: 0.12,
              pointerInfluence: 0.8,
            })
            .to(scene, {
              route: 0.28,
              phoneRotX: 0.08,
              phoneRotY: 0.2,
              phoneRotZ: 0.018,
              cameraY: -0.04,
            })
            .to(scene, {
              route: 0.7,
              phoneRotX: -0.11,
              phoneRotY: -0.12,
              cameraX: -0.2,
              cameraZ: 8.75,
              pointerInfluence: 0.42,
            })
            .to(scene, {
              route: 1,
              territory: 1,
              burst: 1,
              glow: 1,
              phoneRotX: 0.05,
              phoneRotY: 0.16,
              phoneZ: 0.16,
              cameraZ: 8.55,
              pointerInfluence: 0.08,
            })
            .to(scene, {
              sync: 1,
              glow: 0.38,
              phoneX: -1.3,
              phoneRotY: 0.32,
              cameraX: 0.28,
              cameraZ: 9.5,
              pointerInfluence: 0.24,
            })
            .to(scene, {
              architecture: 1,
              sync: 0.82,
              phoneX: -1.75,
              phoneRotY: 0.5,
              cameraX: 0.52,
              cameraZ: 10.4,
            })
            .to(scene, {
              sync: 0.34,
              architecture: 0.18,
              glow: 0.32,
              phoneX: 0,
              phoneY: 0.04,
              phoneZ: 0,
              phoneRotX: -0.04,
              phoneRotY: 0.24,
              phoneRotZ: 0.025,
              cameraX: 0,
              cameraY: 0.08,
              cameraZ: 10.2,
              pointerInfluence: 0.56,
            });

          syncPresentation(timeline);
          return () => {
            timeline.scrollTrigger?.kill();
            timeline.kill();
          };
        },
      );
    }, root);

    return () => {
      media.revert();
      context.revert();
      Object.assign(scene, initialSceneState);
    };
  }, [chapters.length, performance.reducedMotion]);

  return (
    <section
      id="wayper"
      className="wayper-experience"
      aria-labelledby="wayper-project-title"
      ref={rootRef}
      data-wayper-chapter="0"
    >
      <header className="wayper-experience__intro">
        <div className="wayper-experience__identity">
          <span className="eyebrow">Projeto em destaque</span>
          <span className="wayper-experience__status">
            <i /> {wayper.label}
          </span>
        </div>

        <div className="wayper-experience__headline">
          <div>
            <span className="wayper-experience__coordinate">interface · cena territorial demonstrativa</span>
            <h3 id="wayper-project-title">{wayper.name}</h3>
          </div>
          <p>{wayper.summary}</p>
        </div>

        <div className="wayper-experience__intro-actions">
          <Button href={wayper.githubUrl} icon={GitBranch}>
            Ver código no GitHub
          </Button>
          <a className="text-link" href="#arquitetura-wayper">
            Explorar arquitetura <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
      </header>

      <div className="wayper-story" ref={storyRef}>
        <div className="wayper-stage-shell">
          <div
            className="wayper-stage"
            ref={stageRef}
            aria-describedby="wayper-scene-description"
          >
            <WayperVisual
              activeChapter={renderedChapter}
              performance={performance}
              sceneStateRef={sceneStateRef}
            />

            <div className="wayper-stage__chrome" aria-hidden="true">
              <span>WAYPER / TERRITORY SYSTEM</span>
              <span>CH {String(renderedChapter + 1).padStart(2, "0")} / 07</span>
            </div>
            <div className="wayper-stage__quality" aria-hidden="true">
              <i /> {performance.quality} · {performance.webgl ? "webgl" : "2d"}
            </div>
            <div className="wayper-stage__progress" aria-hidden="true">
              <span style={{ transform: `scaleX(${(renderedChapter + 1) / chapters.length})` }} />
            </div>

            <p className="wayper-visually-hidden" id="wayper-scene-description">
              A visualização é demonstrativa. Ela representa uma rota que cresce, fecha um
              território, persiste dados localmente e os sincroniza. Não apresenta métricas reais
              de usuários.
            </p>
          </div>
        </div>

        <div className="wayper-chapters">
          <div className="wayper-chapters__rail" aria-hidden="true">
            {chapters.map((chapter, index) => (
              <span className={index <= renderedChapter ? "is-active" : ""} key={chapter.code} />
            ))}
          </div>

          {chapters.map((chapter, index) => {
            const Icon = chapterIcons[index];
            return (
              <article
                className={`wayper-chapter${chapter.climax ? " wayper-chapter--climax" : ""}`}
                data-active={index === renderedChapter ? "true" : "false"}
                key={chapter.code}
              >
                <header>
                  <span className="wayper-chapter__index">{chapter.code}</span>
                  <span className="wayper-chapter__icon">
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <span className="eyebrow">{chapter.eyebrow}</span>
                    <h4>{chapter.title}</h4>
                  </div>
                </header>

                <p>{chapter.text}</p>
                <ul>
                  {chapter.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>

                {chapter.climax ? (
                  <div className="wayper-chapter__mobile-climax" aria-hidden="true">
                    <WayperFallback activeChapter={3} reason="mobile-climax" />
                  </div>
                ) : null}

                {chapter.architecture ? (
                  <div id="arquitetura-wayper">
                    <WayperArchitectureDiagram reducedMotion={performance.reducedMotion} />
                  </div>
                ) : null}

                {chapter.final ? (
                  <div className="wayper-chapter__cta">
                    <Button href={wayper.githubUrl} icon={GitBranch} variant="secondary">
                      Abrir repositório
                    </Button>
                    <span>Projeto pessoal em desenvolvimento</span>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>

      <div className="wayper-dossier">
        <header className="wayper-dossier__heading">
          <span className="eyebrow">Implementação real</span>
          <h4>O que existe no projeto, além da cena.</h4>
          <p>
            A apresentação acima usa uma rota fictícia e valores demonstrativos. Os itens abaixo
            descrevem o conteúdo profissional real do Wayper.
          </p>
        </header>

        <div className="wayper-dossier__grid">
          <article className="wayper-capability-list">
            <header>
              <CheckCircle2 size={21} aria-hidden="true" />
              <div>
                <span className="eyebrow">O que já funciona</span>
                <h5>Capacidades atuais</h5>
              </div>
            </header>
            <ul>
              {wayper.capabilities.map((capability) => (
                <li key={capability}>{capability}</li>
              ))}
            </ul>
          </article>

          <article className="wayper-engineering-list">
            <header>
              <RadioTower size={21} aria-hidden="true" />
              <div>
                <span className="eyebrow">Parte técnica</span>
                <h5>Decisões de engenharia</h5>
              </div>
            </header>
            <div>
              {wayper.engineering.map((item, index) => (
                <section key={item.title} aria-labelledby={`wayper-engineering-${index}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h6 id={`wayper-engineering-${index}`}>{item.title}</h6>
                    <p>{item.text}</p>
                  </div>
                </section>
              ))}
            </div>
          </article>
        </div>

        <div className="wayper-evolution-grid">
          <article>
            <span className="eyebrow">Próximos passos</span>
            <h5>O que quero melhorar</h5>
            <ul>
              {wayper.nextSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </article>
          <article>
            <span className="eyebrow">Aprendizados</span>
            <h5>O que aprendi até aqui</h5>
            <ul>
              {wayper.learnings.map((learning) => (
                <li key={learning}>{learning}</li>
              ))}
            </ul>
          </article>
        </div>

        <footer className="wayper-stack-panel">
          <div>
            <span className="eyebrow">Tecnologias usadas</span>
            <p>A stack atual do projeto.</p>
          </div>
          <TagList items={wayper.technologies} label="Tecnologias usadas no Wayper" />
        </footer>
      </div>
    </section>
  );
}
