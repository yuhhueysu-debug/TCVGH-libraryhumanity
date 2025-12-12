import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set the base path for GitHub Pages deployment.
  // This should match your GitHub repository name, with leading and trailing slashes.
  // 例如: 如果你的 repo 是 'my-awesome-app', 這裡就是 '/my-awesome-app/'
  base: '/TCVGH-libraryhumanity/',
});
