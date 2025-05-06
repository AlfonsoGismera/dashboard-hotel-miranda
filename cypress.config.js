import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    defaultCommandTimeout: 6000,
    setupNodeEvents(on, config) {
      // Aquí también podrías necesitar usar import si importas algo
    },
  },
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});