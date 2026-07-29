import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight, GitBranch, GitFork } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import Section from "../common/Section.jsx";
import {
  gsap,
  registerGsapPlugins,
  ScrollTrigger,
} from "../../animation/gsap.js";
import {
  githubFallback,
  profile,
  selectedGithubRepos,
} from "../../data/portfolio.js";
import { getGithubOverview } from "../../services/github.js";

function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("pt-BR", {
    month: "short",
    year: "numeric",
  }).format(date);
}

function LanguageBar({ language }) {
  return (
    <li>
      <div>
        <span>{language.name}</span>
        <strong>{language.value}%</strong>
      </div>
      <span className="language-track" aria-hidden="true">
        <i
          data-language-scale={language.value / 100}
          style={{ transform: `scaleX(${language.value / 100})` }}
        />
      </span>
    </li>
  );
}

const telemetryNodes = [
  { progress: 0.08, fallbackPosition: "translate(103 190)" },
  { progress: 0.28, fallbackPosition: "translate(267 154)" },
  { progress: 0.5, fallbackPosition: "translate(480 127)" },
  { progress: 0.72, fallbackPosition: "translate(688 132)" },
  { progress: 0.94, fallbackPosition: "translate(872 67)" },
];

function useGithubTelemetry(rootRef, reduceMotion) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const trace = root.querySelector(".github-telemetry__trace");
    const traveler = root.querySelector(".github-telemetry__traveler");
    const nodes = [...root.querySelectorAll("[data-telemetry-node]")];
    const readout = root.querySelector("[data-telemetry-readout]");
    if (!trace || !traveler) return undefined;

    const totalLength = trace.getTotalLength();
    trace.style.strokeDasharray = `${totalLength}`;

    nodes.forEach((node) => {
      const progress = Number(node.dataset.telemetryNode);
      const point = trace.getPointAtLength(totalLength * progress);
      node.setAttribute("transform", `translate(${point.x} ${point.y})`);
    });

    const renderProgress = (progress) => {
      const clampedProgress = Math.min(1, Math.max(0, progress));
      const point = trace.getPointAtLength(totalLength * clampedProgress);

      trace.style.strokeDashoffset = `${totalLength * (1 - clampedProgress)}`;
      traveler.setAttribute("transform", `translate(${point.x} ${point.y})`);
      nodes.forEach((node) => {
        node.classList.toggle(
          "is-reached",
          clampedProgress >= Number(node.dataset.telemetryNode) - 0.012,
        );
      });

      if (readout) {
        readout.textContent = `${String(Math.round(clampedProgress * 100)).padStart(2, "0")}%`;
      }
    };

    if (reduceMotion) {
      root.classList.add("is-telemetry-static");
      renderProgress(1);
      return () => root.classList.remove("is-telemetry-static");
    }

    registerGsapPlugins();
    root.classList.add("is-telemetry-active");
    renderProgress(0);

    const telemetryState = { progress: 0 };
    const progressTween = gsap.to(telemetryState, {
      progress: 1,
      paused: true,
      ease: "none",
      onUpdate: () => renderProgress(telemetryState.progress),
    });
    const scrollTrigger = ScrollTrigger.create({
      trigger: root.querySelector(".github-telemetry"),
      start: "top 82%",
      end: "bottom 18%",
      animation: progressTween,
      scrub: 0.45,
      invalidateOnRefresh: true,
    });

    return () => {
      scrollTrigger.kill();
      progressTween.kill();
      root.classList.remove("is-telemetry-active");
      nodes.forEach((node) => node.classList.remove("is-reached"));
    };
  }, [reduceMotion, rootRef]);
}

function GithubTelemetry({ status, statusCopy }) {
  return (
    <div className="github-telemetry" aria-hidden="true">
      <header>
        <span>public.data.stream</span>
        <i className={`github-telemetry__signal github-telemetry__signal--${status}`} />
        <strong>{statusCopy}</strong>
      </header>
      <div className="github-telemetry__viewport">
        <span className="github-telemetry__axis-label">scroll / timeline</span>
        <svg viewBox="0 0 960 250" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient
              id="github-telemetry-gradient"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop offset="0" stopColor="var(--color-secondary)" />
              <stop offset="0.58" stopColor="#7ce5c7" />
              <stop offset="1" stopColor="var(--color-primary)" />
            </linearGradient>
          </defs>
          <g className="github-telemetry__grid">
            <path d="M32 62 H928 M32 125 H928 M32 188 H928" />
            <path d="M160 28 V222 M320 28 V222 M480 28 V222 M640 28 V222 M800 28 V222" />
          </g>
          <path
            className="github-telemetry__route"
            d="M36 196 C128 196 144 162 226 162 C321 162 324 96 426 104 C530 112 554 175 654 142 C750 110 792 56 924 58"
          />
          <path
            className="github-telemetry__trace"
            d="M36 196 C128 196 144 162 226 162 C321 162 324 96 426 104 C530 112 554 175 654 142 C750 110 792 56 924 58"
          />
          <g className="github-telemetry__nodes">
            {telemetryNodes.map((node) => (
              <g
                className="github-telemetry__node"
                data-telemetry-node={node.progress}
                key={node.progress}
                transform={node.fallbackPosition}
              >
                <circle className="github-telemetry__node-ring" r="10" />
                <circle className="github-telemetry__node-core" r="4" />
              </g>
            ))}
          </g>
          <g
            className="github-telemetry__traveler"
            transform="translate(924 58)"
          >
            <circle className="github-telemetry__traveler-halo" r="16" />
            <circle className="github-telemetry__traveler-ring" r="8" />
            <circle className="github-telemetry__traveler-core" r="3" />
          </g>
        </svg>
        <span className="github-telemetry__progress">
          scroll sync <strong data-telemetry-readout>100%</strong>
        </span>
      </div>
      <footer>
        <span>API pública</span>
        <span>cache resiliente</span>
        <span>fallback local</span>
      </footer>
    </div>
  );
}

export default function GithubSection() {
  const [overview, setOverview] = useState(githubFallback);
  const [status, setStatus] = useState("loading");
  const telemetryRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const controller = new AbortController();

    getGithubOverview(
      profile.githubUsername,
      selectedGithubRepos,
      controller.signal,
    )
      .then((value) => {
        setOverview(value);
        setStatus(value.fromStaleCache ? "stale" : "ready");
      })
      .catch((error) => {
        if (error?.name === "AbortError" || controller.signal.aborted) return;
        setOverview(githubFallback);
        setStatus("fallback");
      });

    return () => controller.abort();
  }, []);

  const statusCopy = {
    loading: "Consultando a API pública…",
    ready: "Dados públicos atualizados",
    stale: "Cache local exibido",
    fallback: "Seleção editorial local",
  }[status];

  useGithubTelemetry(telemetryRef, reduceMotion);

  return (
    <Section
      id="github"
      eyebrow="GitHub"
      title="Alguns repositórios do meu GitHub."
      description="Aqui ficam os projetos públicos que escolhi destacar."
      className="github-section editorial-section editorial-github-section"
    >
      <div className="editorial-github" ref={telemetryRef}>
        <GithubTelemetry status={status} statusCopy={statusCopy} />

        <div className="github-overview editorial-github__overview">
          <article className="github-profile-card editorial-github__profile">
            <span className="editorial-github__card-index" aria-hidden="true">
              01 / profile
            </span>
            <div className="github-profile-card__top">
              <span>
                <GitFork size={24} aria-hidden="true" />
              </span>
              <div>
                <small>github.com</small>
                <h3>@{profile.githubUsername}</h3>
              </div>
            </div>

            <div className={`api-status api-status--${status}`} role="status">
              <i />
              {statusCopy}
            </div>

            {(status === "ready" || status === "stale") &&
            overview.publicRepos !== null ? (
              <dl className="github-public-metrics">
                <div>
                  <dt>Repositórios públicos</dt>
                  <dd>{overview.publicRepos}</dd>
                </div>
                <div>
                  <dt>Seguidores</dt>
                  <dd>{overview.followers ?? 0}</dd>
                </div>
              </dl>
            ) : (
              <p className="github-fallback-copy">
                {status === "loading"
                  ? "Os dados públicos estão sendo consultados; os links já estão disponíveis."
                  : "Não consegui atualizar os dados agora, mas os links continuam disponíveis."}
              </p>
            )}

            <a
              className="text-link"
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir perfil completo <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </article>

          <article className="language-card editorial-github__languages">
            <span className="editorial-github__card-index" aria-hidden="true">
              02 / languages
            </span>
            <header>
              <span>selected.languages</span>
              <h3>Linguagens nos projetos selecionados</h3>
            </header>

            {overview.languages.length ? (
              <ul>
                {overview.languages.map((language) => (
                  <LanguageBar language={language} key={language.name} />
                ))}
              </ul>
            ) : (
              <div className="language-empty">
                <p>
                  A distribuição de linguagens aparece quando os dados do GitHub estão disponíveis.
                </p>
              </div>
            )}
          </article>
        </div>

        <div className="github-repos editorial-github__repos">
          {overview.recentRepos.map((repo, index) => (
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              key={repo.name}
            >
              <span className="editorial-github__repo-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <header>
                <GitBranch size={17} aria-hidden="true" />
                <span>{repo.language || "Código"}</span>
              </header>
              <h3>{repo.name}</h3>
              <p>{repo.description || "Repositório público selecionado para o portfólio."}</p>
              <footer>
                <span>{formatDate(repo.updatedAt) || "Link verificado"}</span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </footer>
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
}
