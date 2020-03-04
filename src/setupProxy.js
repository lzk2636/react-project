const {createProxyMiddleware} = require("http-proxy-middleware");
// import {BASE_URL} from './utils/base'
module.exports = function(app) {
  // console.log(process.env.REACT_APP_BASE_URL)
  app.use(
    createProxyMiddleware("/api", {
      target: `${process.env.REACT_APP_BASE_URL}`,
      changeOrigin: true, // needed for virtual hosted sites
      ws: true, // proxy websockets
      pathRewrite: {
        "^/api": ""
      }
    })
  );
};