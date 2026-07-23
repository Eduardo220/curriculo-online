# Auditoria inicial

Auditoria realizada em 23 de julho de 2026 antes da reconstrução do portfólio.

## Diagnóstico resumido

| Gravidade | Problema | Causa | Solução adotada | Arquivos afetados |
| --- | --- | --- | --- | --- |
| Crítica | O projeto não instalava nem compilava | O `package.json` não declarava dependências e não havia lockfile | Declarar versões compatíveis, gerar lockfile e validar instalação limpa | `package.json`, `package-lock.json` |
| Crítica | A aplicação importava uma folha de estilos inexistente | A migração do site antigo para React ficou incompleta | Criar um sistema visual novo e centralizado | `src/main.jsx`, `src/styles/global.css` |
| Alta | Não existiam lint nem testes do portfólio | Scripts e configuração ausentes | Adicionar ESLint flat config e testes das transformações da API do GitHub | `eslint.config.js`, `src/services/github.test.js` |
| Alta | Cargo, localização e experiência estavam desatualizados | Os dados ainda usavam “Software Engineer”, Santa Maria/RS e uma trajetória abstrata | Reescrever os dados a partir do briefing e das fontes verificadas | `src/data/portfolio.js`, componentes e metadados |
| Alta | O Wayper apontava para o perfil geral e misturava fatos implementados com ambições | O projeto não havia sido auditado pelo código | Criar seção própria com link direto e afirmações comprovadas no repositório | `src/components/wayper/*`, `src/data/portfolio.js` |
| Alta | SEO continha título, descrição, endereço e imagem social incorretos | Metadados da versão anterior | Atualizar metadados, JSON-LD, canonical, sitemap e imagem Open Graph dedicada | `index.html`, `public/robots.txt`, `public/sitemap.xml`, `public/images/og-portfolio.png` |
| Alta | O currículo público está desatualizado | PDF criado em agosto de 2025, anterior à experiência atual | Manter o download funcionando e documentar a substituição necessária | `Assets/Curriculo.pdf`, `README.md` |
| Média | A experiência misturava empregos com fases abstratas | Estrutura de timeline usada para preencher volume | Exibir somente Venddor e Exército Brasileiro, com escopo objetivo | `src/components/sections/ExperienceSection.jsx` |
| Média | Métricas profissionais não tinham fonte | Números foram usados como recurso visual | Remover contadores e substituí-los por evidências e contexto técnico | `src/App.jsx`, dados e componentes |
| Média | Cards de projetos usavam logos sem relação e links genéricos | Conteúdo legado sem validação dos repositórios | Manter Wayper e Banco Laravel; remover da vitrine o que não pôde ser comprovado | `src/components/sections/ProjectsSection.jsx`, dados |
| Média | A integração com GitHub fazia muitas requisições e não tinha timeout/abort | API implementada com `Promise.all` amplo e proteção parcial | Reduzir escopo, adicionar timeout, abort, cache expirado e fallback validado | `src/services/github.js`, `src/components/sections/GithubSection.jsx` |
| Média | Menu mobile não bloqueava scroll nem gerenciava Escape/foco | Estado visual mínimo | Implementar comportamento de teclado, foco, seção ativa e progresso | `src/components/layout/Header.jsx`, `src/hooks/useActiveSection.js` |
| Média | Formulário dependia de terceiro sem timeout ou barreira antispam | Integração direta com FormSubmit | Adicionar validação, honeypot, timeout, estados acessíveis e fallback por email | `src/components/sections/ContactSection.jsx` |
| Baixa | Assets e código do site antigo não são consumidos pelo React | Migração deixou diretórios legados na raiz | Manter fora do build; a remoção fica separada porque esses arquivos já tinham alterações locais anteriores | `css/`, `js/`, `fonts/`, logos antigos |

## Fontes verificadas

- Briefing profissional fornecido para esta reconstrução.
- Currículo em `Assets/Curriculo.pdf`.
- Código atual do repositório público `Eduardo220/wayper`, e não apenas o README.
- Código atual do repositório público `Eduardo220/Banco_Laravel`.
- API pública do GitHub para confirmar repositórios e links.

## Wayper: implementado versus evolução

Comprovado no código:

- React Native, Expo, Firebase Auth, Firestore, MapLibre e OpenFreeMap.
- Expo Location e Task Manager para rastreamento foreground/background.
- AsyncStorage, fila de corridas não sincronizadas, NetInfo, retries e recuperação de atividade.
- Filtros por precisão, ordem, saltos, velocidade e localização simulada.
- Suavização de rota, cálculo de distância/ritmo e separação de trilhas bruta, confiável e de renderização.
- Geometria, captura, armazenamento, mapa, ranking e antifraude de territórios.
- Testes automatizados para tracking, territórios, ranking, perfil, XP e utilitários de corrida.

Não apresentado como concluído:

- Sentry ou outra plataforma central de observabilidade.
- Persistência do cache do React Query: os pacotes existem, mas o provider persistente não está ligado.
- Resultados de consumo de bateria e confiabilidade em produção.

## Riscos externos encontrados

O repositório público do Wayper contém artefatos Android que merecem uma revisão de segurança, incluindo um keystore versionado. Nenhum desses arquivos foi aberto, copiado ou alterado nesta tarefa. A recomendação é revogar/substituir credenciais de assinatura quando aplicável, remover o material sensível do histórico e adotar secrets no processo de build.

## Decisões

- Não usar capturas antigas do Wayper: elas mostram a interface anterior, Google Maps e referências a Santa Maria.
- Não inventar período de início na Venddor.
- Usar “2022 — em andamento” para a graduação porque esse é o status disponível no PDF; revisar quando houver uma fonte mais atual.
- Não expor telefone ou WhatsApp.
- Não afirmar que o Banco Laravel é uma API bancária completa: o código atual comprova uma aplicação web com autenticação e operações de conta.
