/** Link only snk's dependency-free SVG packages; do not install its web/GIF tools. */
import { mkdir, realpath, symlink, copyFile } from "node:fs/promises";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const checkout = resolve(process.argv[2] || ".snk");
const scripts = dirname(fileURLToPath(import.meta.url));
const scope = join(checkout, "node_modules/@snk");
await mkdir(scope, { recursive: true });
for (const name of ["types", "svg-creator", "github-user-contribution"]) {
  const target = await realpath(join(checkout, "packages", name));
  const link = join(scope, name);
  try {
    await symlink(target, link, "dir");
  } catch (error) {
    if (error.code !== "EEXIST" || await realpath(link) !== target) throw error;
  }
}
for (const name of ["snake-gen.ts", "snake-growth.mjs", "snake-route.mjs", "snake.integration.test.ts"]) {
  await copyFile(join(scripts, name), join(checkout, "packages/generate-snake-animation", name));
}
console.log("Prepared pinned snk SVG sources without installing dependencies.");
