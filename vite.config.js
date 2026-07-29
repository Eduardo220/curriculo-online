import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/curriculo-online/",
  plugins: [react()],
  build: {
    cssCodeSplit: true,
    sourcemap: false,
    target: "es2022",
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "react-runtime",
              test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              priority: 40,
            },
            {
              name: "motion-runtime",
              test: /node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/,
              priority: 35,
            },
            {
              name: "gsap-runtime",
              test: /node_modules[\\/]gsap[\\/]/,
              priority: 30,
            },
            {
              name: "webgl-runtime",
              test: /node_modules[\\/](@react-three|three|three-stdlib)[\\/]/,
              priority: 25,
              entriesAware: true,
              maxSize: 850 * 1024,
            },
          ],
        },
      },
    },
  },
});
