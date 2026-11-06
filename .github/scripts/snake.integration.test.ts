import { test, expect } from "bun:test";
import { generateSnake } from "./snake-gen";
import { snakeToCells } from "@snk/types/snake";
import { growthCapacity } from "./snake-growth.mjs";

const calendar = (days: number) => Array.from({ length: 53 * 7 }, (_, i) => ({
  x: Math.floor(i / 7), y: i % 7, date: `day-${i}`,
  count: i < days ? 1 + (i % 31) : 0,
  level: (i < days ? 1 + (i % 4) : 0) as 0 | 1 | 2 | 3 | 4,
}));

for (const days of [0, 7, 8, 65, 371]) {
  test(`complete, collision-free looping route for ${days} occupied cells`, () => {
    const { outputs, meta, chain } = generateSnake(calendar(days), 1701);
    expect(outputs.length).toBe(2);
    expect(meta.growth.capacity).toBe(growthCapacity(days));
    expect([...chain.at(-1)!]).toEqual([...chain[0]]);
    const visited = new Set<string>();
    for (const snake of chain) {
      const body = snakeToCells(snake);
      expect(body.length).toBe(growthCapacity(days));
      expect(new Set(body.map(p => `${p.x},${p.y}`)).size).toBe(body.length);
      visited.add(`${body[0].x},${body[0].y}`);
      for (const p of body) {
        expect(p.x).toBeGreaterThanOrEqual(-1);
        expect(p.x).toBeLessThanOrEqual(53);
        expect(p.y).toBeGreaterThanOrEqual(-2);
        expect(p.y).toBeLessThanOrEqual(9);
      }
    }
    for (const cell of calendar(days).filter(c => c.count)) expect(visited.has(`${cell.x},${cell.y}`)).toBe(true);
    const schedules = outputs.map(out => JSON.parse(/<metadata id="snk-growth">(.*?)<\/metadata>/.exec(out.svg)![1]));
    expect(schedules[0]).toEqual(schedules[1]);
    expect(schedules[0].activeCells).toBe(days);
    expect(schedules[0].growth.length).toBe(growthCapacity(days) - 4);
  }, 30000);
}
