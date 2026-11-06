import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { addSnakeGrowth, growthCapacity } from "./snake-growth.mjs";

const script = fileURLToPath(new URL("./add-snake-counter.mjs", import.meta.url));
const counts = [2, 13, 1, 25, 4, 8, 3, 11];
const times = ["44.71", "8.32", "93.11", "22.55", "17.01", "69.4", "55.29", "31.61"];
const cells = counts.map((count, i) => ({ x: Math.floor(i / 2), y: i % 2, count, date: `2026-01-0${i + 1}` }));
const fixture = (occupied = true) => {
  const style = occupied ? times.map((at, i) => `@keyframes c${i}{${at}%{fill:var(--c1)}}`).join("") : "";
  return '<svg viewBox="-16 -32 96 112" width="96" height="112"><style>:root{--ce:#ebedf0;--c1:#9be9a8;--c4:#216e39;--cs:purple}.c{animation:none 60000ms linear infinite;width:12px}' +
    style + '</style>' + cells.map((c, i) => `<rect class="c${occupied ? ` c${i}` : ""}" x="${c.x * 16 + 2}" y="${c.y * 16 + 2}"/>`).join("") +
    Array.from({ length: growthCapacity(occupied ? 8 : 0) }, (_, i) => `<rect class="s s${i}" x="2" y="2" width="12" height="12"/>`).join("") + '</svg>';
};

const overlay = async (svg, data) => {
  const dir = await mkdtemp(join(tmpdir(), "snake-counter-test-"));
  try {
    await writeFile(join(dir, "github-snake.svg"), svg);
    await writeFile(join(dir, "snake-meta.json"), JSON.stringify({ seed: 1, cells: data }));
    const result = spawnSync(process.execPath, [script, dir], { encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    return { svg: await readFile(join(dir, "github-snake.svg"), "utf8"), log: result.stdout + result.stderr };
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
};

test("growth preserves every exact counter value and event percentage", async () => {
  const plain = await overlay(fixture(), cells);
  const grown = await overlay(addSnakeGrowth(fixture()).svg, cells);
  const values = svg => [...svg.matchAll(/<text class="kb" y="\d+">([\d,]+)<\/text>/g)].map(m => Number(m[1].replaceAll(",", "")));
  const ordered = times.map((at, i) => ({ at, count: counts[i] })).sort((a, b) => Number(a.at) - Number(b.at));
  const expected = [0];
  for (const event of ordered) expected.push(expected.at(-1) + event.count);
  assert.deepEqual(values(plain.svg), expected);
  assert.deepEqual(values(grown.svg), expected);
  assert.equal(expected.at(-1), 67);
  for (const event of ordered) assert.ok(grown.svg.includes(`${event.at}%{transform:translateY(`));
  assert.ok(grown.svg.includes('<!--snk-growth v1-->'));
  assert.ok(grown.svg.includes('<!--snk-counter v1-->'));
});

test("empty calendar renders an exact zero counter", async () => {
  const { svg } = await overlay(addSnakeGrowth(fixture(false)).svg, []);
  assert.ok(svg.includes('<!--snk-counter v1-->'));
  assert.ok(svg.includes('<text class="kb" y="0">0</text>'));
  assert.ok(svg.includes('>0 / 0</text>'));
});

test("missing or unconsumed contribution data never publishes an invented total", async () => {
  for (const data of [cells.slice(1), [...cells, { x: 10, y: 1, count: 100, date: "2026-01-09" }]]) {
    const original = addSnakeGrowth(fixture()).svg;
    const result = await overlay(original, data);
    assert.equal(result.svg, original);
    assert.ok(!result.svg.includes('<!--snk-counter v1-->'));
  }
});
