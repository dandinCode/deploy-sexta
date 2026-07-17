/**
 * Seeded PRNG (Mulberry32) — deterministic runs for replay/debug.
 */
export function createRng(seed: number) {
  let state = seed >>> 0;

  function next(): number {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  function int(min: number, max: number): number {
    return Math.floor(next() * (max - min + 1)) + min;
  }

  function pick<T>(items: T[]): T {
    if (items.length === 0) {
      throw new Error('Cannot pick from empty array');
    }
    return items[int(0, items.length - 1)]!;
  }

  function shuffle<T>(items: T[]): T[] {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = int(0, i);
      [arr[i], arr[j]] = [arr[j]!, arr[i]!];
    }
    return arr;
  }

  function weightedPick<T extends { weight: number }>(items: T[]): T {
    const total = items.reduce((sum, item) => sum + Math.max(0, item.weight), 0);
    if (total <= 0) {
      return pick(items);
    }
    let roll = next() * total;
    for (const item of items) {
      roll -= Math.max(0, item.weight);
      if (roll <= 0) return item;
    }
    return items[items.length - 1]!;
  }

  return { next, int, pick, shuffle, weightedPick, getState: () => state };
}

export type Rng = ReturnType<typeof createRng>;
