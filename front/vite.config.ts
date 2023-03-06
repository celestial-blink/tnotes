import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 1111,
        host: true
    },
    resolve: {
        alias: {
            "@components": path.resolve(__dirname, "./src/helpers/"),
            "@helpers": path.resolve(__dirname, "./src/styles/"),
            "@hooks": path.resolve(__dirname, "./src/scripts/"),
            "@contexts": path.resolve(__dirname, "./src/assets/"),
            "@views": path.resolve(__dirname, "./src/assets/"),
            "@assets": path.resolve(__dirname, "./src/assets/")
        }
    },
    plugins: [react()],
})
