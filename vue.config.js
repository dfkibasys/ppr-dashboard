import getEnv from '@/helpers/env';

module.exports = {
    // https://medium.com/js-dojo/how-to-deal-with-cors-error-on-vue-cli-3-d78c024ce8d3
    devServer: {
        proxy: {
            "^/engine-rest": {
                target: getEnv('VUE_APP_CAMUNDA_REST_URL'),
            }
        }          
    },
  }