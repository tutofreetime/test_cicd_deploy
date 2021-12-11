const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email is already in use'],
    },
    password: {
        type: String,
        required: false,
    },
    auth_id: {
        type: String,
        required: false
    },
    subscribed_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    updated_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    is_verified: {
        type: Boolean,
        required: true,
        default: false
    },
    role: {
        type: String,
        required: true,
        default: 'ROLE_USER'
    },
    articles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    }],
    crypto_currencies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CryptoCurrency'
    }],
});

userSchema.pre('remove', function (next) {
    const ArticleModel = require('../models/articleModel');
    const CryptoCurrencyModel = require('../models/cryptoCurrencyModel');
    ArticleModel.deleteMany({ author: this._id }, (err) => {
        if (err) {
            next(err);
        }
    });
    CryptoCurrencyModel.deleteMany({ author: this._id }, (err) => {
        if (err) {
            next(err);
        }
    });
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
