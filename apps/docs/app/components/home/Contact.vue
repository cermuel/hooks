<template>
  <section
    class="mx-auto max-w-7xl flex flex-col text-center items-center justify-center border-border md:py-40 px-4 pb-20 pt-14"
  >
    <div>
      <p
        class="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted-foreground"
      >
        Work with me
      </p>
      <h2
        class="mt-3 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-normal text-foreground md:text-4xl"
      >
        Need an engineer for your product?
      </h2>
      <p
        class="mt-4 max-w-xl text-pretty text-sm leading-6 text-muted-foreground"
      >
        I work on frontend systems, product interfaces, docs, and practical
        developer tooling. Book a project or drop a line, whichever is easier.
      </p>
      <div class="mt-7 flex justify-center items-center gap-3">
        <AtomButton
          label="Email me"
          href="mailto:samuelobasi2005@gmail.com"
          size="lg"
          left-icon="lucide:mail"
          static
        />
        <AtomButton
          label="X / Twitter"
          href="https://x.com/yrn_cermuel"
          variant="secondary"
          size="lg"
          right-icon="lucide:arrow-up-right"
          external
          static
        />
      </div>
    </div>
  </section>
</template>
