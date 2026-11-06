/** A bounded Hamiltonian sweep: every calendar cell, no route search or crossings. */
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
  // Reserve one outside column and the top row for the return path. If the
  // calendar width is even, use the other outside column too, making the sweep
  // rectangle even-width. Both margins fit snk's existing SVG canvas.
  const right = width % 2 ? width - 1 : width;
  const loop = [{ x: -1, y: -1 }];
  for (let x = -1; x <= right; x++) {
    for (let row = 0; row < height; row++)
      loop.push({ x, y: (x + 1) % 2 ? height - row - 1 : row });
  }
  loop.push({ x: right, y: -1 });
  for (let x = right - 1; x >= 0; x--) loop.push({ x, y: -1 });

  const startX = Math.floor(random() * (width - length + 1));
  const start = loop.findIndex(p => p.x === startX && p.y === -1);
  const flipX = random() < 0.5;
  const flipY = random() < 0.5;
  const transform = ({ x, y }) => ({ x: flipX ? width - 1 - x : x, y: flipY ? height - 1 - y : y });
  const poses = Array.from({ length: loop.length + 1 }, (_, step) =>
    Array.from({ length }, (_, segment) => transform(loop[(start + step - segment + loop.length) % loop.length])));
  return { poses, pose: { ...poses[0][0], length }, steps: poses.length };
};
