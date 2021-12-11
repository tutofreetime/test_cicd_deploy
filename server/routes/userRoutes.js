const express = require('express');
const router = express.Router();

const userController = require('../src/controllers/userController');
const authFormController = require("../src/controllers/security/authFormController");
const authGoogleController = require("../src/controllers/security/authGoogleController");

router.route('/')
    .get(userController.getUsers)
    .post(userController.createUser);

router.route('/profile')
    .get(authFormController.profile);

router.route('/unsubscribe')
    .delete(authFormController.unsubscribe);

router.route('/:id')
    .get(userController.getUser)
    .put(userController.updateUser)
    .delete(userController.deleteUser);

router.route('/register')
    .post(authFormController.signUp);

router.route('/login')
    .post(authFormController.signIn);

router.route('/logout')
    .post(authFormController.logout);

// Provider Google GET /auth/google
// TODO - to create Route file
router.route('/auth/google')
    .get(authGoogleController.google);
router.route('/auth/google/code')
    .get(authGoogleController.code);
router.route('/auth/google/callback')
    .get(authGoogleController.callback);

module.exports = router;
