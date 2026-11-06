/**
 * Render a growing contribution snake from one GitHub calendar snapshot.
 * A seeded sweep covers every cell on a bounded, collision-free loop. snk still
 * supplies the palettes, SVG movement, calendar cells and progress bars.
 * Executed inside its pinned generate-snake-animation package by Bun.
 */
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { getGithubUserContribution } from "@snk/github-user-contribution";
import type { Cell } from "@snk/github-user-contribution";
import { createSvg } from "@snk/svg-creator";
import { createSnakeFromCells, getHeadX, getHeadY } from "@snk/types/snake";
import { cellsToGrid } from "./cellsToGrid";
import { parseOutputsOption } from "./outputsOptions";
import { addSnakeGrowth, growthCapacity, INITIAL_LENGTH, CELLS_PER_SEGMENT } from "./snake-growth.mjs";
import { createSnakeRoute } from "./snake-route.mjs";

export const generateSnake = (cells: Cell[], seed: number) => {
  if (!cells.length) throw new Error("no contribution cells returned");
  const grid = cellsToGrid(cells);
  const active = cells.filter(c => c.count > 0);
  const capacity = growthCapacity(active.length);
  const route = createSnakeRoute(grid.width, grid.height, capacity, seed);
  const chain = route.poses.map(createSnakeFromCells);
  const visited = new Set(chain.map(s => `${getHeadX(s)},${getHeadY(s)}`));
  if (active.some(c => !visited.has(`${c.x},${c.y}`)))
    throw new Error("snake route leaves occupied cells behind");
  console.log(`[route] seed ${seed}, ${grid.width}x${grid.height}, ${active.length} occupied cells, ${chain.length} steps, capacity ${capacity}`);

  const outputs = parseOutputsOption([
    "github-snake.svg",
    "github-snake-dark.svg?palette=github-dark",
  ]).map(out => {
    if (!out) throw new Error("invalid SVG output option");
    const rendered = createSvg(grid, cells, chain, out.drawOptions, out.animationOptions);
    const grown = addSnakeGrowth(rendered);
    return { filename: out.filename, svg: grown.svg };
  });
  const meta = {
    seed,
    pose: route.pose,
    randomised: true,
    steps: chain.length,
    durationMs: chain.length * 100,
    gridWidth: grid.width,
    gridHeight: grid.height,
    growth: { initialLength: INITIAL_LENGTH, capacity, cellsPerSegment: CELLS_PER_SEGMENT },
    cells: active.map(({ x, y, date, count }) => ({ x, y, date, count })),
  };
  return { outputs, meta, chain };
};

const main = async () => {
  const outDir = process.argv[2];
  const userName = process.env.SNAKE_USER;
  const githubToken = process.env.GITHUB_TOKEN;
  if (!outDir) throw new Error("usage: bun run snake-gen.ts <outDir>");
  if (!userName) throw new Error("SNAKE_USER is required");
  if (!githubToken) throw new Error("GITHUB_TOKEN is required");
  const seed = Number(process.env.SNAKE_SEED) || Math.floor(Math.random() * 0xffffffff) || 1;
  console.log(`[fetch] contributions for ${userName}`);
  const cells = await getGithubUserContribution(userName, { githubToken });
  const { outputs, meta } = generateSnake(cells, seed);
  // Both palettes and their growth schedules validate before any file is written.
  await fs.mkdir(outDir, { recursive: true });
  for (const out of outputs) {
    await fs.writeFile(path.join(outDir, out.filename), out.svg);
    console.log(`[write] ${out.filename}`);
  }
  await fs.writeFile(path.join(outDir, "snake-meta.json"), JSON.stringify(meta));
  console.log(`[write] snake-meta.json (${meta.cells.length} active days, ${meta.steps} steps)`);
};

if (import.meta.main) main().catch((err) => {
  console.error("snake generation failed:", err?.message ?? err);
  process.exit(1);
});
