const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/springboot",
    createProxyMiddleware({
      target: "http://localhost:8080",
      changeOrigin: true,
      pathRewrite: { "^/api1": "" },
    })
  );
  app.use(
    "/flask",
    createProxyMiddleware({
      target: "http://127.0.0.1:5000",
      changeOrigin: true,
      pathRewrite: { "^/api2": "" },
      timeout: 120000,
      proxyTimeout: 120000,
    })
  );
};
