import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/softgames/' : '/', // critical for GitHub Pages subfolder
  // base: '/softgames/', // critical for GitHub Pages subfolder
  build: {
    outDir: 'dist', // default, safe
    assetsDir: 'assets', // default, keeps CSS/JS in assets/
     sourcemap: true, // Helps debug minified code

     rollupOptions: {
      output: {
        manualChunks: undefined, // disables chunking
      },
    },
  },
  server: {
    host: true,
    port: 5173,
  },
});