# Auditoria visual e de motion

Auditoria realizada em 28 de julho de 2026, antes de qualquer alteração na experiência visual. O diagnóstico considerou o código-fonte completo, os assets locais, o build de produção, a execução local em desktop e mobile e a versão publicada no GitHub Pages.

## Resumo executivo

O portfólio atual já é uma base funcional e cuidadosa: conteúdo profissional centralizado, boa semântica, SEO completo, formulário resiliente, integração pública com o GitHub, navegação por teclado, `prefers-reduced-motion`, download do currículo e publicação via GitHub Actions. A identidade grafite, verde elétrico e azul técnico também já existe.

O limite atual não é de conteúdo, mas de linguagem e arquitetura visual. A experiência é composta sobretudo por layouts estáticos, entradas genéricas de viewport e um mapa Wayper 2D. Não existem scroll narrativo, pinning, câmera, WebGL, shaders, níveis de qualidade, loader, cursor, transições contínuas entre seções ou uma arquitetura dedicada a motion. Todo o CSS React está concentrado em um único arquivo de 2.882 linhas.

A reformulação deve preservar os contratos existentes e adicionar profundidade de forma progressiva: HTML e conteúdo continuam sendo a fonte acessível; WebGL é uma camada de apresentação; o Wayper 2D permanece como fallback; e dispositivos fracos ou com redução de movimento recebem uma experiência simplificada, não uma página incompleta.

## Estado do repositório e execução

- Branch auditada: `dev`, limpa e sincronizada com `origin/dev` no início da tarefa.
- Stack: React 19, Vite 8 e JavaScript.
- `base` do Vite: `/curriculo-online/`.
- Publicação: workflow `.github/workflows/deploy.yml`, acionado em `main` ou manualmente.
- URL pública verificada: `https://eduardo220.github.io/curriculo-online/`, resposta HTTP 200.
- Linha de base: lint aprovado, 3 testes aprovados e build aprovado.
- Build inicial: JavaScript principal de aproximadamente 370 kB (118 kB gzip) e CSS de aproximadamente 44 kB (8,6 kB gzip).
- Execução local verificada com Vite e Chrome headless em 1440 × 1100 e 390 × 844.

## Estrutura atual

```text
src/
  App.jsx
  main.jsx
  components/
    common/       Button, Section e TagList
    layout/       Background, Header e Footer
    sections/     Hero, Sobre, Experiência, Projetos, Stack,
                  Formação, GitHub e Contato
    wayper/       WayperSection e WayperVisual
  data/           conteúdo profissional centralizado
  hooks/          seção ativa da navegação
  services/       API pública do GitHub e testes
  styles/         global.css monolítico
public/           favicon, imagem social, robots e sitemap
Assets/           currículo em PDF e foto
```

Os diretórios `css/`, `js/`, `fonts/` e alguns assets na raiz pertencem à versão legada e não são importados pela aplicação React. Eles não serão removidos nesta reformulação.

## Fluxo e contratos existentes

A ordem atual do documento é:

1. skip link;
2. background decorativo;
3. header fixo;
4. Hero `#top`;
5. Sobre `#sobre`;
6. Experiência `#experiencia`;
7. Projetos `#projetos`, com Wayper `#wayper` e arquitetura `#arquitetura-wayper`;
8. Stack `#stack`;
9. Formação `#formacao`;
10. GitHub `#github`;
11. Contato `#contato`;
12. footer.

Contratos que não podem regredir:

- conteúdo profissional e afirmações do Wayper em `src/data/portfolio.js`;
- IDs, âncoras e links externos já publicados;
- PDF importado pelo Vite e botões de download;
- foto existente e texto alternativo;
- canonical, Open Graph, Twitter Card, JSON-LD, sitemap e robots;
- cache, timeout, abort, seleção editorial e fallback da API do GitHub;
- endpoint FormSubmit, validação, honeypot, timeout, `aria-live` e fallback por email;
- skip link, landmarks, foco visível, hierarquia de headings e menu por teclado;
- `base` do GitHub Pages e workflow de build/deploy.

## Motion atual

Framer Motion controla:

- fade e deslocamento vertical de cada `Section`;
- stagger de entrada do Hero;
- entrada dos princípios e experiências;
- abertura e fechamento do menu mobile;
- progresso do header;
- barras de linguagens do GitHub;
- path e células do mapa Wayper.

CSS controla pulsos, fluxo de dados, nodes do Hero e skeleton do GitHub. Não há GSAP, ScrollTrigger, Lenis, Anime.js, Three.js, shaders, parallax ou timelines sincronizadas com scroll.

## Wayper atual

`WayperVisual.jsx` é uma composição DOM, CSS e SVG com:

- topografia e ruas abstratas;
- grade 8 × 8;
- células capturadas fixas;
- contorno territorial pré-calculado;
- indicador GPS, estados offline/sync e legenda.

O componente já possui descrição acessível e é uma boa base de fallback. Ele não possui celular, mapa vivo, rota progressiva, fechamento territorial ligado ao scroll, câmera, HUD dinâmica, capítulos ou WebGL.

## Gargalos e riscos

### Arquitetura

- `global.css` concentra tokens, reset, layout, componentes, seções, responsive e motion.
- Há apenas um hook de navegação; não existem utilitários de performance ou lifecycle para animações.
- Apenas o GitHub usa code splitting.
- Não há error boundary para chunks ou Canvas.

### Motion e scroll

- A maioria das entradas é um fade genérico e independente.
- Várias animações CSS são infinitas, mesmo quando fora da viewport.
- O header ainda anima via Motion com `prefers-reduced-motion`.
- Scroll suave nativo e um futuro Lenis não podem operar juntos.
- React StrictMode exige cleanup idempotente de GSAP, listeners, RAF e Canvas.

### Navegação

- O observer de seção ativa pode continuar observando o fallback removido do GitHub lazy.
- Pinning e scroll virtual podem alterar a leitura de seção ativa e de hashes.
- O menu mobile já fecha com Escape e devolve foco, mas ainda não contém o foco dentro do overlay.

### Performance

- Three.js aumentará significativamente o JavaScript; as cenas precisam ser chunks separados.
- Filtros, `backdrop-filter`, Canvas de DPR alto e múltiplos RAF podem degradar mobile.
- Não se deve usar largura de tela como único indicador de qualidade.
- Context loss, aba oculta, Canvas fora da viewport e falha de import precisam de fallback.

### Acessibilidade

- O Canvas nunca pode ser a única fonte de informação.
- Pin prolongado não deve ser usado em mobile, teclado ou reduced motion.
- Conteúdo dividido visualmente precisa permanecer texto normal no DOM.
- Cursores customizados não podem ser ativados em touch, caneta ou reduced motion.

### Integrações

- A API do GitHub usa `Promise.allSettled` para linguagens e cache expirado em falhas; ambos devem permanecer.
- O formulário não deve ser enviado durante testes automatizados.
- O currículo está funcional, mas seu conteúdo já estava documentado como desatualizado; ele não será reescrito ou substituído nesta tarefa.

## Oportunidades de direção de arte

- Fazer uma linha cartográfica conectar o loader, Hero, timeline, Wayper e contato.
- Usar o Hero como sala de controle geoespacial, com terreno procedural e rota em 3D.
- Transformar a foto em uma composição editorial técnica sem descaracterizá-la.
- Dar à experiência profissional um progresso de trilho controlado pelo scroll.
- Tratar projetos secundários como artefatos técnicos, com perspectiva e inspeção por ponteiro.
- Tornar o Wayper o ápice visual: celular procedural, mapa em profundidade, rota reversível, captura territorial e sincronização.
- Organizar a stack como constelação de capacidades, não como grade de logos.
- Usar Anime.js apenas em diagramas, rotas SVG e números de telemetria.
- Fazer o contato encerrar a rota iniciada no Hero.

## Arquitetura proposta

```text
src/
  animation/
    easings.js
    gsap.js
    lenis.js
    motionConfig.js
  components/
    effects/
      BootSequence.jsx
      CustomCursor.jsx
      GlobalBackground.jsx
    three/
      SceneErrorBoundary.jsx
      HeroCanvas.jsx
      HeroScene.jsx
    transitions/
      Magnetic.jsx
      RevealText.jsx
    wayper/
      WayperExperience.jsx
      WayperCanvas.jsx
      WayperScene.jsx
      WayperPhone.jsx
      WayperMap.jsx
      WayperHud.jsx
      WayperVisual.jsx
  hooks/
    useGsapContext.js
    useLenis.js
    useMediaQuery.js
    usePerformanceMode.js
    usePointerParallax.js
    useReducedMotion.js
  shaders/
    terrain.js
    territory.js
  utils/
    performance.js
    route.js
  styles/
    global.css
    tokens.css
    reset.css
    typography.css
    layout.css
    animations.css
    components/
    sections/
    wayper/
```

Os nomes podem ser ajustados durante a implementação, mas as responsabilidades permanecerão separadas.

## Responsabilidade de cada biblioteca

### GSAP e ScrollTrigger

- abertura sequencial do Hero;
- transformações editoriais de títulos;
- progresso e transições de seções;
- timeline principal, pinning e scrub reversível do Wayper;
- câmera, pose do celular e estados narrativos por meio de um único progresso compartilhado;
- trilho de experiência e grandes transições de layout.

GSAP não controlará propriedades que Motion estiver animando no mesmo nó.

### Motion

- abertura do menu;
- hover, tap e foco de botões;
- magnetismo e tilt discretos;
- presença de loader, status e pequenas camadas de interface;
- transições pequenas de layout.

### Anime.js

- desenho de rotas e conexões SVG;
- sequência dos nós da arquitetura;
- gráficos de linguagens e telemetria precisa;
- contadores visuais baseados somente em valores reais ou explicitamente demonstrativos.

### Three.js e React Three Fiber

- terreno e objeto cartográfico do Hero;
- celular procedural do Wayper;
- mapa, ruas, blocos, rota, marcador e território em profundidade;
- luzes, materiais físicos, partículas e câmera;
- shaders procedurais de topografia e captura territorial.

### Lenis

- smooth scroll em desktop e dispositivos adequados;
- integração com o ticker do GSAP e ScrollTrigger;
- navegação por âncoras com offset do header;
- desligamento completo em reduced motion e perfis fracos.

## Estratégia de performance

Quatro perfis serão derivados de múltiplos sinais:

- `high`: WebGL disponível, memória/CPU adequadas, ponteiro fino e custo de frames aceitável;
- `medium`: Canvas completo com menos partículas, DPR e sombras;
- `low`: sem cenas pesadas; Wayper pseudo-3D/SVG e scroll natural;
- `reduced`: conteúdo estático, sem Lenis, pinning, parallax ou câmera agressiva.

Medidas previstas:

- lazy loading de Hero 3D, Wayper 3D e GitHub;
- DPR limitado por perfil;
- `frameloop` pausado fora da viewport e quando a aba estiver oculta;
- geometrias procedurais compartilhadas e instancing para blocos repetidos;
- texturas geradas localmente, sem download remoto;
- cleanup de ScrollTriggers, ticker, listeners, Canvas textures, materiais e geometrias;
- fallback imediato em erro ou `webglcontextlost`;
- nenhuma dependência de modelo, mapa, vídeo ou API externa para as cenas.

## Estratégia mobile

- scroll natural, sem pin prolongado;
- capítulos do Wayper em sequência vertical;
- Canvas simplificado apenas em aparelhos capazes; fallback pseudo-3D nos demais;
- menos partículas, rotação, sombras e DPR;
- targets mínimos de 44 px e menu com contenção de foco;
- uso de `svh`/`dvh`, sem `100vh` rígido;
- nenhuma dependência de hover para compreender ou acionar conteúdo.

## Estratégia reduced motion

- loader visual omitido;
- Lenis, parallax, cursor customizado, pin e scrub desligados;
- Hero e Wayper exibidos em poses estáticas compreensíveis;
- conteúdo e capítulos permanecem em fluxo normal;
- animações contínuas removidas;
- foco, hashes, formulário, links e fallback continuam integralmente funcionais.

## Arquivos previstos

### Criados

- módulos de animação, hooks, utilitários e shaders descritos na arquitetura;
- componentes de efeitos, transições e cenas 3D;
- folhas de estilo segmentadas por domínio;
- testes de qualidade, progresso, rota e território;
- `docs/visual-motion-validation.md`.

### Alterados

- `package.json` e `package-lock.json`;
- `src/main.jsx` e `src/App.jsx`;
- componentes comuns, layout e todas as seções visuais;
- componentes Wayper;
- `src/styles/global.css`, convertido em ponto de entrada dos estilos segmentados;
- `README.md`;
- documentação de validação.

### Preservados

- `src/data/portfolio.js`, salvo ajuste estrutural sem mudança de fatos;
- serviço resiliente do GitHub e seu contrato;
- formulário e seus contratos externos;
- `vite.config.js`, `.github/workflows/deploy.yml`, SEO e assets públicos;
- PDF e foto;
- código e assets legados não importados.

## Critério técnico da implementação

A versão WebGL será aprimoramento progressivo. Se a cena falhar, o site não perde conteúdo, navegação ou CTA. A timeline do Wayper terá uma fonte única de progresso, evitando centenas de triggers e conflitos entre bibliotecas. A rota será demonstrativa e marcada como tal; nenhuma métrica será apresentada como dado real de usuários.
