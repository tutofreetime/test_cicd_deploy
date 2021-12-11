const chai = require('chai');
const chai_Http =require('chai-http')
const app = require('../app');
const Article = require("../src/models/articleModel");
chai.should()
chai.use(chai_Http)

describe('CryptoCurrency', () => {

    before(async (done) => {
        Article.deleteMany({}, (err) => {
            done();
        });
        done();
    });

    it('GET /cryptos - return message', (done) => {

        chai.request(app)
            .get('/articles')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('message').eql('Article fetched successfully');
                res.body.should.have.property('data').lengthOf(0);
                done();
            });
        done();
    });

    it('POST /articles - it should  POST create a new Article. User not ADMIN', (done) => {
        let article = {
            "title" : "article_title tres bon",
            "summary" : "article summary",
            "source" : "article source",
            "article_url" : "article source"
        }
        chai.request(app)
            .post('/articles')
            .send(article)
            .end((err, res) => {
                res.should.be.a.json;
                res.should.have.status(401);
                res.body.should.have.property('message')
                    .eql('You are not authorized to create a Article');
            });
        done();
    });

    after(async (done) => {
        done()
    });
})
