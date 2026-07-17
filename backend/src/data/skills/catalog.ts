import type { SkillId } from '../../engine/types.js';
import { SKILL_LABELS } from '../../engine/player/attributes.js';

export const skillCatalog: Array<{ id: SkillId; label: string }> =
  (Object.keys(SKILL_LABELS) as SkillId[]).map((id) => ({
    id,
    label: SKILL_LABELS[id],
  }));
