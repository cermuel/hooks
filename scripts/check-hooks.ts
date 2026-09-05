import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import type { HookFramework, HookMetadata } from "../packages/hooks/src/types/hook";

const rootDir = process.cwd();
const hooksDir = path.join(rootDir, "packages/hooks/src/hooks");
const registryPath = path.join(rootDir, "generated/hooks.json");
const reactExportsPath = path.join(rootDir, "packages/hooks/src/react.ts");
const vueExportsPath = path.join(rootDir, "packages/hooks/src/vue.ts");
const validFrameworks = ["react", "vue"] satisfies HookFramework[];
const hookNamePattern = /^use[A-Z][A-Za-z0-9]*$/;
type HooksRegistryModule = {
  generateHooksRegistry: () => Promise<string>;
  readHookMetadata: () => Promise<HookMetadata[]>;
};

async function loadHooksRegistryModule(): Promise<HooksRegistryModule> {
  const moduleUrl = pathToFileURL(path.join(rootDir, "scripts/generate-hooks-registry.ts"));

  return (await import(moduleUrl.href)) as HooksRegistryModule;
}

function slugFromHookName(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function isHookMetadata(value: HookMetadata): boolean {
  return (
    typeof value.name === "string" &&
    hookNamePattern.test(value.name) &&
    typeof value.slug === "string" &&
    value.slug.length > 0 &&
    typeof value.description === "string" &&
    value.description.trim().length > 0 &&
    Array.isArray(value.frameworks) &&
    value.frameworks.length > 0 &&
    value.frameworks.every((framework) => validFrameworks.includes(framework)) &&
    typeof value.addedAt === "string" &&
    !Number.isNaN(Date.parse(value.addedAt)) &&
    (value.author === undefined ||
      (typeof value.author.github === "string" && value.author.github.length > 0))
  );
}

async function readOptionalFile(filePath: string): Promise<string | undefined> {
  try {
    return await readFile(filePath, "utf8");
  } catch {
    return undefined;
  }
}

async function main(): Promise<void> {
  const errors: string[] = [];
  const hookDirs = (await readdir(hooksDir, { withFileTypes: true }).catch(() => []))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const { generateHooksRegistry, readHookMetadata } = await loadHooksRegistryModule();
  const metadata = await readHookMetadata();
  const reactExports = await readFile(reactExportsPath, "utf8").catch(() => "");
  const vueExports = await readFile(vueExportsPath, "utf8").catch(() => "");
  const names = new Map<string, string>();
  const slugs = new Map<string, string>();

  if (hookDirs.length === 0) {
    errors.push("No hook folders found in packages/hooks/src/hooks.");
  }

  for (const hook of metadata) {
    if (!isHookMetadata(hook)) {
      errors.push(`${hook.name ?? "Unknown hook"} has invalid metadata.`);
      continue;
    }

    const hookDir = path.join(hooksDir, hook.slug);
    const lowerName = hook.name.toLowerCase();
    const lowerSlug = hook.slug.toLowerCase();

    if (names.has(lowerName)) {
      errors.push(`${hook.name} duplicates ${names.get(lowerName)} by name.`);
    }
    names.set(lowerName, hook.name);

    if (slugs.has(lowerSlug)) {
      errors.push(`${hook.slug} duplicates ${slugs.get(lowerSlug)} by slug.`);
    }
    slugs.set(lowerSlug, hook.slug);

    if (!hookDirs.includes(hook.slug)) {
      errors.push(`${hook.name} metadata slug does not match a hook folder.`);
    }

    if (hook.slug !== slugFromHookName(hook.name)) {
      errors.push(`${hook.name} slug should be ${slugFromHookName(hook.name)}.`);
    }

    if (!(await fileExists(path.join(hookDir, "meta.ts")))) {
      errors.push(`${hook.name} is missing meta.ts.`);
    }

    for (const framework of hook.frameworks) {
      const implementationPath = path.join(hookDir, `${framework}.ts`);
      const examplePath = path.join(
        hookDir,
        "examples",
        framework === "react" ? "react.tsx" : "vue.vue"
      );
      const exportsPath = framework === "react" ? reactExportsPath : vueExportsPath;
      const exportsSource = framework === "react" ? reactExports : vueExports;
      const expectedExport = `export { ${hook.name} } from "./hooks/${hook.slug}/${framework}";`;
      const expectedImport = `import { ${hook.name} } from "@cermuel/hooks/${framework}";`;

      if (!(await fileExists(implementationPath))) {
        errors.push(`${hook.name} declares ${framework} but is missing ${framework}.ts.`);
      }

      const exampleSource = await readOptionalFile(examplePath);

      if (exampleSource === undefined) {
        errors.push(
          `${hook.name} is missing its ${framework === "react" ? "React" : "Vue"} usage example. Expected: ${path.relative(rootDir, examplePath)}.`
        );
      } else {
        if (!exampleSource.includes(expectedImport)) {
          errors.push(`${hook.name} ${framework} example must import from @cermuel/hooks/${framework}.`);
        }

        if (/\bTODO\b/i.test(exampleSource) || /\bresult\b/.test(exampleSource) || /JSON\.stringify/.test(exampleSource)) {
          errors.push(`${hook.name} ${framework} usage still contains placeholder content.`);
        }
      }

      if (!exportsSource.includes(expectedExport)) {
        errors.push(`${hook.name} is missing ${path.relative(rootDir, exportsPath)} export.`);
      }
    }
  }

  for (const hookDir of hookDirs) {
    if (!metadata.some((hook) => hook.slug === hookDir)) {
      errors.push(`${hookDir} has no matching metadata entry.`);
    }
  }

  const previousRegistry = await readFile(registryPath, "utf8").catch(() => "");
  const generatedRegistry = await generateHooksRegistry();

  if (previousRegistry !== generatedRegistry) {
    errors.push("generated/hooks.json was stale and has been regenerated. Run pnpm check:hooks again.");
  }

  if (errors.length > 0) {
    console.error(errors.map((error) => `✗ ${error}`).join("\n"));
    process.exitCode = 1;
    return;
  }

  console.log("✓ Hooks are valid");
}

await main();
