import {
  readFileSync,
  writeFileSync,
  readdirSync,
  mkdirSync,
  copyFileSync,
} from "node:fs";
import { join } from "node:path";

const chunksDir = join(process.cwd(), ".next/static/chunks");
const mediaDir = join(process.cwd(), ".next/static/media");
const outDir = join(process.cwd(), ".design-sync/.cache/css");

const chunks = readdirSync(chunksDir).filter((f) => f.endsWith(".css"));
if (chunks.length === 0) {
  console.error("collect-css: no CSS chunks in .next/ — run `npm run build` first");
  process.exit(1);
}

const globals = [];
const fonts = [];
for (const f of chunks) {
  const css = readFileSync(join(chunksDir, f), "utf8");
  (css.trimStart().startsWith("@font-face") ? fonts : globals).push(css);
}
if (globals.length !== 1) {
  console.error(`collect-css: expected exactly 1 global CSS chunk, found ${globals.length}`);
  process.exit(1);
}

const fontCss = fonts.join("\n");
const varDecls = [...fontCss.matchAll(/\.[\w-]+__variable\{(--font-[^}]+)\}/g)]
  .map((m) => m[1])
  .join(";");
const localOnlyFaces = [...fontCss.matchAll(/@font-face\{[^}]+\}/g)]
  .map((m) => m[0])
  .filter((r) => !r.includes("url("));

mkdirSync(join(outDir, "chunks"), { recursive: true });
mkdirSync(join(outDir, "media"), { recursive: true });
writeFileSync(
  join(outDir, "chunks/ds-globals.css"),
  `${globals[0]}\n:root{${varDecls}}\n${localOnlyFaces.join("\n")}\n`,
);
writeFileSync(join(outDir, "chunks/ds-fonts.css"), fontCss);

const woff2 = new Set(
  [...fontCss.matchAll(/url\(\.\.\/media\/([^)]+\.woff2)\)/g)].map((m) => m[1]),
);
for (const f of woff2) copyFileSync(join(mediaDir, f), join(outDir, "media", f));

console.log(
  `collect-css: ds-globals.css (${globals[0].length}B), ds-fonts.css from ${fonts.length} font chunk(s), ${varDecls.split(";").length} font vars, ${localOnlyFaces.length} local-only faces, ${woff2.size} woff2 copied`,
);
