import { execFileSync } from "node:child_process";
import { readdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repo = dirname(here);

execFileSync(join(repo, "node_modules/.bin/tsc"), ["-p", join(here, "tsconfig.types.json")], {
  stdio: "inherit",
});

const typesDir = join(here, ".cache/types");
const uiDir = join(typesDir, "components/ui");
const names = readdirSync(uiDir)
  .filter((f) => f.endsWith(".d.ts"))
  .map((f) => f.replace(/\.d\.ts$/, ""));
writeFileSync(
  join(typesDir, "index.d.ts"),
  names.map((n) => `export * from "./components/ui/${n}";`).join("\n") + "\n",
);
console.log(`emit-types: ${names.length} component declarations + index.d.ts`);
