const chai = require('chai');
const fs = require('fs');
const supertest = require('supertest');

const expect = chai.expect;
const request = supertest('localhost:3000');

const crypto = require('../services/crypto');

let filehash = '';
let realfilehash = '';
const fp = 'test/bird.jpg';

describe('upload', () => {
  before(() => {
    const f = fs.readFileSync(fp);
    realfilehash = crypto.makeHash(f);
  });
  it('should work and return the correct hash', (done) => {
    request.post('/jsfs')
        .field('name', fp)
          .attach('image', fp)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.text).to.equal(realfilehash);
            filehash = res.text;
            done();
          });
  });
  it('should 404', (done) => {
    request.post('/')
        .field('name', fp)
          .attach('image', fp)
          .end((err, res) => {
            expect(res.status).to.equal(404);
            done();
          });
  });
});
describe('download', () => {
  it('should download a file when given the correct hash', (done) => {
    request.get(`/jsfs/${filehash}`)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(crypto.makeHash(res.body)).to.equal(realfilehash);
            done();
          });
  });
  it('should 404', (done) => {
    request.get('/jsfs')
          .end((err, res) => {
            expect(res.status).to.equal(404);
            done();
          });
  });
});
