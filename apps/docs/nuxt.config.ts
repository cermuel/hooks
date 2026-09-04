import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: ["@nuxt/icon", "@nuxtjs/color-mode"],

  css: ["~/assets/css/main.css"],

  colorMode: {
    classSuffix: "",
    preference: "system",
    fallback: "dark",
  },

  vite: {
    plugins: [tailwindcss()],
  },

  devtools: {
    enabled: true,
  },
});
