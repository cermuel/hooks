import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { stdin as input, stdout as output } from "node:process";
import readline from "node:readline";
import { createInterface } from "node:readline/promises";

import {
  generateHooksRegistry,
  readHookMetadata,
} from "./generate-hooks-registry.ts";
import type {
  HookFramework,
  HookMetadata,
} from "../packages/hooks/src/types/hook";

const rootDir = process.cwd();
const hooksDir = path.join(rootDir, "packages/hooks/src/hooks");
const reactExportsPath = path.join(rootDir, "packages/hooks/src/react.ts");
const vueExportsPath = path.join(rootDir, "packages/hooks/src/vue.ts");
const hookNamePattern = /^use[A-Z][A-Za-z0-9]*$/;
const validFrameworks = ["react", "vue"] satisfies HookFramework[];
const color = {
  cyan: (value: string) => `\x1b[36m${value}\x1b[0m`,
  dim: (value: string) => `\x1b[2m${value}\x1b[0m`,
  green: (value: string) => `\x1b[32m${value}\x1b[0m`,
};

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

  if (
    selected.length === 0 ||
    selected.some(
      (framework) => !validFrameworks.includes(framework as HookFramework)
    )
  ) {
    throw new Error('Frameworks must be "react", "vue", or "react, vue".');
  }

  return [...new Set(selected)] as HookFramework[];
}

async function folderExists(slug: string): Promise<boolean> {
  const entries = await readdir(hooksDir, { withFileTypes: true }).catch(
    () => []
  );
  return entries.some(
    (entry) =>
      entry.isDirectory() && entry.name.toLowerCase() === slug.toLowerCase()
  );
}

async function getAvailabilityError(
  name: string,
  slug: string
): Promise<string | undefined> {
  const metadata = await readHookMetadata();
  const reactExports = await readFile(reactExportsPath, "utf8").catch(() => "");
  const vueExports = await readFile(vueExportsPath, "utf8").catch(() => "");
  const lowerName = name.toLowerCase();
  const lowerSlug = slug.toLowerCase();

  const matchingMetadata = metadata.find(
    (hook) =>
      hook.name.toLowerCase() === lowerName ||
      hook.slug.toLowerCase() === lowerSlug
  );

  if (matchingMetadata) {
    return `${name} already exists\nLocation: packages/hooks/src/hooks/${matchingMetadata.slug}`;
  }

  if (await folderExists(slug)) {
    return `${name} already has a folder\nLocation: packages/hooks/src/hooks/${slug}`;
  }

  if (
    reactExports.toLowerCase().includes(name.toLowerCase()) ||
    vueExports.toLowerCase().includes(name.toLowerCase())
  ) {
    return `${name} already appears in package exports.`;
  }

  return undefined;
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

function implementationTemplate(
  name: string,
  framework: HookFramework
): string {
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

function testTemplate(
  name: string,
  slug: string,
  frameworks: HookFramework[]
): string {
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

async function updateExports(
  exportPath: string,
  name: string,
  slug: string,
  framework: HookFramework
): Promise<void> {
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

function clearLines(count: number): void {
  if (count > 0) {
    output.write(`\x1b[${count}A\x1b[0J`);
  }
}

async function frameworkCheckbox(): Promise<HookFramework[]> {
  const choices: Array<{ name: string; value: HookFramework }> = [
    { name: "React", value: "react" },
    { name: "Vue", value: "vue" },
  ];
  const selected = new Set<HookFramework>(["react", "vue"]);
  let cursor = 0;
  let renderedLines = 0;

  readline.emitKeypressEvents(input);

  if (input.isTTY) {
    input.setRawMode(true);
  }

  function render(): void {
    clearLines(renderedLines);
    const lines = [
      `${color.cyan("?")} Select frameworks ${color.dim("(Space to toggle, Enter to confirm)")}`,
      ...choices.map((choice, index) => {
        const pointer = index === cursor ? color.cyan("❯") : " ";
        const marker = selected.has(choice.value) ? color.green("◉") : "○";
        return `${pointer} ${marker} ${choice.name}`;
      }),
    ];

    output.write(`${lines.join("\n")}\n`);
    renderedLines = lines.length;
  }

  return new Promise((resolve, reject) => {
    function cleanup(): void {
      input.off("keypress", onKeypress);

      if (input.isTTY) {
        input.setRawMode(false);
      }
    }

    function onKeypress(_: string, key: readline.Key): void {
      if (key.ctrl && key.name === "c") {
        cleanup();
        reject(new Error("Prompt cancelled."));
        return;
      }

      if (key.name === "up") {
        cursor = (cursor - 1 + choices.length) % choices.length;
        render();
        return;
      }

      if (key.name === "down") {
        cursor = (cursor + 1) % choices.length;
        render();
        return;
      }

      if (key.name === "space") {
        const value = choices[cursor]?.value;

        if (!value) {
          return;
        }

        if (selected.has(value) && selected.size > 1) {
          selected.delete(value);
        } else {
          selected.add(value);
        }

        render();
        return;
      }

      if (key.name === "return" || key.name === "enter") {
        cleanup();
        clearLines(renderedLines);
        const frameworks = choices.map((choice) => choice.value).filter((value) => selected.has(value));
        output.write(
          `${color.green("✓")} Select frameworks ${frameworks.map((framework) => framework === "react" ? "React" : "Vue").join(", ")}\n`
        );
        resolve(frameworks);
      }
    }

    input.on("keypress", onKeypress);
    render();
  });
}

async function main(): Promise<void> {
  const scriptedAnswers = input.isTTY ? undefined : await readScriptedAnswers();
  const prompts = input.isTTY ? createInterface({ input, output }) : undefined;
  let answerIndex = 0;

  async function ask(question: string): Promise<string> {
    if (scriptedAnswers) {
      if (answerIndex >= scriptedAnswers.length) {
        throw new Error("No more scripted input available.");
      }

      const answer = scriptedAnswers[answerIndex] ?? "";
      answerIndex += 1;
      output.write(question);
      output.write(`${answer}\n`);
      return answer;
    }

    return prompts?.question(question) ?? "";
  }

  try {
    let name = "";
    let slug = "";

    while (true) {
      name = (await ask("Hook name: ")).trim();

      if (!hookNamePattern.test(name)) {
        console.log('✗ Hook names must begin with "use" and use camelCase.');
        console.log("Example: useOnline\n");
        continue;
      }

      console.log("\nChecking availability...");
      slug = slugFromHookName(name);
      const availabilityError = await getAvailabilityError(name, slug);

      if (availabilityError) {
        console.log(`✗ ${availabilityError}`);
        console.log("Try another hook name.\n");
        continue;
      }

      console.log(`✓ ${name} is available\n`);
      break;
    }

    const frameworks = scriptedAnswers
      ? parseFrameworks(await ask("Select frameworks (react, vue) [react, vue]: "))
      : await frameworkCheckbox();

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
      await writeFile(
        path.join(hookDir, `${framework}.ts`),
        implementationTemplate(name, framework)
      );
      console.log(`✓ Created ${framework}.ts`);
    }

    await writeFile(path.join(hookDir, "meta.ts"), metadataTemplate(metadata));
    console.log("✓ Created meta.ts");

    await writeFile(
      path.join(hookDir, "hook.test.ts"),
      testTemplate(name, slug, frameworks)
    );
    console.log("✓ Created hook.test.ts");

    await writeFile(
      path.join(hookDir, "README.md"),
      readmeTemplate(name, frameworks)
    );
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
    console.log(
      "\nNext:\n1. Add the implementation\n2. Complete the documentation\n3. Run pnpm check"
    );
  } finally {
    prompts?.close();
  }
}

await main();
