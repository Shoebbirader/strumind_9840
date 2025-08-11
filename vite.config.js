import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        'components': path.resolve(__dirname, './src/components'),
        'pages': path.resolve(__dirname, './src/pages'),
        'services': path.resolve(__dirname, './src/services'),
        'store': path.resolve(__dirname, './src/store'),
        'styles': path.resolve(__dirname, './src/styles'),
        'utils': path.resolve(__dirname, './src/utils')
      }
    },
    server: {
      port: parseInt(env.PORT) || 3000,
      host: '0.0.0.0',
      allowedHosts: true,
      cors: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5000',
          changeOrigin: true,
          secure: false
        },
        '/socket.io': {
          target: env.VITE_SOCKET_URL || 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          ws: true
        }
      }
    },
    build: {
      outDir: 'build',
      sourcemap: true
    }
  };
});