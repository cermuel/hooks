import { existsSync } from "node:fs";
import { access, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import type { HookMetadata } from "../packages/hooks/src/types/hook";
import { extractHookApi, type HookApi } from "./utils/extract-hook-api.ts";

const rootDir = process.cwd();
const hooksDir = path.join(rootDir, "packages/hooks/src/hooks");
const registryPath = path.join(rootDir, "generated/hooks.json");

type FrameworkApi = Partial<Record<"react" | "vue", HookApi>>;
type FrameworkSource = Partial<Record<"react" | "vue" | "core", string>>;

type HookRegistryEntry = HookMetadata & {
  api: FrameworkApi;
  source: FrameworkSource;
};

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function readHookMetadata(): Promise<HookMetadata[]> {
  const entries = await readdir(hooksDir, { withFileTypes: true }).catch(() => []);
  const metadata: HookMetadata[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const metaPath = path.join(hooksDir, entry.name, "meta.ts");

    if (!(await fileExists(metaPath))) {
      continue;
    }

    const metaUrl = pathToFileURL(metaPath);
    const imported = (await import(metaUrl.href)) as { default: HookMetadata };

    metadata.push(imported.default);
  }

  return [...metadata].sort((a, b) => a.name.localeCompare(b.name));
}

function extractFrameworkApis(hookDirectory: string, hookName: string) {
  const api: FrameworkApi = {};
  const reactPath = path.join(hookDirectory, "react.ts");
  const vuePath = path.join(hookDirectory, "vue.ts");

  if (fileExistsSync(reactPath)) {
    api.react = extractHookApi(reactPath, hookName);
  }

  if (fileExistsSync(vuePath)) {
    api.vue = extractHookApi(vuePath, hookName);
  }

  return api;
}

function fileExistsSync(filePath: string): boolean {
  return existsSync(filePath);
}

async function readSourceFiles(hookDirectory: string) {
  const entries: FrameworkSource = {};
  const files = {
    core: path.join(hookDirectory, "core.ts"),
    react: path.join(hookDirectory, "react.ts"),
    vue: path.join(hookDirectory, "vue.ts"),
  } satisfies Record<keyof FrameworkSource, string>;

  for (const [framework, filePath] of Object.entries(files) as Array<
    [keyof FrameworkSource, string]
  >) {
    if (await fileExists(filePath)) {
      entries[framework] = Buffer.from(await readFile(filePath, "utf8")).toString(
        "base64",
      );
    }
  }

  return entries;
}

export async function generateHooksRegistry(): Promise<string> {
  const metadata = await readHookMetadata();
  const registry: HookRegistryEntry[] = [];

  for (const hook of metadata) {
    const hookDirectory = path.join(hooksDir, hook.slug);

    registry.push({
      ...hook,
      api: extractFrameworkApis(hookDirectory, hook.name),
      source: await readSourceFiles(hookDirectory),
    });
  }

  const output = `${JSON.stringify(registry, null, 2)}\n`;

  await mkdir(path.dirname(registryPath), { recursive: true });
  await writeFile(registryPath, output);

  return output;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  await generateHooksRegistry();
  console.log(`Generated ${path.relative(rootDir, registryPath)}`);
}
