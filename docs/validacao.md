# Validação final

Validação executada em 23 de julho de 2026 sobre o build de produção servido por `vite preview`.

## Ambiente

- Node.js: 22.23.1
- npm: 10.9.8
- Vite: 8.1.5
- Google Chrome headless

## Instalação e qualidade

| Comando | Resultado |
| --- | --- |
| `npm install` / `npm ci` | concluído em instalação limpa; 0 vulnerabilidades |
| `npm run lint` | aprovado, sem warnings |
| `npm test` | 3 testes aprovados |
| `npm run build` | aprovado |
| `npm run preview` | servidor respondeu em `/curriculo-online/` |

Os testes cobrem seleção editorial de repositórios, exclusão de forks/arquivados, ordenação e agregação defensiva de linguagens.

## Build

| Recurso | Tamanho | Gzip |
| --- | ---: | ---: |
| JavaScript principal | 370,93 kB | 118,49 kB |
| Chunk do GitHub | 6,69 kB | 2,82 kB |
| CSS | 41,16 kB | 8,06 kB |
| Imagem Open Graph | 116 kB | — |
| Site completo, com PDF e imagens | aproximadamente 1,2 MB | — |

## Navegador

Validações automatizadas em 320, 375, 430, 768, 1024, 1440 e 1920 px:

- sem overflow horizontal;
- sem imagens quebradas;
- sem erros de console;
- uma única `h1` e hierarquia de seções preservada;
- menu mobile abre, move o foco para a navegação e bloqueia o scroll;
- `Escape` fecha o menu, restaura o scroll e devolve foco ao botão;
- todos os links internos apontam para IDs existentes;
- PDF retorna HTTP 200 e `application/pdf`;
- formulário vazio é inválido e, com dados válidos, passa pela validação nativa;
- `prefers-reduced-motion` desativa scroll suave e animações contínuas;
- API do GitHub foi validada tanto com resposta disponível quanto com fallback por limite de cota.

O formulário não foi enviado durante a validação para evitar gerar uma mensagem externa artificial. O endpoint, o fallback por email e os estados locais foram verificados; a ativação inicial do FormSubmit continua sendo uma etapa manual real.

## Assets e links servidos

| Caminho | HTTP | Tipo |
| --- | ---: | --- |
| `/curriculo-online/` | 200 | `text/html` |
| `/curriculo-online/favicon.png` | 200 | `image/png` |
| `/curriculo-online/images/og-portfolio.jpg` | 200 | `image/jpeg` |
| `/curriculo-online/robots.txt` | 200 | `text/plain` |
| `/curriculo-online/sitemap.xml` | 200 | `text/xml` |

Os links públicos do Wayper, Banco Laravel e perfil GitHub retornaram HTTP 200. O LinkedIn bloqueia clientes automatizados, mas o endereço usado é o perfil informado no briefing.

## Lighthouse

Execução local em modo mobile sobre o build de produção:

| Categoria | Nota |
| --- | ---: |
| Performance | 98 |
| Acessibilidade | 100 |
| Boas práticas | 100 |
| SEO | 100 |

Métricas:

- First Contentful Paint: 1,6 s
- Largest Contentful Paint: 2,2 s
- Total Blocking Time: 30 ms
- Cumulative Layout Shift: 0
- Speed Index: 1,6 s

O relatório final não registrou erros de console nem incompatibilidade entre rótulo visível e nome acessível.

## Pendências verificadas

- Substituir `Assets/Curriculo.pdf` por uma versão atualizada.
- Ativar o endereço no FormSubmit no primeiro envio real, caso o serviço solicite confirmação.
- Selecionar **GitHub Actions** como fonte em **Settings → Pages**.
- Publicar a branch e abrir pull request; o ambiente atual não possui `gh`.
