const mongoose = require('mongoose');

const userCryptoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    crypto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Crypto',
        required: true
    },
});

// userCryptoSchema.pre('deleteMany', async function () {
//     const userCrypto = this;
//     const user = await User.findById(userCrypto.user);
//     user.cryptos.pull(userCrypto.crypto);
//     await user.save();
// });

const User = mongoose.model('UserCrypto', userCryptoSchema);

module.exports = User;
