import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/curriculo-online/",
  plugins: [react()],
  build: {
    cssCodeSplit: true,
    sourcemap: false,
    target: "es2022",
  },
});
