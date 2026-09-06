<script setup lang="ts">
import { hooks } from "~/utils/hooks";
import type { HookFramework } from "../../../../../packages/hooks/src/types/hook";

const activeUsageFramework = ref<HookFramework>("react");

const activeFrameworks = reactive<Record<string, HookFramework>>(
  Object.fromEntries(
    hooks.map((hook) => [hook.slug, hook.frameworks[0] ?? "react"])
  ) as Record<string, HookFramework>
);

const usageTabs = [
  { icon: "simple-icons:react", label: "", value: "react" },
  { icon: "simple-icons:vuedotjs", label: "", value: "vue" },
];

const usageExamples: Record<HookFramework, string> = {
  react: `import { useOnline } from "@cermuel/hooks/react";

export function Status() {
  const online = useOnline();

  return online ? "Online" : "Offline";
}`,
  vue: `import { useOnline } from "@cermuel/hooks/vue";

const online = useOnline();`,
};

const activeUsageExample = computed(
  () => usageExamples[activeUsageFramework.value]
);
</script>

<template>
  <div class="lg:h-dvh lg:overflow-hidden">
    <main
      class="mx-auto grid max-w-7xl gap-10 px-4 pb-28 pt-28 lg:mt-24 lg:h-[calc(100dvh-7.5rem)] lg:grid-cols-[16rem_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)] lg:overflow-hidden lg:pb-0 lg:pt-0"
    >
      <UiSidebar />

      <div
        class="min-w-0 overscroll-contain lg:h-full lg:overflow-y-auto lg:pb-14 lg:pr-2"
      >
        <section id="installation" class="scroll-mt-24 sm:pt-12">
          <div
            class="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(24rem,1.1fr)] lg:items-start"
          >
            <div>
              <p
                class="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted-foreground"
              >
                Installation
              </p>
              <h2
                class="mt-3 font-display text-2xl font-semibold tracking-normal text-foreground"
              >
                Add the package once
              </h2>
              <p class="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                Install the package, then import from the React or Vue entry
                that matches your app.
              </p>
            </div>

            <UiInstallationBlock />
          </div>
        </section>

        <section id="usage" class="scroll-mt-24 pt-24 pb-10">
          <div>
            <div class="mb-4">
              <p
                class="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted-foreground"
              >
                Usage
              </p>
              <h2
                class="mt-3 font-display text-2xl font-semibold tracking-normal text-foreground"
              >
                Use the framework-native entry
              </h2>
            </div>
            <article
              class="relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div
                class="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3"
              >
                <h3
                  class="font-display text-[0.95rem] font-semibold tracking-normal text-foreground"
                >
                  useOnline
                </h3>
                <AtomTabs
                  v-model="activeUsageFramework"
                  :items="usageTabs"
                  aria-label="Usage framework"
                  variant="pill"
                  size="xs"
                  class="bg-white! dark:bg-black/70!"
                />
              </div>
              <div class="relative m-2 min-h-0 flex-1">
                <AtomCodeBlock
                  :code="activeUsageExample"
                  class="h-full text-left text-xs leading-6"
                />
              </div>
            </article>
          </div>
        </section>

        <section id="all-hooks" class="scroll-mt-24 pt-14">
          <div>
            <p
              class="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted-foreground"
            >
              All hooks
            </p>
            <h2
              class="mt-2 font-display text-2xl font-semibold tracking-normal text-foreground"
            >
              Every hook in the package
            </h2>
          </div>

          <div
            class="mt-6 grid grid-cols-1 gap-4 [grid-auto-rows:20rem] sm:grid-cols-2 2xl:grid-cols-3"
          >
            <UiHookCard
              v-for="hook in hooks"
              :key="hook.name"
              v-model="activeFrameworks[hook.slug]"
              :hook="hook"
            />
          </div>
        </section>
      </div>
    </main>
  </div>
</template>
