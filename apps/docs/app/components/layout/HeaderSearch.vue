<script setup lang="ts">
import type { ComponentPublicInstance } from "vue";

import { hooks } from "~/utils/hooks";

type SearchItem = {
  title: string;
  frameworks: string[];
  to: string;
  keywords: string[];
};

const open = ref(false);
const panelOpen = ref(false);
const query = ref("");
const activeIndex = ref(0);
const trigger = ref<HTMLButtonElement | null>(null);
const input = ref<HTMLInputElement | null>(null);
const resultsList = ref<HTMLElement | null>(null);
const resultRefs = ref<HTMLButtonElement[]>([]);
const resultIndicator = ref({
  top: 0,
  left: 0,
  width: 0,
  height: 0,
});
let closeTimer: ReturnType<typeof setTimeout> | undefined;
const listId = `header-search-list-${useId()}`;

const searchItems = computed<SearchItem[]>(() => [
  ...hooks.map((hook) => ({
    title: hook.name,
    frameworks: hook.frameworks,
    to: `/hooks/${hook.slug}`,
    keywords: [
      hook.slug,
      ...hook.frameworks,
      hook.description,
      hook.author?.github,
    ].filter((keyword): keyword is string => Boolean(keyword)),
  })),
]);

const filteredItems = computed(() => {
  const term = query.value.trim().toLowerCase();

  if (!term) {
    return searchItems.value;
  }

  return searchItems.value.filter((item) =>
    [item.title, item.to, ...item.keywords]
      .join(" ")
      .toLowerCase()
      .includes(term)
  );
});

const resultIndicatorStyle = computed(() => ({
  width: `${resultIndicator.value.width}px`,
  height: `${resultIndicator.value.height}px`,
  transform: `translate(${resultIndicator.value.left}px, ${resultIndicator.value.top}px)`,
}));

function setResultRef(
  element: Element | ComponentPublicInstance | null,
  index: number
) {
  if (element instanceof HTMLButtonElement) {
    resultRefs.value[index] = element;
  }
}

function scrollActiveResultIntoView() {
  resultRefs.value[activeIndex.value]?.scrollIntoView({
    block: "nearest",
    behavior: "smooth",
  });
}

async function updateResultIndicator() {
  await nextTick();

  const activeResult = resultRefs.value[activeIndex.value];

  if (!resultsList.value || !activeResult) {
    resultIndicator.value = { top: 0, left: 0, width: 0, height: 0 };
    return;
  }

  resultIndicator.value = {
    top: activeResult.offsetTop,
    left: activeResult.offsetLeft,
    width: activeResult.offsetWidth,
    height: activeResult.offsetHeight,
  };
}

watch(filteredItems, () => {
  activeIndex.value = 0;
  resultRefs.value = [];
  resultsList.value?.scrollTo({ top: 0, behavior: "smooth" });
  void updateResultIndicator();
});

watch(activeIndex, () => {
  void updateResultIndicator();
});

watch(open, async (isOpen) => {
  if (isOpen) {
    await nextTick();
    input.value?.focus();
    void updateResultIndicator();
    return;
  }

  query.value = "";
});

function openSearch() {
  if (closeTimer) {
    clearTimeout(closeTimer);
  }

  open.value = true;
  panelOpen.value = true;
}

function closeSearch({ restoreFocus = true } = {}) {
  panelOpen.value = false;

  if (closeTimer) {
    clearTimeout(closeTimer);
  }

  closeTimer = setTimeout(() => {
    open.value = false;
    closeTimer = undefined;
  }, 180);

  if (restoreFocus) {
    trigger.value?.focus();
  }
}

function selectItem(item = filteredItems.value[activeIndex.value]) {
  if (!item) {
    return;
  }

  console.log("Header search selection:", item);
  closeSearch({ restoreFocus: false });
}

function onKeydown(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    openSearch();
  }

  if (!open.value && event.key === "/") {
    const target = event.target as HTMLElement | null;

    if (!target?.closest("input, textarea, select, [contenteditable='true']")) {
      event.preventDefault();
      openSearch();
    }
  }
}

function onPanelKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    closeSearch();
    return;
  }

  if (!filteredItems.value.length) {
    return;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    activeIndex.value = (activeIndex.value + 1) % filteredItems.value.length;
    void nextTick(scrollActiveResultIntoView);
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    activeIndex.value =
      (activeIndex.value - 1 + filteredItems.value.length) %
      filteredItems.value.length;
    void nextTick(scrollActiveResultIntoView);
  }

  if (event.key === "Enter") {
    event.preventDefault();
    void selectItem();
  }
}

onMounted(() => {
  document.addEventListener("keydown", onKeydown);
  window.addEventListener("resize", updateResultIndicator);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", onKeydown);
  window.removeEventListener("resize", updateResultIndicator);

  if (closeTimer) {
    clearTimeout(closeTimer);
  }
});
</script>

<template>
  <div ref="root" class="relative flex">
    <button
      ref="trigger"
      type="button"
      :aria-expanded="open"
      aria-haspopup="dialog"
      class="group inline-flex h-9 w-9 items-center justify-center gap-2 rounded-full border border-border bg-card/60 px-0 text-sm font-medium text-muted-foreground shadow-sm outline-none transition-[width,background-color,border-color,box-shadow,color,transform] duration-300 ease-out hover:border-border-strong hover:bg-card hover:text-foreground active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background md:w-55 md:justify-start md:px-3.5"
      @click="openSearch"
    >
      <Icon name="lucide:search" class="size-4 shrink-0" aria-hidden="true" />
      <span class="hidden min-w-0 flex-1 text-left md:block">
        Search hooks
      </span>
      <span
        class="hidden rounded-md border border-background bg-background/80 px-1.5 py-1 text-[0.65rem] leading-none text-foreground md:inline-flex"
      >
        ⌘K
      </span>
    </button>

    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300 ease-out"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-200 ease-out"
        leave-to-class="opacity-0"
      >
        <div
          v-if="open"
          class="fixed inset-0 z-50 bg-background/25 backdrop-blur-[2px]"
          @pointerdown.self="closeSearch()"
        >
          <Transition
            enter-active-class="transition-[opacity,transform] duration-300 ease-out"
            enter-from-class="translate-y-2 scale-[0.98] opacity-0"
            leave-active-class="transition-[opacity,transform] duration-180 ease-out"
            leave-to-class="translate-y-1 scale-[0.99] opacity-0"
          >
            <section
              v-if="panelOpen"
              role="dialog"
              aria-label="Search documentation"
              class="mx-auto mt-20 w-[calc(100%-2rem)] max-w-xl overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-xl"
              @keydown="onPanelKeydown"
            >
              <div
                class="flex items-center gap-3 border-b border-border px-4 py-2"
              >
                <Icon
                  name="lucide:search"
                  class="size-3.5 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  ref="input"
                  v-model="query"
                  type="search"
                  aria-label="Search hooks"
                  :aria-controls="listId"
                  :aria-activedescendant="
                    filteredItems.length
                      ? `${listId}-${activeIndex}`
                      : undefined
                  "
                  autocomplete="off"
                  placeholder="Search hooks and docs"
                  class="h-4.5 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
                />
                <button
                  type="button"
                  class="hidden rounded-md border-background bg-background/80 px-1.5 py-1.5 text-[0.65rem] font-medium leading-none text-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 sm:inline-flex"
                  @click="() => closeSearch()"
                >
                  ESC
                </button>
              </div>

              <div
                :id="listId"
                ref="resultsList"
                role="listbox"
                aria-label="Search results"
                class="relative max-h-[80dvh] overflow-y-auto p-2"
              >
                <span
                  class="pointer-events-none absolute left-0 top-0 rounded-lg bg-primary/5 transition-[transform,width,height,opacity] duration-300 ease-out"
                  :style="resultIndicatorStyle"
                  aria-hidden="true"
                />
                <button
                  v-for="(item, index) in filteredItems"
                  :id="`${listId}-${index}`"
                  :key="item.to"
                  :ref="(element) => setResultRef(element, index)"
                  type="button"
                  role="option"
                  :aria-selected="index === activeIndex"
                  class="relative z-10 flex w-full items-center gap-3 px-3 py-2 text-left outline-none transition-[color,transform] duration-150 ease-out"
                  @mouseenter="activeIndex = index"
                  @click="selectItem(item)"
                >
                  <SharedShipIcon
                    :size="16"
                    class="size-4 shrink-0 text-primary/70"
                  />
                  <span class="min-w-0">
                    <span class="block text-sm">{{ item.title }}</span>
                  </span>
                  <div class="ml-auto flex items-center gap-1">
                    <div
                      v-for="framework in item.frameworks"
                      :key="framework"
                      class="hidden rounded-md border-background bg-background/80 px-1.5 py-1.5 text-[0.65rem] font-medium leading-none text-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 sm:inline-flex"
                    >
                      {{ framework }}
                    </div>
                  </div>
                </button>

                <p
                  v-if="!filteredItems.length"
                  class="px-3 py-10 text-center text-sm text-muted-foreground"
                >
                  No results found.
                </p>
              </div>
            </section>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
