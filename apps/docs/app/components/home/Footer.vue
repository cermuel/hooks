<template>
  <footer class="border-t border-border px-4 py-10">
    <div class="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto_auto]">
      <div>
        <NuxtLink
          to="/"
          class="group inline-flex items-center gap-2.5 text-sm font-semibold text-foreground"
        >
          <span
            class="inline-flex size-6 items-center justify-center rounded-lg border border-border bg-card"
          >
            <SharedShipIcon :size="16" />
          </span>
          Hooks
        </NuxtLink>
        <p class="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
          Practical hooks and composables for everyday frontend development.
        </p>
      </div>

      <div>
        <h2 class="text-sm font-medium text-foreground">Docs</h2>
        <nav
          class="mt-3 grid gap-2 text-sm text-muted-foreground"
          aria-label="Footer docs"
        >
          <NuxtLink
            class="transition-colors hover:text-foreground"
            to="/hooks#installation"
          >
            Installation
          </NuxtLink>
          <NuxtLink
            class="transition-colors hover:text-foreground"
            to="/hooks#usage"
          >
            Usage
          </NuxtLink>
          <NuxtLink class="transition-colors hover:text-foreground" to="/hooks">
            Hooks
          </NuxtLink>
        </nav>
      </div>

      <div>
        <h2 class="text-sm font-medium text-foreground">Links</h2>
        <nav
          class="mt-3 grid gap-2 text-sm text-muted-foreground"
          aria-label="Footer links"
        >
          <a
            class="transition-colors hover:text-foreground"
            href="https://github.com/cermuel/hooks"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <NuxtLink
            class="transition-colors hover:text-foreground"
            href="/publish"
            rel="noreferrer"
          >
            Publish
          </NuxtLink>
        </nav>
      </div>
    </div>
  </footer>
</template>
