const User = require('../../models/userModel');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const {SESSION_SECRET}  = require('../../../config/config');
const {checkUser} = require("../baseController");

exports.signUp = async (request, response, callback) => {
    if (checkUser(request, response)) {
        return response.status(403).json({
            message: 'You are already logged in'
        });
    }
    try {
        const user_data = request.body;
        const user = await User.create({
            username: user_data.username,
            email: user_data.email,
            password: bcrypt.hashSync(user_data.password, saltRounds)
        });
        if (user) {
            // Remove password from response
            user.password = '';
        }
        response.status(201).json({
            message: 'User created successfully',
            data: user
        });
    } catch (e) {
        if (e.code === 11000) {
            response.status(400).json({
                message: 'User already exists'
            });
        } else {
            response.status(500).json({
                message: 'Something went wrong'
            });
        }
    }
}

exports.signIn = async (request, response, callback) => {

    const user_data = checkUser(request, response)
    if (user_data) {
        const user = await User.findOne({email: user_data.email});
        if (user ) {
            user.password = '';
        }
        response.status(200).json({
            message: 'User already logged in',
            user: user
        });
    } else {
        const res_message = {
            message: 'Email or password is incorrect'
        }

        try {
            const user_data = request.body;
            const user = await User.findOne({
                email: user_data.email
            });

            if (!user) {
                response.status(404).json(res_message);
            } else {
                if (bcrypt.compareSync(user_data.password, user.password)) {
                    // Remove password from response
                    user.password = '';

                    const token = jwt.sign({
                        id: user.id,
                        email: user.email,
                        role: user.role
                    }, SESSION_SECRET);

                    //Set token in cookie
                    // TODO - to activate secure and domain
                    response.status(200).cookie('token', token, {httpOnly: true})
                        .json({
                            message: 'User logged in successfully',
                            data: user
                        });
                } else {
                    response.status(404).json({
                        message: 'Email or password is incorrect'
                    });
                }
            }
        } catch (e) {
            res_message.message = 'User not logged in : ' + e.message;
            response.status(404).json(res_message);
        }
    }
}

exports.profile = async (request, response, callback) => {
    const res_message = {
        message: 'Not user connected'
    }
    try {
        // login by form
        const user_from_cookie = checkUser(request, response);

        if (!user_from_cookie) {
            response.status(404).json(res_message);
        } else {
            const user = await User.findOne({
                _id: user_from_cookie.id
            }).populate('crypto_currencies').populate('articles');
            // Remove password from response
            user.password = '';
            response.status(200).json({
                data: user
            });
        }
    } catch (e) {
        res_message.message = 'User not logged in : ' + e.message;
        response.status(404).json(res_message);
    }
}

/**
 * @description remove user token from cookie
 * @param request
 * @param response
 * @param callback
 * @returns {Promise<void>}
 */
exports.logout = async (request, response, callback) => {
    try {
        //Remove cookie token from response
        if (request.cookies.token) {
            response.status(200).clearCookie('token').send({
                message: 'User logged out successfully'
            });
        } else {
            response.status(404).send({
                message: 'User not logged in'
            });
        }
    } catch (e) {
        response.status(404).json({
            message: 'No cookies found'
        });
    }
}

/**
 * @ description - This function is used to unsubscribe an user.
 * check if this user is the current user.
 * @param request
 * @param response
 * @param callback
 * @returns {Promise<void>}
 */
exports.unsubscribe = async (request, response, callback) => {
    const user = checkUser(request, response);
    if (!user) {
        return response.status(403).json({
            message: 'Forbidden'
        });
    }

    try {
        await User.findByIdAndDelete(user.id);
        //TODO - have to delete all article and crypto related to this user
        response.clearCookie('token');
        response.status(202).json({
            message: 'User unsubscribed successfully',
        });
    } catch (e) {
        response.status(404).json({
            message: 'User not deleted. ' + e.message
        });
    }
}
