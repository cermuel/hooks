<template>
  <section class="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
    <div class="space-y-6">
      <p class="text-sm font-medium uppercase tracking-normal text-accent">React, Vue and Nuxt</p>
      <h1 class="max-w-3xl text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
        Practical hooks and composables for everyday frontend development.
      </h1>
      <p class="max-w-2xl text-lg leading-8 text-muted-foreground">
        Cermuel Hooks keeps framework-specific APIs thin, typed and SSR-aware while sharing the behavior that should stay consistent.
      </p>
      <div class="flex flex-col gap-3 sm:flex-row">
        <a
          href="#installation"
          class="inline-flex h-11 items-center justify-center rounded-md bg-accent px-5 text-sm font-medium text-accent-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Get started
        </a>
        <a
          href="https://github.com/cermuel/cermuel-hooks"
          class="inline-flex h-11 items-center justify-center rounded-md border border-border bg-card px-5 text-sm font-medium text-card-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          GitHub
        </a>
      </div>
    </div>

    <div id="installation" class="rounded-md border border-border bg-card p-5 text-card-foreground shadow-sm">
      <div class="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Icon name="lucide:terminal" class="size-4" />
        Installation
      </div>
      <pre class="overflow-x-auto rounded-md bg-muted p-4 text-sm"><code>npm install @cermuel/hooks</code></pre>

      <div class="mt-6 grid gap-4">
        <div>
          <p class="mb-2 text-sm font-medium">React or TanStack Start</p>
          <pre class="overflow-x-auto rounded-md bg-muted p-4 text-sm"><code>import { useOnline } from "@cermuel/hooks/react";</code></pre>
        </div>
        <div>
          <p class="mb-2 text-sm font-medium">Vue or Nuxt</p>
          <pre class="overflow-x-auto rounded-md bg-muted p-4 text-sm"><code>import { useOnline } from "@cermuel/hooks/vue";</code></pre>
        </div>
      </div>
    </div>
  </section>
</template>
