import { defineConfig, loadEnv } from 'vite';
import solid from 'vite-plugin-solid';
import tailwindcss from '@tailwindcss/vite';
import { API_BASE_ENV, normalizeApiBase } from './src/lib/apiConfig.ts';
import { productionCsp, productionHeaders } from './src/lib/securityPolicy.ts';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const apiBase = normalizeApiBase(env[API_BASE_ENV], command === 'serve' && mode !== 'production');
  const headers = command === 'build' || mode === 'production' ? productionHeaders(apiBase) : {};
  return {
    plugins: [
      solid(),
      tailwindcss(),
      {
        name: 'portfolio-production-security',
        apply: 'build',
        transformIndexHtml: {
          order: 'post',
          handler: () => [{ tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: productionCsp(apiBase) }, injectTo: 'head-prepend' }],
        },
        generateBundle() {
          this.emitFile({ type: 'asset', fileName: 'security-headers.json', source: JSON.stringify(headers, null, 2) + '\n' });
        },
      },
    ],
    server: { host: '127.0.0.1' },
    preview: { host: '127.0.0.1', headers },
    resolve: {
      alias: { '@': '/src' },
    },
  };
});
