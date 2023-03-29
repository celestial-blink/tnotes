import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 1111,
        host: true
    },
    resolve: {
        alias: {
            "@components": path.resolve(__dirname, "./src/components/"),
            "@helpers": path.resolve(__dirname, "./src/helpers/"),
            "@hooks": path.resolve(__dirname, "./src/hooks/"),
            "@contexts": path.resolve(__dirname, "./src/contexts/"),
            "@views": path.resolve(__dirname, "./src/views/"),
            "@assets": path.resolve(__dirname, "./src/assets/")
        }
    },
    plugins: [react()],
})
