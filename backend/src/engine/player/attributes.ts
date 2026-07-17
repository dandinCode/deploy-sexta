import type { AttributeId, AttributeMap, SkillId, SkillMap } from '../types.js';

export const ATTRIBUTE_IDS: AttributeId[] = [
  'logic',
  'communication',
  'business',
  'architecture',
  'backend',
  'frontend',
  'devops',
  'cloud',
  'ai',
  'networking',
  'creativity',
  'leadership',
  'discipline',
  'mentalHealth',
  'reputation',
];

export const SKILL_IDS: SkillId[] = [
  'react',
  'node',
  'java',
  'python',
  'go',
  'rust',
  'docker',
  'aws',
  'kubernetes',
  'sql',
  'postgres',
  'redis',
  'rabbitmq',
  'flutter',
  'aiTools',
];

export const ATTRIBUTE_LABELS: Record<AttributeId, string> = {
  logic: 'Lógica',
  communication: 'Comunicação',
  business: 'Negócios',
  architecture: 'Arquitetura',
  backend: 'Backend',
  frontend: 'Frontend',
  devops: 'DevOps',
  cloud: 'Cloud',
  ai: 'IA',
  networking: 'Networking',
  creativity: 'Criatividade',
  leadership: 'Liderança',
  discipline: 'Disciplina',
  mentalHealth: 'Saúde Mental',
  reputation: 'Reputação',
};

export const SKILL_LABELS: Record<SkillId, string> = {
  react: 'React',
  node: 'Node.js',
  java: 'Java',
  python: 'Python',
  go: 'Go',
  rust: 'Rust',
  docker: 'Docker',
  aws: 'AWS',
  kubernetes: 'Kubernetes',
  sql: 'SQL',
  postgres: 'Postgres',
  redis: 'Redis',
  rabbitmq: 'RabbitMQ',
  flutter: 'Flutter',
  aiTools: 'IA / Tools',
};

export function createBaseAttributes(base = 40): AttributeMap {
  return ATTRIBUTE_IDS.reduce((acc, id) => {
    acc[id] = id === 'mentalHealth' ? 70 : base;
    return acc;
  }, {} as AttributeMap);
}

export function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

export function applyAttributeDelta(
  attributes: AttributeMap,
  delta?: Partial<AttributeMap>,
): AttributeMap {
  if (!delta) return { ...attributes };
  const next = { ...attributes };
  for (const [key, value] of Object.entries(delta)) {
    const id = key as AttributeId;
    if (value === undefined) continue;
    next[id] = clamp(next[id] + value);
  }
  return next;
}

export function applySkillDelta(skills: SkillMap, delta?: SkillMap): SkillMap {
  if (!delta) return { ...skills };
  const next = { ...skills };
  for (const [key, value] of Object.entries(delta)) {
    const id = key as SkillId;
    if (value === undefined) continue;
    next[id] = clamp((next[id] ?? 0) + value);
  }
  return next;
}
