import profileImage from "../../images/eu.jpg";
import cvFile from "../../Assets/Curriculo.pdf";

export const profile = {
  name: "Eduardo Weissheimer",
  role: "Desenvolvedor de Software",
  specialty: "Backend, aplicativos e integrações",
  location: "Balneário Arroio do Silva, SC, Brasil",
  email: "eduardo.weissheimer22@gmail.com",
  githubUsername: "Eduardo220",
  githubUrl: "https://github.com/Eduardo220",
  linkedinUrl: "https://www.linkedin.com/in/eduardo-weissheimer/",
  cvUrl: cvFile,
  image: profileImage,
};

export const navItems = [
  { label: "Sobre", href: "#sobre", id: "sobre" },
  { label: "Experiência", href: "#experiencia", id: "experiencia" },
  { label: "Wayper", href: "#wayper", id: "wayper" },
  { label: "Projetos", href: "#projetos", id: "projetos" },
  { label: "Stack", href: "#stack", id: "stack" },
  { label: "GitHub", href: "#github", id: "github" },
  { label: "Contato", href: "#contato", id: "contato" },
];

export const workingPrinciples = [
  {
    code: "01",
    title: "Investigar antes de corrigir",
    text: "Logs, mensagens em filas e dados no banco ajudam a reconstruir o fluxo antes de qualquer mudança.",
  },
  {
    code: "02",
    title: "Entender a regra de negócio",
    text: "Pedidos, pagamentos e sincronizações só ficam confiáveis quando o comportamento esperado está claro.",
  },
  {
    code: "03",
    title: "Pensar no produto inteiro",
    text: "No Wayper, isso conecta interface, GPS, persistência, mapas, sincronização e experiência de uso.",
  },
];

export const experiences = [
  {
    company: "Venddor",
    role: "Desenvolvedor de Software Júnior",
    period: "Atual",
    current: true,
    summary:
      "Desenvolvimento e manutenção de aplicativos, APIs, workers, microsserviços e integrações usadas em operações digitais e de e-commerce.",
    groups: [
      {
        title: "Desenvolvimento",
        items: [
          "Serviços em C# e .NET, APIs REST, workers e manutenção de microsserviços.",
          "Correções em fluxos de pedidos, pagamentos, produtos e clientes.",
        ],
      },
      {
        title: "Integrações e processamento",
        items: [
          "Processamento assíncrono com RabbitMQ e integração com Magento e ERPs.",
          "Integrações com Bling, Tiny e Sienge, respeitando regras distintas entre plataformas.",
        ],
      },
      {
        title: "Operação e diagnóstico",
        items: [
          "Investigação de incidentes por logs, filas, banco de dados e comportamento entre tenants.",
          "Análise de causa, correção cuidadosa e prevenção de regressões em sistemas em uso.",
        ],
      },
    ],
    tools: ["C#", ".NET", "APIs REST", "RabbitMQ", "SQL Server", "Docker", "Azure DevOps"],
  },
  {
    company: "Exército Brasileiro",
    role: "Soldado",
    period: "2023 — fev 2025",
    current: false,
    summary:
      "Experiência em ambiente operacional estruturado, com responsabilidade sobre rotinas, materiais, documentação e execução de tarefas sob pressão.",
    groups: [
      {
        title: "Contexto",
        items: [
          "Organização de processos e documentação em uma operação com hierarquia e responsabilidades claras.",
          "Comunicação, disciplina e cuidado na execução de tarefas com impacto sobre outras pessoas.",
        ],
      },
    ],
    tools: [],
  },
];

export const wayper = {
  name: "Wayper",
  label: "Produto próprio · em desenvolvimento ativo",
  githubUrl: "https://github.com/Eduardo220/wayper",
  summary:
    "Aplicativo mobile de corrida gamificada que transforma trajetos reais em territórios conquistados no mapa.",
  description:
    "Durante uma atividade, o Wayper coleta e processa pontos de localização, acompanha métricas da corrida e usa dados geoespaciais para representar as áreas percorridas. O projeto combina produto mobile, GPS, mapas, persistência local e sincronização com backend.",
  problem:
    "Registrar uma corrida já exige lidar com localização imprecisa, interrupções e uso em segundo plano. Transformar esse trajeto em território adiciona validação geoespacial, consistência de estado, competição e proteção contra dados suspeitos.",
  solution:
    "O app separa pontos brutos, confiáveis e de renderização; filtra leituras ruins, preserva a atividade localmente, sincroniza quando a rede volta e aplica regras próprias para formar e validar territórios.",
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
      text: "Expo Location e Task Manager recebem pontos em primeiro e segundo plano.",
    },
    {
      code: "02",
      title: "Confiança",
      text: "Filtros avaliam precisão, ordem, saltos, velocidade e localização simulada.",
    },
    {
      code: "03",
      title: "Persistência",
      text: "AsyncStorage preserva corridas, estado ativo, territórios e itens ainda não sincronizados.",
    },
    {
      code: "04",
      title: "Sincronização",
      text: "NetInfo, retries e backoff coordenam o envio ao Firestore quando há conectividade.",
    },
  ],
  engineering: [
    {
      title: "Rota confiável",
      text: "O tracking mantém trilhas bruta, filtrada e visual. A suavização melhora a leitura sem alterar os pontos usados nos cálculos.",
    },
    {
      title: "Continuidade da corrida",
      text: "A atividade ativa é persistida, o serviço mantém uma fila de corridas pendentes e tenta recuperar o estado após interrupções.",
    },
    {
      title: "Território geoespacial",
      text: "Turf apoia a construção e validação de geometria, área, células e interações entre territórios.",
    },
    {
      title: "Proteção contra fraude GPS",
      text: "As regras rejeitam localização simulada, saltos, velocidade impossível, baixa precisão e atividades insuficientes.",
    },
  ],
  nextSteps: [
    "Medir consumo de bateria e estabilidade em corridas longas em diferentes aparelhos.",
    "Conectar a persistência do cache do React Query já prevista nas dependências.",
    "Adicionar observabilidade centralizada para falhas e diagnósticos fora do ambiente local.",
  ],
  learnings: [
    "Dados de GPS precisam ser tratados como sinais imperfeitos, não como verdade absoluta.",
    "Offline-first exige decidir o que é fonte de verdade e como conflitos serão reconciliados.",
    "A rota usada para cálculo não precisa ser a mesma curva apresentada visualmente no mapa.",
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
    label: "Projeto público · estudo aplicado",
    status: "Funcional, sem demo publicada",
    githubUrl: "https://github.com/Eduardo220/Banco_Laravel",
    context:
      "Aplicação web bancária experimental criada para praticar modelagem, autenticação e regras de movimentação financeira.",
    problem:
      "Organizar usuários, contas corrente e poupança, saldo e histórico de operações sem espalhar as regras por toda a aplicação.",
    solution:
      "Estrutura em Laravel com rotas autenticadas, models Eloquent, validação de entrada e fluxos de depósito, saque e transferência.",
    responsibility:
      "Implementação da aplicação, modelagem relacional, autenticação, regras de conta, views Blade e registros de auditoria.",
    result:
      "Um projeto de estudo que consolidou regras de negócio, relacionamentos de dados e organização de uma aplicação backend renderizada no servidor.",
    technologies: ["PHP 8.2", "Laravel 12", "Eloquent", "Blade", "Laravel Auditing"],
  },
];

export const stackGroups = [
  {
    title: "Backend",
    code: "core.services",
    description: "Serviços, contratos HTTP, regras de negócio e processamento fora da requisição.",
    items: ["C#", ".NET", "ASP.NET", "APIs REST", "Workers", "Microsserviços"],
  },
  {
    title: "Integrações",
    code: "systems.connect",
    description: "Fluxos entre e-commerce, ERPs e serviços que operam de forma assíncrona.",
    items: ["RabbitMQ", "Webhooks", "Magento", "Bling", "Tiny", "Sienge"],
  },
  {
    title: "Dados",
    code: "state.persist",
    description: "Persistência, consultas, análise operacional e dados locais de aplicativos.",
    items: ["SQL Server", "Firestore", "AsyncStorage", "Modelagem", "Análise de consultas"],
  },
  {
    title: "Mobile e frontend",
    code: "product.interface",
    description: "Aplicativos e interfaces conectados a mapas, localização e produto.",
    items: ["React Native", "Expo", "React", "JavaScript", "MapLibre", "Geolocalização"],
  },
  {
    title: "Entrega e diagnóstico",
    code: "ship.observe",
    description: "Ferramentas usadas para versionar, empacotar, entregar e investigar sistemas.",
    items: ["Docker", "Git", "GitHub", "Azure DevOps", "Logs", "Firebase"],
  },
];

export const education = {
  degree: "Análise e Desenvolvimento de Sistemas",
  institution: "UNINTER",
  period: "2022 — em andamento",
  note: "Período e status obtidos no currículo atual; devem ser revisados quando houver atualização acadêmica.",
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
