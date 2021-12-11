const chai = require('chai');
const chai_Http =require('chai-http')
const app = require('../app');
const User = require("../src/models/userCryptoModel");
chai.should()
chai.use(chai_Http)

describe('User', () => {

    before(async (done) => {
        User.deleteMany({}, (err) => {
            done();
        });
        done();
    });

    let user_id = "";

    it('GET /users - return message ', (done) => {
        chai.request(app)
            .get('/users')
            .end((err, res) => {
                res.should.have.status(403);
                res.body.should.have.property('message').eql('Forbidden');
                done();
            });
    });

    it('POST /users/register it should  POST create a new User', (done) => {
        let user =
            {
                username: "test",
                email: "test@user.com",
                password: "user"
            }
        chai.request(app)
            .post('/users/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(201);
                res.should.be.a.json;
                res.should.have.status(201);
                res.body.should.have.property('message').eql('User created successfully');
                user_id = res.body.data.id
            });
        done();
    });

    it('POST /users/register - it return error because of duplicate email', (done) => {
        let user =
            {
                username: "test",
                email: "test@user.com",
                password: "user"
            }
        chai.request(app)
            .post('/users/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('message').eql('User already exists');
            });
            done();
    });

    it('POST /users/register - it return error because of missing email', (done) => {
        let user =
            {
                user: {
                    name: "user4",
                    email: "",
                    password: "user"
                }
            }
        chai.request(app)
            .post('/users/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(500);
                res.body.should.have.property('message').eql('Something went wrong')
            });
            done();
    });

    it('POST /users/logout - it should  POST Log out error status 304 because cookies not found', (done) => {
        chai.request(app)
            .post('/users/logout')
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.have.property('message').eql('User not logged in');
            });
        done();
    });

    it('POST /users/login - it should  POST Log in the user', (done) => {
        let user = {
            email: "test@user.com",
            password: "user"
        }
        chai.request(app)
            .post('/users/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.a.json
                res.body.should.be.a('object')
                res.body.should.have.property('message').eql('User logged in successfully')
                res.body.should.have.property('data')
                res.header.should.have.property('token')
            });
        done();
    });

    it('POST /users/profile - it should  return an error status 304 because cookies not found', (done) => {
        chai.request(app)
            .post('/users/profile')
            .end((err, res) => {
                res.should.have.status(404);
            });
        done();
    });

    it('POST /users/login - it should  email or password incorrect', (done) => {
        let user = {
            user: {
                password: "user",
                email: "user654654@user.com",
            }
        }
        chai.request(app)
            .post('/users/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.have.property('message').eql('Email or password is incorrect')
            });
        done();
    });

    it('DELETE /users/delete - it deletes user and return status 200. User Not ADMIN', (done) => {
        chai.request(app)
            .delete('/users/delete')
            .send({user_id})
            .end((err, res) => {
                res.should.have.status(403);
                res.body.should.have.property('message').eql('Forbidden')
            });
        done();
    });

    after(async (done) => {
        done()
    });
})
