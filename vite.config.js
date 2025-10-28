import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

//chages made : add the allowed hosts
export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd());
  return {
    server: { port: 3000 },
    base: env.VITE_BASE_PATH ? `${env.VITE_BASE_PATH}` : '/', // Use base URL from environment variables
    plugins: [react()],
    preview: {
      allowedHosts: env.VITE_ALLOWED_HOSTS ? env.VITE_ALLOWED_HOSTS.split(',') : ['localhost'],
    },
  };
});
