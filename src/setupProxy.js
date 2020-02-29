const {createProxyMiddleware} = require("http-proxy-middleware");
module.exports = function(app) {
  app.use(
    createProxyMiddleware("/api", {
      target: "http://127.0.0.1/heimamm/public",
      changeOrigin: true, // needed for virtual hosted sites
      ws: true, // proxy websockets
      pathRewrite: {
        "^/api": ""
      }
    })
  );
};