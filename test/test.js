const chai = require('chai');
const fs = require('fs');
const expect = chai.expect;
const supertest = require('supertest');
const request = supertest('localhost:3000');

const crypto = require('../services/crypto');

let filehash = '';
let realfilehash = '';
const fp = 'test/bird.jpg';


describe('upload', function() {
    before(function() {
        const f = fs.readFileSync(fp);
        realfilehash = crypto.makeHash(f);
    });
    it('a file', function(done) {
       request.post('/')
        .field('name', fp)
          .attach('image', fp)
          .end(function(err, res) {
              expect(res.status).to.equal(200);
              expect(res.text).to.equal(realfilehash);
              filehash = res.text;
              done();
          });
    });
});
describe('download', function() {
    it('a file', function(done) {
       request.get('/' + filehash)
          .end(function(err, res) {
              expect(res.status).to.equal(200);
              expect(crypto.makeHash(res.body)).to.equal(realfilehash);
              done();
          });
    });
});
