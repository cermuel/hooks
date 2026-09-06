<template>
  <main class="lg:h-dvh flex flex-col items-center justify-center">
    <section class="relative isolate overflow-hidden px-4 pb-20 pt-28">
      <div class="mx-auto max-w-7xl text-center">
        <h1
          class="mx-auto max-w-5xl font-display text-5xl font-semibold leading-[0.92] tracking-normal text-foreground sm:text-6xl md:text-7xl"
        >
          <span class="hero-word">Practical</span>
          <span class="hero-word">hooks</span>
          <br />
          <span class="hero-word">for</span>
          <span class="hero-word">React,</span>
          <span class="hero-word">Vue</span>
          <span class="hero-word">and</span>
          <span class="hero-word">Nuxt</span>
        </h1>

        <p
          class="hero-fade mx-auto mt-6 max-w-md text-pretty text-base leading-7 text-muted-foreground"
        >
          Typed, SSR-safe hooks and composables with shared core behavior and
          framework-native adapters.
        </p>

        <div
          class="hero-fade mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <AtomButton
            label="Installation"
            to="/hooks#installation"
            size="lg"
            right-icon="lucide:arrow-down-to-line"
            static
          />
          <AtomButton
            label="Browse hooks"
            to="/hooks"
            variant="secondary"
            size="lg"
            right-icon="lucide:arrow-right"
          />
        </div>
      </div>
    </section>
    <section id="installation" class="mx-auto max-w-2xl px-4 pb-24">
      <p class="mb-5 text-center text-sm text-muted-foreground">
        Built for React, Vue, Nuxt and TanStack Start. Distributed as
        <span class="font-medium text-foreground">@cermuel/hooks</span>.
      </p>

      <UiInstallationBlock />
    </section>
  </main>
</template>

<style scoped>
.hero-word {
  display: inline-block;
  animation: hero-word-in 560ms var(--ease-out) both;
  margin-inline-end: 0.18em;
}

.hero-word:nth-of-type(1) {
  animation-delay: 80ms;
}

.hero-word:nth-of-type(2) {
  animation-delay: 150ms;
}

.hero-word:nth-of-type(3) {
  animation-delay: 220ms;
}

.hero-word:nth-of-type(4) {
  animation-delay: 290ms;
}

.hero-word:nth-of-type(5) {
  animation-delay: 360ms;
}

.hero-word:nth-of-type(6) {
  animation-delay: 430ms;
}

.hero-word:nth-of-type(7) {
  animation-delay: 500ms;
}

.hero-fade {
  animation: hero-fade-in 620ms var(--ease-out) 640ms both;
}

@keyframes hero-word-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes hero-fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-word,
  .hero-fade {
    animation: none;
  }
}
</style>
