const env = require('dotenv').config();
require('dotenv').config();
const mongoose = require('mongoose');
const {MONGO_USER, MONGO_PASS, MONGO_IP, MONGO_PORT, MONGO_DB} = require("../../config/config");
const DATABASE_URL = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_IP}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

// ENVIRONMENT VARIABLES

mongoose.connect(
    DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Connected to MongoDB');
        }
    });

module.exports = {
    // The port your web server for MONGO DB
    MONGO_IP: process.env.MONGO_IP || 'mongo',
    MONGO_PORT: process.env.MONGO_PORT || '27017',
    MONGO_DB: process.env.MONGO_DB || 'api_db',
    MONGO_USER: process.env.MONGO_USER,
    MONGO_PASS: process.env.MONGO_PASSWORD,

    // The port your web server for CLIENT
    CLIENT_URL: env.parsed.SITE_DOMAIN,

    // The port your web server for REDIS
    REDIS_URL: process.env.REDIS_URL || 'redis',
    REDIS_PORT: process.env.REDIS_PORT || '6379',

    SESSION_SECRET: process.env.SESSION_SECRET,
}
// ENVIRONMENT VARIABLES
require('dotenv').config();

//Connect to mongoDB
