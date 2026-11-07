import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { POST as handleContactPost } from './api/contact';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables (.env, .env.local) into process.env for local serverless emulation
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [
      react(),
      {
        name: 'api-contact-dev-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url === '/api/contact' && req.method === 'POST') {
              let bodyStr = '';
              req.on('data', (chunk) => {
                bodyStr += chunk;
              });
              req.on('end', async () => {
                try {
                  const protocol = req.headers['x-forwarded-proto'] || 'http';
                  const host = req.headers.host || 'localhost:5173';
                  const webReq = new Request(`${protocol}://${host}${req.url}`, {
                    method: 'POST',
                    headers: req.headers as Record<string, string>,
                    body: bodyStr,
                  });

                  const webRes = await handleContactPost(webReq);
                  const responseText = await webRes.text();

                  res.statusCode = webRes.status;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(responseText);
                } catch (err: unknown) {
                  const message = err instanceof Error ? err.message : 'Server error';
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: false, error: message }));
                }
              });
              return;
            }
            next();
          });
        },
      },
    ],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            three: ['three'],
            react: ['react', 'react-dom'],
          },
        },
      },
    },
  };
});
