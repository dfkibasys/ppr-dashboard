import { defineConfig } from 'vite';
import { createVuePlugin as vue } from 'vite-plugin-vue2';

const path = require('path');
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // https://medium.com/js-dojo/how-to-deal-with-cors-error-on-vue-cli-3-d78c024ce8d3
    proxy: {
      '^/engine-rest': 'http://basys-lnv-1.mrk40.dfki.lan:9080', //import.meta.env.VITE_CAMUNDA_REST_URL,
    },
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    mxLoadResources: {},
    mxForceIncludes: {},
    mxResourceExtension: {},
    mxLoadStylesheets: {},
  },
});
