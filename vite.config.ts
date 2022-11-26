import { defineConfig, loadEnv, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import * as ngrokAPI from './ngrok-api';

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') }

  const config: UserConfig = {
    plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
  }

  switch (mode) {
    case 'development': {
      const token = process.env.GET_LINKS_TOKEN

      const res = await fetch("https://api.ngrok.com/tunnels", {
        headers: {
          "authorization": `Bearer ${token}`,
          "ngrok-version": "2",
        },
        redirect: 'follow',
      })

      const { tunnels } = await res.json() as ngrokAPI.Tunnels

      const tunnel = tunnels.find((t) => t.forwards_to === 'http://localhost:8000')

      if (!tunnel) {
        return {
          ...config,
          server: {
            open: true,
            port: 8000
          },
        }
      }

      return {
        ...config,
        server: {
          open: true,
          port: 8000,
          proxy: {
            "/api": tunnel.public_url
          }
        },
      }
    }
    case 'preview':
      return {
        ...config,
        base: process.env.BASE_URL
      }
    case 'production':
      return {
        ...config,
        build: {
          sourcemap: false,
          rollupOptions: {
            output: {
              manualChunks: (id) => {
                if (id.includes('node_modules')) {
                  return 'vendor'
                }
                return id.split('/')[id.length - 1]
              }
            }
          }
        }
      }
    default:
      return config;
  }
});
