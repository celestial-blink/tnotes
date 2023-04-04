import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 1111,
        host: true,
        proxy: {
            "/api": {
                target: 'http://localhost:1112'
            }
        }
    },
    resolve: {
        extensions: [".tsx", ".ts", ".css", ".json"],
        alias: {
            "@components": path.resolve(__dirname, "./src/components/"),
            "@helpers": path.resolve(__dirname, "./src/helpers/"),
            "@hooks": path.resolve(__dirname, "./src/hooks/"),
            "@contexts": path.resolve(__dirname, "./src/contexts/"),
            "@views": path.resolve(__dirname, "./src/views/"),
            "@assets": path.resolve(__dirname, "./src/assets/"),
            "@api": path.resolve(__dirname, "./src/api/"),
            "@": path.resolve(__dirname, "./src/"),
        }
    },
    plugins: [react()],
})
