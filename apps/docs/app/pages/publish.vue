<script setup lang="ts">
const scaffoldTree = `use-clipboard/
├── core.ts
├── react.ts
├── vue.ts
├── meta.ts
├── hook.test.ts
└── examples/
    ├── react.tsx
    └── vue.vue`;

const steps = [
  {
    title: "Fork and clone the repo",
    description: "Fork the repo, clone it locally, and install dependencies.",
    command: "git clone <your-fork-url> && cd hooks && pnpm install",
  },
  {
    title: "Create a branch",
    description: "Create a focused branch for your hook.",
    command: "git checkout -b feat/use-my-hook",
  },
  {
    title: "Run the hook generator",
    description: "",
    command: "pnpm create:hook",
    prompts: [
      { label: "Hook name", value: "useClipboard" },
      { label: "Framework support", value: "React, Vue, or both" },
      { label: "GitHub username", value: "optional" },
    ],
  },
  {
    title: "Let the generator scaffold it",
    description:
      "It checks name availability, and creates everything below. It also updates the package exports and regenerates the docs registry.",
    files: scaffoldTree,
  },
  {
    title: "Implement the hook",
    description: "Steps to implement the hook",
    checklist: [
      {
        item: "Hook name",
        status: "required",
        detail:
          "Use the public API name, like useOnline, useClipboard, or useLocalStorage.",
      },
      {
        item: "Core logic",
        status: "required",
        detail:
          "Write the actual behavior in core.ts when there's logic shared across frameworks.",
      },
      {
        item: "Framework implementation",
        status: "required",
        detail: "Add the hook to react.ts, vue.ts, or both.",
      },
      {
        item: "Usage example",
        status: "required",
        detail:
          "Replace the placeholder with real usage code for each framework you support.",
      },
      {
        item: "Description and Tests",
        status: "",
        detail:
          "Update description and overwrite auto-generated tests if required",
      },
    ],
  },
  {
    title: "Run full check",
    description: "",
    command: "pnpm check",
  },
  {
    title: "Commit and create a PR",
    description: "",
    command: 'git commit -m "feat(clipboard): add useClipboard"',
  },
];

useHead({
  title: "Publish Hook",
  meta: [
    {
      name: "description",
      content: "Learn how to publish a React hook or Vue composable to Hooks.",
    },
  ],
});
</script>

<template>
  <main class="mx-auto max-w-3xl px-4 pb-24 pt-28">
    <section class="border-b border-border pb-10">
      <h1
        class="font-display text-4xl font-semibold leading-tight tracking-normal text-foreground md:text-5xl"
      >
        Publish a hook
      </h1>
      <p class="mt-3 text-pretty text-base leading-7 text-muted-foreground">
        Step by step guide on how to build and publish your own hook
      </p>
    </section>

    <section class="pt-12">
      <ol class="grid gap-10">
        <li
          v-for="(step, index) in steps"
          :key="step.title"
          class="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-5"
        >
          <div class="relative flex justify-center">
            <span
              v-if="index < steps.length - 1"
              class="absolute bottom-[-2.5rem] top-3 w-px bg-border"
              aria-hidden="true"
            />
            <span
              class="relative z-10 mt-1.5 size-2 bg-foreground"
              aria-hidden="true"
            />
          </div>

          <div class="max-w-xl pb-1">
            <p class="text-xs text-muted-foreground">
              {{ String(index + 1).padStart(2, "0") }}
            </p>
            <h2
              class="mt-1 font-display text-xl font-semibold tracking-normal text-foreground"
            >
              {{ step.title }}
            </h2>
            <p class="mt-2 text-sm leading-6 text-muted-foreground">
              {{ step.description }}
            </p>

            <!-- plain command -->
            <div
              v-if="step.command"
              class="mt-3 max-w-md overflow-hidden rounded-lg border border-border bg-background"
            >
              <div
                class="flex items-center justify-between gap-3 border-b border-border px-3 py-1.5"
              >
                <span class="text-xs text-muted-foreground">Run</span>
                <SharedCopyButton :value="step.command" />
              </div>
              <AtomCodeBlock
                :code="`$ ${step.command}`"
                command
                :expandable="false"
                class="rounded-none! border-none! bg-card!"
              />
            </div>

            <div
              v-if="step.prompts"
              class="mt-3 max-w-md overflow-hidden rounded-lg border border-border bg-background font-mono text-xs"
            >
              <div
                class="border-b border-border px-3 py-1.5 text-muted-foreground"
              >
                pnpm create:hook
              </div>
              <div class="grid gap-2 px-3 py-3">
                <div
                  v-for="prompt in step.prompts"
                  :key="prompt.label"
                  class="flex flex-wrap items-baseline gap-x-2"
                >
                  <span class="text-muted-foreground">?</span>
                  <span class="text-foreground/80">{{ prompt.label }}</span>
                  <span class="text-muted-foreground">›</span>
                  <span class="text-foreground">{{ prompt.value }}</span>
                </div>
              </div>
            </div>

            <!-- generated file tree -->
            <pre
              v-if="step.files"
              class="mt-3 max-w-md overflow-x-auto rounded-lg border border-border bg-background p-3 font-mono text-xs leading-6 text-muted-foreground"
            ><code>{{ step.files }}</code></pre>

            <!-- what the hook needs before a PR -->
            <dl v-if="step.checklist" class="mt-3 grid max-w-md gap-4">
              <div v-for="entry in step.checklist" :key="entry.item">
                <dt class="flex items-center justify-between gap-3">
                  <span class="text-sm font-medium text-foreground">{{
                    entry.item
                  }}</span>
                  <span class="text-xs text-muted-foreground">{{
                    entry.status
                  }}</span>
                </dt>
                <dd class="mt-1 text-sm leading-6 text-muted-foreground">
                  {{ entry.detail }}
                </dd>
              </div>
            </dl>
          </div>
        </li>
      </ol>
    </section>
  </main>
</template>
