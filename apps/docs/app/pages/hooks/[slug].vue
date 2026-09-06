<script setup lang="ts">
import { getHookBySlug, getPrimaryExample, hooks } from "~/utils/hooks";
import type { HookFramework } from "../../../../../packages/hooks/src/types/hook";
import type { TabItem } from "~/components/atom/Tabs.vue";

type HookSourceKey = HookFramework | "core";

const route = useRoute();
const slug = computed(() => String(route.params.slug ?? ""));
const hook = computed(() => getHookBySlug(slug.value));

if (!hook.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Hook not found",
  });
}

const currentHook = computed(() => hook.value!);
const showFrameworkLabels = useMediaQuery("(min-width: 640px)");
const sourceOrder: HookSourceKey[] = ["react", "vue", "core"];

const frameworkTabs = computed<TabItem[]>(() =>
  hook?.value
    ? hook.value?.frameworks.map((framework) => ({
        icon:
          framework === "react"
            ? "simple-icons:react"
            : "simple-icons:vuedotjs",
        label: showFrameworkLabels.value
          ? framework === "react"
            ? "React"
            : "Vue"
          : "",
        value: framework,
      }))
    : []
);

function getSourceLabel(source: HookSourceKey) {
  return (
    {
      core: "Core",
      react: "React",
      vue: "Vue",
    } satisfies Record<HookSourceKey, string>
  )[source];
}

function getSourceIcon(source: HookSourceKey) {
  return (
    {
      core: "lucide:box",
      react: "simple-icons:react",
      vue: "simple-icons:vuedotjs",
    } satisfies Record<HookSourceKey, string>
  )[source];
}

function getSourceKeys(): HookSourceKey[] {
  return sourceOrder.filter((source) => currentHook.value.source[source]);
}

const activeFramework = ref<HookFramework>(
  currentHook.value.frameworks[0] ?? "react"
);
const activeSource = ref<HookSourceKey>(getSourceKeys()[0] ?? "core");
const activeReferenceTab = ref("usage");
const pageUrl = ref("");
const saved = ref(false);
const actionMenuRef = ref<HTMLDivElement | null>(null);
const { copied, copy } = useCopy();
const savedHooksStorageKey = "cermuel-hooks:saved-hooks";

const referenceTabs = [
  { icon: "lucide:book-open", label: "Usage", value: "usage" },
  { icon: "lucide:code-2", label: "Code", value: "code" },
];

const activeApi = computed(() => currentHook.value.api[activeFramework.value]);
const activeParameters = computed(() => activeApi.value?.parameters ?? []);
const activeReturnType = computed(() => activeApi.value?.returnType ?? "");
const activeExample = computed(() =>
  getPrimaryExample(currentHook.value, activeFramework.value)
);
const sourceTabs = computed<TabItem[]>(() =>
  getSourceKeys().map((source) => ({
    icon: getSourceIcon(source),
    label: showFrameworkLabels.value ? getSourceLabel(source) : "",
    value: source,
  }))
);
const activeSourceKey = computed(() => {
  const sourceKeys = getSourceKeys();

  return sourceKeys.includes(activeSource.value)
    ? activeSource.value
    : (sourceKeys[0] ?? "core");
});
const activeSourceCode = computed(
  () => currentHook.value.source[activeSourceKey.value] ?? ""
);
const activeSourcePath = computed(
  () => `/hooks/${currentHook.value.name}/${activeSourceKey.value}`
);
const publisherGithub = computed(() => currentHook.value.author?.github ?? "");
const publisherHooks = computed(() =>
  publisherGithub.value
    ? hooks.filter(
        (hookItem) => hookItem.author?.github === publisherGithub.value
      )
    : []
);
const moreFromPublisher = computed(() =>
  publisherHooks.value
    .filter((hookItem) => hookItem.slug !== currentHook.value.slug)
    .slice(0, 3)
);

async function copyShareUrl() {
  await copy(pageUrl.value || window.location.href);
}

function readSavedHooks(): string[] {
  try {
    return JSON.parse(localStorage.getItem(savedHooksStorageKey) ?? "[]");
  } catch {
    return [];
  }
}

function saveHook() {
  const savedHooks = new Set(readSavedHooks());
  savedHooks.add(currentHook.value.slug);
  localStorage.setItem(savedHooksStorageKey, JSON.stringify([...savedHooks]));
  saved.value = true;
}

function copyShareUrlFromMenu(close: () => void) {
  void copyShareUrl();
  close();
}

function saveHookFromMenu(close: () => void) {
  saveHook();
  close();
}

function handleActionKeydown(event: KeyboardEvent) {
  if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
    return;
  }

  const items = Array.from(
    actionMenuRef.value?.querySelectorAll<HTMLButtonElement>("button") ?? []
  );

  if (!items.length) {
    return;
  }

  event.preventDefault();
  const currentIndex = items.indexOf(
    document.activeElement as HTMLButtonElement
  );

  if (event.key === "Home") {
    items[0]?.focus();
    return;
  }

  if (event.key === "End") {
    items.at(-1)?.focus();
    return;
  }

  const nextIndex =
    event.key === "ArrowDown"
      ? (currentIndex + 1) % items.length
      : (currentIndex - 1 + items.length) % items.length;

  items[nextIndex]?.focus();
}

onMounted(() => {
  pageUrl.value = window.location.href;
  saved.value = readSavedHooks().includes(currentHook.value.slug);
});

useHead(() => ({
  title: `${currentHook.value.name} - Hooks`,
  meta: [
    {
      name: "description",
      content: currentHook.value.description,
    },
  ],
}));
</script>

<template>
  <div class="lg:h-dvh lg:overflow-hidden">
    <main
      class="mx-auto grid max-w-7xl gap-10 px-4 pb-28 pt-28 lg:mt-24 lg:h-[calc(100dvh-7.5rem)] lg:grid-cols-[16rem_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)] lg:overflow-hidden lg:pb-0 lg:pt-0 xl:grid-cols-[14rem_minmax(0,1fr)_14rem]"
    >
      <UiSidebar />
      <div
        class="min-w-0 overscroll-contain lg:h-full lg:overflow-y-auto lg:pb-14 lg:pr-2"
      >
        <div class="">
          <div class="flex items-center justify-between gap-4">
            <div class="flex min-w-0 items-center gap-1.5">
              <NuxtLink
                class="cursor-pointer text-sm text-muted-foreground hover:underline"
                href="/hooks"
              >
                Hooks
              </NuxtLink>
              <Icon
                name="lucide:chevron-right"
                class="size-3.5 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <p class="truncate text-sm font-medium text-foreground">
                {{ currentHook.name }}
              </p>
            </div>

            <AtomPopover
              v-if="publisherGithub"
              side="bottom"
              align="end"
              label="Publisher details"
              trigger-label="Publisher"
              trigger-class="inline-flex h-8 shrink-0 items-center justify-center rounded-full border border-border bg-card/60 px-3 text-xs font-medium text-foreground outline-none transition-colors hover:border-border-strong hover:bg-card focus-visible:ring-2 focus-visible:ring-ring xl:hidden"
              content-class="w-[min(20rem,calc(100vw-2rem))] rounded-xl p-4"
            >
              <p
                class="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted-foreground"
              >
                Publisher
              </p>

              <NuxtLink
                :href="`https://github.com/${publisherGithub}`"
                target="_blank"
                rel="noreferrer"
                class="mt-3 flex min-w-0 items-center gap-2 rounded-md text-sm font-medium text-foreground outline-none transition-colors hover:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Icon
                  name="lucide:github"
                  class="size-4 shrink-0"
                  aria-hidden="true"
                />
                <span class="truncate">{{ publisherGithub }}</span>
              </NuxtLink>

              <p class="mt-3 text-sm text-muted-foreground">
                {{ publisherHooks.length }}
                {{ publisherHooks.length === 1 ? "hook" : "hooks" }}
                published
              </p>

              <div class="mt-6">
                <p class="text-sm font-semibold text-foreground">
                  More from this publisher
                </p>
                <div v-if="moreFromPublisher.length" class="mt-2 grid gap-1">
                  <NuxtLink
                    v-for="hookItem in moreFromPublisher"
                    :key="hookItem.slug"
                    :href="`/hooks/${hookItem.slug}`"
                    class="rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {{ hookItem.name }}
                  </NuxtLink>
                </div>
                <p v-else class="mt-2 text-sm leading-6 text-muted-foreground">
                  No other hooks yet.
                </p>
              </div>
            </AtomPopover>
          </div>
          <div class="mt-6 flex gap-4 items-start justify-between">
            <div class="min-w-0">
              <h2
                class="font-display text-2xl max-sm:w-60 truncate sm:text-3xl font-semibold tracking-normal text-foreground"
              >
                {{ currentHook.name }}
              </h2>
            </div>

            <div
              class="inline-flex w-max rounded-full bg-muted/70 max-sm:scale-90"
            >
              <button
                type="button"
                class="inline-flex min-h-10 items-center shrink-0 gap-2 rounded-l-full px-3 text-sm font-medium text-foreground outline-none transition-colors hover:bg-muted focus-visible:relative focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-wait sm:min-h-8 sm:px-2.5 sm:text-xs"
                :aria-label="copied ? 'Page link copied' : 'Copy page link'"
                @click="copyShareUrl"
              >
                <Icon
                  :name="copied ? 'lucide:check' : 'lucide:copy'"
                  class="size-3.5"
                  :class="copied ? 'text-success' : ''"
                  aria-hidden="true"
                />
                <span>{{ copied ? "Copied" : "Copy Link" }}</span>
              </button>
              <span class="my-2 w-px bg-border" aria-hidden="true" />
              <AtomPopover
                side="bottom"
                align="end"
                label="Page actions"
                trigger-label="More page actions"
                trigger-class="inline-flex min-h-10 w-10 items-center justify-center rounded-r-full text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:relative focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring sm:min-h-8 sm:w-8"
                content-class="min-w-50! p-1! rounded-xl bg-background!"
              >
                <template #trigger="{ open }">
                  <Icon
                    name="lucide:chevron-down"
                    class="size-3.5 text-muted-foreground transition-transform"
                    :class="open ? 'rotate-180' : ''"
                    aria-hidden="true"
                  />
                </template>

                <template #default="{ close }">
                  <div
                    ref="actionMenuRef"
                    role="menu"
                    aria-label="Page actions"
                    class="grid gap-1"
                    @keydown="handleActionKeydown"
                  >
                    <button
                      type="button"
                      role="menuitem"
                      class="flex min-h-9 w-full items-center gap-2 rounded-lg p-2 text-left text-sm text-foreground outline-none transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                      @click="copyShareUrlFromMenu(close)"
                    >
                      <Icon
                        :name="copied ? 'lucide:check' : 'lucide:copy'"
                        class="size-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      Copy page link
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      class="flex min-h-9 w-full items-center gap-2 rounded-lg p-2 text-left text-sm text-foreground outline-none transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                      @click="saveHookFromMenu(close)"
                    >
                      <Icon
                        :name="
                          saved ? 'lucide:bookmark-check' : 'lucide:bookmark'
                        "
                        class="size-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      {{ saved ? "Saved hook" : "Save hook" }}
                    </button>
                  </div>
                </template>
              </AtomPopover>
            </div>
          </div>
          <p
            v-if="currentHook?.description"
            class="mt-3 sm:mt-1 w-full max-w-md text-sm leading-6 text-muted-foreground"
          >
            {{ currentHook.description }}
          </p>
        </div>
        <div class="h-px w-full bg-muted my-10" />
        <div class="">
          <AtomTabs v-model="activeReferenceTab" :items="referenceTabs" />

          <div
            v-if="activeReferenceTab === 'usage'"
            class="overflow-hidden rounded-2xl border border-border bg-card/50 mt-3"
          >
            <div class="flex items-center gap-2 border-b border-border p-2">
              <div class="flex min-w-0 items-center gap-2 text-[13px] px-4">
                <Icon
                  name="hugeicons:file-code"
                  class="size-4! text-muted-foreground"
                  aria-hidden="true"
                />
                {{ hook?.name }}.{{
                  activeFramework == "react" ? "tsx" : "vue"
                }}
              </div>
              <AtomTabs
                v-if="hook && hook?.frameworks?.length > 1"
                v-model="activeFramework"
                :items="frameworkTabs"
                aria-label="Usage framework"
                variant="pill"
                size="xs"
                class="bg-primary/5 dark:bg-black/70! ml-auto"
              />
              <SharedCopyButton
                :value="activeExample"
                label=""
                copied-label=""
                class="h-8!"
              />
            </div>

            <div v-if="activeExample" class="relative min-h-0">
              <AtomCodeBlock
                :code="activeExample"
                :class="'rounded-t-none! bg-card! border-none!'"
                expandable
              />
            </div>
            <p
              v-else
              class="px-4 py-12 text-center text-sm text-muted-foreground"
            >
              No usage example has been added for this hook yet.
            </p>
          </div>

          <div
            v-else-if="activeReferenceTab === 'code'"
            class="overflow-hidden rounded-2xl border border-border bg-card/50 mt-3"
          >
            <div class="flex items-center gap-2 border-b border-border p-2">
              <div
                class="flex min-w-0 items-center gap-2 px-4 text-[13px] text-muted-foreground"
              >
                <Icon
                  name="hugeicons:file-code"
                  class="size-4! shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <span class="truncate font-mono">{{ activeSourcePath }}</span>
              </div>
              <AtomTabs
                v-if="sourceTabs.length > 1"
                v-model="activeSource"
                :items="sourceTabs"
                aria-label="Source file"
                variant="pill"
                size="xs"
                class="ml-auto bg-primary/5 dark:bg-black/70!"
              />
            </div>

            <div v-if="activeSourceCode" class="relative min-h-0">
              <AtomCodeBlock
                :code="activeSourceCode"
                :class="'rounded-t-none! bg-card! border-none!'"
                expandable
              />
            </div>
            <p
              v-else
              class="px-4 py-12 text-center text-sm text-muted-foreground"
            >
              No source code has been added for this hook yet.
            </p>
          </div>
        </div>
        <div class="h-px w-full bg-muted my-10" />

        <div class="">
          <div class="mt-4">
            <div class="flex items-center justify-between">
              <p class="font-semibold text-sm">Props</p>
              <AtomTabs
                v-if="hook && hook?.frameworks?.length > 1"
                v-model="activeFramework"
                :items="frameworkTabs"
                aria-label="Example framework"
                variant="pill"
                size="xs"
                class="bg-black/7! dark:bg-black/70! ml-auto max-h-38"
              />
            </div>
            <div
              class="overflow-hidden rounded-[10px] border border-muted mt-2"
            >
              <div class="grid grid-cols-5 items-center py-2 bg-muted/70">
                <div
                  class="col-span-2 flex w-full items-center justify-start px-4 text-[13px] font-semibold text-foreground/80"
                >
                  Param
                </div>
                <div
                  class="flex w-full items-center justify-center px-4 text-[13px] font-semibold text-foreground/80"
                >
                  Type
                </div>
                <div
                  class="col-span-2 flex w-full items-center justify-end px-4 text-[13px] font-semibold text-foreground/80"
                >
                  Default Value
                </div>
              </div>
              <div>
                <template v-if="activeParameters.length">
                  <div
                    v-for="(param, index) in activeParameters"
                    :key="index"
                    class="grid grid-cols-5 items-center py-2"
                  >
                    <div
                      class="col-span-2 flex w-full items-center justify-start px-4"
                    >
                      <code
                        class="block w-max max-w-full rounded-md bg-muted px-2 py-1 font-mono text-xs text-foreground"
                      >
                        {{ param.name }}{{ !param.required ? "?" : "" }}
                      </code>
                    </div>
                    <div class="flex w-full items-center justify-center px-4">
                      <code
                        class="block rounded-md bg-muted px-2 py-1 font-mono shrink-0 text-xs text-foreground"
                      >
                        {{ param.type }}
                      </code>
                    </div>
                    <div
                      class="col-span-2 flex w-full items-center justify-end px-4"
                    >
                      <code
                        v-if="param.default"
                        class="block w-max max-w-full rounded-md bg-muted px-2 py-1 font-mono text-xs text-foreground"
                      >
                        {{ param.default }}
                      </code>
                    </div>
                  </div>
                </template>
                <div v-else>
                  <p
                    class="px-3 py-10 text-center text-sm text-muted-foreground"
                  >
                    No props for this hook
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-6">
            <p class="font-semibold text-sm">Returns</p>
            <div class="mt-2">
              <div
                v-if="activeReturnType"
                class="rounded-[10px] border border-muted bg-card/40 p-1"
              >
                <AtomCodeBlock
                  :code="activeReturnType"
                  :class="'rounded-t-none! bg-transparent! border-none!'"
                  expandable
                />
              </div>
              <div v-else>
                <p
                  class="rounded-[10px] border border-muted px-3 py-10 text-center text-sm text-muted-foreground"
                >
                  This hook doesn't return anything
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside
        class="hidden min-h-0 overscroll-contain xl:block xl:h-full xl:overflow-y-auto xl:pb-14"
      >
        <div
          v-if="publisherGithub"
          class="rounded-xl border border-border bg-card/40 p-4"
        >
          <p
            class="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted-foreground"
          >
            Publisher
          </p>

          <NuxtLink
            :href="`https://github.com/${publisherGithub}`"
            target="_blank"
            rel="noreferrer"
            class="mt-3 flex min-w-0 items-center gap-2 rounded-md text-sm font-medium text-foreground outline-none transition-colors hover:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Icon
              name="lucide:github"
              class="size-4 shrink-0"
              aria-hidden="true"
            />
            <span class="truncate">{{ publisherGithub }}</span>
          </NuxtLink>

          <p class="mt-3 text-sm text-muted-foreground">
            {{ publisherHooks.length }}
            {{ publisherHooks.length === 1 ? "hook" : "hooks" }} published
          </p>

          <div class="mt-6">
            <p class="text-sm font-semibold text-foreground">
              More from this publisher
            </p>
            <div v-if="moreFromPublisher.length" class="mt-2 grid gap-1">
              <NuxtLink
                v-for="hookItem in moreFromPublisher"
                :key="hookItem.slug"
                :href="`/hooks/${hookItem.slug}`"
                class="rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {{ hookItem.name }}
              </NuxtLink>
            </div>
            <p v-else class="mt-2 text-sm leading-6 text-muted-foreground">
              No other hooks yet.
            </p>
          </div>
        </div>
      </aside>
    </main>
  </div>
</template>
