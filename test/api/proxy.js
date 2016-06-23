'use strict';
process.env.NODE_ENV = 'test';

var app = require('../../app');
var nock = require('nock');
var request = require('supertest');
var should = require('should');

describe('API Proxy', function() {
  describe('GET /sync.php', function() {
    it('should return a 401 with wrong password', function(done) {
      request(app)
        .get('/sync.php?action=get_dates')
        .expect(401)
        .auth('foo', 'wrongpassword')
        .end(function(err, res) {
          should.not.exist(err);

          res.body.should.be.obj;

          done();
        });
    });

    it('should return a dates that a project has rankings for', function(done) {
      nock('https://api.awrcloud.com')
        .get('/sync.php')
        .query(function(query) {
          if (query.action == null) {
            return false;
          }

          if (query.token !== '1234') {
            return false;
          }

          if (query.project_name !== 'foo project') {
            return false;
          }
          return true;
        })
        .reply(200, {
          dates: [
            { date: '2013-08-01', depth: '5' },
            { date: '2013-08-02', depth: '5' },
            { date: '2013-08-03', depth: '10' }
          ]
        });

      request(app)
        .get('/sync.php?action=get_dates')
        .expect(200)
        .auth('foo', 'test')
        .end(function(err, res) {
          should.not.exist(err);
          var dates = res.body.dates;
          dates[0].date.should.be.eql('2013-08-01');

          done();
        });
    });

    it('should return a 403 if you try to get projects', function(done) {
      request(app)
        .get('/sync.php?action=projects')
        .expect(403)
        .auth('foo', 'test')
        .end(function(err, res) {
          should.not.exist(err);

          done();
        });
    });
  });

  describe('GET /index.php', function() {
    it('should return a 404', function(done) {
      request(app)
        .get('/index.php?action=get_dates')
        .expect(404)
        .end(function(err, res) {
          should.not.exist(err);

          res.body.should.be.obj;

          done();
        });
    });
  });

  describe('GET /get.php', function() {
    it('should return a dates that a project has rankings for', function(done) {
      nock('https://api.awrcloud.com')
        .get('/get.php')
        .query(function(query) {
          if (query.action == null) {
            return false;
          }

          if (query.token !== '1234') {
            return false;
          }

          if (query.project_name !== 'foo project') {
            return false;
          }
          return true;
        })
        .reply(200, 'https://api.awrcloud.com/get.php?action=list&project=project+name&token=myAPIkey&date=2013-07-24&file=0.tar.xz\n' +
          'https://api.awrcloud.com/get.php?action=list&project=project+name&token=myAPIkey&date=2013-07-24&file=1.tar.xz');

      request(app)
        .get('/get.php?action=list')
        .expect(200)
        .auth('foo', 'test')
        .end(function(err, res) {
          should.not.exist(err);

          done();
        });
    });
  })
});
