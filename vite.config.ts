import { defineConfig, loadEnv, ServerOptions, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import * as ngrokAPI from './ngrok-api';

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') }

  const config: UserConfig & { server: ServerOptions } = {
    plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
    server: {
      open: true,
      port: 8000
    },
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
        return config
      }

      const proxy = {
        "/api": tunnel.public_url
      }

      config.server.proxy = proxy
      config.base = process.env.BASE_URL

      return config
    }
    case 'production':
    default:
      return config;
  }
});
