# Portfólio — Eduardo Weissheimer

Currículo online e portfólio imersivo em português brasileiro. A experiência combina direção editorial, cartografia técnica, scroll narrativo e cenas WebGL sem deixar de funcionar como um currículo profissional acessível.

Produção: <https://eduardo220.github.io/curriculo-online/>

## Stack visual

- React 19 e Vite 8, em JavaScript;
- Three.js, React Three Fiber e Drei para as cenas 3D;
- GSAP e ScrollTrigger para timelines, scrub, pinning e câmera;
- Motion para menu, botões, tilt e microinterações React;
- Anime.js para telemetria e diagramas SVG precisos;
- Lenis integrado ao ticker do GSAP para scroll suave elegível;
- Lucide, CSS modular por domínio e tokens próprios;
- API pública do GitHub e FormSubmit, ambos com fallback.

Não há backend, token, mapa pago, iframe, vídeo pesado, modelo remoto ou textura externa. O telefone, o mapa e os territórios da Wayper são procedurais.

## Execução local

Requisito: Node.js 20.19 ou superior. O workflow de publicação usa Node.js 22.

```bash
npm install
npm run dev
```

O `base` é `/curriculo-online/`, portanto a URL local padrão é:

```text
http://127.0.0.1:5173/curriculo-online/
```

Validação completa:

```bash
npm run lint
npm test
npm run build
npm run preview
```

Em uma instalação reproduzível de CI, prefira `npm ci`.

Parâmetros úteis apenas para inspeção visual local:

- `?skipIntro=1`: omite a abertura da sessão;
- `?static=1`: desliga a timeline de entrada/saída do Hero para screenshots.

Exemplo:

```text
http://127.0.0.1:5173/curriculo-online/?skipIntro=1&static=1#wayper
```

## Arquitetura

```text
src/
  animation/       registro GSAP, Lenis, easings e configuração Motion
  components/
    common/         botões, seções e tags
    effects/        abertura, background global e cursor
    layout/         header, navegação e footer
    sections/       capítulos editoriais do currículo
    three/          Canvas, cena e shader do Hero
    transitions/    revelações reutilizáveis
    wayper/         narrativa, Canvas, fallback, HUD e diagrama
  data/             única fonte de conteúdo profissional
  hooks/            lifecycle, media queries, performance e ponteiro
  services/         integração resiliente com o GitHub
  shaders/          terreno do Hero e captura territorial
  styles/           tokens e folhas por componente/seção
  utils/            perfil de performance e rota demonstrativa
docs/
  visual-motion-audit.md
  visual-motion-validation.md
```

`src/styles/global.css` permanece como camada de compatibilidade para os contratos visuais antigos. A nova implementação está separada em `tokens.css`, `reset.css`, `layout.css`, `responsive.css`, `components/`, `effects/`, `sections/` e `wayper/`.

## Responsabilidade das animações

| Tecnologia | Responsabilidade |
| --- | --- |
| GSAP + ScrollTrigger | loader, Hero, headings, trilho de experiência e timeline única da Wayper |
| Motion | menu mobile, presença, tap, magnetismo e tilt de interface |
| Anime.js | telemetria do GitHub e fluxo SVG da arquitetura Wayper |
| R3F + Three.js | terreno, partículas, telefone, mapa, rota, território, luz e câmera |
| Lenis | scroll suave, hashes e sincronização com ScrollTrigger |

GSAP e Motion não controlam simultaneamente a mesma propriedade do mesmo elemento.

## Cenas

### Hero

`HeroCanvas.jsx` carrega de forma dinâmica. `HeroScene.jsx` contém:

- terreno topográfico com shader próprio;
- rota espacial, marcador e partículas;
- núcleo cartográfico em malha e anéis orbitais;
- câmera com influência discreta do ponteiro e progresso de scroll;
- fallback CSS/SVG quando WebGL, qualidade ou movimento não permitem a cena.

### Wayper

`WayperSection.jsx` organiza sete capítulos e uma timeline ScrollTrigger reversível. No desktop, a cena fica fixada durante o scrub; no mobile, os capítulos seguem o fluxo natural e o clímax territorial recebe uma leitura SVG compacta junto ao texto.

`WayperCanvas.jsx` modela proceduralmente:

- moldura, vidro, botões e tela do telefone;
- ruas, quarteirões e mapa com profundidade;
- rota demonstrativa progressiva e marcador;
- polígono extrudado com shader territorial;
- partículas de captura, iluminação de clímax e fluxo de sincronização;
- HUD marcada como `DEMO`, sem apresentar métricas de usuários.

O mesmo objeto de estado é interpolado pela timeline e lido no `useFrame`. Ao voltar o scroll, rota, território, câmera e telefone retornam ao estado anterior.

## Alterar a rota demonstrativa

A rota normalizada está em `src/utils/wayperRoute.js`, na constante `DEMO_ROUTE`. Cada ponto usa coordenadas entre `0` e `1`:

```js
{ x: 0.24, y: 0.78 }
```

Ao alterar a forma:

1. mantenha pontos suficientes para uma progressão suave;
2. termine próximo ao ponto inicial para formar o loop;
3. preserve os limites normalizados;
4. execute `npm test`, pois os helpers de amostragem, progresso e fechamento são testados.

Essa rota representa o conceito do produto; ela não duplica o motor geográfico do aplicativo.

## Alterar os capítulos Wayper

Os títulos e a ordem visual ficam em `buildChapters()`, dentro de `WayperSection.jsx`. Os fatos e textos profissionais continuam vindo de `src/data/portfolio.js`.

A timeline possui sete trechos consecutivos, um por capítulo. Para mudar a duração relativa, ajuste a `duration` do trecho correspondente; para mudar uma pose, altere apenas as propriedades de `sceneStateRef`. Evite criar triggers independentes para câmera, telefone e rota.

## Performance e code splitting

`usePerformanceMode()` combina:

- WebGL;
- `deviceMemory` e `hardwareConcurrency`, quando disponíveis;
- DPR;
- touch/ponteiro;
- economia de dados e tipo de conexão;
- uma amostra curta do tempo de frame;
- `prefers-reduced-motion`.

Os perfis são `high`, `medium`, `low` e `reduced`. Eles controlam DPR, partículas, antialias, sombras, Lenis e escolha entre Canvas e fallback.

Outras medidas:

- Hero e Wayper em chunks dinâmicos;
- o Canvas Wayper só é baixado ao se aproximar da viewport;
- `frameloop` pausa fora da viewport e com a aba oculta;
- geometrias e buffers são descartados no cleanup;
- DPR limitado a 2 no Hero e 1,8 na Wayper;
- blocos e partículas reduzidos no perfil `medium`;
- grupos estáveis de React, Motion, GSAP e WebGL em `vite.config.js`;
- chunk inicial reduzido para cerca de 138 kB minificados, antes de gzip;
- nenhum aviso de chunk acima do limite padrão no build final.

## Fallbacks

- Hero: composição topográfica CSS/SVG;
- Wayper: mapa SVG com rota, território, HUD e sincronização;
- WebGL: error boundary e tratamento de `webglcontextlost`;
- baixa capacidade: perfil `low`, sem Canvas pesado;
- movimento reduzido: sem loader, Lenis, cursor, pin, scrub ou câmera;
- GitHub: cache de 30 minutos, cache expirado, seleção local e página íntegra;
- contato: action HTML, validação nativa, honeypot, timeout, `aria-live` e `mailto:`;
- JavaScript desativado: bloco `noscript` com email e GitHub.

## Desligar e depurar efeitos

Para testar a experiência essencial, ative “reduzir movimento” no sistema ou emule `prefers-reduced-motion: reduce` no DevTools. Isso é preferível a comentar componentes.

Pontos de controle:

- Lenis: `src/hooks/useLenis.js`;
- classificação: `src/utils/performance.js`;
- Hero WebGL: `shouldRenderScene` em `Hero.jsx`;
- Wayper WebGL/fallback: `fallbackRequired` em `WayperVisual.jsx`;
- timelines: `Hero.jsx`, `Section.jsx`, `ExperienceSection.jsx` e `WayperSection.jsx`.

Para depurar ScrollTrigger, use temporariamente `markers: true` no trigger relevante e confira `ScrollTrigger.getAll()` no console. Remova os markers antes de publicar. Após mudanças de altura, use `ScrollTrigger.refresh()`.

Para WebGL, confira o perfil mostrado na moldura da cena, teste context loss no DevTools e verifique se o fallback aparece. Mensagens `GL Driver Message` produzidas por screenshot com SwiftShader pertencem ao Chrome headless, não à aplicação.

## Conteúdo profissional

As informações reais ficam em `src/data/portfolio.js`:

- `profile`;
- `experiences`;
- `wayper`;
- `projects`;
- `stackGroups`;
- `education`;
- `selectedGithubRepos`.

Não inclua tecnologia, métrica ou funcionalidade sem confirmação no projeto real.

## GitHub e contato

`src/services/github.js` verifica cota, limita repositórios, aplica timeout de oito segundos, aceita `AbortSignal`, tolera linguagens parciais e usa cache expirado quando necessário.

O formulário usa FormSubmit sem segredo no frontend. No primeiro envio real, o serviço pode pedir ativação por email. Os testes de navegador bloqueiam o endpoint para validar o estado de erro sem enviar mensagens artificiais.

## Currículo e imagens

- `Assets/Curriculo.pdf`: arquivo servido pelo Vite e baixado como `Curriculo-Eduardo-Weissheimer.pdf`;
- `images/eu.jpg`: foto da seção Sobre;
- `public/images/eduardo-weissheimer.jpg`: imagem dos dados estruturados;
- `public/images/og-portfolio.jpg`: Open Graph/Twitter 1200 × 630;
- `public/favicon.png`: favicon 96 × 96.

O PDF preservado foi criado em agosto de 2025 e continua desatualizado em relação à experiência atual. Substitua o conteúdo mantendo o mesmo caminho para não quebrar o download.

## Acessibilidade e SEO

O site preserva skip link, landmarks, uma única `h1`, headings hierárquicos, foco visível, menu com trap de foco e Escape, targets de toque, textos equivalentes aos Canvas, labels, `aria-live`, reduced motion e navegação por hashes.

`index.html` mantém canonical, Open Graph, Twitter Card e JSON-LD. `public/robots.txt`, `public/sitemap.xml`, `vite.config.js` e o workflow de Pages usam `/curriculo-online/`.

## Publicação

`.github/workflows/deploy.yml` executa em `main` ou manualmente:

1. `npm ci`;
2. lint;
3. testes;
4. build;
5. upload de `dist`;
6. deploy pelas actions oficiais do GitHub Pages.

Não versione `dist`. Em **Settings → Pages**, a fonte deve ser **GitHub Actions**.

## Relatórios

- Auditoria anterior à implementação: [`docs/visual-motion-audit.md`](docs/visual-motion-audit.md)
- Validação final: [`docs/visual-motion-validation.md`](docs/visual-motion-validation.md)
