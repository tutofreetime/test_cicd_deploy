const User = require('../../models/userModel');
const jwt = require('jsonwebtoken');
const {SESSION_SECRET}  = require('../../../config/config');
const {Issuer, generators} = require("openid-client");
const {checkUser} = require("../baseController");

// TODO - to optimize - For session
let ss = null
/**
 * @description - This function is used to redirect to google login page
 * @param request
 * @param response
 * @param callback
 * @returns {Promise<void>}
 */
exports.google = async (request, response, callback) => {
    //TODO - to optimize - Checker by setting up a middleware
    if (checkUser(request, response)) {
        return response.status(403).json({
            message: 'You are already logged in'
        });
    }

    const googleIssuer = await Issuer.discover('https://accounts.google.com');
    const client = new googleIssuer.Client({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uris: [process.env.GOOGLE_REDIRECT_URI],
    });
    const code_verifier = generators.codeVerifier()
    const code_challenge = generators.codeChallenge(code_verifier);
    const  redirect_url = client.authorizationUrl({
        scope: 'openid email profile',
        resource: process.env.GOOGLE_REDIRECT_URI,
        code_challenge,
        code_challenge_method: 'S256',
    });
    // TODO - to user express session
    ss = request.session;
    ss.code_verifier = code_verifier;
    response.cookie('code_verify', code_verifier).redirect(redirect_url);
}

/**
 * @description - Google callback (login and register)
 * @param request
 * @param response
 * @param callback
 * @returns {Promise<void>}
 */
exports.code = async (request, response, callback) => {
    const res_message = {
        message: 'Email or password is incorrect'
    }

    const googleIssuer = await Issuer.discover('https://accounts.google.com');
    googleIssuer.metadata.authorization_endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    const client = new googleIssuer.Client({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uris: [process.env.GOOGLE_REDIRECT_URI],
    });

    const params = client.callbackParams(request);
    const code_verifier = ss.code_verifier

    try {
        const tokenSet = await client.callback(process.env.GOOGLE_REDIRECT_URI, params, { code_verifier });
        const user_google = {
            auth_id: tokenSet.claims().sub,
            email: tokenSet.claims().email,
            username: tokenSet.claims().name,
            is_active: tokenSet.claims().email_verified,
        }
        // Verify if user is already logged in
        const user = await User.findOne({
            email: user_google.email
        });

        if (!user) {
            // Create new user
            const newUser = User.create(user_google);
            if (newUser) {
                // Remove password from response
                newUser.password = '';
            }
            response.status(201).json({
                message: 'Register logged in successfully',
                data: newUser
            });
        } else {
            // User is already logged in = login
            // Remove password from response
            user.password = '';
            const token = jwt.sign({
                id: user.id,
                email: user.email,
                role: user.role
            }, SESSION_SECRET);

            //Set token in cookie
            // TODO - to activate secure and domain and remove session (code_verify)
            response.status(200).cookie('token', token, {httpOnly: true})
                .json({
                    message: 'User logged in successfully',
                    data: user
                });
        }
    } catch (e) {
        res_message.message = 'User not logged in : ' + e.message;
        response.status(404).json(res_message);
    }
}

/**
 * @description - Check if user is logged in and return user data
 * @param request
 * @param response
 * @param callback
 * @returns {Promise<*>}
 */
exports.callback = async (request, response, callback) => {
    const user_info = checkUser(request);

    if (!user_info) {
        return response.status(401).send({error: 'Unauthorized'});
    }
    const user = await User.findOne({
        email: user_info.email
    });

    if (user) {
        user.password = '';
    }

    response.status(200).send({ user: user});
}
