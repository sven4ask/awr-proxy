'use strict';
var express = require('express');
var log = require('winston');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var config = require('config');

var app = express();

passport.use(new BasicStrategy(function(username, password, done) {
    var accounts = config.get('accounts');
    if (accounts.has(username)) {
      var user = accounts.get(username);
      if (user.password === password) {
        return done(null, user);
      }
    }

    return done(null, false);
  }
));

// Middleware
app.all('*', passport.authenticate('basic', { session: false }), require('./middleware/proxy'));

var port = (config.has('port') ? config.get('port') : 1337);

// Start the server
var server = app.listen(port, function() {
  log.info('AWR Proxy listening on port ' + server.address().port);
});

module.exports = app;
