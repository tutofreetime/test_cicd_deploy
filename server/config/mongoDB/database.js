const mongoose = require('mongoose');
const {MONGO_USER, MONGO_PASS, MONGO_IP, MONGO_PORT, MONGO_DB, SESSION_SECRET, CLIENT_URL} = require("../config");
const DATABASE_URL = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_IP}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
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
    mongoose
};
