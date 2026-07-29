import { useEffect, useMemo, useRef, useState } from "react";
import {
  ContactRound,
  Download,
  GitBranch,
  Mail,
  MapPin,
  Send,
} from "lucide-react";
import Button from "../common/Button.jsx";
import Section from "../common/Section.jsx";
import { profile } from "../../data/portfolio.js";

const statusMessages = {
  idle: "",
  sending: "Enviando sua mensagem…",
  success: "Mensagem enviada. Obrigado pelo contato.",
  error: "Não foi possível confirmar o envio. Use o link de email nesta seção.",
};

export default function ContactSection() {
  const [status, setStatus] = useState("idle");
  const submissionControllerRef = useRef(null);
  const submissionInFlightRef = useRef(false);
  const mountedRef = useRef(true);
  const directEmailUrl = useMemo(
    () =>
      `mailto:${profile.email}?subject=${encodeURIComponent(
        "Contato pelo portfólio",
      )}`,
    [],
  );

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      submissionControllerRef.current?.abort();
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (submissionInFlightRef.current) return;

    const form = event.currentTarget;
    const data = new FormData(form);

    if (data.get("_honey")) {
      setStatus("success");
      form.reset();
      return;
    }

    data.set("_captcha", "false");
    data.set("_template", "table");
    submissionInFlightRef.current = true;
    setStatus("sending");

    const controller = new AbortController();
    submissionControllerRef.current = controller;
    const timeoutId = window.setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${profile.email}`,
        {
          method: "POST",
          headers: { Accept: "application/json" },
          body: data,
          signal: controller.signal,
        },
      );

      if (!response.ok) throw new Error(`contact_${response.status}`);

      form.reset();
      if (mountedRef.current) setStatus("success");
    } catch {
      if (mountedRef.current) setStatus("error");
    } finally {
      window.clearTimeout(timeoutId);
      if (submissionControllerRef.current === controller) {
        submissionControllerRef.current = null;
        submissionInFlightRef.current = false;
      }
    }
  }

  return (
    <Section
      id="contato"
      eyebrow="Contato"
      title="Quer falar comigo?"
      description="Você pode mandar uma mensagem por aqui ou me chamar pelo email, LinkedIn ou GitHub."
      className="contact-section editorial-section editorial-contact-section"
    >
      <div className="contact-layout editorial-contact" data-status={status}>
        <form
          className="contact-form editorial-contact__form"
          action={`https://formsubmit.co/${profile.email}`}
          method="POST"
          onSubmit={handleSubmit}
          aria-busy={status === "sending"}
        >
          <input name="_captcha" type="hidden" value="false" />
          <input name="_template" type="hidden" value="table" />
          <header className="editorial-contact__form-header" aria-hidden="true">
            <span>message.compose</span>
            <div>
              <i />
              contato direto
            </div>
          </header>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="contact-name">Nome</label>
              <input
                id="contact-name"
                name="Nome"
                type="text"
                autoComplete="name"
                minLength="2"
                maxLength="80"
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                name="Email"
                type="email"
                autoComplete="email"
                maxLength="120"
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="contact-subject">Assunto</label>
            <input
              id="contact-subject"
              name="Assunto"
              type="text"
              minLength="3"
              maxLength="120"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="contact-message">Mensagem</label>
            <textarea
              id="contact-message"
              name="Mensagem"
              rows="6"
              minLength="10"
              maxLength="3000"
              required
            />
          </div>

          <div className="form-honey" aria-hidden="true">
            <label htmlFor="contact-website">Não preencha este campo</label>
            <input
              id="contact-website"
              name="_honey"
              type="text"
              tabIndex="-1"
              autoComplete="off"
            />
          </div>

          <div className="form-footer">
            <button
              className="button button--primary editorial-contact__submit"
              type="submit"
              disabled={status === "sending"}
            >
              <span>{status === "sending" ? "Enviando…" : "Enviar mensagem"}</span>
              <Send size={17} aria-hidden="true" />
              <i className="editorial-contact__submit-signal" aria-hidden="true" />
            </button>
            <p
              className={`form-status form-status--${status}`}
              aria-live="polite"
              role={status === "error" ? "alert" : "status"}
            >
              {statusMessages[status]}
            </p>
          </div>
        </form>

        <aside className="contact-aside editorial-contact__aside">
          <div>
            <span className="eyebrow">Contato</span>
            <h3>Onde me encontrar</h3>
            <p>Respondo assim que puder.</p>
          </div>

          <div className="editorial-contact__radar" aria-hidden="true">
            <i />
            <i />
            <i />
            <span />
          </div>

          <address className="editorial-contact__address">
            <a href={directEmailUrl}>
              <Mail size={18} aria-hidden="true" />
              <span>
                <small>Email</small>
                {profile.email}
              </span>
            </a>
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ContactRound size={18} aria-hidden="true" />
              <span>
                <small>LinkedIn</small>
                eduardo-weissheimer
              </span>
            </a>
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitBranch size={18} aria-hidden="true" />
              <span>
                <small>GitHub</small>
                @{profile.githubUsername}
              </span>
            </a>
            <div>
              <MapPin size={18} aria-hidden="true" />
              <span>
                <small>Localização</small>
                {profile.location}
              </span>
            </div>
          </address>

          <Button
            href={profile.cvUrl}
            icon={Download}
            variant="secondary"
            download
            className="editorial-contact__cv"
          >
            Baixar currículo em PDF
          </Button>

          <div className="editorial-contact__signature" aria-hidden="true">
            <span>EW</span>
            <i />
            <small>SC · BR</small>
          </div>
        </aside>
      </div>
    </Section>
  );
}
