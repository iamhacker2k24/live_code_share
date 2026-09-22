import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      '/gofile-preview': {
        target: 'https://store3.gofile.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gofile-preview/, ''),
        headers: {
          'Referer': 'https://gofile.io/',
          'Range': 'bytes=0-1048575',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36',
          'Sec-Ch-Ua': '"Google Chrome";v="153", "Not_A Brand";v="8", "Chromium";v="153"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"Windows"',
        },
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            delete proxyRes.headers['x-frame-options'];
            delete proxyRes.headers['content-security-policy'];
            proxyRes.headers['access-control-allow-origin'] = '*';
          });
        },
      },
    },
  },
})




