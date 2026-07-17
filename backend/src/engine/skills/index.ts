import type { SkillId, SkillMap } from '../types.js';
import { SKILL_LABELS } from '../player/attributes.js';

export function getSkillLabel(id: SkillId): string {
  return SKILL_LABELS[id];
}

export function topSkills(skills: SkillMap, limit = 5): Array<{ id: SkillId; level: number; label: string }> {
  return Object.entries(skills)
    .map(([id, level]) => ({
      id: id as SkillId,
      level: level ?? 0,
      label: SKILL_LABELS[id as SkillId],
    }))
    .sort((a, b) => b.level - a.level)
    .slice(0, limit);
}
