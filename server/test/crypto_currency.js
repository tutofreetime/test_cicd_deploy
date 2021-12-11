const chai = require('chai');
const chai_Http =require('chai-http')
const app = require('../app');
const CryptoCurrency = require("../src/models/cryptoCurrencyModel");
chai.should()
chai.use(chai_Http)

describe('CryptoCurrency', () => {

    before(async (done) => {
        CryptoCurrency.deleteMany({}, (err) => {
            done();
        });
        done();
    });
    // let user_id = "";
    // let crypto_id = "";
    it('GET /cryptos - return message', (done) => {

        chai.request(app)
            .get('/cryptos')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('message').eql('CryptoCurrency fetched successfully');
                res.body.should.have.property('data').lengthOf(0);
                done();
            });
        done();
    });

    it('GET /cryptos/:id - return message', (done) => {

        chai.request(app)
            .get('/cryptos/61afbde3e81dc535533effa7s')
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('message').eql('You have to be logged in to access this page');
            });
        done();
    });

    it('POST /cryptos - it should  POST create a new Crypto Currency. User not ADMIN', (done) => {
        let crypto = {
            "code": "bitcoin",
            "name": "bitcoin",
            "picture_url": "picture_url",
            "current_price": 2.5,
            "lower_price": 1.5,
            "highest_price": 3.5
        }
        chai.request(app)
            .post('/cryptos')
            .send(crypto)
            .end((err, res) => {
                res.should.be.a.json;
                res.should.have.status(401);
                res.body.should.have.property('message')
                    .eql('You are not authorized to create a CryptoCurrency');
            });
        done();
    });

    after(async (done) => {
        done()
    });
})
