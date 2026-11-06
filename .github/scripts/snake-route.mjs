/** A winding closed route: every calendar cell, no route search or crossings. */
export const createSnakeRoute = (width, height, length, seed) => {
  if (![width, height, length].every(Number.isSafeInteger) || width < length || height < 1 || length < 1)
    throw new Error("invalid calendar or snake dimensions");
  let state = seed >>> 0;
  const random = () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  // Each 2x2 tile starts as a little loop. Joining neighboring loops along a
  // random spanning tree makes one winding cycle through the whole calendar.
  // Unlike a column sweep, this produces left/right runs and irregular turns
  // within the grid. Work stays proportional to grid size, even for long snakes.
  const columns = Math.ceil((width + 1) / 2) * 2;
  const rows = Math.ceil((height + 1) / 2) * 2;
  const tileColumns = columns / 2;
  const tileRows = rows / 2;
  const at = (x, y) => y * columns + x;
  const links = Array.from({ length: columns * rows }, () => new Set());
  const connect = (a, b) => { links[a].add(b); links[b].add(a); };
  const disconnect = (a, b) => { links[a].delete(b); links[b].delete(a); };
  const parents = Array.from({ length: tileColumns * tileRows }, (_, i) => i);
  const root = (id) => {
    while (parents[id] !== id) { parents[id] = parents[parents[id]]; id = parents[id]; }
    return id;
  };
  const join = ({ x, y, vertical }) => {
    const from = root(y * tileColumns + x);
    const to = root(y * tileColumns + x + (vertical ? tileColumns : 1));
    if (from === to) return;
    parents[to] = from;
    const a = at(2 * x + (vertical ? 0 : 1), 2 * y + (vertical ? 1 : 0));
    const b = a + (vertical ? 1 : columns);
    const c = a + (vertical ? columns : 1);
    const d = c + (vertical ? 1 : columns);
    disconnect(a, b);
    disconnect(c, d);
    connect(a, c);
    connect(b, d);
  };
  const edges = [];
  for (let y = 0; y < tileRows; y++) for (let x = 0; x < tileColumns; x++) {
    const corners = [at(2 * x, 2 * y), at(2 * x + 1, 2 * y),
      at(2 * x + 1, 2 * y + 1), at(2 * x, 2 * y + 1)];
    corners.forEach((corner, i) => connect(corner, corners[(i + 1) % 4]));
    if (x + 1 < tileColumns) edges.push({ x, y, vertical: false });
    if (y + 1 < tileRows) edges.push({ x, y, vertical: true });
  }
  // Keep the outside row continuous so the entire initial body starts off-grid
  // and returns to exactly the same pose. The calendar interior stays random.
  for (let x = 0; x + 1 < tileColumns; x++) join({ x, y: 0, vertical: false });
  for (let i = edges.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [edges[i], edges[j]] = [edges[j], edges[i]];
  }
  edges.forEach(join);

  const loop = [{ x: -1, y: -1 }];
  let previous = 0;
  let current = 1;
  while (current !== 0 && loop.length <= links.length) {
    loop.push({ x: current % columns - 1, y: Math.floor(current / columns) - 1 });
    const next = [...links[current]].find(id => id !== previous);
    previous = current;
    current = next;
  }
  if (loop.length !== links.length || links.some(neighbors => neighbors.size !== 2))
    throw new Error("winding route did not form one complete cycle");

  const start = length - 1 + Math.floor(random() * (columns - length));
  const flipX = random() < 0.5;
  const flipY = random() < 0.5;
  const transform = ({ x, y }) => ({ x: flipX ? width - 1 - x : x, y: flipY ? height - 1 - y : y });
  const poses = Array.from({ length: loop.length + 1 }, (_, step) =>
    Array.from({ length }, (_, segment) => transform(loop[(start + step - segment + loop.length) % loop.length])));
  return { poses, pose: { ...poses[0][0], length }, steps: poses.length };
};
