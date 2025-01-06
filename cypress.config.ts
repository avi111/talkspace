// @ts-ignore
const { defineConfig } = require("cypress");

// @ts-ignore
exports.default = defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    supportFile: false,
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
