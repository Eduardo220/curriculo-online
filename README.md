# Portfólio — Eduardo Weissheimer

Currículo online e portfólio em português brasileiro, com experiência profissional, formação, stack e projetos de Eduardo Weissheimer. O foco principal está em backend e desenvolvimento mobile; o Wayper aparece como destaque dentro da seção de projetos.

URL esperada: <https://eduardo220.github.io/curriculo-online/>

## Stack do site

- React 19
- Vite 8
- Framer Motion
- Lucide
- CSS com tokens próprios
- API pública do GitHub
- FormSubmit para o formulário de contato

O projeto permanece em JavaScript. Não há ganho suficiente, neste tamanho, para uma migração parcial para TypeScript.

## Execução local

Requisito: Node.js 20.19 ou superior. O workflow usa Node.js 22.

```bash
npm install
npm run dev
```

O Vite informa a URL local no terminal. Como o projeto usa o `base` do GitHub Pages, o caminho inclui `/curriculo-online/`.

Validação completa:

```bash
npm run lint
npm test
npm run build
npm run preview
```

`npm ci` deve ser usado em CI e em instalações limpas que respeitem exatamente o `package-lock.json`.

## Estrutura

```text
src/
  components/
    common/       componentes compartilhados
    layout/       cabeçalho, fundo e rodapé
    sections/     seções editoriais
    wayper/       estudo de caso e visual do Wayper
  data/           conteúdo profissional centralizado
  hooks/          comportamento de navegação
  services/       consulta resiliente à API do GitHub
  styles/         sistema visual global
public/
  images/         imagem social e foto para dados estruturados
docs/
  auditoria-inicial.md
```

## Atualização de conteúdo

As informações profissionais ficam em [`src/data/portfolio.js`](src/data/portfolio.js):

- `profile`: nome, cargo, localização e links;
- `experiences`: Venddor e Exército Brasileiro;
- `wayper`: conteúdo técnico do estudo de caso;
- `projects`: projetos públicos secundários;
- `stackGroups`: tecnologias organizadas por capacidade;
- `education`: graduação e formação complementar;
- `selectedGithubRepos`: repositórios que a API pode exibir.

Afirmações sobre o Wayper devem ser revisadas contra o código real antes de qualquer atualização. Tecnologias instaladas mas não usadas não devem entrar na lista.

## Atualização de projetos

Para adicionar um projeto:

1. confirme que o link é público e correto;
2. verifique o código, não apenas o README;
3. descreva contexto, problema, solução, responsabilidade, resultado e status;
4. não use métricas sem fonte;
5. não apresente trabalho privado como repositório público.

O componente de projetos está em [`src/components/sections/ProjectsSection.jsx`](src/components/sections/ProjectsSection.jsx).

## Currículo

O download usa `Assets/Curriculo.pdf`, importado pelo Vite para respeitar o `base` do GitHub Pages.

O PDF atual foi criado em agosto de 2025 e está desatualizado. Antes da publicação definitiva, ele deve ser substituído por uma versão que:

- inclua a experiência atual na Venddor;
- remova o texto de transição de carreira e busca da primeira oportunidade;
- atualize o foco antigo em PHP/Laravel;
- use a localização atual em Balneário Arroio do Silva, SC;
- revise o período da formação;
- remova telefone e redes antigas caso não devam continuar públicos;
- confira as datas divergentes do Exército Brasileiro.

Mantenha o mesmo caminho e nome do arquivo para não alterar o botão:

```text
Assets/Curriculo.pdf
```

## Imagens

- `images/eu.jpg`: foto exibida na seção “Sobre”.
- `public/images/eduardo-weissheimer.jpg`: cópia otimizada para dados estruturados.
- `public/images/og-portfolio.jpg`: imagem 1200×630 usada por Open Graph e Twitter Card.
- `public/favicon.png`: favicon otimizado.

Ao substituir imagens, preserve a proporção e otimize o arquivo antes do commit. Atualize texto alternativo e metadados quando o conteúdo visual mudar.

## GitHub público

`src/services/github.js`:

- limita a consulta aos repositórios selecionados;
- verifica a cota disponível antes de disparar o conjunto de requisições;
- usa cache local por 30 minutos;
- aplica timeout de 8 segundos;
- aceita `AbortSignal`;
- reaproveita cache expirado quando a rede falha;
- tolera respostas parciais de linguagens;
- nunca impede o restante da página de renderizar.

Os testes unitários validam seleção e agregação de linguagens:

```bash
npm test
```

## Formulário de contato

O formulário envia para o FormSubmit sem expor token. Há validação HTML, honeypot, timeout, feedback com `aria-live` e link `mailto:` como fallback.

No primeiro envio real, o FormSubmit pode solicitar a ativação do endereço por email. Faça essa ativação antes de divulgar o formulário. Nenhum segredo deve ser adicionado ao frontend.

## Acessibilidade

O site inclui:

- landmarks e hierarquia de títulos;
- link para pular ao conteúdo;
- foco visível;
- navegação por teclado;
- fechamento do menu com `Escape`;
- bloqueio de scroll no menu mobile;
- áreas clicáveis com pelo menos 44 px;
- mensagens acessíveis no formulário;
- contraste forte;
- suporte a `prefers-reduced-motion`;
- conteúdo funcional quando a API do GitHub falha.

## SEO

`index.html` contém:

- título e descrição;
- canonical;
- Open Graph;
- Twitter Card;
- JSON-LD do tipo `Person`, com ocupação, empresa, instituição, localização e conhecimentos;
- imagem social própria.

`public/robots.txt` e `public/sitemap.xml` usam a URL final do GitHub Pages.

Ao mudar o endereço de publicação, atualize:

- `vite.config.js`;
- canonical e URLs sociais em `index.html`;
- `public/robots.txt`;
- `public/sitemap.xml`.

## Direção visual

O sistema usa grafite, verde elétrico e azul técnico. Grades, topografia e telemetria aparecem como linguagem visual do portfólio; o mapa territorial fica concentrado no projeto Wayper. As famílias tipográficas são a pilha sans-serif do sistema e uma pilha monoespaçada para labels técnicos.

As animações usam principalmente `transform` e `opacity`, ficam mais discretas no mobile e são removidas quando o sistema solicita redução de movimento.

## Publicação no GitHub Pages

O workflow está em `.github/workflows/deploy.yml` e executa, em push na `main`:

1. `npm ci`;
2. lint;
3. testes;
4. build;
5. upload de `dist`;
6. deploy com as actions oficiais do GitHub Pages.

Configuração manual:

1. abra **Settings → Pages** no repositório;
2. em **Build and deployment**, selecione **GitHub Actions**;
3. faça merge da branch de desenvolvimento na `main`;
4. acompanhe o workflow **Deploy GitHub Pages** na aba Actions.

Também é possível executar o workflow manualmente por `workflow_dispatch`.

## Segurança e privacidade

- não há telefone ou WhatsApp no site;
- não há tokens, credenciais ou configurações privadas;
- detalhes de clientes e código da Venddor não são expostos;
- a API usada é pública;
- os serviços externos são GitHub API e FormSubmit.

O relatório técnico inicial está em [`docs/auditoria-inicial.md`](docs/auditoria-inicial.md).
