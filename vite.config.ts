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
  }

  switch (mode) {
    case 'development': {
      const token = process.env.GET_LINKS_TOKEN
      console.log(token)
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

      return config
    }
    case 'production':
    default:
      return config;
  }
});
