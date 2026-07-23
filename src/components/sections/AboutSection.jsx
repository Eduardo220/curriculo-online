import { motion, useReducedMotion } from "framer-motion";
import Section from "../common/Section.jsx";
import { profile, workingPrinciples } from "../../data/portfolio.js";

export default function AboutSection() {
  const reduceMotion = useReducedMotion();

  return (
    <Section
      id="sobre"
      eyebrow="Sobre mim"
      title="Código é uma parte do problema. O fluxo inteiro também importa."
      description="Minha base está em backend e integrações, mas o trabalho começa antes da implementação: entender o que falhou, quem depende daquele fluxo e qual comportamento precisa ser preservado."
      className="about-section"
    >
      <div className="about-layout">
        <figure className="about-portrait">
          <div className="about-portrait__frame">
            <img
              src={profile.image}
              alt="Eduardo Weissheimer em retrato profissional"
              width="1200"
              height="1600"
              loading="lazy"
              decoding="async"
            />
          </div>
          <figcaption>
            <span>base.location</span>
            {profile.location}
          </figcaption>
        </figure>

        <div className="about-copy">
          <p>
            Hoje atuo no desenvolvimento e na sustentação de aplicativos, APIs, workers,
            microsserviços e integrações usadas em operações de e-commerce. Isso inclui construir
            novos fluxos, mas também investigar os que já estão rodando: logs, mensagens em filas,
            dados no banco e diferenças de comportamento entre tenants.
          </p>
          <p>
            Gosto especialmente desse trabalho de reconstruir o caminho de um problema. Uma falha
            em pedido, pagamento ou sincronização raramente termina na primeira exceção encontrada;
            é preciso entender a regra, a sequência de eventos e o efeito da correção sobre o
            restante do sistema.
          </p>
          <p>
            O Wayper amplia esse aprendizado para produto mobile. Nele, cuido da experiência e de
            problemas como GPS impreciso, execução em segundo plano, persistência offline, mapas e
            sincronização — escolhas que só aparecem quando o aplicativo precisa sobreviver ao uso
            fora do ambiente de desenvolvimento.
          </p>
        </div>
      </div>

      <div className="principles-grid">
        {workingPrinciples.map((principle, index) => (
          <motion.article
            key={principle.code}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
          >
            <span>{principle.code}</span>
            <h3>{principle.title}</h3>
            <p>{principle.text}</p>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
