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
  it('a file', (done) => {
    request.post('/')
        .field('name', fp)
          .attach('image', fp)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.text).to.equal(realfilehash);
            filehash = res.text;
            done();
          });
  });
});
describe('download', () => {
  it('a file', (done) => {
    request.get(`/${filehash}`)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(crypto.makeHash(res.body)).to.equal(realfilehash);
            done();
          });
  });
});
