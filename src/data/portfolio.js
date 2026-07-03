import profileImage from "../../images/eu.jpg";
import codeVitalLogo from "../../images/Logo CodeVital.png";
import ecommerceLogo from "../../images/Logo e-commercePro.png";
import sghssLogo from "../../images/Logo SGHSS.png";
import cvFile from "../../Assets/Curriculo.pdf";

export const profile = {
  name: "Eduardo Weissheimer",
  role: "Software Engineer",
  location: "Santa Maria, RS - Brasil",
  email: "eduardo.weissheimer22@gmail.com",
  phone: "+55 (55) 98408-0642",
  githubUsername: "Eduardo220",
  githubUrl: "https://github.com/Eduardo220",
  linkedinUrl: "https://www.linkedin.com/in/eduardo-weissheimer/",
  cvUrl: cvFile,
  image: profileImage,
  focus: ["Backend", "Integrações", "APIs", "Arquitetura", "Produtos Digitais"],
};

export const navItems = [
  { label: "Sobre", href: "#sobre" },
  { label: "Stack", href: "#stack" },
  { label: "Experiência", href: "#experiencia" },
  { label: "Projetos", href: "#projetos" },
  { label: "GitHub", href: "#github" },
  { label: "Contato", href: "#contato" },
];

export const stackGroups = [
  {
    title: "Backend",
    description: "Construção de APIs, serviços, regras de negócio e sistemas robustos.",
    items: ["C#", ".NET", "ASP.NET", "Entity Framework"],
  },
  {
    title: "Integrações",
    description: "Conexão entre plataformas, ERPs, filas, eventos e automações críticas.",
    items: ["Magento", "APIs REST", "RabbitMQ", "Webhooks"],
  },
  {
    title: "Banco",
    description: "Modelagem, consultas, persistência, performance e cache aplicado.",
    items: ["SQL Server", "PostgreSQL", "Redis"],
  },
  {
    title: "Frontend",
    description: "Interfaces modernas para produtos web e mobile com foco em experiência.",
    items: ["React", "React Native", "Expo", "TypeScript"],
  },
  {
    title: "DevOps",
    description: "Entrega, versionamento, ambientes e automação do ciclo de desenvolvimento.",
    items: ["Docker", "Git", "Azure DevOps", "GitHub"],
  },
];

export const timeline = [
  {
    title: "Exército Brasileiro",
    period: "2023 - 2025",
    summary:
      "Base forte em disciplina, processos, documentação, responsabilidade operacional e execução sob pressão.",
  },
  {
    title: "Venddor",
    period: "Atual",
    summary:
      "Atuação em integrações, APIs, workers, correções críticas, microsserviços e sustentação de fluxos de negócio.",
  },
  {
    title: "Software Engineer",
    period: "Evolução técnica",
    summary:
      "Foco em backend, arquitetura, produtos digitais e sistemas que conectam plataformas de forma confiável.",
  },
  {
    title: "Projetos próprios",
    period: "Produto e experimentação",
    summary:
      "Criação de soluções próprias para explorar produto, experiência, mobile, geolocalização e performance.",
  },
];

export const professionalExperience = {
  company: "Venddor",
  role: "Software Engineer",
  description:
    "Desenvolvimento e manutenção de integrações, APIs REST, workers e serviços voltados para operações digitais e e-commerce.",
  activities: [
    "Desenvolvimento de integrações entre sistemas e plataformas de venda.",
    "Correções críticas em fluxos de pedido, sincronização e processamento.",
    "Construção e manutenção de APIs REST, workers e microsserviços.",
    "Uso de RabbitMQ, SQL Server, Docker, Magento, Bling e Tiny.",
    "Análise de incidentes, logs, filas, banco de dados e comportamento de serviços.",
  ],
};

export const projects = [
  {
    title: "Wayper",
    label: "Projeto principal",
    featured: true,
    image: null,
    description:
      "Aplicativo mobile gamificado que transforma caminhadas e corridas em um jogo de conquista territorial utilizando GPS em tempo real.",
    technologies: ["React Native", "Expo", "Geolocalização", "Firebase", "Mapas", "Backend"],
    problems: [
      "Renderização de áreas no mapa sem comprometer fluidez.",
      "Algoritmos de polígonos para conquista territorial.",
      "Sincronização entre dados locais, cache offline e backend.",
      "Performance, consumo de bateria e detecção de fraude GPS.",
    ],
    result:
      "Um produto próprio com desafios reais de mobile, localização, arquitetura offline-first e experiência gamificada.",
    githubUrl: profile.githubUrl,
    demoUrl: null,
  },
  {
    title: "Integrações Venddor",
    label: "Experiência profissional",
    image: sghssLogo,
    description:
      "Integrações e automações para conectar marketplaces, ERPs, sistemas internos e plataformas de e-commerce.",
    technologies: ["C#", ".NET", "RabbitMQ", "SQL Server", "Docker", "Magento"],
    problems: [
      "Processamento assíncrono de pedidos e eventos.",
      "Correções críticas em fluxos de integração.",
      "Observabilidade de filas, logs e dados transacionais.",
    ],
    result: "Fluxos mais confiáveis para operações digitais com menor intervenção manual.",
    githubUrl: null,
    demoUrl: null,
  },
  {
    title: "Parkew's Bank",
    label: "Projeto pessoal",
    image: ecommerceLogo,
    description:
      "Plataforma bancária experimental criada para praticar regras de negócio, segurança, transações e organização backend.",
    technologies: ["PHP", "Laravel", "MySQL"],
    problems: [
      "Modelagem de contas e transações.",
      "Validações de segurança e consistência de dados.",
      "Organização de logs e fluxo de operações financeiras simuladas.",
    ],
    result: "Projeto de estudo aplicado para consolidar fundamentos de backend e produto.",
    githubUrl: profile.githubUrl,
    demoUrl: null,
  },
  {
    title: "Dash",
    label: "Interface web",
    image: codeVitalLogo,
    description:
      "Experimento de loja online com foco em interface, identidade visual e estrutura responsiva.",
    technologies: ["HTML", "CSS", "JavaScript"],
    problems: [
      "Criação de interface responsiva.",
      "Organização visual de uma experiência comercial.",
      "Ajustes de contraste, hierarquia e interação.",
    ],
    result: "Base visual para explorar composição, landing pages e experiência de compra.",
    githubUrl: null,
    demoUrl: "https://dashgg.site/",
  },
];

export const stats = [
  { label: "Anos de experiência", value: 3, suffix: "+" },
  { label: "Projetos desenvolvidos", value: 8, suffix: "+" },
  { label: "Tecnologias utilizadas", value: 20, suffix: "+" },
  { label: "Integrações e fluxos", value: 10, suffix: "+" },
];

export const githubFallback = {
  publicRepos: 0,
  followers: 0,
  recentCommits: 0,
  publicEvents: 0,
  languages: [
    { name: "C#", value: 38 },
    { name: "JavaScript", value: 24 },
    { name: "TypeScript", value: 18 },
    { name: "CSS", value: 12 },
    { name: "PHP", value: 8 },
  ],
  recentRepos: [],
  fromFallback: true,
};
