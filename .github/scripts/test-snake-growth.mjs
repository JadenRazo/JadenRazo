import test from "node:test";
import assert from "node:assert/strict";
import { addSnakeGrowth, growthCapacity } from "./snake-growth.mjs";

const fixture = (bites, parts = growthCapacity(bites)) =>
  '<svg viewBox="-16 -32 880 192"><style>.c{animation:none 60000ms linear infinite}' +
  Array.from({ length: bites }, (_, i) =>
    `@keyframes c${i.toString(36)}{${((i + 1) * 0.2).toFixed(2)}%{fill:var(--c1)}}`).join("") +
  '</style>' + Array.from({ length: parts }, (_, i) =>
    `<rect class="s s${i}" x="2" y="2" width="12" height="12"/>`).join("") + '</svg>';

test("growth follows occupied days, starting at four and capped at twelve", () => {
  for (const [days, length] of [[0, 4], [7, 4], [8, 5], [15, 5], [16, 6], [63, 11], [64, 12], [366, 12]])
    assert.equal(growthCapacity(days), length);
  for (const invalid of [-1, 1.5, NaN, Infinity]) assert.throws(() => growthCapacity(invalid));
});

test("growth uses exact bite percentages, retains movement, and resets each loop", () => {
  const input = fixture(80);
  const { svg, metadata } = addSnakeGrowth(input);
  assert.equal(metadata.growth.length, 8);
  assert.deepEqual(metadata.growth[0], { segment: 4, at: "1.60" });
  assert.deepEqual(metadata.growth.at(-1), { segment: 11, at: "12.80" });
  assert.equal((svg.match(/<g class="sg /g) || []).length, 8);
  for (const { segment, at } of metadata.growth)
    assert.ok(svg.includes(`@keyframes sg${segment}{0%{opacity:0}${at}%,100%{opacity:1}}`));
  assert.deepEqual([...svg.matchAll(/<rect[^>]*\/>/g)].map(m => m[0]),
    [...input.matchAll(/<rect[^>]*\/>/g)].map(m => m[0]));
  assert.ok(svg.includes("@media (prefers-reduced-motion:reduce){.sg{animation:none;opacity:0}}"));
  assert.throws(() => addSnakeGrowth(svg), /already applied/);
});

test("empty and sparse calendars stay short without inventing bites", () => {
  for (const n of [0, 1, 7]) {
    const { svg, metadata } = addSnakeGrowth(fixture(n));
    assert.equal(metadata.capacity, 4);
    assert.deepEqual(metadata.growth, []);
    assert.ok(!svg.includes('<g class="sg '));
  }
});

test("mismatched bodies and malformed or duplicate timing fail before publication", () => {
  assert.throws(() => addSnakeGrowth(fixture(64, 4)), /all 12/);
  assert.throws(() => addSnakeGrowth(fixture(8).replace('s s4', 's s8')), /segments/);
  assert.throws(() => addSnakeGrowth(fixture(8).replace('0.40%', '0.20%')), /bite times/);
  assert.throws(() => addSnakeGrowth(fixture(8).replace('0.20%', '100%')), /bite times/);
  assert.throws(() => addSnakeGrowth(fixture(8).replace('keyframes c1', 'keyframes c0')), /bite times/);
  assert.throws(() => addSnakeGrowth(fixture(8).replace('</svg>', '')), /incomplete/);
});
