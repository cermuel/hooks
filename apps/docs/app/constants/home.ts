export const PACKAGE_MANAGERS = [
  { name: "npm", command: "npm install @cermuel/hooks" },
  { name: "pnpm", command: "pnpm add @cermuel/hooks" },
  { name: "yarn", command: "yarn add @cermuel/hooks" },
  { name: "bun", command: "bun add @cermuel/hooks" },
];

export const HOOK_CARDS = [
  {
    name: "useOnline",
    description: "Track browser online status with React and Vue adapters.",
    href: "/hooks",
    snippet: `import { useOnline } from "@cermuel/hooks/react";

export function Status() {
  const online = useOnline();

  return online ? "Online" : "Offline";
}`,
  },
];
