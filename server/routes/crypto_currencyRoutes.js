const express = require('express');
const router = express.Router();

const crypto_currencyController = require('../src/controllers/crypto_currencyController');

router.route('/')
    .get(crypto_currencyController.getCryptoCurrencies)
    .post(crypto_currencyController.createCryptoCurrency);

router.route('/:cmid')
    .get(crypto_currencyController.getCryptoCurrency)
    .put(crypto_currencyController.updateCryptoCurrency)
    .delete(crypto_currencyController.deleteCryptoCurrency);

router.route('/:id/history/:period')
    .get(crypto_currencyController.getHistory);
module.exports = router;
