import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from "vite-tsconfig-paths"

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        tsconfigPaths()
    ],
    base: './', // Ensures assets are correctly referenced
    build: {
        outDir: 'dist',
    },
    server: {
        port: 3000,
    },
});
