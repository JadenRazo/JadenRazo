import test from "node:test";
import assert from "node:assert/strict";
import { createSnakeRoute } from "./snake-route.mjs";

test("even and odd calendars have bounded, contiguous, collision-free cycles", () => {
  for (const width of [52, 53, 54]) for (const length of [4, 5, 12]) for (const seed of [1, 1701, 4294967295]) {
    const { poses } = createSnakeRoute(width, 7, length, seed);
    assert.ok(poses.length <= (width + 2) * 8 + 1);
    assert.deepEqual(poses[0], poses.at(-1));
    assert.ok(poses[0].every(p => p.y === -1 || p.y === 7));
    const visited = new Set();
    poses.forEach((body, step) => {
      assert.equal(new Set(body.map(p => `${p.x},${p.y}`)).size, length);
      visited.add(`${body[0].x},${body[0].y}`);
      body.forEach((p, i) => {
        assert.ok(p.x >= -1 && p.x <= width && p.y >= -1 && p.y <= 7);
        if (i) assert.equal(Math.abs(p.x - body[i - 1].x) + Math.abs(p.y - body[i - 1].y), 1);
        if (step && i) assert.deepEqual(p, poses[step - 1][i - 1]);
      });
      if (step) assert.equal(Math.abs(body[0].x - poses[step - 1][0].x) + Math.abs(body[0].y - poses[step - 1][0].y), 1);
    });
    for (let x = 0; x < width; x++) for (let y = 0; y < 7; y++) assert.ok(visited.has(`${x},${y}`));
  }
});

test("seeded routes reproduce and vary without moving the start onto food", () => {
  assert.deepEqual(createSnakeRoute(53, 7, 12, 1701), createSnakeRoute(53, 7, 12, 1701));
  const starts = new Set(Array.from({ length: 10 }, (_, seed) => JSON.stringify(createSnakeRoute(53, 7, 12, seed).pose)));
  assert.ok(starts.size > 1);
  assert.throws(() => createSnakeRoute(3, 7, 12, 1), /dimensions/);
});

test("routes mix all four directions inside the calendar and change their layout", () => {
  const layouts = new Set();
  for (let seed = 1; seed <= 24; seed++) {
    const { poses } = createSnakeRoute(53, 7, 12, seed);
    const directions = { left: 0, right: 0, up: 0, down: 0 };
    const edges = [];
    for (let i = 1; i < poses.length; i++) {
      const a = poses[i - 1][0], b = poses[i][0];
      // The outside return row must not disguise a vertical-only calendar path.
      if ([a, b].some(p => p.x < 0 || p.x >= 53 || p.y < 0 || p.y >= 7)) continue;
      directions[b.x < a.x ? "left" : b.x > a.x ? "right" : b.y < a.y ? "up" : "down"]++;
      edges.push([`${a.x},${a.y}`, `${b.x},${b.y}`].sort().join("/"));
    }
    const horizontal = (directions.left + directions.right) / edges.length;
    assert.ok(horizontal >= 0.35 && horizontal <= 0.7, `seed ${seed}: balanced axes`);
    for (const [direction, moves] of Object.entries(directions))
      assert.ok(moves >= 40, `seed ${seed}: enough ${direction} movement inside the grid`);
    layouts.add(edges.sort().join(";"));
  }
  // Rotation of the starting pose alone cannot satisfy this layout comparison.
  assert.equal(layouts.size, 24);
});
