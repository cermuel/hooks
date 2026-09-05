<template>
  <main class="mx-auto max-w-7xl px-4 pb-20 pt-28">
    <p class="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
      Usage
    </p>
    <h1 class="mt-3 font-display text-4xl font-semibold leading-tight tracking-normal text-foreground md:text-5xl">
      Use the framework-native entry
    </h1>
    <p class="mt-5 max-w-xl text-pretty text-base leading-7 text-muted-foreground">
      React and Vue adapters stay thin while the core behavior stays shared.
    </p>

    <div class="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <article class="relative flex min-h-64 flex-col overflow-hidden rounded-3xl border border-border bg-card">
        <div class="relative m-2 mb-0 flex min-h-0 flex-1 items-center">
          <AtomCodeBlock
            code="import { useOnline } from &quot;@cermuel/hooks/react&quot;;

export function Status() {
  const online = useOnline();

  return online ? &quot;Online&quot; : &quot;Offline&quot;;
}"
          />
        </div>
        <div class="flex shrink-0 items-center justify-between gap-3 px-4 py-3.5">
          <div class="min-w-0">
            <h2 class="truncate font-display text-[0.95rem] font-semibold tracking-normal text-foreground">
              React or TanStack Start
            </h2>
            <p class="mt-0.5 line-clamp-1 text-xs leading-relaxed text-muted-foreground">
              Hooks with idiomatic React state and effects.
            </p>
          </div>
        </div>
      </article>

      <article class="relative flex min-h-64 flex-col overflow-hidden rounded-3xl border border-border bg-card">
        <div class="relative m-2 mb-0 flex min-h-0 flex-1 items-center">
          <AtomCodeBlock
            code="import { useOnline } from &quot;@cermuel/hooks/vue&quot;;

const online = useOnline();"
          />
        </div>
        <div class="flex shrink-0 items-center justify-between gap-3 px-4 py-3.5">
          <div class="min-w-0">
            <h2 class="truncate font-display text-[0.95rem] font-semibold tracking-normal text-foreground">
              Vue or Nuxt
            </h2>
            <p class="mt-0.5 line-clamp-1 text-xs leading-relaxed text-muted-foreground">
              Composables with Vue refs and lifecycle cleanup.
            </p>
          </div>
        </div>
      </article>
    </div>
  </main>
</template>
