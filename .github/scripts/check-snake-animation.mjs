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
const browser = await chromium.launch({ headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const observations = [];
try {
  for (const theme of ["light", "dark"]) {
    const file = join(input, theme === "dark" ? "github-snake-dark.svg" : "github-snake.svg");
    const svg = await readFile(file, "utf8");
    const growth = JSON.parse(/<metadata id="snk-growth">(.*?)<\/metadata>/.exec(svg)[1]);
    const atByClass = new Map([...svg.matchAll(/@keyframes (c[0-9a-z]+)\{([\d.]+)%\{fill:var\(--c[0-4]\)\}/g)].map(m => [m[1], Number(m[2])]));
    const bites = [...svg.matchAll(/<rect class="c (c[0-9a-z]+)" x="([\d.]+)" y="([\d.]+)"/g)].map(m => ({
      at: atByClass.get(m[1]), count: byPosition.get(`${(Number(m[2]) - 2) / 16},${(Number(m[3]) - 2) / 16}`),
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
    for (const [i, event] of growth.growth.entries()) {
      const time = Number(event.at) / 100 * growth.durationMs;
      await sample(time - 1, `growth-${i + 1}-before`);
      await sample(time + 1, `growth-${i + 1}-after`, i === 0 || i === growth.growth.length - 1);
    }
    await sample(growth.durationMs - 1, "end", true);
    await sample(growth.durationMs + 1, "reset", true);
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
