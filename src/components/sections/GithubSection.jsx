import { useEffect, useState } from "react";
import { ArrowUpRight, GitBranch, GitFork } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Section from "../common/Section.jsx";
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
  const reduceMotion = useReducedMotion();

  return (
    <li>
      <div>
        <span>{language.name}</span>
        <strong>{language.value}%</strong>
      </div>
      <span className="language-track" aria-hidden="true">
        <motion.i
          initial={reduceMotion ? false : { scaleX: 0 }}
          whileInView={reduceMotion ? undefined : { scaleX: language.value / 100 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={reduceMotion ? { transform: `scaleX(${language.value / 100})` } : undefined}
        />
      </span>
    </li>
  );
}

export default function GithubSection() {
  const [overview, setOverview] = useState(githubFallback);
  const [status, setStatus] = useState("loading");

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

  return (
    <Section
      id="github"
      eyebrow="GitHub"
      title="Alguns repositórios do meu GitHub."
      description="Aqui ficam os projetos públicos que escolhi destacar."
      className="github-section"
    >
      <div className="github-overview">
        <article className="github-profile-card">
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

          {status === "ready" && overview.publicRepos !== null ? (
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
              Não consegui atualizar os dados agora, mas os links continuam disponíveis.
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

        <article className="language-card">
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

      <div className="github-repos">
        {overview.recentRepos.map((repo) => (
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            key={repo.name}
          >
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
    </Section>
  );
}
