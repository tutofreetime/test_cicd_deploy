const jwt = require("jsonwebtoken");
const {SESSION_SECRET} = require("../../config/config");
const mongoose = require('../../config/mongoDB/database');
function checkUser(req) {
    try {
        // login by form
        return jwt.verify(req.cookies.token, SESSION_SECRET);
    } catch (err) {
        return false;
    }
}

module.exports = {
    checkUser,
    mongoose
};
