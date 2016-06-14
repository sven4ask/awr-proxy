'use strict';
const express = require('express');
const log = require('winston');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const config = require('config');

const app = express();

passport.use(new BasicStrategy(
  (username, password, done) => {
    const accounts = config.get('accounts');
    if (accounts.has(username)) {
      const user = accounts.get(username);
      if (user.password === password) {
        return done(null, user);
      }
    }

    done(null, false);
  }
));

// Middleware
app.all('*', passport.authenticate('basic', { session: false }), require('./middleware/proxy'));

const port = (config.has('port') ? config.get('port') : 1337);

// Start the server
const server = app.listen(port, () => {
  log.info(`AWR Proxy listening on port ${server.address().port}`);
});

module.exports = app;