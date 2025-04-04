import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import * as path from "node:path"

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            "@components": path.resolve(__dirname, "src/components"),
            "@src": path.resolve(__dirname, "src"),
        },
    },
    base: './',
    build: {
        sourcemap: false,
        outDir: 'dist',
    },
    server: {
        port: 3000,
    },
});
