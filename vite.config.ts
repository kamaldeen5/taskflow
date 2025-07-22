import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      plugins: [
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['vite.svg', 'icon-192.png', 'icon-512.png'],
          manifest: {
            name: 'TaskFlow AI',
            short_name: 'TaskFlow',
            description: 'An AI-powered task management platform that automatically categorizes and prioritizes tasks to boost productivity.',
            theme_color: '#06b6d4',
            background_color: '#f3f4f6',
            display: 'standalone',
            start_url: '.',
            icons: [
              {
                src: 'icon-192.png',
                sizes: '192x192',
                type: 'image/png'
              },
              {
                src: 'icon-512.png',
                sizes: '512x512',
                type: 'image/png'
              }
            ]
          }
        })
      ]
    };
});
