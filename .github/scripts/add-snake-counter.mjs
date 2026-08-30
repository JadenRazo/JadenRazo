/**
 * Overlays a live "contributions eaten" scoreboard onto the snake SVGs.
 *
 * snk already encodes, in its own CSS, the exact instant every cell is eaten:
 *
 *   @keyframes c1f{37.13%{fill:var(--c1)}37.15%,100%{fill:var(--ce)}}
 *
 * so the eat schedule is read straight back out rather than recomputed. Those
 * percentage strings are reused verbatim — never reformatted — so the counter
 * cannot drift out of sync with the square turning pale.
 *
 * Each eaten cell is joined to its real date and contribution count via
 * snake-meta.json, which snake-gen.ts emits from the same fetch that produced
 * the animation. If that file is absent (the stock-action fallback path) the
 * same GraphQL query snk uses is issued instead.
 *
 * Rendering: rather than ~120 opacity-gated groups (~70KB, ~600 concurrently
 * running animations), the values are stacked in a column that is slid by one
 * row per bite with `steps(1,end)`. That yields an exact, gap-free partition of
 * the timeline from a single keyframe block, with no epsilon arithmetic and no
 * chance of catching a frame mid-transition.
 *
 * Every failure path warns and exits 0, leaving the SVG untouched: a working
 * snake without a counter is a good outcome, a mangled snake is not.
 *
 * Usage: node add-snake-counter.mjs <dir-or-svg...>
 * Env:   GITHUB_TOKEN + SNAKE_USER (only needed when snake-meta.json is absent)
 */
import * as fs from "node:fs/promises";
import * as path from "node:path";

const SENTINEL = "<!--snk-counter v1-->";
const ROW_PITCH = 40; // px between stacked rows; shared by every stack
/**
 * A stack's clip window must never exceed the row pitch, or the neighbouring
 * row's baseline falls inside it too and two values render at once.
 */
const WINDOW_H = ROW_PITCH;
const BASELINE_IN_WINDOW = 32; // leaves ~25px of ascent and room for a comma
const BAND_TOP = 44; // extra canvas above the artwork
const BAND_BOTTOM = 30; // extra canvas below the artwork
/**
 * Bites closer together than this are treated as one burst: the badge shows the
 * burst's running sum (+3, then +8) instead of a fresh badge per bite. The
 * snake eats on consecutive animation steps for long stretches — the median gap
 * is around one step — so without this the badge strobes several times a second
 * and is unreadable.
 */
const BURST_GAP_MS = 500;
const BADGE_HOLD_MS = 500; // linger after a burst ends, so the total can be read
const BADGE_FADE_MS = 400;
const FONT = `-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif`;
const MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");

class Bail extends Error {}
const bail = (why) => {
  throw new Bail(why);
};

const commas = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const xmlEscape = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
/** Trim float noise from derived percentages (0.30000000000000004 -> 0.3). */
const pct = (n) => String(Math.round(n * 1000) / 1000);

const fmtDate = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return "";
  return `${MONTHS[m - 1]} ${d}`;
};

/** #rgb / #rrggbb -> relative luminance, for picking a readable muted colour. */
const luminance = (hex) => {
  let h = hex.replace("#", "").trim();
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  if (h.length < 6) return 1;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};

const fetchCells = async () => {
  const user = process.env.SNAKE_USER;
  const token = process.env.GITHUB_TOKEN;
  if (!user || !token) bail("snake-meta.json missing and SNAKE_USER/GITHUB_TOKEN unset");

  const query = `query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{weeks{contributionDays{contributionCount weekday date}}}}}}`;
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "snk-counter",
    },
    body: JSON.stringify({ query, variables: { login: user } }),
  });
  if (!res.ok) bail(`contribution API returned ${res.status}`);
  const { data, errors } = await res.json();
  if (errors?.length) bail(`contribution API: ${errors[0].message}`);

  const weeks = data?.user?.contributionsCollection?.contributionCalendar?.weeks;
  if (!weeks?.length) bail("contribution API returned no weeks");
  return weeks.flatMap(({ contributionDays }, x) =>
    contributionDays.map((d) => ({
      x,
      y: d.weekday,
      date: d.date,
      count: d.contributionCount,
    })),
  );
};

/** Pull the eat schedule and grid geometry back out of snk's own output. */
const parseSvg = (svg) => {
  if (svg.includes(SENTINEL)) bail("already processed");

  const rootEnd = svg.indexOf(">");
  const root = svg.slice(0, rootEnd + 1);
  const vb = /viewBox="(-?[\d.]+) (-?[\d.]+) (-?[\d.]+) (-?[\d.]+)"/.exec(root);
  if (!vb) bail("no parsable viewBox on the root element");
  const [vx, vy, vw, vh] = vb.slice(1).map(Number);

  const styleStart = svg.indexOf("<style>");
  const styleEnd = svg.indexOf("</style>");
  if (styleStart < 0 || styleEnd < 0) bail("no <style> block");
  const style = svg.slice(styleStart, styleEnd);

  // Duration is derived by snk from the route length, so it changes every run.
  const dur = Number(/\.c\{[^}]*?(\d+)ms/.exec(style)?.[1]);
  if (!dur) bail("could not determine animation duration");

  const cellSize = Number(/\.c\{[^}]*?width:([\d.]+)px/.exec(style)?.[1]);
  if (!cellSize) bail("could not determine cell size");

  const ce = /--ce:\s*(#[0-9a-fA-F]{3,8})/.exec(style)?.[1];
  if (!ce) bail("could not determine --ce palette colour");

  if (/@keyframes k|class="[^"]*\bk[a-z]/.test(svg))
    bail("SVG already uses k-prefixed names");

  // class -> the moment that cell is eaten, as snk printed it
  const eatAt = new Map();
  for (const m of style.matchAll(
    /@keyframes (c[0-9a-z]+)\{([\d.]+)%\{fill:var\(--c[0-4]\)\}/g,
  ))
    eatAt.set(m[1], m[2]);
  if (!eatAt.size) bail("no cell keyframes found");

  // class -> grid position, via the rect that carries it
  const rects = [...svg.matchAll(/<rect class="c(?: (c[0-9a-z]+))?" x="([\d.]+)" y="([\d.]+)"/g)];
  if (!rects.length) bail("no cell rects found");

  const xs = [...new Set(rects.map((r) => Number(r[2])))].sort((a, b) => a - b);
  const ys = [...new Set(rects.map((r) => Number(r[3])))].sort((a, b) => a - b);
  if (xs.length < 2 || ys.length < 2) bail("degenerate grid");
  const pitch = xs[1] - xs[0];
  if (!(pitch > 0)) bail("could not determine grid pitch");
  const rightEdge = xs[xs.length - 1] + cellSize;

  const placed = [];
  for (const r of rects) {
    if (!r[1]) continue; // never eaten
    const gx = (Number(r[2]) - xs[0]) / pitch;
    const gy = (Number(r[3]) - ys[0]) / pitch;
    if (!Number.isInteger(gx) || !Number.isInteger(gy) || gx < 0 || gy < 0)
      bail(`cell ${r[1]} does not land on the grid`);
    const at = eatAt.get(r[1]);
    if (at === undefined) bail(`cell ${r[1]} has no keyframe`);
    placed.push({ gx, gy, at });
  }
  if (!placed.length) bail("no eaten cells");

  return { root, rootEnd, vx, vy, vw, vh, dur, ce, rightEdge, styleEnd, placed };
};

/**
 * Chain bites separated by less than BURST_GAP_MS into a burst, and give each
 * event the burst-cumulative figure the badge should display at that moment.
 * Returns the bursts so the badge keyframe can hold one badge across each.
 */
const buildBursts = (events, dur) => {
  const gapPct = (BURST_GAP_MS / dur) * 100;
  const bursts = [];
  let start = 0;
  for (let i = 0; i < events.length; i++) {
    const isLast = i === events.length - 1;
    // sum from the burst's first bite up to and including this one
    events[i].burst = events[i].count + (i > start ? events[i - 1].burst : 0);
    if (isLast || events[i + 1].n - events[i].n > gapPct) {
      bursts.push({ start, end: i });
      start = i + 1;
    }
  }
  return bursts;
};

const buildEvents = (placed, cells) => {
  const byPos = new Map(cells.map((c) => [`${c.x},${c.y}`, c]));

  const events = placed.map(({ gx, gy, at }) => {
    const cell = byPos.get(`${gx},${gy}`);
    if (!cell) bail(`no contribution data for cell ${gx},${gy}`);
    if (!(cell.count > 0)) bail(`cell ${gx},${gy} is eaten but has no contributions`);
    return { at, n: Number(at), count: cell.count, date: cell.date };
  });

  events.sort((a, b) => a.n - b.n);
  for (let i = 1; i < events.length; i++)
    if (events[i].n <= events[i - 1].n)
      bail(`non-monotonic eat times at ${events[i].at}%`);
  if (events[0].n <= 0) bail("first eat time is not positive");
  if (events[events.length - 1].n >= 100) bail("last eat time is not below 100%");

  let running = 0;
  for (const e of events) e.running = running += e.count;
  return events;
};

const buildCss = (events, bursts, dur, ce, lastOffset) => {
  const dark = luminance(ce) < 0.5;
  const muted = dark ? "#8b949e" : "#57606a";

  // steps(1,end) holds each interval's start value and jumps at its end, so the
  // event percentages alone define an exact, gap-free partition — no epsilon.
  const kn = [
    "0%{transform:translateY(0px)}",
    ...events.map((e, i) => `${e.at}%{transform:translateY(-${(i + 1) * ROW_PITCH}px)}`),
    `100%{transform:translateY(-${lastOffset}px)}`,
  ].join("");

  // The floating "+N" badge: one badge per burst, held from the burst's first
  // bite to its last so the figure visibly accumulates rather than restarting.
  // It only floats away once the burst is over. Windows are derived from the
  // gap to the next burst, so the stops stay strictly increasing however
  // tightly packed the bites are.
  const holdPct = (BADGE_HOLD_MS / dur) * 100;
  const fadePct = (BADGE_FADE_MS / dur) * 100;
  const stops = [{ o: 0, v: "opacity:0;transform:translateY(0px)" }];
  let prevEnd = 0;
  bursts.forEach((b, bi) => {
    const first = events[b.start].n;
    const last = events[b.end].n;
    const next = bi + 1 < bursts.length ? events[bursts[bi + 1].start].n : 100;
    const gap = next - last;
    // hold + fade together stay inside 70% of the gap, leaving clear air before
    // the next burst appears
    const hold = Math.min(holdPct, gap * 0.35);
    const fade = Math.min(fadePct, gap * 0.35);
    const pre = Math.min(0.01, (first - prevEnd) * 0.25);
    stops.push({ o: first - pre, v: "opacity:0;transform:translateY(0px)" });
    stops.push({ o: first, v: "opacity:1;transform:translateY(0px)" });
    stops.push({ o: last + hold, v: "opacity:1;transform:translateY(0px)" });
    prevEnd = last + hold + fade;
    stops.push({ o: prevEnd, v: "opacity:0;transform:translateY(-10px)" });
  });
  stops.push({ o: 100, v: "opacity:0;transform:translateY(-10px)" });
  for (let i = 1; i < stops.length; i++)
    if (stops[i].o <= stops[i - 1].o) bail("badge keyframe offsets collide");
  const kf = stops.map((s) => `${pct(s.o)}%{${s.v}}`).join("");

  return (
    `:root{--kt:${muted}}` +
    `.kk{animation:kn ${dur}ms steps(1,end) infinite}` +
    `@keyframes kn{${kn}}` +
    `.kf{animation:kf ${dur}ms linear infinite}` +
    `@keyframes kf{${kf}}` +
    `.kb{font-family:${FONT};font-weight:700;font-size:34px;fill:var(--c4);text-anchor:end;font-variant-numeric:tabular-nums}` +
    `.kl{font-family:${FONT};font-weight:600;font-size:15px;fill:var(--kt)}` +
    `.kd{font-family:${FONT};font-weight:600;font-size:15px;fill:var(--kt);font-variant-numeric:tabular-nums}` +
    `.kp{font-family:${FONT};font-weight:700;font-size:17px;fill:var(--c4);text-anchor:end}` +
    // snk's base styles already paint the complete calendar, so freezing every
    // animation yields a sensible static frame: full year + final total. The
    // progress bars need an explicit end state — their base is scale(0,1), so
    // simply stopping the animation would erase them.
    `@media (prefers-reduced-motion:reduce){` +
    `.c,.s,.u,.kk,.kf{animation:none}` +
    `.u{transform:scale(1,1)}` +
    `.kk{transform:translateY(-${lastOffset}px)}` +
    `.kf{opacity:0}}`
  );
};

const buildElements = (events, total, rightEdge, vx, vw, top, bottom) => {
  // delta is the burst-cumulative figure, so a run of quick bites reads as one
  // badge climbing (+3 then +8) rather than a new badge flashing per bite.
  const rows = [{ value: 0, date: "", delta: 0 }, ...events.map((e) => ({
    value: e.running,
    date: e.date,
    delta: e.burst,
  }))];

  const baseline = top + BASELINE_IN_WINDOW; // clear of the snake's runway
  const numW = 180;
  const numX = rightEdge - numW;
  // Park the badge just clear of the widest total the number can ever reach,
  // rather than a fixed offset that leaves a gap at small values.
  const badgeW = 120;
  const widestNumber = commas(total).length * 34 * 0.62;
  const badgeX = Math.max(0, rightEdge - widestNumber - 14 - badgeW);

  const stack = (rows, cls) =>
    rows.map((t, i) => `<text class="${cls}" y="${i * ROW_PITCH}">${t}</text>`).join("");

  // Static placement and animated transform live on separate <g>s: a CSS
  // animated transform replaces the transform attribute outright.
  const number =
    `<svg x="${numX}" y="${top}" width="${numW}" height="${WINDOW_H}" overflow="hidden">` +
    `<g transform="translate(${numW},${BASELINE_IN_WINDOW})"><g class="kk">` +
    stack(rows.map((r) => commas(r.value)), "kb") +
    `</g></g></svg>`;

  const badge =
    `<svg x="${badgeX}" y="${top}" width="${badgeW}" height="${WINDOW_H}" overflow="hidden">` +
    `<g transform="translate(${badgeW},${BASELINE_IN_WINDOW})"><g class="kk"><g class="kf">` +
    stack(rows.map((r) => (r.delta ? `+${commas(r.delta)}` : "")), "kp") +
    `</g></g></g></svg>`;

  const label =
    `<rect x="0" y="${baseline - 12}" width="12" height="12" rx="2" ry="2" fill="var(--c4)"/>` +
    `<text class="kl" x="20" y="${baseline}">CONTRIBUTIONS EATEN</text>`;

  const totalStr = commas(total);
  const footer =
    `<svg x="${vx}" y="${bottom - 22}" width="${vw}" height="26" overflow="hidden">` +
    `<g transform="translate(${-vx},18)"><g class="kk">` +
    rows
      .map(
        (r, i) =>
          `<g transform="translate(0,${i * ROW_PITCH})">` +
          `<text class="kd" x="0" y="0">${xmlEscape(r.date ? fmtDate(r.date) : "")}</text>` +
          `<text class="kd" x="${rightEdge}" y="0" text-anchor="end">${commas(r.value)} / ${totalStr}</text>` +
          `</g>`,
      )
      .join("") +
    `</g></g></svg>`;

  return label + number + badge + footer;
};

const process1 = async (file, cellsPromise) => {
  const original = await fs.readFile(file, "utf8");
  const p = parseSvg(original);

  const cells = await cellsPromise;
  const events = buildEvents(p.placed, cells);
  const bursts = buildBursts(events, p.dur);
  const total = events[events.length - 1].running;
  const lastOffset = events.length * ROW_PITCH;

  const top = p.vy - BAND_TOP;
  const bottom = p.vy + p.vh + BAND_BOTTOM;
  const height = bottom - top;

  const newRoot = p.root
    .replace(/viewBox="[^"]*"/, `viewBox="${p.vx} ${top} ${p.vw} ${height}"`)
    .replace(/height="[^"]*"/, `height="${height}"`);

  const css = buildCss(events, bursts, p.dur, p.ce, lastOffset);
  const els = buildElements(events, total, p.rightEdge, p.vx, p.vw, top, bottom);

  const closeAt = original.lastIndexOf("</svg>");
  if (closeAt < 0) bail("no closing </svg>");

  const out =
    newRoot +
    SENTINEL +
    original.slice(p.rootEnd + 1, p.styleEnd) +
    css +
    original.slice(p.styleEnd, closeAt) +
    els +
    original.slice(closeAt);

  await fs.writeFile(file, out);
  console.log(
    `[ok] ${path.basename(file)}: ${events.length} bites, total ${commas(total)}, ` +
      `${(original.length / 1024) | 0}KB → ${(out.length / 1024) | 0}KB`,
  );
  return { events, total };
};

const main = async () => {
  const args = process.argv.slice(2);
  if (!args.length) {
    console.warn("[counter] usage: add-snake-counter.mjs <dir-or-svg...>");
    return;
  }

  const files = [];
  let metaDir = null;
  for (const arg of args) {
    const st = await fs.stat(arg).catch(() => null);
    if (!st) continue;
    if (st.isDirectory()) {
      metaDir ??= arg;
      for (const f of await fs.readdir(arg))
        if (f.endsWith(".svg")) files.push(path.join(arg, f));
    } else {
      metaDir ??= path.dirname(arg);
      files.push(arg);
    }
  }
  if (!files.length) {
    console.warn("[counter] no SVGs found — nothing to do");
    return;
  }

  // Resolved once and shared, but awaited lazily so a parse failure short-
  // circuits before any network call.
  const cellsPromise = (async () => {
    const metaPath = path.join(metaDir ?? ".", "snake-meta.json");
    const raw = await fs.readFile(metaPath, "utf8").catch(() => null);
    if (raw) {
      const meta = JSON.parse(raw);
      if (!meta?.cells?.length) bail("snake-meta.json has no cells");
      console.log(
        `[counter] using snake-meta.json (seed ${meta.seed}, ${meta.cells.length} active days)`,
      );
      return meta.cells;
    }
    console.log("[counter] no snake-meta.json — querying the contribution API");
    return fetchCells();
  })();
  cellsPromise.catch(() => {}); // handled at the await site

  for (const file of files) await process1(file, cellsPromise);
};

main().catch((err) => {
  // Never fail the job and never leave a half-written file: a snake with no
  // counter is a good outcome, a mangled snake is not.
  console.warn(
    `[counter] ${err instanceof Bail ? err.message : err?.stack ?? err} — leaving SVG unmodified`,
  );
  process.exit(0);
});
