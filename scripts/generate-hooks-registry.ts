import { access, mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import type { HookMetadata } from "../packages/hooks/src/types/hook";

const rootDir = process.cwd();
const hooksDir = path.join(rootDir, "packages/hooks/src/hooks");
const registryPath = path.join(rootDir, "generated/hooks.json");

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

export async function generateHooksRegistry(): Promise<string> {
  const metadata = await readHookMetadata();
  const output = `${JSON.stringify(metadata, null, 2)}\n`;

  await mkdir(path.dirname(registryPath), { recursive: true });
  await writeFile(registryPath, output);

  return output;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  await generateHooksRegistry();
  console.log(`Generated ${path.relative(rootDir, registryPath)}`);
}
