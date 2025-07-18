import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_PUBLIC_URL,
  plugins: [react()],
  server: {
    allowedHosts: ['e648-218-1-210-14.ngrok-free.app'],
    // 暂时关闭HTTPS以避免混合内容错误
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, 'localhost-key.pem')),
    //   cert: fs.readFileSync(path.resolve(__dirname, 'localhost.pem')),
    // },
    host: 'localhost',
    port: 5173,
    // 如果需要恢复HTTPS，可以使用代理转发API请求
    // proxy: {
    //   '/api/ai': {
    //     target: 'http://221.181.122.58:23006',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api\/ai/, '/v1/chat/completions'),
    //   },
    // },
  },
});
