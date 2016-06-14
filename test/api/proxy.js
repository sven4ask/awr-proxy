'use strict';
process.env.NODE_ENV = 'test';

const app = require('../../app');
const nock = require('nock');
const request = require('supertest');
const should = require('should');

describe('API Proxy', () => {
  describe('GET /sync.php', () => {
    it('should return a 401 with wrong password', (done) => {
      request(app)
        .get('/sync.php?action=get_dates')
        .expect(401)
        .auth('foo', 'wrongpassword')
        .end((err, res) => {
          should.not.exist(err);

          res.body.should.be.obj;

          done();
        });
    });

    it('should return a dates that a project has rankings for', (done) => {
      nock('https://api.awrcloud.com')
        .get('/sync.php')
        .query((query) => {
          if (query.action == null) {
            return false;
          }

          if (query.token !== '1234') {
            return false;
          }

          if (query.project !== 'foo project') {
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
        .end((err, res) => {
          should.not.exist(err);
          const dates = res.body.dates;
          dates[0].date.should.be.eql('2013-08-01');

          done();
        });
    });
  });
});
