import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// Without it dynamic require is not possible in config file
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
  plugins: [react()],
  build: {
    commonjsOptions: {
      defaultIsModuleExports(id) {
        const module = require(id);
        if (module?.default) {
          return false;
        }
        return 'auto';
      },
    },
  },
});
