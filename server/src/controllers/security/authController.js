const User = require('../../models/userModel');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const {SESSION_SECRET}  = require('../../../config/config');

exports.signUp = async (request, response, callback) => {
    try {
        const user_data = request.body;
        user_data.password = bcrypt.hashSync(user_data.password, saltRounds);
        const user = await User.create(request.body);
        if (user) {
            // Remove password from response
            user.password = '';
        }
        response.status(201).json({
            message: 'User created successfully',
            data: user
        });
    } catch (e) {
        response.status(404).json({
            message: 'User not created : ' + e.message
        });
    }
}

exports.signIn = async (request, response, callback) => {
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

exports.profile = async (request, response, callback) => {
    const res_message = {
        message: 'Not user connected'
    }
    try {
        //Bed manner to get the token from the cookie
        const token = request.headers.cookie.split('=')[1];
        // login by form
        const user_from_cookie = jwt.verify(token, SESSION_SECRET);

        if (!user_from_cookie) {
            response.status(404).json(res_message);
        } else {
            const user = await User.findOne({
                _id: user_from_cookie.id
            });
            // Remove password from response
            user.password = '';
            response.status(200).json({
                message: 'User connected successfully',
                data: user
            });
        }
    } catch (e) {
        res_message.message = 'User not logged in : ' + e.message;
        response.status(404).json(res_message);
    }
}

exports.logout = async (request, response, callback) => {
    const res_message = {
        message: 'Not user connected'
    }
    try {
        //Bed manner to get the token from the cookie
        const token = request.headers.cookie.split('=')[1];
        //TODO - check is this user is on the database

        //Set token in cookie
        // TODO - to activate secure and domain
        response.status(200).cookie('token', null, {httpOnly: true})
            .json({
                message: 'User logout successfully',
            });
    } catch (e) {
        res_message.message = 'User not logged in : ' + e.message;
        response.status(404).json(res_message);
    }
}

