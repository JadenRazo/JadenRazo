/** Browser acceptance: real CSS timing, counter values, growth, reset and reduced motion. */
import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const [directory, playwrightDirectory, evidenceDirectory] = process.argv.slice(2);
if (!directory || !playwrightDirectory || !evidenceDirectory)
  throw new Error("usage: check-snake-animation.mjs <svg-dir> <playwright-package-dir> <evidence-dir>");
const { chromium } = createRequire(import.meta.url)(resolve(playwrightDirectory));
const input = resolve(directory);
const evidence = resolve(evidenceDirectory);
await mkdir(evidence, { recursive: true });
const meta = JSON.parse(await readFile(join(input, "snake-meta.json"), "utf8"));
const byPosition = new Map(meta.cells.map(c => [`${c.x},${c.y}`, c.count]));
const luminance = (rgb) => rgb.map(v => {
  const s = v / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}).reduce((sum, value, i) => sum + value * [0.2126, 0.7152, 0.0722][i], 0);
const contrast = (a, b) => {
  const [low, high] = [luminance(a), luminance(b)].sort((a, b) => a - b);
  return (high + 0.05) / (low + 0.05);
};
const rgb = color => color.match(/[\d.]+/g).slice(0, 3).map(Number);
const browser = await chromium.launch({ headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const observations = [];
try {
  for (const theme of ["light", "dark"]) {
    const file = join(input, theme === "dark" ? "github-snake-dark.svg" : "github-snake.svg");
    const svg = await readFile(file, "utf8");
    const growth = JSON.parse(/<metadata id="snk-growth">(.*?)<\/metadata>/.exec(svg)[1]);
    const eventByClass = new Map([...svg.matchAll(/@keyframes (c[0-9a-z]+)\{([\d.]+)%\{fill:var\(--c([0-4])\)\}/g)].map(m => [m[1], { at: Number(m[2]), level: Number(m[3]) }]));
    const bites = [...svg.matchAll(/<rect class="c (c[0-9a-z]+)" x="([\d.]+)" y="([\d.]+)"/g)].map(m => ({
      className: m[1], ...eventByClass.get(m[1]),
      count: byPosition.get(`${(Number(m[2]) - 2) / 16},${(Number(m[3]) - 2) / 16}`),
    }));
    assert.ok(bites.every(b => Number.isFinite(b.at) && b.count > 0));
    const total = meta.cells.reduce((n, c) => n + c.count, 0);
    const page = await browser.newPage({ viewport: { width: 880, height: 300 }, colorScheme: theme });
    await page.goto(pathToFileURL(file).href);
    await page.evaluate(theme => { document.documentElement.style.background = theme === "dark" ? "#0d1117" : "#ffffff"; }, theme);
    const sample = async (ms, label, capture = false) => {
      await page.evaluate(ms => { for (const animation of document.getAnimations()) { animation.pause(); animation.currentTime = ms; } }, ms);
      const state = await page.evaluate(() => {
        const body = [...document.querySelectorAll("rect.s")].filter(el => !el.parentElement.classList.contains("sg") || Number(getComputedStyle(el.parentElement).opacity) > 0.5);
        const number = document.querySelector("text.kb").parentElement;
        const row = Math.round(-new DOMMatrix(getComputedStyle(number).transform).m42 / 40);
        return { length: body.length, count: Number(number.children[row].textContent.replaceAll(",", "")) };
      });
      const phase = (ms % growth.durationMs) / growth.durationMs * 100;
      assert.equal(state.length, growth.initialLength + growth.growth.filter(g => Number(g.at) <= phase).length, `${theme} ${label} length`);
      assert.equal(state.count, bites.filter(b => b.at <= phase).reduce((n, b) => n + b.count, 0), `${theme} ${label} counter`);
      observations.push({ theme, label, ms, ...state });
      if (capture) await page.screenshot({ path: join(evidence, `${theme}-${label}.png`) });
    };
    await sample(0, "start", true);
    // Check actual rendered colors, including opacity: a palette constant alone
    // cannot prove that the food is visible once the SVG's CSS is applied.
    const colors = await page.evaluate(() => {
      const cells = [...document.querySelectorAll("rect.c")].map(el => {
        const s = getComputedStyle(el);
        return { className: el.classList[1], fill: s.fill, opacity: Number(s.opacity), fillOpacity: Number(s.fillOpacity) };
      });
      return { cells, background: getComputedStyle(document.documentElement).backgroundColor,
        snake: getComputedStyle(document.querySelector("rect.s")).fill };
    });
    const empty = colors.cells.find(c => !c.className).fill;
    const occupied = colors.cells.filter(c => c.className);
    assert.equal(occupied.length, bites.length);
    assert.equal(new Set(occupied.map(c => c.fill)).size, new Set(bites.map(b => b.level)).size, `${theme} distinct activity levels`);
    for (const cell of occupied) {
      assert.equal(cell.opacity, 1, `${theme} ${cell.className} opacity`);
      assert.equal(cell.fillOpacity, 1, `${theme} ${cell.className} fill opacity`);
      assert.ok(contrast(rgb(cell.fill), rgb(empty)) >= 3, `${theme} ${cell.className} contrast against empty cells`);
      assert.ok(contrast(rgb(cell.fill), rgb(colors.background)) >= 3, `${theme} ${cell.className} contrast against background`);
    }
    assert.ok(contrast(rgb(colors.snake), rgb(empty)) >= 3, `${theme} snake contrast`);
    observations.push({ theme, contrast: { activeCells: occupied.length,
      minimumAgainstEmpty: Math.min(...occupied.map(c => contrast(rgb(c.fill), rgb(empty)))),
      minimumAgainstBackground: Math.min(...occupied.map(c => contrast(rgb(c.fill), rgb(colors.background)))) } });

    // Inspect a faint-level bite before arrival and after the tail clears it.
    // This catches cells that appear empty while their count still increases.
    const low = bites.filter(b => b.level === 1 && b.at / 100 * growth.durationMs + 1400 < growth.durationMs)
      .sort((a, b) => a.count - b.count || a.at - b.at)[0];
    assert.ok(low, `${theme} preview needs a low-activity cell`);
    const biteTime = low.at / 100 * growth.durationMs;
    await sample(Math.max(0, biteTime - 250), "low-cell-before", true);
    const beforeFill = await page.locator(`rect.${low.className}`).evaluate(el => getComputedStyle(el).fill);
    assert.notEqual(beforeFill, empty);
    await sample(biteTime + 1400, "low-cell-after", true);
    const afterFill = await page.locator(`rect.${low.className}`).evaluate(el => getComputedStyle(el).fill);
    assert.equal(afterFill, empty);
    observations.push({ theme, lowCell: { count: low.count, className: low.className, beforeFill, afterFill } });
    for (const [i, event] of growth.growth.entries()) {
      const time = Number(event.at) / 100 * growth.durationMs;
      await sample(time - 1, `growth-${i + 1}-before`);
      await sample(time + 1, `growth-${i + 1}-after`, i === 0 || i === growth.growth.length - 1);
    }
    // Inspect the route throughout the loop, not just while the first tail
    // segments appear. These frames show the varied bends at full length too.
    for (const percent of [10, 20, 30, 40, 50, 60, 70, 80, 90])
      await sample(growth.durationMs * percent / 100, `path-${percent}`, true);
    await sample(growth.durationMs - 1, "end", true);
    assert.ok(await page.locator("rect.c").evaluateAll((cells, empty) => cells.every(el => getComputedStyle(el).fill === empty), empty), `${theme} all cells eaten`);
    await sample(growth.durationMs + 1, "reset", true);
    assert.equal(await page.locator("rect.c").evaluateAll((cells, empty) => cells.filter(el => getComputedStyle(el).fill !== empty).length, empty), bites.length, `${theme} food restored on reset`);
    await page.emulateMedia({ reducedMotion: "reduce" });
    const reduced = await page.evaluate(() => ({
      animations: document.getAnimations().length,
      tailVisible: [...document.querySelectorAll(".sg")].some(el => Number(getComputedStyle(el).opacity) > 0),
      count: (() => { const n = document.querySelector("text.kb").parentElement; const row = Math.round(-new DOMMatrix(getComputedStyle(n).transform).m42 / 40); return Number(n.children[row].textContent.replaceAll(",", "")); })(),
    }));
    assert.deepEqual(reduced, { animations: 0, tailVisible: false, count: total });
    await page.screenshot({ path: join(evidence, `${theme}-reduced-motion.png`) });
    observations.push({ theme, reduced });
    await page.close();
  }
  await writeFile(join(evidence, "animation-checks.json"), JSON.stringify(observations, null, 2));
  console.log(`Verified ${observations.length} browser states across both palettes.`);
} finally {
  await browser.close();
}
