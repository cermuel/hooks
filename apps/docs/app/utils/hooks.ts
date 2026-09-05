import hooksRegistry from "../../../../generated/hooks.json";

import type {
  HookFramework,
  HookMetadata,
} from "../../../../packages/hooks/src/types/hook";

type HookExample = Partial<Record<HookFramework, string>>;

const exampleModules = import.meta.glob<string>(
  "../../../../packages/hooks/src/hooks/*/examples/*.{tsx,vue}",
  {
    eager: true,
    query: "?raw",
    import: "default",
  }
);

function getExampleKey(filePath: string) {
  const match = filePath.match(
    /hooks\/([^/]+)\/examples\/(react|vue)\.(tsx|vue)$/
  );

  if (!match) {
    return undefined;
  }

  return {
    slug: match[1] ?? "",
    framework: match[2] as HookFramework,
  };
}

const examplesBySlug = Object.entries(exampleModules).reduce<
  Record<string, HookExample>
>((examples, [filePath, source]) => {
  const key = getExampleKey(filePath);

  if (key) {
    examples[key.slug] = {
      ...examples[key.slug],
      [key.framework]: source,
    };
  }

  return examples;
}, {});

export type DocsHook = HookMetadata & {
  examples: HookExample;
};

export const hooks = (hooksRegistry as HookMetadata[]).map((hook) => ({
  ...hook,
  examples: examplesBySlug[hook.slug] ?? {},
})) satisfies DocsHook[];

export function getHookBySlug(slug: string): DocsHook | undefined {
  return hooks.find((hook) => hook.slug === slug);
}

export function getPrimaryExample(
  hook: DocsHook,
  key?: "react" | "vue"
): string {
  if (key) return hook.examples[key] ?? "";
  return hook.examples.react ?? hook.examples.vue ?? "";
}
