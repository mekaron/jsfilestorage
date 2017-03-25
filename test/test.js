const chai = require('chai');
const fs = require('fs');
const supertest = require('supertest');
const Nightmare = require('nightmare');

const crypto = require('../services/crypto');

const expect = chai.expect;
const request = supertest('localhost:3000');
const nightmare = Nightmare();

let filehash = '';
let realfilehash = '';
const fp = 'test/bird.jpg';

describe('upload', () => {
  // https://github.com/mochajs/mocha/issues/2018
  // this.timeout only works on functions, arrow functions dont export context.
  before(function (done) { // eslint-disable-line func-names
    this.timeout(5000);
    const f = fs.readFileSync(fp);
    realfilehash = crypto.makeHash(f);
    nightmare.goto('http://localhost:3000/jsfs/target').wait('body')
      .then(() => {
        done();
      });
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
    request.get('/jsfs/invalid_hash')
          .end((err, res) => {
            expect(res.status).to.equal(404);
            done();
          });
  });
  after(() => {
    nightmare.end();
  });
});
