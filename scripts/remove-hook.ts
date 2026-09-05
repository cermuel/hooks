import { rm, readFile, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import { generateHooksRegistry, readHookMetadata } from "./generate-hooks-registry.ts";
import type { HookFramework, HookMetadata } from "../packages/hooks/src/types/hook";

const rootDir = process.cwd();
const hooksDir = path.join(rootDir, "packages/hooks/src/hooks");
const reactExportsPath = path.join(rootDir, "packages/hooks/src/react.ts");
const vueExportsPath = path.join(rootDir, "packages/hooks/src/vue.ts");

async function readScriptedAnswers(): Promise<string[]> {
  let source = "";

  for await (const chunk of input) {
    source += chunk;
  }

  return source.split(/\r?\n/);
}

function matchesHook(hook: HookMetadata, query: string): boolean {
  return hook.name.toLowerCase() === query.toLowerCase() || hook.slug.toLowerCase() === query.toLowerCase();
}

function gitStatusForHook(slug: string): string {
  const result = spawnSync("git", ["status", "--porcelain", "--", `packages/hooks/src/hooks/${slug}`], {
    cwd: rootDir,
    encoding: "utf8",
  });

  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || "Unable to inspect hook git status.");
  }

  return result.stdout.trim();
}

function runHookValidation(): void {
  const result = spawnSync("node", ["scripts/check-hooks.ts"], {
    cwd: rootDir,
    encoding: "utf8",
    stdio: "inherit",
  });

  if (result.status !== 0) {
    throw new Error("Hook validation failed.");
  }
}

async function removeExport(exportPath: string, name: string, slug: string, framework: HookFramework): Promise<boolean> {
  const source = await readFile(exportPath, "utf8").catch(() => "");
  const exportLine = `export { ${name} } from "./hooks/${slug}/${framework}";`;
  const lines = source.split("\n");
  const nextLines = lines.filter((line) => line.trim() !== exportLine);

  if (nextLines.length === lines.length) {
    return false;
  }

  const nextSource = nextLines.filter((line, index) => line !== "" || index < nextLines.length - 1).join("\n");
  await writeFile(exportPath, nextSource.endsWith("\n") || nextSource === "" ? nextSource : `${nextSource}\n`);

  return true;
}

async function main(): Promise<void> {
  const scriptedAnswers = input.isTTY ? undefined : await readScriptedAnswers();
  const prompts = input.isTTY ? createInterface({ input, output }) : undefined;
  let answerIndex = 0;

  async function ask(question: string): Promise<string> {
    if (scriptedAnswers) {
      const answer = scriptedAnswers[answerIndex] ?? "";
      answerIndex += 1;
      output.write(question);
      output.write(`${answer}\n`);
      return answer;
    }

    return prompts?.question(question) ?? "";
  }

  try {
    const metadata = await readHookMetadata();

    if (metadata.length === 0) {
      throw new Error("No hooks found to remove.");
    }

    const requestedHook = process.argv[2]?.trim();
    const hookName = requestedHook || (await ask(`Hook to remove (${metadata.map((hook) => hook.name).join(", ")}): `)).trim();
    const hook = metadata.find((entry) => matchesHook(entry, hookName));

    if (!hook) {
      throw new Error(`Hook not found: ${hookName}`);
    }

    const frameworks = hook.frameworks.join(" and ");
    const uncommittedChanges = gitStatusForHook(hook.slug);

    if (uncommittedChanges) {
      console.log(`\n${hook.name} has uncommitted changes:`);
      console.log(uncommittedChanges);

      const dirtyConfirmation = (await ask(`Continue removing ${hook.name} anyway? [y/N] `)).trim().toLowerCase();

      if (dirtyConfirmation !== "y" && dirtyConfirmation !== "yes") {
        console.log("Removal cancelled.");
        return;
      }
    }

    console.log(`\nYou are about to remove ${hook.name} from ${frameworks}.`);
    const confirmation = (await ask("Continue? [y/N] ")).trim().toLowerCase();

    if (confirmation !== "y" && confirmation !== "yes") {
      console.log("Removal cancelled.");
      return;
    }

    await rm(path.join(hooksDir, hook.slug), { recursive: true, force: false });
    console.log(`✓ Removed ${hook.name}`);

    let updatedExports = false;

    if (hook.frameworks.includes("react")) {
      updatedExports = (await removeExport(reactExportsPath, hook.name, hook.slug, "react")) || updatedExports;
    }

    if (hook.frameworks.includes("vue")) {
      updatedExports = (await removeExport(vueExportsPath, hook.name, hook.slug, "vue")) || updatedExports;
    }

    if (updatedExports) {
      console.log("✓ Updated exports");
    }

    await generateHooksRegistry();
    console.log("✓ Updated registry");

    runHookValidation();

    console.log("\nYou can recover this change with Git before committing.");
  } finally {
    prompts?.close();
  }
}

await main();
