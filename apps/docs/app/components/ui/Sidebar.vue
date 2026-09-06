<script lang="ts" setup>
const sidebarSections = [
  { label: "Installation", href: "/hooks#installation" },
  { label: "Usage", href: "/hooks#usage" },
  { label: "All hooks", href: "/hooks#all-hooks" },
];
</script>

<template>
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
          <NuxtLink
            v-for="hookItem in hooks"
            :key="hookItem.slug"
            :href="`/hooks/${hookItem.slug}`"
            class="rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {{ hookItem.name }}
          </NuxtLink>
        </div>
      </section>
    </nav>
  </aside>
</template>
