import { defineConfig } from 'vite';
import createVuePlugin from '@vitejs/plugin-vue';

const path = require('path');
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // https://medium.com/js-dojo/how-to-deal-with-cors-error-on-vue-cli-3-d78c024ce8d3
    proxy: {
      '^/engine-rest': 'http://basys-lnv-1.mrk40.dfki.lan:9080', //import.meta.env.VITE_CAMUNDA_REST_URL,
    },
  },
  plugins: [
    createVuePlugin({
      template: {
        compilerOptions: {
          compatConfig: {
            MODE: 2,
          },
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      vue: '@vue/compat',
    },
  },
  define: {
    mxLoadResources: {},
    mxForceIncludes: {},
    mxResourceExtension: {},
    mxLoadStylesheets: {},
  },
});
