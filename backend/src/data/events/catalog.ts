import type { GameEvent } from '../../engine/types.js';

/**
 * Event catalog — data-driven.
 * To add content: append events here. Engine filters by requirements + weight.
 */
export const gameEvents: GameEvent[] = [
  {
    id: 'quiet_month',
    title: 'Mês tranquilo',
    description: 'Nada de especial. Só tickets, café e stand-ups.',
    weight: 8,
    tags: ['filler'],
    options: [
      {
        id: 'study',
        label: 'Estudar no tempo livre',
        effects: {
          skills: { react: 2, node: 2 },
          attributes: { discipline: 2, mentalHealth: 2 },
        },
      },
      {
        id: 'network',
        label: 'Ir a um meetup',
        effects: {
          attributes: { networking: 4, communication: 2 },
        },
      },
      {
        id: 'slack_off',
        label: 'Só sobreviver ao mês',
        effects: {
          attributes: { mentalHealth: 5, discipline: -2 },
        },
      },
    ],
  },
  {
    id: 'first_job',
    title: 'Primeira oportunidade CLT',
    description: 'Uma software house local te chama para entrevista.',
    weight: 22,
    requirements: {
      hasCompany: false,
      careerPaths: ['clt'],
    },
    tags: ['career', 'opportunity'],
    options: [
      {
        id: 'accept_sh',
        label: 'Aceitar na Code&Ship SP',
        effects: {
          setCompanyId: 'software_house_sp',
          setCareerPath: 'clt',
          salary: 800,
          attributes: { reputation: 5 },
          addTimelineNote: 'Entrou na Code&Ship SP',
          addAchievement: 'Primeiro CLT',
        },
      },
      {
        id: 'accept_agency',
        label: 'Aceitar na Agência Deploy',
        effects: {
          setCompanyId: 'agencia_web',
          setCareerPath: 'clt',
          salary: 400,
          attributes: { frontend: 3, creativity: 2 },
        },
      },
      {
        id: 'accept_startup',
        label: 'Aceitar na Nubug Startup',
        effects: {
          setCompanyId: 'startup_local',
          setCareerPath: 'clt',
          salary: 200,
          attributes: { creativity: 4, mentalHealth: -2 },
          addTimelineNote: 'Entrou na Nubug Startup',
        },
      },
      {
        id: 'wait',
        label: 'Esperar algo melhor',
        effects: {
          attributes: { mentalHealth: -3 },
          wealth: -500,
        },
      },
    ],
  },
  {
    id: 'job_offer_bank',
    title: 'Vaga no Banco Pixel',
    description: 'Processo seletivo longo, mas o salário compensa.',
    weight: 8,
    requirements: {
      hasCompany: false,
      minAttributes: { reputation: 40 },
    },
    tags: ['career', 'opportunity'],
    options: [
      {
        id: 'accept_bank',
        label: 'Aceitar a vaga',
        effects: {
          setCompanyId: 'banco_digital',
          setCareerPath: 'clt',
          salary: 3000,
          attributes: { reputation: 6, mentalHealth: -3 },
          addTimelineNote: 'Entrou no Banco Pixel',
        },
      },
      {
        id: 'decline_bank',
        label: 'Recusar',
        effects: { attributes: { mentalHealth: 2 } },
      },
    ],
  },
  {
    id: 'deploy_friday',
    title: 'Deploy na sexta',
    description: 'O PM insiste: "é só um hotfix". São 17:47 de sexta.',
    weight: 14,
    requirements: { hasCompany: true },
    tags: ['chaos', 'work'],
    options: [
      {
        id: 'deploy_anyway',
        label: 'Deployar mesmo assim',
        effects: {
          attributes: { reputation: -8, mentalHealth: -10, discipline: -4 },
          wealth: -2000,
          addTimelineNote: 'Deploy de sexta quebrou produção',
        },
      },
      {
        id: 'refuse',
        label: 'Recusar e agendar segunda',
        requirements: { minAttributes: { discipline: 45 } },
        effects: {
          attributes: { reputation: 6, discipline: 4, leadership: 3 },
          addAchievement: 'Anti-Deploy-Sexta',
        },
      },
      {
        id: 'hotfix_careful',
        label: 'Fazer com feature flag e rollback pronto',
        requirements: { minAttributes: { devops: 40, architecture: 40 } },
        effects: {
          attributes: { reputation: 8, devops: 4 },
          skills: { docker: 3 },
          addProject: 'Feature flags em produção',
        },
      },
    ],
  },
  {
    id: 'google_offer',
    title: 'Proposta da Google',
    description: 'Um recruiter te procura no LinkedIn. Processo longo à vista.',
    weight: 6,
    requirements: {
      minYear: 2018,
      minAttributes: { reputation: 55, logic: 50 },
      hasCompany: true,
    },
    tags: ['opportunity', 'career'],
    options: [
      {
        id: 'accept_google',
        label: 'Aceitar e se mudar',
        effects: {
          setCompanyId: 'google',
          salary: 8000,
          attributes: { reputation: 15, mentalHealth: -5, networking: 5 },
          addAchievement: 'Big Tech',
          addTimelineNote: 'Entrou na Google',
        },
      },
      {
        id: 'negotiate_current',
        label: 'Usar para negociar aumento',
        effects: {
          salary: 2500,
          attributes: { business: 4, reputation: 3 },
        },
      },
      {
        id: 'decline',
        label: 'Recusar educadamente',
        effects: {
          attributes: { mentalHealth: 5, reputation: 2 },
        },
      },
    ],
  },
  {
    id: 'client_ghost',
    title: 'Cliente desapareceu',
    description: 'O pagamento não caiu. O WhatsApp está no silêncio absoluto.',
    weight: 10,
    requirements: { careerPaths: ['freelancer', 'consultant', 'software_house'] },
    tags: ['money'],
    options: [
      {
        id: 'chase',
        label: 'Cobrar formalmente',
        effects: {
          wealth: 3000,
          attributes: { business: 3, mentalHealth: -4 },
        },
      },
      {
        id: 'write_off',
        label: 'Dar como prejuízo e seguir',
        effects: {
          wealth: -4000,
          attributes: { mentalHealth: 2, discipline: 2 },
        },
      },
    ],
  },
  {
    id: 'startup_funding',
    title: 'Startup recebeu investimento',
    description: 'Sua empresa fechou uma rodada. O vibe mudou da noite pro dia.',
    weight: 7,
    requirements: {
      careerPaths: ['startup_founder', 'clt'],
      hasCompany: true,
    },
    tags: ['startup', 'money'],
    options: [
      {
        id: 'stay_and_grow',
        label: 'Ficar e crescer com o time',
        effects: {
          salary: 2000,
          attributes: { reputation: 8, leadership: 5 },
          wealth: 5000,
          addProject: 'Scale pós-investimento',
        },
      },
      {
        id: 'equity_focus',
        label: 'Negociar equity',
        requirements: { minAttributes: { business: 45 } },
        effects: {
          wealth: 15000,
          attributes: { business: 6 },
          addAchievement: 'Equity Holder',
        },
      },
    ],
  },
  {
    id: 'server_down',
    title: 'Servidor caiu',
    description: 'PagerDuty às 3h da manhã. Clientes reclamando no Twitter.',
    weight: 12,
    requirements: { hasCompany: true },
    tags: ['ops', 'chaos'],
    options: [
      {
        id: 'fix_all_night',
        label: 'Virar a noite no war room',
        effects: {
          attributes: { devops: 5, reputation: 6, mentalHealth: -12 },
          skills: { aws: 3, kubernetes: 2 },
        },
      },
      {
        id: 'blameless_postmortem',
        label: 'Corrigir e fazer postmortem blameless',
        requirements: { minAttributes: { leadership: 40 } },
        effects: {
          attributes: { leadership: 5, reputation: 8, architecture: 3 },
          addProject: 'Postmortem blameless',
        },
      },
    ],
  },
  {
    id: 'competitor_clone',
    title: 'Concorrente lançou produto igual',
    description: 'Eles copiaram o roadmap. Inclusive os bugs.',
    weight: 8,
    requirements: { careerPaths: ['startup_founder', 'saas'] },
    tags: ['business'],
    options: [
      {
        id: 'innovate',
        label: 'Acelerar inovação',
        effects: {
          attributes: { creativity: 6, discipline: 3, mentalHealth: -6 },
          wealth: -8000,
          addProject: 'Pivot competitivo',
        },
      },
      {
        id: 'marketing_war',
        label: 'Guerra de marketing',
        requirements: { minAttributes: { communication: 50 } },
        effects: {
          attributes: { communication: 4, business: 4, reputation: 5 },
          wealth: -5000,
        },
      },
    ],
  },
  {
    id: 'openai_model',
    title: 'OpenAI lançou novo modelo',
    description: 'O mercado inteiro está reescrevendo roadmaps.',
    weight: 10,
    requirements: { minYear: 2023 },
    tags: ['ai', 'market'],
    options: [
      {
        id: 'adopt_fast',
        label: 'Integrar IA no produto agora',
        effects: {
          attributes: { ai: 8, creativity: 4 },
          skills: { aiTools: 10, python: 4 },
          addProject: 'Feature com LLM',
          salary: 1000,
        },
      },
      {
        id: 'wait_and_see',
        label: 'Esperar a poeira baixar',
        effects: {
          attributes: { discipline: 2, reputation: -3 },
        },
      },
      {
        id: 'join_openai',
        label: 'Tentar vaga na OpenAI',
        requirements: {
          minAttributes: { ai: 50, reputation: 60 },
          minYear: 2023,
        },
        effects: {
          setCompanyId: 'openai_co',
          salary: 12000,
          attributes: { reputation: 12, ai: 5 },
          addAchievement: 'AI Lab',
        },
      },
    ],
  },
  {
    id: 'new_lang_hype',
    title: 'Nova linguagem virou tendência',
    description: 'Todo mundo no Twitter jura que essa é A linguagem.',
    weight: 9,
    tags: ['tech', 'learning'],
    options: [
      {
        id: 'learn_rust',
        label: 'Aprender Rust',
        effects: {
          skills: { rust: 8 },
          attributes: { logic: 4, discipline: 3, mentalHealth: -4 },
        },
      },
      {
        id: 'learn_go',
        label: 'Aprender Go',
        effects: {
          skills: { go: 8 },
          attributes: { backend: 4 },
        },
      },
      {
        id: 'ignore_hype',
        label: 'Ignorar o hype',
        effects: {
          attributes: { discipline: 3, reputation: -2 },
        },
      },
    ],
  },
  {
    id: 'layoff_wave',
    title: 'Layoff em massa',
    description: 'O e-mail do RH chegou. "Reorganização estratégica".',
    weight: 9,
    requirements: { hasCompany: true, minYear: 2020 },
    tags: ['career', 'crisis'],
    options: [
      {
        id: 'got_laid_off',
        label: 'Você foi cortado',
        effects: {
          fire: true,
          attributes: { mentalHealth: -15 },
          addTimelineNote: 'Layoff',
        },
      },
      {
        id: 'survived',
        label: 'Sobreviveu — por enquanto',
        requirements: { minAttributes: { reputation: 55 } },
        effects: {
          attributes: { mentalHealth: -8, discipline: 3 },
          salary: -500,
        },
      },
    ],
  },
  {
    id: 'hackathon',
    title: 'Hackathon de fim de semana',
    description: '48h, pizza fria e um MVP duvidoso.',
    weight: 10,
    tags: ['opportunity', 'learning'],
    options: [
      {
        id: 'join_win',
        label: 'Participar e dar o máximo',
        effects: {
          attributes: { creativity: 6, networking: 5, mentalHealth: -6 },
          skills: { react: 3, node: 3 },
          wealth: 2000,
          addProject: 'Hackathon winner',
          addAchievement: 'Hackathon',
        },
      },
      {
        id: 'skip',
        label: 'Passar o fim de semana descansando',
        effects: {
          attributes: { mentalHealth: 8 },
        },
      },
    ],
  },
  {
    id: 'conference',
    title: 'Convite para conferência',
    description: 'Quer apresentar uma talk sobre sua stack?',
    weight: 8,
    requirements: { minAttributes: { reputation: 40 } },
    tags: ['opportunity', 'reputation'],
    options: [
      {
        id: 'speak',
        label: 'Aceitar e apresentar',
        requirements: { minAttributes: { communication: 40 } },
        effects: {
          attributes: { communication: 8, reputation: 10, networking: 6 },
          addAchievement: 'Speaker',
        },
      },
      {
        id: 'attend_only',
        label: 'Só assistir',
        effects: {
          attributes: { networking: 4, mentalHealth: 3 },
          wealth: -800,
        },
      },
    ],
  },
  {
    id: 'pr_rejected',
    title: 'Pull Request rejeitado',
    description: 'Review demolidor. "Rewrite this."',
    weight: 11,
    requirements: { hasCompany: true },
    tags: ['work'],
    options: [
      {
        id: 'rewrite',
        label: 'Reescrever com humildade',
        effects: {
          attributes: { discipline: 5, architecture: 4, mentalHealth: -3 },
          skills: { node: 2 },
        },
      },
      {
        id: 'argue',
        label: 'Discutir no thread',
        effects: {
          attributes: { communication: -4, reputation: -5, mentalHealth: -5 },
        },
      },
    ],
  },
  {
    id: 'critical_issue',
    title: 'Issue crítica em produção',
    description: 'Bug que afeta pagamento. Priority P0.',
    weight: 11,
    requirements: { hasCompany: true },
    tags: ['work', 'chaos'],
    options: [
      {
        id: 'fix_hero',
        label: 'Modo herói: resolver sozinho',
        effects: {
          attributes: { reputation: 10, backend: 4, mentalHealth: -10 },
          addAchievement: 'Production Hero',
        },
      },
      {
        id: 'team_fix',
        label: 'Organizar o time',
        requirements: { minAttributes: { leadership: 45 } },
        effects: {
          attributes: { leadership: 6, reputation: 6, mentalHealth: -4 },
        },
      },
    ],
  },
  {
    id: 'oss_contribute',
    title: 'Contribuição Open Source',
    description: 'Uma lib que você usa está pedindo ajuda.',
    weight: 9,
    tags: ['oss', 'reputation'],
    options: [
      {
        id: 'contribute',
        label: 'Abrir PR e manter',
        effects: {
          attributes: { reputation: 8, discipline: 4 },
          skills: { node: 2 },
          addProject: 'Maintainer OSS',
          addAchievement: 'Open Source',
        },
      },
      {
        id: 'star_only',
        label: 'Só dar star no GitHub',
        effects: {
          attributes: { reputation: 1 },
        },
      },
    ],
  },
  {
    id: 'burnout_event',
    title: 'Sinais de burnout',
    description: 'Você não consegue mais abrir o Slack sem ansiedade.',
    weight: 10,
    requirements: { maxAttributes: { mentalHealth: 45 } },
    tags: ['burnout', 'health'],
    options: [
      {
        id: 'vacation',
        label: 'Tirar férias forçadas',
        effects: {
          attributes: { mentalHealth: 20, discipline: -2 },
          wealth: -3000,
          salary: -200,
        },
      },
      {
        id: 'push_through',
        label: 'Empurrar com a barriga',
        effects: {
          attributes: { mentalHealth: -15, reputation: 3 },
        },
      },
      {
        id: 'quit_for_health',
        label: 'Pedir demissão por saúde',
        effects: {
          setCompanyId: null,
          salary: -2000,
          attributes: { mentalHealth: 15 },
          addTimelineNote: 'Saiu por saúde mental',
        },
      },
    ],
  },
  {
    id: 'go_freelance',
    title: 'Convite para freela gordo',
    description: 'Um ex-colega indica um projeto de 3 meses bem pago.',
    weight: 8,
    requirements: { minAttributes: { reputation: 35 } },
    tags: ['career', 'opportunity'],
    options: [
      {
        id: 'go_freelance',
        label: 'Virar freelancer',
        effects: {
          setCareerPath: 'freelancer',
          setCompanyId: null,
          salary: 2000,
          attributes: { business: 5, mentalHealth: -3 },
          addTimelineNote: 'Virou freelancer',
        },
      },
      {
        id: 'side_gig',
        label: 'Fazer como side project',
        requirements: { hasCompany: true },
        effects: {
          wealth: 8000,
          attributes: { discipline: -4, mentalHealth: -6 },
          addProject: 'Side freela',
        },
      },
      {
        id: 'decline_freelance',
        label: 'Recusar',
        effects: { attributes: { mentalHealth: 2 } },
      },
    ],
  },
  {
    id: 'found_startup',
    title: 'Ideia de startup',
    description: 'Você e um amigo esboçam um SaaS no napkin.',
    weight: 6,
    requirements: {
      minAttributes: { creativity: 45, business: 30 },
      minWealth: 10000,
    },
    tags: ['startup', 'career'],
    options: [
      {
        id: 'found_it',
        label: 'Fundar a startup',
        effects: {
          setCareerPath: 'startup_founder',
          setCompanyId: 'own_startup',
          wealth: -10000,
          salary: -1000,
          attributes: { leadership: 8, business: 6, mentalHealth: -8 },
          addAchievement: 'Founder',
          addTimelineNote: 'Fundou uma startup',
        },
      },
      {
        id: 'shelve_idea',
        label: 'Guardar a ideia no Notion',
        effects: {
          attributes: { creativity: 2 },
        },
      },
    ],
  },
  {
    id: 'promotion',
    title: 'Ciclo de promoção',
    description: 'Seu manager pergunta se você está pronto para o próximo nível.',
    weight: 10,
    requirements: {
      hasCompany: true,
      minAttributes: { reputation: 50, discipline: 40 },
    },
    tags: ['career', 'opportunity'],
    options: [
      {
        id: 'accept_promo',
        label: 'Aceitar a promoção',
        effects: {
          promote: true,
          addTimelineNote: 'Promovido',
        },
      },
      {
        id: 'stay_ic',
        label: 'Continuar como IC',
        effects: {
          attributes: { mentalHealth: 5, discipline: 3 },
          salary: 800,
        },
      },
    ],
  },
  {
    id: 'sell_company',
    title: 'Oferta de aquisição',
    description: 'Uma big tech quer comprar sua empresa.',
    weight: 4,
    requirements: {
      careerPaths: ['startup_founder', 'saas'],
      minWealth: 50000,
      minAttributes: { business: 50 },
    },
    tags: ['ending', 'money'],
    options: [
      {
        id: 'sell',
        label: 'Vender e celebrar',
        effects: {
          wealth: 500000,
          endGame: 'company_sale',
          addAchievement: 'Exit',
          addTimelineNote: 'Vendeu a empresa',
        },
      },
      {
        id: 'keep_building',
        label: 'Recusar e continuar construindo',
        effects: {
          attributes: { leadership: 5, reputation: 8, mentalHealth: -5 },
          wealth: 20000,
        },
      },
    ],
  },
  {
    id: 'rare_death',
    title: 'Evento raro: destino cruel',
    description: 'Um acidente inesperado encerra sua história.',
    weight: 0.3,
    tags: ['ending', 'rare'],
    options: [
      {
        id: 'accept_fate',
        label: 'Aceitar o destino',
        effects: {
          endGame: 'death',
          addTimelineNote: 'Fim inesperado',
        },
      },
    ],
  },
  {
    id: 'react_boom',
    title: 'React bomba no mercado',
    description: 'Todo job description pede React. Até os de Java.',
    weight: 8,
    requirements: { maxYear: 2021 },
    tags: ['market', 'tech'],
    options: [
      {
        id: 'deep_react',
        label: 'Virar especialista React',
        effects: {
          skills: { react: 12 },
          attributes: { frontend: 8 },
          salary: 1200,
        },
      },
      {
        id: 'stay_generalist',
        label: 'Continuar generalista',
        effects: {
          attributes: { architecture: 3 },
          skills: { react: 3, node: 3 },
        },
      },
    ],
  },
  {
    id: 'cloud_migration',
    title: 'Migração para a cloud',
    description: 'A empresa quer sair do data center até o fim do trimestre.',
    weight: 9,
    requirements: { hasCompany: true, minYear: 2019 },
    tags: ['cloud', 'work'],
    options: [
      {
        id: 'lead_migration',
        label: 'Liderar a migração',
        effects: {
          attributes: { cloud: 8, devops: 6, leadership: 4 },
          skills: { aws: 10, docker: 6, kubernetes: 4 },
          addProject: 'Cloud migration',
          salary: 1500,
        },
      },
      {
        id: 'support_only',
        label: 'Só apoiar o time de infra',
        effects: {
          skills: { docker: 3, aws: 3 },
          attributes: { cloud: 3 },
        },
      },
    ],
  },
  {
    id: 'ai_wave',
    title: 'Onda de IA na empresa',
    description: 'Diretoria: "Precisamos de IA em tudo."',
    weight: 7,
    requirements: { minYear: 2023, hasCompany: true },
    tags: ['ai', 'market'],
    options: [
      {
        id: 'ai_champion',
        label: 'Ser o champion de IA',
        effects: {
          attributes: { ai: 10, reputation: 6 },
          skills: { aiTools: 12, python: 5 },
          salary: 2000,
          addAchievement: 'AI Champion',
        },
      },
      {
        id: 'skeptic',
        label: 'Ser cético e focar no core',
        effects: {
          attributes: { discipline: 4, reputation: -4 },
        },
      },
    ],
  },
];
