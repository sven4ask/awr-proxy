'use strict';
const config = require('config');
const parse = require('url-parse');
const httpProxy = require('http-proxy');
const https = require('https');

// API Proxy
const proxy = httpProxy.createProxyServer({
  xfwd: true,
});

const PROXY_URL = 'https://api.awrcloud.com';

proxy.on('proxyReq', (proxyReq, req, res, options) => {

  proxyReq.setHeader('X-Forwarded-Url', req.originalUrl);

});

function changeProject(req, user) {
  req.query.project = user.project;
}

function replaceProject(url, user) {
  url = parse(url, true);
  url.query.project = user.project;
  return url.toString();
}

function addToken(url, token) {
  url = parse(url,true);
  url.query.token = token;
  return url.toString();
}

module.exports = function (req, res, next) {

  req.url = replaceProject(req.url, req.user);
  req.url = addToken(req.url, config.get('token'));

  proxy.web(req, res, {
    target: PROXY_URL,
    headers: {
      host: 'api.awrcloud.com'
    },
    agent  : https.globalAgent
  }, (e) => {
    next(`Failed to connect to API  ${PROXY_URL} : ${e}`);
  });
}