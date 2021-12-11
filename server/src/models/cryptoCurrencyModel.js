const mongoose = require('mongoose');

const cryptoCurrencySchema = new mongoose.Schema({
    //TODO - We have to save all of this info. Because we can get it from the API.
    code: {
        //Crypto currency id. From the API.
        type: String,
        required: [true, 'Code is required'],
        unique: [true, 'Code is already in use']
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: [true, 'Name is already taken']
    },
    picture_url: {
        type: String,
        required: [true, 'Picture url is required'],
    }
    ,// TODO to remove those 3 properties below
    current_price: {
        type: Number,
    },
    lower_price: {
        type: Number,
    },
    highest_price: {
        type: Number,
    },
    updated_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

cryptoCurrencySchema.pre('remove', function(next) {
    this.model('User').update(
        {},
        { $pull: { crypto_currencies: this._id } },
        { multi: true },
        next
    );
});
const CryptoCurrency = mongoose.model('CryptoCurrency', cryptoCurrencySchema);

module.exports = CryptoCurrency;
