import hooksRegistry from "../../../../generated/hooks.json";

import type {
  HookFramework,
  HookMetadata,
} from "../../../../packages/hooks/src/types/hook";

type HookExample = Partial<Record<HookFramework, string>>;
type HookSource = Partial<Record<HookFramework | "core", string>>;

export interface HookParameter {
  name: string;
  type: string;
  default: string | null;
  required: boolean;
}

export interface HookApi {
  parameters: HookParameter[];
  returnType: string;
}

type HookRegistryEntry = HookMetadata & {
  api?: Partial<Record<HookFramework, HookApi>>;
  source?: HookSource;
};

function decodeSource(source: HookSource | undefined): HookSource {
  return Object.fromEntries(
    Object.entries(source ?? {}).map(([framework, code]) => [
      framework,
      atob(code),
    ])
  ) as HookSource;
}

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
  api: Partial<Record<HookFramework, HookApi>>;
  source: HookSource;
};

export const hooks = (hooksRegistry as HookRegistryEntry[]).map((hook) => ({
  ...hook,
  api: hook.api ?? {},
  source: decodeSource(hook.source),
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
