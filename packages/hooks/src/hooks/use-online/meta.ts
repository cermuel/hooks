import type { HookMetadata } from "../../types/hook";

export default {
  name: "useOnline",
  slug: "use-online",
  description: "Track whether the user currently has a network connection.",
  frameworks: ["react", "vue"],
  addedAt: "2026-09-05",
  author: {
    github: "cermuel",
  },
} satisfies HookMetadata;
