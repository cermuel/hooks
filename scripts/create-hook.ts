import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import { generateHooksRegistry, readHookMetadata } from "./generate-hooks-registry.ts";
import type { HookFramework, HookMetadata } from "../packages/hooks/src/types/hook";

const rootDir = process.cwd();
const hooksDir = path.join(rootDir, "packages/hooks/src/hooks");
const reactExportsPath = path.join(rootDir, "packages/hooks/src/react.ts");
const vueExportsPath = path.join(rootDir, "packages/hooks/src/vue.ts");
const hookNamePattern = /^use[A-Z][A-Za-z0-9]*$/;
const validFrameworks = ["react", "vue"] satisfies HookFramework[];

function slugFromHookName(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function parseFrameworks(value: string): HookFramework[] {
  if (value.trim() === "") {
    return ["react", "vue"];
  }

  const selected = value
    .split(",")
    .map((framework) => framework.trim().toLowerCase())
    .filter(Boolean);

  if (selected.length === 0 || selected.some((framework) => !validFrameworks.includes(framework as HookFramework))) {
    throw new Error('Frameworks must be "react", "vue", or "react, vue".');
  }

  return [...new Set(selected)] as HookFramework[];
}

async function folderExists(slug: string): Promise<boolean> {
  const entries = await readdir(hooksDir, { withFileTypes: true }).catch(() => []);
  return entries.some((entry) => entry.isDirectory() && entry.name.toLowerCase() === slug.toLowerCase());
}

async function assertAvailable(name: string, slug: string): Promise<void> {
  const metadata = await readHookMetadata();
  const reactExports = await readFile(reactExportsPath, "utf8").catch(() => "");
  const vueExports = await readFile(vueExportsPath, "utf8").catch(() => "");
  const lowerName = name.toLowerCase();
  const lowerSlug = slug.toLowerCase();

  const matchingMetadata = metadata.find(
    (hook) => hook.name.toLowerCase() === lowerName || hook.slug.toLowerCase() === lowerSlug,
  );

  if (matchingMetadata) {
    throw new Error(`${name} already exists at packages/hooks/src/hooks/${matchingMetadata.slug}`);
  }

  if (await folderExists(slug)) {
    throw new Error(`${name} already has a folder at packages/hooks/src/hooks/${slug}`);
  }

  if (reactExports.toLowerCase().includes(name.toLowerCase()) || vueExports.toLowerCase().includes(name.toLowerCase())) {
    throw new Error(`${name} already appears in package exports.`);
  }
}

function metadataTemplate(metadata: HookMetadata): string {
  const author = metadata.author
    ? `,\n  author: {\n    github: "${metadata.author.github}",\n  }`
    : "";

  return `import type { HookMetadata } from "../../types/hook";

export default {
  name: "${metadata.name}",
  slug: "${metadata.slug}",
  description: "",
  frameworks: ${JSON.stringify(metadata.frameworks)},
  addedAt: "${metadata.addedAt}"${author},
} satisfies HookMetadata;
`;
}

function implementationTemplate(name: string, framework: HookFramework): string {
  if (framework === "vue") {
    return `export function ${name}() {
  // TODO: Add Vue implementation.
}
`;
  }

  return `export function ${name}() {
  // TODO: Add React implementation.
}
`;
}

function testTemplate(name: string, slug: string, frameworks: HookFramework[]): string {
  return `import { describe, expect, it } from "vitest";

import metadata from "./meta";

describe("${name}", () => {
  it("has the expected generated configuration", () => {
    expect(metadata).toMatchObject({
      name: "${name}",
      slug: "${slug}",
      frameworks: ${JSON.stringify(frameworks)},
    });
  });
});
`;
}

function readmeTemplate(name: string, frameworks: HookFramework[]): string {
  const reactExample = frameworks.includes("react")
    ? `
## React

\`\`\`tsx
import { ${name} } from "@cermuel/hooks/react";

export function Example() {
  const value = ${name}();

  return <pre>{JSON.stringify(value, null, 2)}</pre>;
}
\`\`\`
`
    : "";
  const vueExample = frameworks.includes("vue")
    ? `
## Vue

\`\`\`vue
<script setup lang="ts">
import { ${name} } from "@cermuel/hooks/vue";

const value = ${name}();
</script>

<template>
  <pre>{{ value }}</pre>
</template>
\`\`\`
`
    : "";

  return `# ${name}

TODO: Describe what this hook does.

## Installation

\`\`\`bash
npm install @cermuel/hooks
\`\`\`
${reactExample}${vueExample}
## API

TODO: Document parameters and return values.
`;
}

async function updateExports(exportPath: string, name: string, slug: string, framework: HookFramework): Promise<void> {
  const source = await readFile(exportPath, "utf8").catch(() => "");
  const exportLine = `export { ${name} } from "./hooks/${slug}/${framework}";`;

  if (source.includes(exportLine)) {
    return;
  }

  const lines = source
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  lines.push(exportLine);
  lines.sort((a, b) => a.localeCompare(b));

  await writeFile(exportPath, `${lines.join("\n")}\n`);
}

async function readScriptedAnswers(): Promise<string[]> {
  let source = "";

  for await (const chunk of input) {
    source += chunk;
  }

  return source.split(/\r?\n/);
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
    const name = (await ask("Hook name: ")).trim();

    if (!hookNamePattern.test(name)) {
      throw new Error('Hook names must begin with "use" and use camelCase.\nExample: useOnline');
    }

    console.log("\nChecking availability...");
    const slug = slugFromHookName(name);
    await assertAvailable(name, slug);
    console.log(`✓ ${name} is available\n`);

    const frameworks = parseFrameworks(await ask("Select frameworks (react, vue) [react, vue]: "));

    const github = (await ask("GitHub username (optional): ")).trim();
    const metadata: HookMetadata = {
      name,
      slug,
      description: "",
      frameworks,
      addedAt: today(),
      ...(github ? { author: { github } } : {}),
    };
    const hookDir = path.join(hooksDir, slug);

    await mkdir(hookDir, { recursive: false });

    for (const framework of frameworks) {
      await writeFile(path.join(hookDir, `${framework}.ts`), implementationTemplate(name, framework));
      console.log(`✓ Created ${framework}.ts`);
    }

    await writeFile(path.join(hookDir, "meta.ts"), metadataTemplate(metadata));
    console.log("✓ Created meta.ts");

    await writeFile(path.join(hookDir, "hook.test.ts"), testTemplate(name, slug, frameworks));
    console.log("✓ Created hook.test.ts");

    await writeFile(path.join(hookDir, "README.md"), readmeTemplate(name, frameworks));
    console.log("✓ Created README.md");

    if (frameworks.includes("react")) {
      await updateExports(reactExportsPath, name, slug, "react");
      console.log("✓ Updated React exports");
    }

    if (frameworks.includes("vue")) {
      await updateExports(vueExportsPath, name, slug, "vue");
      console.log("✓ Updated Vue exports");
    }

    await generateHooksRegistry();
    console.log("✓ Updated hooks registry");

    console.log(`\nHook created at:\npackages/hooks/src/hooks/${slug}`);
    console.log("\nNext:\n1. Add the implementation\n2. Complete the documentation\n3. Run pnpm check");
  } finally {
    prompts?.close();
  }
}

await main();
