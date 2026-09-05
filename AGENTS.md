# AGENTS.md

## Project Overview

Hooks is an open-source collection of practical, type-safe hooks and composables for everyday frontend development.

This repository contains:

- A Nuxt documentation website
- One distributable npm package
- Shared framework-independent TypeScript utilities
- React hooks
- Vue composables

## Technology

- pnpm workspaces
- Nuxt
- Vue 3
- React
- TypeScript
- Tailwind CSS
- Vitest

Do not add a state-management library unless the requested feature genuinely requires one.

## Repository Structure

- `apps/docs` contains the Nuxt website and documentation.
- `packages/hooks/src/core` contains framework-independent behaviour.
- `packages/hooks/src/react` contains React hooks.
- `packages/hooks/src/vue` contains Vue composables.

The package is published as `@cermuel/hooks`.

## Architecture

Keep framework-independent behaviour inside `packages/hooks/src/core` whenever practical.

React and Vue integrations should be thin adapters around shared behaviour.

Do not force identical implementations across frameworks when their reactive models differ. APIs should feel native to their respective frameworks.

TanStack Start uses the React implementation. Do not create a separate TanStack adapter unless functionality specifically integrates with a TanStack library.

## Development Rules

- Use TypeScript.
- Keep implementations focused and dependency-light.
- Avoid unnecessary abstractions.
- Do not add a dependency when the platform API is sufficient.
- Never access browser APIs during server rendering without a runtime guard.
- Clean up event listeners, observers, subscriptions and timers.
- Preserve consistent behaviour between React and Vue.
- Keep public APIs predictable and fully typed.
- Do not make unrelated changes.
- Inspect existing patterns before creating new files.

## Website Rules

- Use Nuxt and Vue for the documentation website.
- Use Tailwind CSS for styling.
- Source colours, borders, backgrounds and radii from the global CSS tokens.
- Support light and dark modes.
- Keep components and pages below 200 lines when practical.
- Put shared components in `apps/docs/app/components/shared`.
- Put layout components in `apps/docs/app/components/layout`.
- Reuse existing atom components from `apps/docs/app/components/atom` for buttons, inputs, tabs, pills, popovers and tooltips before hand-rolling equivalent UI.
- Put reusable types in a `types` directory.
- Put general helpers in `utils`.
- Do not add Pinia unless application state becomes complex enough to require it.

## Design Direction

- Keep the interface minimal and readable.
- Use restrained animations and micro-interactions.
- Avoid unnecessary gradients, excessive shadows and visual noise.
- Use semantic theme tokens instead of hardcoded theme colours.
- Ensure keyboard accessibility and visible focus states.
- Respect reduced-motion preferences.

## Hook Requirements

Every public hook or composable must include:

- TypeScript types
- SSR-safe behaviour where relevant
- Cleanup logic where relevant
- Unit tests
- Documentation
- A usage example
- React and Vue implementations where applicable

## Naming

React hooks and Vue composables use the `use` prefix:

```ts
useCopyToClipboard;
useOnline;
useLocalStorage;
```

Framework-independent helper functions should not use `use` unless they are reactive APIs.

## Validation

Before completing a change, run:

```bash
pnpm check
```

Do not claim a change works if the required checks fail.

## Commits

Use Conventional Commits:

```text
feat(clipboard): add copy to clipboard
fix(storage): guard browser APIs during SSR
docs: update installation guide
test(network): cover connection changes
style: add global theme tokens
chore: update dependencies
ci: add project checks
```

Keep commits focused and do not combine unrelated changes.
