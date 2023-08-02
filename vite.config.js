import { defineConfig } from 'vite';
import createVuePlugin from '@vitejs/plugin-vue';

const path = require('path');
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    hmr: true, // enable hot module replacement
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
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
      'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
    },
  },
  define: {
    mxLoadResources: {},
    mxForceIncludes: {},
    mxResourceExtension: {},
    mxLoadStylesheets: {},
  },
});
