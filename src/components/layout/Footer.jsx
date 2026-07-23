import { ArrowUp, ContactRound, GitBranch, Mail } from "lucide-react";
import { profile } from "../../data/portfolio.js";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <span className="footer-mark">EW</span>
          <p>
            © {new Date().getFullYear()} {profile.name}. Conteúdo em português brasileiro.
          </p>
        </div>

        <p className="footer-note">
          Construído com React e Vite. Sem rastreadores, sem telefone público e sem dados
          confidenciais de projetos profissionais.
        </p>

        <div className="footer-actions">
          <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <GitBranch size={18} aria-hidden="true" />
          </a>
          <a
            href={profile.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <ContactRound size={18} aria-hidden="true" />
          </a>
          <a href={`mailto:${profile.email}`} aria-label="Enviar email">
            <Mail size={18} aria-hidden="true" />
          </a>
          <a href="#top" aria-label="Voltar ao início">
            <ArrowUp size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
