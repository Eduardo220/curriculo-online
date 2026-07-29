# Validação visual e de motion

Validação executada em 28 de julho de 2026 sobre o servidor Vite, o build de produção e uma sessão de preview. A rodada cobre a reformulação cinematográfica e substitui os números visuais do relatório anterior.

## Ambiente

- Node.js 22.23.1;
- npm 10.9.8;
- Vite 8.1.5;
- Google Chrome 150 headless;
- GPU identificada no teste WebGL: NVIDIA GeForce RTX 3060 via ANGLE/Vulkan;
- renderer alternativo: SwiftShader para screenshots e testes de fallback.

## Comandos

| Comando | Resultado |
| --- | --- |
| `npm install` | concluído; dependências instaladas e 0 vulnerabilidades |
| `npm run lint` | aprovado sem erro ou warning |
| `npm test` | 6 arquivos de teste aprovados |
| `npm run build` | aprovado sem aviso de chunk acima do limite |
| `npm run preview` | aplicação servida com `base` `/curriculo-online/` |
| `git diff --check` | aprovado |

Os testes cobrem integração Lenis/GSAP, configuração Motion, media query, perfil de performance, rota Wayper, seleção/agregação GitHub, falha sem cache e recuperação por cache expirado.

## Build final

| Recurso | Tamanho minificado | Gzip |
| --- | ---: | ---: |
| Entrada da aplicação | 139,91 kB | 47,16 kB |
| React runtime | 189,64 kB | 59,65 kB |
| Motion runtime | 127,56 kB | 41,60 kB |
| GSAP runtime | 112,81 kB | 44,34 kB |
| Hero específico | 7,92 kB | 3,00 kB |
| Wayper específico | 13,98 kB | 4,80 kB |
| GitHub lazy | 11,33 kB | 4,10 kB |
| CSS | 119,13 kB | 22,42 kB |

O runtime WebGL compartilhado foi dividido em grupos entre 1,03 kB e 369,48 kB. Nenhum chunk ultrapassa 500 kB. O código do Canvas Wayper não monta nem é solicitado enquanto a seção está fora da margem de observação; no topo foi medido um Canvas do Hero, zero Canvas Wayper e fallback `standby`.

## Resoluções e layout

Validação automatizada de largura e overflow:

| Viewport | Overflow horizontal | Hero dentro da tela | Navegação |
| --- | ---: | --- | --- |
| 320 × 568 | 0 px | sim | menu |
| 390 × 844 | 0 px | sim | menu |
| 768 × 1024 | 0 px | sim | menu |
| 1024 × 768 | 0 px | sim | menu |
| 1440 × 1050 | 0 px | sim | desktop |
| 1920 × 1080 | 0 px | sim | desktop |

Capturas visuais foram conferidas em 390 × 844, 1440 × 1050 e no clímax mobile com DPR 2. A correção de tipografia mobile reduziu o sobrenome do Hero até caber integralmente em 320 e 390 px.

## Seções verificadas

- Hero: tipografia, ações, PDF, email, terreno, rota, núcleo cartográfico e fallback;
- Sobre: foto, máscara, texto alternativo, parallax mouse-only e princípios;
- Experiência: progresso do trilho, período `MAR 2023 — FEV 2025`, conteúdo S3, tecnologias atuais e roadmap Venddor 2.0;
- Projetos: hierarquia entre Wayper e projeto secundário, tilt e links;
- Wayper: introdução, sete capítulos, telefone, mapa, HUD, rota, território, sync, arquitetura, CTA e dossiê;
- Stack: mapa de capacidades, proporção SVG preservada, quatro categorias e chips centralizados;
- Formação: trilho simples e conteúdo preservado;
- GitHub: loading, API, telemetria, cache e fallback;
- Contato: validação, honeypot, erro, `aria-live`, action HTML e email;
- Footer e navegação por hashes.

## Scroll e Wayper

Desktop:

- uma timeline ScrollTrigger controla os sete capítulos;
- a cena é fixada somente a partir de 64 rem;
- telefone, câmera, rota, território, luz e sync leem um único estado;
- a rota demonstrativa usa apenas segmentos ortogonais, alinhados aos corredores entre quarteirões;
- cada trecho é uma mesh ancorada no próprio início, evitando linhas soltas ou diagonais durante o scrub;
- as antigas barras azul/cinza, a grade 3D externa e as partículas giratórias foram removidas;
- o HUD HTML não usa mais transformação 3D: o conteúdo mediu 226 × 426 px, `transform: none`, e distância, tempo e ritmo ficaram integralmente dentro do palco;
- no capítulo 4 foram medidos `route = 0,8515` e `territory = 0,5051` durante a aproximação do centro do capítulo;
- ao voltar ao capítulo 1, ambos retornaram a `0,0000`;
- o Canvas permaneceu ativo durante a narrativa e pausou fora da viewport.

Mobile:

- não há pin GSAP;
- o palco principal ficou a `-1708 px` ao alcançar o clímax, confirmando fluxo natural;
- uma visualização territorial compacta ficou entre `310 px` e `630 px` da viewport junto ao capítulo 4;
- a sequência manteve `overflow = 0` e o capítulo seguinte continuou no fluxo normal.

## FPS aproximado

Uma amostra de 90 frames no clímax Wayper, em 1440 × 1050, perfil `medium`, ANGLE/Vulkan e RTX 3060, registrou aproximadamente 60 FPS.

Com SwiftShader, a mesma cena caiu para cerca de 12 FPS. Esse segundo número é esperado para renderização WebGL totalmente por software e não representa um dispositivo com GPU; ele foi usado para validar degradação e fallback. Não foi executado benchmark em aparelhos físicos nesta sessão.

## Movimento reduzido

Com `prefers-reduced-motion: reduce` emulado:

- zero Canvas;
- loader ausente;
- classe Lenis ausente;
- cursor customizado ausente;
- Wayper em fallback `reduced-motion`;
- capítulo final disponível no DOM;
- palco com `position: relative`, sem pin;
- conteúdo, links e formulário disponíveis;
- nenhum overflow horizontal.

O warning informativo do Motion sobre a preferência reduzida aparece apenas no modo de desenvolvimento da biblioteca; o build de produção não o emite.

## Teclado e touch

No menu mobile:

- abrir define `aria-expanded="true"`;
- o primeiro link (`#top`) recebe foco;
- `main` e footer recebem `inert`;
- o body recebe `overflow: hidden`;
- `Escape` fecha o diálogo;
- `aria-expanded` retorna a `false`;
- `inert` e o bloqueio de scroll são removidos;
- o foco volta ao botão `.menu-toggle`.

Em emulação touch, o cursor customizado não foi criado. Todos os controles principais mantêm pelo menos 44 px e não dependem de hover.

## Loader

Com `sessionStorage` limpo:

- durante a abertura, o loader estava presente, o conteúdo estava `inert`, a classe `is-booting` estava ativa e “Pular abertura” recebeu foco;
- após a timeline/timeout de segurança, o loader foi removido, o conteúdo deixou de estar `inert`, o Hero ficou visível e `portfolio.boot.v1` foi gravado como `complete`;
- o loader não reaparece na mesma sessão;
- reduced motion o omite integralmente.

## WebGL e fallbacks

- Hero e Wayper renderizaram com renderer NVIDIA/Vulkan;
- Hero possui error boundary e fallback CSS/SVG;
- Wayper possui boundary, fallback SVG e listener de `webglcontextlost`;
- o Canvas Wayper só monta perto da viewport;
- aba oculta e saída da viewport pausam o frame loop;
- perfil `low`, WebGL ausente e movimento reduzido não montam Canvas;
- o SVG territorial usa IDs únicos por instância.

Mensagens `GL Driver Message`, `ReadPixels` e inicialização Vulkan vistas no terminal pertencem ao Chrome headless durante screenshot; não foram emitidas pelo código do site.

## Integrações e falhas

### GitHub

Com `api.github.com` bloqueado e cache limpo:

- status: “Seleção editorial local”;
- classe de fallback ativa;
- dois projetos editoriais permaneceram visíveis;
- a seção, os links e o restante da página continuaram funcionais.

A telemetria foi verificada em 50% do percurso, com o marcador posicionado sobre a curva e três pontos já alcançados. Ao avançar e retornar o scroll, o readout passou de 78% para 22%, confirmando scrub bidirecional. O SVG preservou proporção de 3,84:1, sem esticamento por `preserveAspectRatio="none"`.

Os testes também confirmam uso de cache expirado quando a API falha.

### Contato

Com `formsubmit.co` bloqueado e campos fictícios válidos:

- o formulário permaneceu válido pela API HTML;
- action `https://formsubmit.co/eduardo.weissheimer22@gmail.com` e método POST presentes;
- honeypot presente;
- falha exibida com `role="alert"`;
- `aria-busy` retornou a `false` e o botão foi reabilitado;
- o fallback `mailto:` permaneceu disponível;
- nenhuma mensagem externa foi enviada.

### PDF

`Assets/Curriculo.pdf` foi identificado como PDF 1.4, três páginas, e respondeu localmente:

```text
HTTP 200
Content-Type: application/pdf
Content-Length: 422793
```

## Console e runtime

A recarga limpa no Chrome registrou:

- zero exceções JavaScript;
- zero warnings React;
- zero warnings da aplicação;
- zero erros de runtime;
- conexão HMR preservada durante as etapas.

Na rodada final de refinamento, um scroll inicial de 120 px manteve o Canvas do Hero visível, com opacidade gradual de 0,90 na camada interna. A cena Wayper foi conferida em WebGL nos estados de rota parcial (`route = 0,2495`) e fechamento (`route = 0,9342`, `territory = 0,7805`), sem diagonais soltas. Em 390 × 844, a sequência permaneceu sem overflow horizontal.

O terminal Vite foi acompanhado após cada alteração relevante. Erros de lint introduzidos durante a ativação lazy foram corrigidos imediatamente antes de continuar.

## SEO e GitHub Pages

- `base: /curriculo-online/` preservado;
- canonical, Open Graph, Twitter Card e JSON-LD preservados;
- favicon, imagem social, robots e sitemap presentes;
- workflow mantém `npm ci`, lint, testes, build e deploy oficial de Pages;
- URL publicada respondeu HTTP 200 na auditoria inicial.

## Limitações restantes

1. O PDF preservado é de agosto de 2025 e está desatualizado em relação à experiência profissional atual.
2. A primeira submissão real do FormSubmit ainda pode exigir confirmação do endereço por email.
3. Não houve benchmark em iPhone/Android físicos; a validação touch foi feita por emulação Chrome.
4. O CSS de compatibilidade antigo continua carregado junto das novas folhas segmentadas. Ele evita regressões, mas pode ser reduzido em uma futura migração visual componente a componente.
5. Não há pós-processamento de bloom/DOF. A decisão foi intencional para preservar nitidez, bundle e desempenho; iluminação, shader e materiais entregam o efeito sem essa camada.

## Melhorias futuras

- atualizar o currículo em PDF;
- medir dispositivos físicos de entrada, intermediários e high-end;
- converter a foto para AVIF/WebP com `<picture>` mantendo o JPEG de fallback;
- remover regras legadas comprovadamente não utilizadas após uma rodada de regressão visual;
- adicionar testes E2E versionados para foco, hashes e fallbacks quando o projeto adotar Playwright.
