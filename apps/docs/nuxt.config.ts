import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: ["@nuxt/icon", "@nuxtjs/color-mode"],

  css: ["~/assets/css/main.css"],

  colorMode: {
    classSuffix: "",
    preference: "dark",
    fallback: "dark",
  },

  vite: {
    plugins: [tailwindcss() as any],
  },

  devtools: {
    enabled: true,
  },
});
