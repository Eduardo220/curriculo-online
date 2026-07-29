import profileImage from "../../images/eu.jpg";
import cvFile from "../../Assets/Curriculo.pdf";

export const profile = {
  name: "Eduardo Weissheimer",
  role: "Desenvolvedor de Software",
  specialty: "Backend e desenvolvimento mobile",
  location: "Balneário Arroio do Silva, SC, Brasil",
  email: "eduardo.weissheimer22@gmail.com",
  githubUsername: "Eduardo220",
  githubUrl: "https://github.com/Eduardo220",
  linkedinUrl: "https://www.linkedin.com/in/eduardo-weissheimer/",
  cvUrl: cvFile,
  image: profileImage,
};

export const navItems = [
  { label: "Início", href: "#top", id: "top" },
  { label: "Sobre mim", href: "#sobre", id: "sobre" },
  { label: "Experiência", href: "#experiencia", id: "experiencia" },
  { label: "Projetos", href: "#projetos", id: "projetos" },
  { label: "Stack", href: "#stack", id: "stack" },
  { label: "GitHub", href: "#github", id: "github" },
  { label: "Contato", href: "#contato", id: "contato" },
];

export const workingPrinciples = [
  {
    code: "01",
    title: "Entender antes de mexer",
    text: "Antes de corrigir, gosto de olhar os dados e acompanhar o caminho completo do problema.",
  },
  {
    code: "02",
    title: "Entender a regra",
    text: "O código fica mais simples quando está claro o que o sistema realmente precisa fazer.",
  },
  {
    code: "03",
    title: "Aprender construindo",
    text: "Projetos próprios são onde testo ideias, conheço ferramentas novas e coloco o aprendizado em prática.",
  },
];

export const experiences = [
  {
    company: "Venddor",
    role: "Desenvolvedor de Software Júnior",
    period: "Atual",
    current: true,
    summary:
      "Desenvolvimento e manutenção da plataforma em PHP, integrações com diferentes APIs e aplicativos mobile usados em operações digitais e de e-commerce.",
    groups: [
      {
        title: "Plataforma e backend",
        items: [
          "Desenvolvimento e manutenção de funcionalidades da plataforma, principalmente em PHP.",
          "Evolução de serviços em C# e .NET e de fluxos ligados a pedidos, pagamentos, produtos e clientes.",
        ],
      },
      {
        title: "Integrações e APIs",
        items: [
          "Desenvolvimento e manutenção de integrações principalmente em C, conectando diferentes APIs.",
          "Investigação de falhas por logs, banco de dados e comportamento das aplicações integradas.",
        ],
      },
      {
        title: "Mobile e evolução",
        items: [
          "Desenvolvimento e manutenção de sistemas mobile com React Native, incluindo telas, fluxos e consumo de APIs.",
          "Go na evolução tecnológica da Venddor 2.0.",
        ],
      },
    ],
    tools: [
      "PHP",
      "C",
      "C#",
      ".NET",
      "APIs REST",
      "React Native",
      "SQL Server",
      "Go",
    ],
  },
  {
    company: "Exército Brasileiro",
    role: "Soldado",
    period: "MAR 2023 — FEV 2025",
    current: false,
    summary:
      "Durante minha atuação no Exército Brasileiro, apoiei a seção de operações e planejamento (S3) na organização de instruções, cronogramas, escalas e atividades da unidade. A experiência fortaleceu minha capacidade de priorizar demandas, alinhar equipes e tomar decisões com responsabilidade.",
    groups: [
      {
        title: "Planejamento, coordenação e liderança",
        items: [
          "Planejamento e coordenação de instruções, treinamentos e demandas envolvendo diferentes equipes.",
          "Organização de cronogramas, escalas, documentos e acompanhamento de prazos e pendências.",
          "Alinhamento de pessoal, materiais e informações entre setores, com comunicação objetiva em diferentes níveis hierárquicos.",
          "Liderança prática, disciplina e tomada de decisão sob pressão, com rápida adaptação a mudanças de prioridade e imprevistos.",
        ],
      },
    ],
    tools: [],
  },
];

export const wayper = {
  name: "Wayper",
  label: "Projeto pessoal · em desenvolvimento",
  githubUrl: "https://github.com/Eduardo220/wayper",
  summary: "Um app de corrida em que o trajeto vira território no mapa.",
  description:
    "O Wayper nasceu de uma ideia simples: deixar a corrida mais divertida. É também o projeto em que mais tenho explorado React Native, GPS, mapas, funcionamento offline e Firebase.",
  problem:
    "A ideia parece simples, mas o GPS nem sempre entrega pontos precisos e a corrida pode ser interrompida a qualquer momento. Além de registrar o trajeto, o app precisa manter o estado e decidir quais dados são confiáveis.",
  solution:
    "Hoje o app separa os pontos brutos dos pontos usados nos cálculos e no mapa, filtra leituras ruins, salva a atividade no aparelho e sincroniza os dados quando a conexão volta.",
  capabilities: [
    "Registro de corridas com distância, tempo, ritmo e velocidade",
    "Rastreamento foreground e background com Expo Location",
    "Mapa baseado em MapLibre e tiles OpenFreeMap",
    "Territórios, ranking, feed, amigos e grupos",
    "Persistência local e fila de sincronização",
    "Autenticação e dados remotos com Firebase",
  ],
  architecture: [
    {
      code: "01",
      title: "Captura",
      text: "Expo Location e Task Manager recebem os pontos em primeiro e segundo plano.",
    },
    {
      code: "02",
      title: "Validação",
      text: "Os filtros conferem precisão, ordem, saltos, velocidade e localização simulada.",
    },
    {
      code: "03",
      title: "Dados locais",
      text: "AsyncStorage mantém a corrida ativa, os territórios e o que ainda precisa ser enviado.",
    },
    {
      code: "04",
      title: "Sincronização",
      text: "Quando a conexão volta, o app tenta enviar os dados pendentes ao Firestore.",
    },
  ],
  engineering: [
    {
      title: "Rota confiável",
      text: "O rastreamento mantém trilhas bruta, filtrada e visual. Assim, o mapa pode ficar mais legível sem alterar os cálculos.",
    },
    {
      title: "Continuidade da corrida",
      text: "A atividade fica salva no aparelho para que o estado possa ser recuperado depois de uma interrupção.",
    },
    {
      title: "Território geoespacial",
      text: "Turf ajuda a montar e validar as áreas, as células e as interações entre territórios.",
    },
    {
      title: "Proteção contra fraude GPS",
      text: "As regras descartam localização simulada, saltos, velocidade impossível e pontos com baixa precisão.",
    },
  ],
  nextSteps: [
    "Medir melhor o consumo de bateria em corridas longas e em aparelhos diferentes.",
    "Aprimorar a persistência dos dados usados pelo React Query.",
    "Melhorar o acompanhamento de falhas fora do ambiente local.",
  ],
  learnings: [
    "GPS é um sinal imperfeito e precisa ser validado antes de entrar nos cálculos.",
    "Trabalhar offline exige deixar claro qual dado vale quando aparece um conflito.",
    "A rota usada nos cálculos não precisa ser igual à curva mostrada no mapa.",
  ],
  technologies: [
    "React Native",
    "Expo",
    "Firebase Auth",
    "Firestore",
    "MapLibre",
    "OpenFreeMap",
    "Turf",
    "React Query",
    "AsyncStorage",
    "Expo Location",
    "Task Manager",
    "NetInfo",
    "Reanimated",
  ],
};

export const projects = [
  {
    name: "Banco Laravel",
    label: "Projeto de estudo · código público",
    status: "Código disponível, sem demo publicada",
    githubUrl: "https://github.com/Eduardo220/Banco_Laravel",
    context:
      "Uma aplicação bancária que fiz para praticar Laravel, modelagem de dados, autenticação e regras de movimentação financeira.",
    problem:
      "Organizar usuários, contas corrente e poupança, saldo e histórico de operações sem espalhar as regras por toda a aplicação.",
    solution:
      "Estrutura em Laravel com rotas autenticadas, models Eloquent, validação de entrada e fluxos de depósito, saque e transferência.",
    responsibility:
      "Implementação da aplicação, modelagem relacional, autenticação, regras de conta, views Blade e registros de auditoria.",
    result:
      "O projeto me ajudou a consolidar regras de negócio, relacionamentos de dados e a organização de uma aplicação backend renderizada no servidor.",
    technologies: ["PHP 8.2", "Laravel 12", "Eloquent", "Blade", "Laravel Auditing"],
  },
];

export const stackGroups = [
  {
    title: "Backend",
    code: "core.services",
    description: "Plataforma, APIs, integrações, regras de negócio e processamento em segundo plano.",
    items: ["PHP", "C", "C#", ".NET", "ASP.NET", "APIs REST", "Workers", "Microsserviços"],
  },
  {
    title: "Dados",
    code: "state.persist",
    description: "Banco relacional, dados remotos e persistência local nos aplicativos.",
    items: ["SQL Server", "Firestore", "AsyncStorage", "Modelagem", "Consultas SQL"],
  },
  {
    title: "Mobile e front",
    code: "product.interface",
    description: "Aplicativos, interfaces, mapas e recursos de localização.",
    items: ["React Native", "Expo", "React", "JavaScript", "MapLibre", "Geolocalização"],
  },
  {
    title: "Entrega e diagnóstico",
    code: "ship.observe",
    description: "Versionamento, ambiente, entrega e investigação de problemas.",
    items: ["Docker", "Git", "GitHub", "Logs", "Debug", "Firebase"],
  },
];

export const education = {
  degree: "Análise e Desenvolvimento de Sistemas",
  institution: "UNINTER",
  period: "2022 — em andamento",
  complementary: [
    "Formação PHP Experience · DIO",
    "Git e GitHub Essentials · DIO",
    "Fundamentos de banco de dados · DIO",
  ],
};

export const selectedGithubRepos = ["wayper", "Banco_Laravel", "curriculo-online"];

export const githubFallback = {
  publicRepos: null,
  followers: null,
  languages: [],
  recentRepos: [
    {
      name: "wayper",
      description: "Aplicativo mobile de corrida com competição por territórios reais.",
      url: wayper.githubUrl,
      language: "JavaScript",
      stars: null,
      updatedAt: null,
    },
    {
      name: "Banco_Laravel",
      description: "Aplicação bancária experimental construída com Laravel.",
      url: projects[0].githubUrl,
      language: "PHP",
      stars: null,
      updatedAt: null,
    },
  ],
  fromFallback: true,
};
