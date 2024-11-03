// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://bdf.bitpoint.co.ke',
      changeOrigin: true,
      secure: false,
      
      // Timeout settings
      timeout: 30000,
      proxyTimeout: 31000,
      
      // Path rewriting
      pathRewrite: {
        '^/api': '/api'
      },

      // Request handling
      onProxyReq: (proxyReq, req, res) => {
        console.log('Original Path:', req.url);
        console.log('Proxied Path:', proxyReq.path);
        console.log('Request Method:', req.method);
        console.log('Request Headers:', req.headers);
      },

      // Response handling
      onProxyRes: (proxyRes, req, res) => {
        console.log('Proxy Response:', {
          status: proxyRes.statusCode,
          originalPath: req.url,
          path: req.path,
          method: req.method,
          timestamp: new Date().toISOString()
        });
      },

      // Error handling
      onError: (err, req, res) => {
        const errorMessage = {
          message: 'Proxy Error Occurred',
          code: err.code,
          details: err.message,
          path: req.url,
          timestamp: new Date().toISOString()
        };

        console.error('Proxy Error:', errorMessage);

        if (err.code === 'ETIMEDOUT') {
          errorMessage.message = 'Request timed out while connecting to the server';
        } else if (err.code === 'ECONNREFUSED') {
          errorMessage.message = 'Unable to connect to the server';
        } else if (err.code === 'ENOTFOUND') {
          errorMessage.message = 'Server not found';
        }

        res.status(502).json(errorMessage);
      },

      // Logging
      logLevel: 'debug',
      logProvider: (provider) => ({
        log: (...args) => console.log(new Date().toISOString(), ...args),
        debug: (...args) => console.debug(new Date().toISOString(), ...args),
        info: (...args) => console.info(new Date().toISOString(), ...args),
        warn: (...args) => console.warn(new Date().toISOString(), ...args),
        error: (...args) => console.error(new Date().toISOString(), ...args)
      })
    })
  );
};