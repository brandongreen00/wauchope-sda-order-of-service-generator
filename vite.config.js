import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// To change the GitHub Pages subpath, edit `base` below.
// Example: if your repo is `my-repo`, set base to `/my-repo/`.
export default defineConfig({
  plugins: [react()],
  base: '/wauchope-sda-order-of-service-generator/',
});
