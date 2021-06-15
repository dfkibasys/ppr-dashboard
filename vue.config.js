module.exports = {
    // https://medium.com/js-dojo/how-to-deal-with-cors-error-on-vue-cli-3-d78c024ce8d3
    devServer: {
        proxy: {
            "^/engine-rest": {
                target: process.env.VUE_APP_CAMUNDA_REST_URL,
            },
            "^/api/v1/registry": {
                target: "http://localhost:4000",
            },
            "^/shells": {
                target: "http://localhost:4001",
            },
        }          
    },
  }