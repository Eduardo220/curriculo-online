import { useEffect, useState } from "react";
import { ArrowUpRight, GitBranch, Github, Star } from "lucide-react";
import { motion } from "framer-motion";
import Section from "./Section.jsx";
import { githubFallback, profile } from "../data/portfolio.js";
import { getGithubOverview } from "../services/github.js";

function LanguageBar({ language }) {
  return (
    <div className="language-row">
      <span>{language.name}</span>
      <div className="language-track">
        <motion.i
          initial={{ width: 0 }}
          whileInView={{ width: `${Math.max(language.value, 5)}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <strong>{language.value}%</strong>
    </div>
  );
}

export default function GithubSection({ username }) {
  const [overview, setOverview] = useState(githubFallback);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    getGithubOverview(username)
      .then((value) => {
        if (!active) return;
        setOverview(value);
        setStatus("ready");
      })
      .catch(() => {
        if (!active) return;
        setOverview(githubFallback);
        setStatus("fallback");
      });

    return () => {
      active = false;
    };
  }, [username]);

  return (
    <Section
      id="github"
      eyebrow="GitHub"
      title="Atividade pública atualizada automaticamente."
      description="A seção consome a API pública do GitHub com cache local. Commits e eventos representam atividade pública recente disponível pela API."
    >
      <div className="github-layout">
        <div className="github-summary surface-panel">
          <div className="github-title">
            <Github size={22} aria-hidden="true" />
            <div>
              <h3>@{username}</h3>
              <span>{status === "ready" ? "Dados públicos carregados" : "Fallback local ativo"}</span>
            </div>
          </div>

          <div className="github-metrics">
            <div>
              <strong>{overview.publicRepos}</strong>
              <span>Repositórios</span>
            </div>
            <div>
              <strong>{overview.recentCommits}</strong>
              <span>Commits recentes</span>
            </div>
            <div>
              <strong>{overview.publicEvents}</strong>
              <span>Eventos públicos</span>
            </div>
          </div>

          <a className="text-link" href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
            Ver perfil completo <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>

        <div className="surface-panel">
          <h3>Linguagens</h3>
          <div className="language-list">
            {overview.languages.map((language) => (
              <LanguageBar key={language.name} language={language} />
            ))}
          </div>
        </div>
      </div>

      <div className="repo-grid">
        {overview.recentRepos.length > 0 ? (
          overview.recentRepos.map((repo) => (
            <motion.a
              className="repo-card"
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              key={repo.name}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.22 }}
            >
              <div>
                <GitBranch size={18} aria-hidden="true" />
                <h3>{repo.name}</h3>
              </div>
              <p>{repo.description || "Repositório público atualizado recentemente."}</p>
              <footer>
                <span>{repo.language || "Código"}</span>
                <span>
                  <Star size={14} aria-hidden="true" /> {repo.stars}
                </span>
              </footer>
            </motion.a>
          ))
        ) : (
          <div className="repo-empty surface-panel">
            <p>
              Não foi possível listar repositórios agora. O link do perfil continua disponível para
              consulta direta.
            </p>
          </div>
        )}
      </div>
    </Section>
  );
}
