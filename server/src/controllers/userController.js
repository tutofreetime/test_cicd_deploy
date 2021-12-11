const User = require('../models/userModel');
const {checkUser} = require("./baseController");
const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * @description - This function is used to get all users. Only accessible by admin.
 * @param request
 * @param response
 * @param callback
 * @returns {Promise<*>}
 */
exports.getUsers = async (request, response, callback) => {

    if (checkUser(request, response).role !== 'ROLE_ADMIN') {
        return response.status(403).json({
            message: 'Forbidden'
        });
    }

    try {
        const users = await User.find();
        users.forEach(user => {
            user.password = '';
        });
        response.status(200).json({
            message: 'Users fetched successfully',
            data: users
        });
    } catch (e) {
        response.status(404).json({
            message: 'User not found'
        });
    }
}

/**
 * @description - This function is used to get a single user. Only accessible by admin.
 * @param request
 * @param response
 * @param callback
 * @returns {Promise<void>}
 */
exports.getUser = async (request, response, callback) => {
    //TODO - not optimal, but works for now. have to find a better way to do this
    if (checkUser(request, response).role !== 'ROLE_ADMIN') {
        return response.status(403).json({
            message: 'Forbidden'
        });
    }

    try {
        const user = await User.findById(request.params.id);

        if (user) {
            user.password = '';
        }

        response.status(200).json({
            message: 'User fetched successfully',
            data: user
        });
    } catch (e) {
        response.status(404).json({
            message: 'User not found ' + e.message
        });
    }
}

exports.createUser = async (request, response, callback) => {
    try {
        const user = await User.create(request.body);
        response.status(201).json({
            message: 'User created successfully',
            data: user
        });
    } catch (e) {
        response.status(404).json({
            message: 'User not created'
        });
    }
}

exports.updateUser = async (request, response, callback) => {
    const current_user = checkUser(request, response);

    //Stop user from updating other users
    if (!current_user) {
        response.status(401).json({
            message: 'Unauthorized'
        });
        return;
    }

    try {
        let user = [];
        const user_post = {
            ...request.body
        }

        // Hash password if exists
        if (user_post.password) {
            user_post.password = bcrypt.hashSync(user_post.password, saltRounds);
        }

        if (current_user.role !== 'ROLE_ADMIN') {
            // To update is own profile
            if (current_user.id.toString() !== request.params.id) {
                response.status(403).json({
                    message: 'You cannot update other users'
                });
                return;
            } else {
                delete user_post.role;
                delete user_post.is_verified;
            }
        }

        user = await User.findByIdAndUpdate(request.params.id, user_post, {
            new: true,
            runValidators: true
        });

        //TODO - update articles of this user
        response.status(201).json({
            message: 'User updated successfully',
            data: user
        });

    } catch (e) {
        response.status(404).json({
            message: 'User not updated. ' + e.message
        });
    }
}

/**
 * @ description - This function is used to delete a single user.
 * delete user by id
 * @param request
 * @param response
 * @param callback
 * @returns {Promise<void>}
 */
exports.deleteUser = async (request, response, callback) => {
    //TODO - not optimal, but works for now. have to find a better way to do this
    if (checkUser(request, response).role !== 'ROLE_ADMIN') {
        return response.status(403).json({
            message: 'Forbidden'
        });
    }

    try {
        await User.findByIdAndDelete(request.params.id);
        //TODO - have to delete all article and crypto related to this user

        response.status(200).json({
            message: 'User deleted successfully',
        });
    } catch (e) {
        response.status(404).json({
            message: 'User not deleted. ' + e.message
        });
    }
}
