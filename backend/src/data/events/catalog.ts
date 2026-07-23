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
    id: 'effectivation',
    title: 'Fim do contrato de estágio',
    description: 'Seu ciclo de estágio acabou. É hora de buscar o primeiro CLT como júnior.',
    weight: 30,
    requirements: {
      maxSeniority: 0,
      minMonthsInLevel: 6,
      careerPaths: ['clt'],
    },
    tags: ['career', 'opportunity'],
    options: [
      {
        id: 'effectivate_here',
        label: 'Ser efetivado como Júnior onde já estou',
        effects: {
          promote: true,
          setCareerPath: 'clt',
          attributes: { reputation: 4 },
          addTimelineNote: 'Efetivado como Desenvolvedor Júnior',
          addAchievement: 'Primeiro CLT',
        },
      },
      {
        id: 'junior_software_house',
        label: 'Vaga Júnior na Code&Ship SP',
        effects: {
          setCompanyId: 'software_house_sp',
          promote: true,
          setCareerPath: 'clt',
          attributes: { reputation: 4, backend: 3 },
          addTimelineNote: 'Entrou na Code&Ship SP como Júnior',
          addAchievement: 'Primeiro CLT',
        },
      },
      {
        id: 'junior_startup',
        label: 'Vaga Júnior na Nubug Startup',
        effects: {
          setCompanyId: 'startup_local',
          promote: true,
          setCareerPath: 'clt',
          attributes: { creativity: 5, mentalHealth: -2 },
          addTimelineNote: 'Entrou na Nubug Startup como Júnior',
          addAchievement: 'Primeiro CLT',
        },
      },
    ],
  },
  {
    id: 'job_search',
    title: 'Recolocação no mercado',
    description: 'Sem emprego, você dispara currículos e faz entrevistas.',
    weight: 40,
    requirements: {
      hasCompany: false,
      minSeniority: 1,
    },
    tags: ['career', 'opportunity'],
    options: [
      {
        id: 'join_software_house',
        label: 'Aceitar vaga na Code&Ship SP',
        effects: {
          setCompanyId: 'software_house_sp',
          setCareerPath: 'clt',
          attributes: { reputation: 3 },
          addTimelineNote: 'Recolocado na Code&Ship SP',
        },
      },
      {
        id: 'join_startup',
        label: 'Aceitar vaga na Nubug Startup',
        effects: {
          setCompanyId: 'startup_local',
          setCareerPath: 'clt',
          attributes: { creativity: 3, mentalHealth: -2 },
          addTimelineNote: 'Recolocado na Nubug Startup',
        },
      },
      {
        id: 'join_agency',
        label: 'Aceitar vaga na Agência Deploy',
        effects: {
          setCompanyId: 'agencia_web',
          setCareerPath: 'clt',
          attributes: { frontend: 3 },
          addTimelineNote: 'Recolocado na Agência Deploy',
        },
      },
    ],
  },
  {
    id: 'offer_bank',
    title: 'Vaga no Banco Pixel',
    description: 'Um banco digital quer seu perfil. Processo longo, mas estabilidade e salário acima da média.',
    weight: 9,
    requirements: {
      minSeniority: 2,
      minAttributes: { reputation: 45 },
    },
    tags: ['career', 'opportunity'],
    options: [
      {
        id: 'accept_bank',
        label: 'Aceitar a vaga',
        effects: {
          setCompanyId: 'banco_digital',
          setCareerPath: 'clt',
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
    id: 'promo_pleno',
    title: 'Ciclo de avaliação — Pleno',
    description: 'Você domina o dia a dia. O time sugere te promover a Pleno.',
    weight: 16,
    requirements: {
      minSeniority: 1,
      maxSeniority: 1,
      minMonthsInLevel: 14,
      hasCompany: true,
      minAttributes: { logic: 45, backend: 42, discipline: 40 },
    },
    tags: ['career', 'opportunity'],
    options: [
      {
        id: 'accept',
        label: 'Aceitar promoção a Pleno',
        effects: { promote: true, addTimelineNote: 'Promovido a Pleno' },
      },
      {
        id: 'negotiate_stay',
        label: 'Ficar como Júnior, mas negociar aumento',
        effects: { raisePct: 0.08, attributes: { business: 3 } },
      },
    ],
  },
  {
    id: 'promo_senior',
    title: 'Ciclo de avaliação — Sênior',
    description: 'Você resolve problemas complexos com autonomia. Sinal de senioridade.',
    weight: 15,
    requirements: {
      minSeniority: 2,
      maxSeniority: 2,
      minMonthsInLevel: 20,
      hasCompany: true,
      minAttributes: { logic: 55, architecture: 50, reputation: 45 },
    },
    tags: ['career', 'opportunity'],
    options: [
      {
        id: 'accept',
        label: 'Aceitar promoção a Sênior',
        effects: {
          promote: true,
          attributes: { architecture: 3 },
          addTimelineNote: 'Promovido a Sênior',
          addAchievement: 'Sênior',
        },
      },
      {
        id: 'negotiate_stay',
        label: 'Segurar mais um pouco e negociar',
        effects: { raisePct: 0.1, attributes: { business: 3 } },
      },
    ],
  },
  {
    id: 'promo_staff',
    title: 'Trilha técnica — Especialista/Staff',
    description: 'Seu impacto passou do time. Existe espaço para um papel de Staff.',
    weight: 12,
    requirements: {
      minSeniority: 3,
      maxSeniority: 3,
      minMonthsInLevel: 28,
      hasCompany: true,
      minAttributes: { architecture: 62, leadership: 45, reputation: 55 },
    },
    tags: ['career', 'opportunity'],
    options: [
      {
        id: 'accept',
        label: 'Assumir papel de Staff',
        effects: {
          promote: true,
          attributes: { leadership: 4 },
          addTimelineNote: 'Virou Especialista/Staff',
          addAchievement: 'Staff Engineer',
        },
      },
      {
        id: 'stay_senior',
        label: 'Seguir como Sênior focado em código',
        effects: { raisePct: 0.08, attributes: { backend: 3 } },
      },
    ],
  },
  {
    id: 'promo_techlead',
    title: 'Trilha de liderança — Tech Lead',
    description: 'Puxar um time é o próximo passo natural.',
    weight: 11,
    requirements: {
      minSeniority: 4,
      maxSeniority: 4,
      minMonthsInLevel: 32,
      hasCompany: true,
      minAttributes: { leadership: 60, communication: 55, reputation: 60 },
    },
    tags: ['career', 'opportunity'],
    options: [
      {
        id: 'accept',
        label: 'Assumir como Tech Lead',
        effects: {
          promote: true,
          attributes: { leadership: 5, communication: 3 },
          addTimelineNote: 'Virou Tech Lead',
          addAchievement: 'Tech Lead',
        },
      },
      {
        id: 'stay_ic',
        label: 'Continuar como IC (trilha técnica)',
        effects: { raisePct: 0.08, attributes: { architecture: 3 } },
      },
    ],
  },
  {
    id: 'promo_principal',
    title: 'Alto impacto — Principal Engineer',
    description: 'Decisões de arquitetura da empresa inteira passam por você.',
    weight: 8,
    requirements: {
      minSeniority: 5,
      maxSeniority: 5,
      minMonthsInLevel: 36,
      hasCompany: true,
      minAttributes: { architecture: 72, leadership: 65, reputation: 70 },
    },
    tags: ['career', 'opportunity'],
    options: [
      {
        id: 'accept',
        label: 'Assumir como Principal',
        effects: {
          promote: true,
          attributes: { reputation: 5 },
          addTimelineNote: 'Virou Principal Engineer',
          addAchievement: 'Principal',
        },
      },
      {
        id: 'stay_lead',
        label: 'Seguir liderando o time atual',
        effects: { raisePct: 0.07 },
      },
    ],
  },
  {
    id: 'promo_cto',
    title: 'Convite para a diretoria — CTO',
    description: 'A empresa quer você liderando toda a engenharia.',
    weight: 5,
    requirements: {
      minSeniority: 6,
      maxSeniority: 6,
      minMonthsInLevel: 48,
      hasCompany: true,
      minAttributes: { leadership: 75, business: 60, reputation: 75 },
    },
    tags: ['career', 'opportunity'],
    options: [
      {
        id: 'accept',
        label: 'Aceitar ser CTO',
        effects: {
          promote: true,
          attributes: { business: 5, leadership: 3 },
          addTimelineNote: 'Tornou-se CTO',
          addAchievement: 'CTO',
        },
      },
      {
        id: 'stay_principal',
        label: 'Preferir o papel técnico de Principal',
        effects: { raisePct: 0.06 },
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
      minSeniority: 3,
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
          attributes: { reputation: 15, mentalHealth: -5, networking: 5 },
          addAchievement: 'Big Tech',
          addTimelineNote: 'Entrou na Google',
        },
      },
      {
        id: 'negotiate_current',
        label: 'Usar como contraproposta (aumento)',
        effects: {
          raisePct: 0.18,
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
          raisePct: 0.12,
          attributes: { reputation: 8, leadership: 5 },
          wealth: 5000,
          addProject: 'Scale pós-investimento',
        },
      },
      {
        id: 'cash_bonus',
        label: 'Pedir bônus em dinheiro e seguir o ritmo',
        effects: {
          wealth: 8000,
          raisePct: 0.05,
          attributes: { business: 2, mentalHealth: 2 },
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
        id: 'escalate_oncall',
        label: 'Acionar o on-call e estabilizar o essencial',
        effects: {
          attributes: { devops: 3, reputation: 3, mentalHealth: -4 },
          skills: { aws: 2 },
          addTimelineNote: 'Incidente estabilizado com ajuda do on-call',
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
        label: 'Acelerar inovação no produto',
        effects: {
          attributes: { creativity: 6, discipline: 3, mentalHealth: -6 },
          wealth: -8000,
          addProject: 'Pivot competitivo',
        },
      },
      {
        id: 'double_down_customers',
        label: 'Focar em retenção e clientes atuais',
        effects: {
          attributes: { business: 4, communication: 2, reputation: 3 },
          wealth: -2000,
          addProject: 'Programa de retenção',
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
    cooldownGroup: 'ai_market',
    options: [
      {
        id: 'adopt_fast',
        label: 'Integrar IA no produto agora',
        effects: {
          attributes: { ai: 8, creativity: 4 },
          skills: { aiTools: 10, python: 4 },
          addProject: 'Feature com LLM',
          raisePct: 0.06,
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
          minSeniority: 3,
          minAttributes: { ai: 50, reputation: 60 },
          minYear: 2023,
        },
        effects: {
          setCompanyId: 'openai_co',
          attributes: { reputation: 12, ai: 5 },
          addAchievement: 'AI Lab',
        },
      },
    ],
  },
  {
    id: 'new_lang_hype',
    title: 'Linguagens de sistemas em alta',
    description: 'Go e Rust ganharam espaço em serviços de alta performance.',
    weight: 5,
    requirements: { minYear: 2018 },
    tags: ['tech', 'learning', 'language'],
    cooldownGroup: 'technology_trend',
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
    id: 'typescript_adoption',
    title: 'TypeScript virou padrão no time',
    description: 'A base JavaScript cresceu e os bugs de tipagem começaram a cobrar a conta.',
    weight: 7,
    requirements: { minYear: 2018, hasCompany: true },
    tags: ['tech', 'learning', 'language'],
    cooldownGroup: 'technology_trend',
    options: [
      {
        id: 'migrate_typescript',
        label: 'Liderar a migração para TypeScript',
        effects: {
          skills: { typescript: 10, javascript: 4 },
          attributes: { architecture: 4, discipline: 3 },
          addProject: 'Migração para TypeScript',
        },
      },
      {
        id: 'nestjs_backend',
        label: 'Adotar Node.js com NestJS',
        effects: {
          skills: { typescript: 7, node: 6, nestjs: 8 },
          attributes: { backend: 5, architecture: 3 },
          addProject: 'API em NestJS',
        },
      },
      {
        id: 'keep_javascript',
        label: 'Manter JavaScript com testes melhores',
        effects: {
          skills: { javascript: 7 },
          attributes: { discipline: 4 },
        },
      },
    ],
  },
  {
    id: 'frontend_framework_choice',
    title: 'Escolha do framework frontend',
    description: 'Um produto novo precisa de uma stack que o time consiga sustentar.',
    weight: 6,
    requirements: { maxYear: 2023, hasCompany: true },
    tags: ['tech', 'learning', 'frontend'],
    cooldownGroup: 'technology_trend',
    options: [
      {
        id: 'choose_angular',
        label: 'Angular para uma aplicação corporativa',
        effects: {
          skills: { typescript: 4, angular: 9 },
          attributes: { frontend: 5, architecture: 3 },
          addProject: 'Portal corporativo Angular',
        },
      },
      {
        id: 'choose_vue',
        label: 'Vue.js pela curva de aprendizado',
        effects: {
          skills: { javascript: 4, vue: 9 },
          attributes: { frontend: 5, creativity: 2 },
          addProject: 'Produto em Vue.js',
        },
      },
      {
        id: 'choose_react',
        label: 'React pelo ecossistema',
        effects: {
          skills: { javascript: 4, react: 9 },
          attributes: { frontend: 5 },
          addProject: 'Frontend React',
        },
      },
    ],
  },
  {
    id: 'enterprise_backend_stack',
    title: 'Projeto enterprise de longo prazo',
    description: 'O contrato exige uma stack madura, suporte e gente disponível no mercado.',
    weight: 6,
    requirements: { hasCompany: true },
    tags: ['tech', 'learning', 'backend'],
    cooldownGroup: 'technology_trend',
    options: [
      {
        id: 'java_spring',
        label: 'Java com Spring Boot',
        effects: {
          skills: { java: 9, spring: 9, sql: 3 },
          attributes: { backend: 5, architecture: 3 },
          addProject: 'Plataforma Spring Boot',
        },
      },
      {
        id: 'csharp_dotnet',
        label: 'C# com .NET',
        effects: {
          skills: { csharp: 9, dotnet: 9, sql: 3 },
          attributes: { backend: 5, discipline: 2 },
          addProject: 'Sistema em .NET',
        },
      },
      {
        id: 'php_laravel',
        label: 'PHP com Laravel',
        effects: {
          skills: { php: 9, laravel: 9, sql: 3 },
          attributes: { backend: 4, creativity: 2 },
          addProject: 'Produto Laravel',
        },
      },
    ],
  },
  {
    id: 'python_product',
    title: 'Produto novo no ecossistema Python',
    description: 'O time quer entregar rápido sem abrir mão de uma base conhecida.',
    weight: 5,
    requirements: { minYear: 2019, hasCompany: true },
    tags: ['tech', 'learning', 'backend'],
    cooldownGroup: 'technology_trend',
    options: [
      {
        id: 'python_django',
        label: 'Construir com Python e Django',
        effects: {
          skills: { python: 9, django: 9, postgres: 3 },
          attributes: { backend: 5, discipline: 2 },
          addProject: 'Produto Django',
        },
      },
      {
        id: 'ruby_rails',
        label: 'Apostar em Ruby on Rails',
        effects: {
          skills: { ruby: 9, rails: 9, postgres: 3 },
          attributes: { backend: 4, creativity: 3 },
          addProject: 'SaaS em Rails',
        },
      },
      {
        id: 'use_known_stack',
        label: 'Continuar na stack que o time já domina',
        effects: {
          attributes: { discipline: 3, architecture: 2 },
        },
      },
    ],
  },
  {
    id: 'mobile_stack',
    title: 'Aplicativo mobile entrou no roadmap',
    description: 'Produto quer presença nativa nas lojas ainda neste semestre.',
    weight: 5,
    requirements: { hasCompany: true },
    tags: ['tech', 'learning', 'mobile'],
    cooldownGroup: 'technology_trend',
    options: [
      {
        id: 'android_kotlin',
        label: 'Android nativo com Kotlin',
        effects: {
          skills: { kotlin: 10 },
          attributes: { frontend: 4, logic: 3 },
          addProject: 'Aplicativo Android',
        },
      },
      {
        id: 'ios_swift',
        label: 'iOS nativo com Swift',
        effects: {
          skills: { swift: 10 },
          attributes: { frontend: 4, creativity: 3 },
          addProject: 'Aplicativo iOS',
        },
      },
      {
        id: 'cross_flutter',
        label: 'Um app multiplataforma com Flutter',
        effects: {
          skills: { flutter: 10 },
          attributes: { frontend: 5 },
          addProject: 'Aplicativo Flutter',
        },
      },
    ],
  },
  {
    id: 'cobol_legacy',
    title: 'O mainframe ainda paga as contas',
    description: 'Um sistema COBOL crítico precisa de alguém disposto a entendê-lo.',
    weight: 1.2,
    requirements: { hasCompany: true, minSeniority: 1 },
    tags: ['tech', 'learning', 'legacy', 'rare'],
    cooldownGroup: 'technology_trend',
    options: [
      {
        id: 'learn_cobol',
        label: 'Aprender COBOL e encarar o legado',
        effects: {
          skills: { cobol: 12, sql: 3 },
          attributes: { logic: 4, discipline: 5, mentalHealth: -3 },
          raisePct: 0.08,
          addProject: 'Modernização de mainframe',
          addAchievement: 'Arqueólogo de Software',
        },
      },
      {
        id: 'document_legacy',
        label: 'Mapear o legado sem virar especialista',
        effects: {
          attributes: { architecture: 4, discipline: 3 },
          addProject: 'Documentação do legado',
        },
      },
      {
        id: 'avoid_mainframe',
        label: 'Recusar educadamente',
        effects: {
          attributes: { mentalHealth: 2 },
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
        id: 'accept_package',
        label: 'Aceitar o pacote e sair',
        effects: {
          fire: true,
          wealth: 12000,
          attributes: { mentalHealth: -10, business: 2 },
          addTimelineNote: 'Aceitou pacote de layoff',
        },
      },
      {
        id: 'fight_to_stay',
        label: 'Pedir transferência interna e tentar ficar',
        effects: {
          attributes: { mentalHealth: -12, networking: 3, communication: 2 },
          raisePct: -0.08,
          addTimelineNote: 'Sobreviveu ao layoff em outro time',
        },
      },
      {
        id: 'survived',
        label: 'Seu time foi poupado — por enquanto',
        requirements: { minAttributes: { reputation: 55 } },
        effects: {
          attributes: { mentalHealth: -8, discipline: 3 },
          raisePct: -0.05,
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
        label: 'Aceitar e apresentar uma talk',
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
        id: 'pair_debug',
        label: 'Chamar um colega e debugar em dupla',
        effects: {
          attributes: { reputation: 5, backend: 2, networking: 2, mentalHealth: -5 },
          skills: { node: 2 },
        },
      },
      {
        id: 'team_fix',
        label: 'Organizar o time no war room',
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
          salary: 7000,
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
    id: 'raise_review',
    title: 'Revisão salarial anual',
    description: 'Chegou a hora da conversa de mérito com a liderança.',
    weight: 10,
    requirements: {
      hasCompany: true,
      minSeniority: 1,
      minAttributes: { reputation: 45, discipline: 40 },
    },
    tags: ['career', 'money'],
    options: [
      {
        id: 'accept_standard',
        label: 'Aceitar o reajuste padrão',
        effects: {
          raisePct: 0.04,
          attributes: { mentalHealth: 3 },
        },
      },
      {
        id: 'ask_benefits',
        label: 'Pedir benefícios e remoto em troca de % menor',
        effects: {
          raisePct: 0.02,
          attributes: { mentalHealth: 6, business: 2 },
          wealth: 1500,
        },
      },
      {
        id: 'negotiate_hard',
        label: 'Negociar com dados de mercado',
        requirements: { minAttributes: { business: 45 } },
        effects: {
          raisePct: 0.1,
          attributes: { business: 3, reputation: 2 },
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
    cooldownGroup: 'technology_trend',
    options: [
      {
        id: 'deep_react',
        label: 'Virar especialista React',
        effects: {
          skills: { react: 12 },
          attributes: { frontend: 8 },
          raisePct: 0.05,
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
          raisePct: 0.07,
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
    cooldownGroup: 'ai_market',
    options: [
      {
        id: 'ai_champion',
        label: 'Ser o champion de IA',
        effects: {
          attributes: { ai: 10, reputation: 6 },
          skills: { aiTools: 12, python: 5 },
          raisePct: 0.1,
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
