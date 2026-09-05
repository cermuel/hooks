<script setup lang="ts">
import { PACKAGE_MANAGERS } from "~/constants/home";
import { hooks } from "~/utils/hooks";
import type { HookFramework } from "../../../../packages/hooks/src/types/hook";

const defaultInstallCommand = "npm install @cermuel/hooks";
const activePackageManager = ref("npm");
const activeUsageFramework = ref<HookFramework>("react");

const activeInstallCommand = computed(
  () =>
    PACKAGE_MANAGERS.find(
      (manager) => manager.name === activePackageManager.value
    )?.command ?? defaultInstallCommand
);

const activeFrameworks = reactive<Record<string, HookFramework>>(
  Object.fromEntries(
    hooks.map((hook) => [hook.slug, hook.frameworks[0] ?? "react"])
  ) as Record<string, HookFramework>
);

const sidebarSections = [
  { label: "Installation", href: "#installation" },
  { label: "Usage", href: "#usage" },
  { label: "All hooks", href: "#all-hooks" },
];

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
</script>

<template>
  <div class="lg:h-dvh lg:overflow-hidden">
    <UiHooksMobileNavSheet :sections="sidebarSections" :hooks="hooks" />

    <main
      class="mx-auto grid max-w-7xl gap-10 px-4 pb-28 pt-28 lg:mt-24 lg:h-[calc(100dvh-7.5rem)] lg:grid-cols-[16rem_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)] lg:overflow-hidden lg:pb-0 lg:pt-0"
    >
      <aside
        class="hidden min-h-0 overscroll-contain lg:block lg:h-full lg:overflow-y-auto lg:pr-2"
      >
        <nav class="grid gap-8" aria-label="Hooks reference">
          <section>
            <p
              class="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted-foreground"
            >
              Docs
            </p>
            <div class="mt-3 grid gap-1">
              <a
                v-for="section in sidebarSections"
                :key="section.href"
                :href="section.href"
                class="rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {{ section.label }}
              </a>
            </div>
          </section>

          <section>
            <p
              class="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted-foreground"
            >
              Hooks
            </p>
            <div class="mt-3 grid gap-1">
              <a
                v-for="hook in hooks"
                :key="hook.slug"
                :href="`#${hook.slug}`"
                class="rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {{ hook.name }}
              </a>
            </div>
          </section>
        </nav>
      </aside>

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
                Install the package, then import from the React or Vue entry that
                matches your app.
              </p>
            </div>

            <div class="overflow-hidden rounded-2xl border border-border bg-card">
              <div
                class="flex items-center justify-between gap-2 border-b border-border p-2"
              >
                <div class="flex min-w-0">
                  <button
                    v-for="manager in PACKAGE_MANAGERS"
                    :key="manager.name"
                    type="button"
                    :class="[
                      'min-h-8 rounded-2xl px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                      activePackageManager === manager.name
                        ? 'bg-background text-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                    ]"
                    @click="activePackageManager = manager.name"
                  >
                    {{ manager.name }}
                  </button>
                </div>
                <UiCopyButton :value="activeInstallCommand" />
              </div>
              <div class="p-2">
                <AtomCodeBlock :code="`$ ${activeInstallCommand}`" command />
              </div>
            </div>
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
                  :code="usageExamples[activeUsageFramework]"
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
