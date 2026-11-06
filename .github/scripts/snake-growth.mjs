/** Reveal a collision-planned tail on the same bite timeline as the counter. */
export const INITIAL_LENGTH = 4;
export const MAX_LENGTH = 12;
export const CELLS_PER_SEGMENT = 8;
export const GROWTH_MARKER = "<!--snk-growth v1-->";

export const growthCapacity = (activeCells) => {
  if (!Number.isSafeInteger(activeCells) || activeCells < 0)
    throw new Error("activeCells must be a non-negative integer");
  return Math.min(MAX_LENGTH, INITIAL_LENGTH + Math.floor(activeCells / CELLS_PER_SEGMENT));
};

export const addSnakeGrowth = (svg) => {
  if (svg.includes(GROWTH_MARKER)) throw new Error("snake growth already applied");
  const duration = Number(/\.c\{[^}]*?(\d+)ms/.exec(svg)?.[1]);
  const styleEnd = svg.indexOf("</style>");
  if (!duration || styleEnd < 0 || !svg.endsWith("</svg>"))
    throw new Error("incomplete snake SVG or missing animation duration");

  // Keep snk's printed percentages exactly, as add-snake-counter.mjs does.
  // One event is one occupied day; the day's contribution count is irrelevant
  // to body length and remains entirely under the counter's control.
  const bites = [...svg.matchAll(/@keyframes (c[0-9a-z]+)\{([\d.]+)%\{fill:var\(--c[0-4]\)\}/g)]
    .map((m) => ({ id: m[1], at: m[2] }))
    .sort((a, b) => Number(a.at) - Number(b.at));
  if (new Set(bites.map((b) => b.id)).size !== bites.length ||
      bites.some((b, i) => !(Number(b.at) > 0 && Number(b.at) < 100) ||
        (i > 0 && Number(b.at) <= Number(bites[i - 1].at))))
    throw new Error("invalid or duplicate bite times");

  const capacity = growthCapacity(bites.length);
  const parts = [...svg.matchAll(/<rect class="s s(\d+)"[^>]*\/>/g)];
  if (parts.length !== capacity || parts.some((m, i) => Number(m[1]) !== i))
    throw new Error(`route must be planned for all ${capacity} body segments`);

  const growth = Array.from({ length: capacity - INITIAL_LENGTH }, (_, i) => ({
    segment: INITIAL_LENGTH + i,
    at: bites[(i + 1) * CELLS_PER_SEGMENT - 1].at,
  }));
  let css = `.sg{opacity:0;animation:none ${duration}ms steps(1,end) infinite}`;
  for (const { segment, at } of growth) {
    css += `.sg.sg${segment}{animation-name:sg${segment}}`;
    // Hide at 0 on EVERY iteration. Only the end of an occupied-cell bite
    // interval reveals a segment; empty cells and the return trip add nothing.
    css += `@keyframes sg${segment}{0%{opacity:0}${at}%,100%{opacity:1}}`;
  }
  css += "@media (prefers-reduced-motion:reduce){.sg{animation:none;opacity:0}}";

  // Opacity belongs to a wrapper so it cannot override snk's transform
  // animation. The solver has already accounted for the full, hidden body.
  const body = svg.replace(/<rect class="s s(\d+)"[^>]*\/>/g, (rect, index) =>
    Number(index) < INITIAL_LENGTH ? rect : `<g class="sg sg${index}">${rect}</g>`);
  const metadata = { initialLength: INITIAL_LENGTH, capacity, cellsPerSegment: CELLS_PER_SEGMENT,
    activeCells: bites.length, durationMs: duration, growth };
  return {
    svg: body.replace("</style>", `${css}</style>`)
      .replace("</svg>", `${GROWTH_MARKER}<metadata id="snk-growth">${JSON.stringify(metadata)}</metadata></svg>`),
    metadata,
  };
};
