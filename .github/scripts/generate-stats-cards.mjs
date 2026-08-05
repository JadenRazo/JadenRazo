// Renders github-readme-stats cards to static SVGs using the project's own
// fetchers/renderers, so the profile keeps the exact card visuals without
// depending on any hosted instance. Run from inside a checkout of
// anuraghazra/github-readme-stats (GRS_DIR) with PAT_1 set to any GitHub
// token that can read public data (the Actions GITHUB_TOKEN suffices).
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const GRS_DIR = process.env.GRS_DIR;
const OUT_DIR = process.env.OUT_DIR || "generated";
const USERNAME = process.env.STATS_USER || "JadenRazo";

if (!GRS_DIR) {
  console.error("GRS_DIR must point at a github-readme-stats checkout");
  process.exit(1);
}

const { fetchStats } = await import(join(GRS_DIR, "src/fetchers/stats.js"));
const { fetchTopLanguages } = await import(
  join(GRS_DIR, "src/fetchers/top-languages.js")
);
const { renderStatsCard } = await import(join(GRS_DIR, "src/cards/stats.js"));
const { renderTopLanguages } = await import(
  join(GRS_DIR, "src/cards/top-languages.js")
);

const stats = await fetchStats(USERNAME);
const langs = await fetchTopLanguages(USERNAME);

const shared = { hide_border: true, bg_color: "00000000" };
const variants = [
  ["dark", { theme: "github_dark", ...shared }],
  ["light", { ...shared }],
];

await mkdir(OUT_DIR, { recursive: true });
for (const [name, opts] of variants) {
  await writeFile(
    join(OUT_DIR, `stats-${name}.svg`),
    renderStatsCard(stats, { show_icons: true, ...opts }),
  );
  await writeFile(
    join(OUT_DIR, `top-langs-${name}.svg`),
    renderTopLanguages(langs, { layout: "compact", ...opts }),
  );
}
console.log(`Wrote 4 SVGs to ${OUT_DIR}/ for ${USERNAME}`);
