import { useState } from "react";
import { Download, Github, Linkedin, Mail, MapPin, Send } from "lucide-react";
import Button from "./Button.jsx";
import Section from "./Section.jsx";
import { profile } from "../data/portfolio.js";

export default function ContactSection() {
  const [status, setStatus] = useState("idle");

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    data.append("_captcha", "false");
    data.append("_template", "table");

    setStatus("sending");

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${profile.email}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });

      if (!response.ok) throw new Error("Contact request failed");

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Section
      id="contato"
      eyebrow="Contato"
      title="Vamos conversar sobre produto, backend ou integrações."
      description="Use o formulário ou escolha um canal direto. O currículo continua disponível para download."
    >
      <div className="contact-layout">
        <form className="contact-form surface-panel" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>
              Nome
              <input name="Nome" type="text" autoComplete="name" required />
            </label>
            <label>
              Email
              <input name="Email" type="email" autoComplete="email" required />
            </label>
          </div>
          <label>
            Assunto
            <input name="Assunto" type="text" required />
          </label>
          <label>
            Mensagem
            <textarea name="Mensagem" rows="5" required />
          </label>
          <button className="button button-primary" type="submit" disabled={status === "sending"}>
            <Send size={17} aria-hidden="true" />
            {status === "sending" ? "Enviando..." : "Enviar mensagem"}
          </button>
          {status === "success" && (
            <p className="form-status success">Mensagem enviada com sucesso.</p>
          )}
          {status === "error" && (
            <p className="form-status error">
              Não consegui confirmar o envio. Você pode falar direto por email.
            </p>
          )}
        </form>

        <aside className="contact-card surface-panel">
          <div className="contact-item">
            <Mail size={18} aria-hidden="true" />
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </div>
          <div className="contact-item">
            <Linkedin size={18} aria-hidden="true" />
            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
          <div className="contact-item">
            <Github size={18} aria-hidden="true" />
            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </div>
          <div className="contact-item">
            <MapPin size={18} aria-hidden="true" />
            <span>{profile.location}</span>
          </div>
          <Button href={profile.cvUrl} icon={Download} variant="secondary" download>
            Baixar currículo
          </Button>
        </aside>
      </div>
    </Section>
  );
}
