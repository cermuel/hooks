export type HookFramework = "react" | "vue";

export interface HookMetadata {
  name: `use${string}`;
  slug: string;
  description: string;
  frameworks: HookFramework[];
  addedAt: string;
  author?: {
    github: string;
  };
}
