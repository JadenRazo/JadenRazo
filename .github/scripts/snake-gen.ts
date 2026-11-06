/**
 * Generates the contribution snake SVGs with a *randomized* route.
 *
 * Platane/snk's own solver is fully deterministic: `getBestRoute(grid, snake)`
 * has no randomness and the CLI always seeds it with the fixed `snake4` pose,
 * so the published animation only ever changes when the contribution grid does.
 * The single lever that changes the route is the starting pose, so that is what
 * this script randomizes.
 *
 * It is executed by bun from inside a checkout of Platane/snk, copied into
 * packages/generate-snake-animation/ so the relative and workspace imports
 * below resolve. It deliberately reuses snk's own `parseOutputsOption` so the
 * draw options — and therefore the styling — stay identical to the stock action.
 *
 * Also emits snake-meta.json, mapping each grid cell to its real date and
 * contribution count, which add-snake-counter.mjs joins against. Emitting it
 * here (rather than re-querying) means the counter and the animation are always
 * derived from a single fetch and cannot disagree.
 *
 * Usage: bun run snake-gen.ts <outDir>
 * Env:   GITHUB_TOKEN (required), SNAKE_USER (required), SNAKE_SEED (optional)
 */
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { getGithubUserContribution } from "@snk/github-user-contribution";
import { getBestRoute } from "@snk/solver/getBestRoute";
import { getPathToPose } from "@snk/solver/getPathToPose";
import { createSvg } from "@snk/svg-creator";
import {
  copyGrid,
  getColor,
  isEmpty,
  isInside,
  setColorEmpty,
  type Grid,
} from "@snk/types/grid";
import { createSnakeFromCells, getHeadX, getHeadY, snakeToCells } from "@snk/types/snake";
import type { Snake } from "@snk/types/snake";
import { cellsToGrid } from "./cellsToGrid";
import { parseOutputsOption } from "./outputsOptions";
import { addSnakeGrowth, growthCapacity, INITIAL_LENGTH, CELLS_PER_SEGMENT } from "./snake-growth.mjs";
import type { Cell } from "@snk/github-user-contribution";

/** How many random poses to try before giving up and using snk's default. */
const MAX_ATTEMPTS = 12;
/**
 * Reject routes longer than this multiple of the default-pose route. Duration is
 * stepDurationMs * chain.length, so an unlucky pose could turn a 45s loop into
 * several minutes.
 */
const MAX_LENGTH_RATIO = 1.6;

/** mulberry32 — small seeded PRNG so a run can be reproduced from its logged seed. */
const makeRng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/** A horizontal snake of `length` cells with its head at (x, y). */
const poseAt = (x: number, y: number, length: number) =>
  createSnakeFromCells(Array.from({ length }, (_, i) => ({ x: x + i, y })));

/**
 * Full route for a starting pose: clear the grid, then return to the start pose
 * so the animation loops seamlessly. Mirrors generateSnakeAnimation.ts, but
 * returns null instead of throwing — getBestRoute/getPathToPose are non-total
 * (snk itself asserts them with `!`), and a random pose is likelier to hit that.
 */
const routeFor = (grid: Grid, snake: Snake): Snake[] | null => {
  let chain: Snake[] | null;
  try {
    chain = getBestRoute(grid, snake);
  } catch {
    return null;
  }
  if (!chain?.length) return null;

  let tail: Snake[] | null;
  try {
    tail = getPathToPose(chain[chain.length - 1], snake);
  } catch {
    return null;
  }
  if (!tail) return null;

  return [...chain, ...tail];
};

/**
 * Replicates svg-creator's createLivingCells eating rule: the head consumes any
 * non-empty cell it enters. Returns the number of coloured cells left behind — a
 * route that strands even one would render as a square that never gets eaten
 * while the counter claims a complete year.
 */
const countUneaten = (grid0: Grid, chain: Snake[]) => {
  const grid = copyGrid(grid0);
  for (const snake of chain) {
    const x = getHeadX(snake);
    const y = getHeadY(snake);
    if (isInside(grid, x, y) && !isEmpty(getColor(grid, x, y)))
      setColorEmpty(grid, x, y);
  }
  return grid.data.reduce((n: number, c: number) => n + (c > 0 ? 1 : 0), 0);
};

const validateRoute = (grid: Grid, chain: Snake[], length: number) => {
  for (const snake of chain) {
    const body = snakeToCells(snake);
    if (body.length !== length || new Set(body.map(p => `${p.x},${p.y}`)).size !== length)
      throw new Error("snake route contains an invalid body or self-collision");
    if (body.some(p => p.x < -1 || p.x > grid.width || p.y < -2 || p.y > grid.height + 2))
      throw new Error("snake route leaves the SVG canvas");
  }
  if (chain[0].some((value, i) => value !== chain.at(-1)![i]))
    throw new Error("snake route does not close its loop");
  if (countUneaten(grid, chain)) throw new Error("snake route leaves occupied cells behind");
};

export const generateSnake = (cells: Cell[], seed: number) => {
  const rng = makeRng(seed);
  console.log(`[seed] ${seed}`);
  if (!cells.length) throw new Error("no contribution cells returned");

  const grid = cellsToGrid(cells);
  const coloured = grid.data.reduce(
    (n: number, c: number) => n + (c > 0 ? 1 : 0),
    0,
  );
  console.log(`[grid] ${grid.width}x${grid.height}, ${coloured} coloured cells`);

  // Plan for the entire final body, including the initially hidden tail, so
  // revealing new segments cannot introduce self-collisions.
  const length = growthCapacity(coloured);
  if (grid.width < length) throw new Error("calendar too narrow for the planned body");
  const defaultPose = poseAt(0, -1, length);
  const baseline = routeFor(grid, defaultPose);
  if (!baseline) throw new Error("default pose produced no route");
  const maxLength = Math.ceil(baseline.length * MAX_LENGTH_RATIO);
  console.log(
    `[route] baseline ${baseline.length} steps (budget ${maxLength})`,
  );

  let chosen = { chain: baseline, pose: { x: 0, y: -1, length } };
  let randomised = false;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    // The snake starts outside the grid: the row above it, or the row below.
    const y = rng() < 0.5 ? -1 : grid.height;
    const x = Math.floor(rng() * (grid.width - length + 1));

    const chain = routeFor(grid, poseAt(x, y, length));
    if (!chain) {
      console.log(`  ✗ attempt ${attempt} (x=${x} y=${y} len=${length}): no route`);
      continue;
    }
    if (chain.length > maxLength) {
      console.log(
        `  ✗ attempt ${attempt} (x=${x} y=${y} len=${length}): ${chain.length} steps exceeds budget`,
      );
      continue;
    }
    const uneaten = countUneaten(grid, chain);
    if (uneaten > 0) {
      console.log(
        `  ✗ attempt ${attempt} (x=${x} y=${y} len=${length}): ${uneaten} cells left uneaten`,
      );
      continue;
    }

    console.log(
      `  ✓ attempt ${attempt} (x=${x} y=${y} len=${length}): ${chain.length} steps`,
    );
    chosen = { chain, pose: { x, y, length } };
    randomised = true;
    break;
  }

  if (!randomised) {
    // Not fatal: a valid deterministic snake beats no snake.
    const uneaten = countUneaten(grid, baseline);
    if (uneaten > 0)
      throw new Error(`default route leaves ${uneaten} cells uneaten`);
    console.warn(
      `[warning] no random pose passed validation after ${MAX_ATTEMPTS} attempts — using the default pose`,
    );
  }

  validateRoute(grid, chosen.chain, length);
  const outputs = parseOutputsOption([
    "github-snake.svg",
    "github-snake-dark.svg?palette=github-dark",
  ]);

  const rendered = [];
  for (const out of outputs) {
    if (!out) continue;
    const svg = createSvg(
      grid,
      cells,
      chosen.chain,
      out.drawOptions,
      out.animationOptions,
    );
    const grown = addSnakeGrowth(svg);
    rendered.push({ filename: out.filename, svg: grown.svg });
  }

  const meta = {
    seed,
    pose: chosen.pose,
    randomised,
    steps: chosen.chain.length,
    durationMs: chosen.chain.length * 100,
    gridWidth: grid.width,
    gridHeight: grid.height,
    growth: { initialLength: INITIAL_LENGTH, capacity: length, cellsPerSegment: CELLS_PER_SEGMENT },
    // Only cells with contributions matter to the counter, and dropping the
    // ~250 empty ones keeps the file small.
    cells: cells
      .filter((c) => c.count > 0)
      .map(({ x, y, date, count }) => ({ x, y, date, count })),
  };
  return { outputs: rendered, meta, chain: chosen.chain };
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
  console.log(
    `[write] snake-meta.json (${meta.cells.length} active days, ${meta.steps} steps)`,
  );
};

if (import.meta.main) main().catch((err) => {
  console.error("✗ snake-gen failed:", err?.message ?? err);
  process.exit(1);
});
