const express = require('express');
const router = express.Router();
const { login, checkUser, getUserBy, deleteUser} = require("../../src/controllers/to_delete/user_controller");
const { register } = require("../../src/controllers/to_delete/user_controller");
const jwt = require("jsonwebtoken");
const {OAuth2Client} = require("google-auth-library/build/src/auth/oauth2client");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(200).send('respond with a resource');
});
//TODO - i did this part just for test if user can persist infos into the database
//TODO - you can modify it as you want. That is way i commented it.
router.post('/register', function(req, res, next) {
    //check if user not empty
    /*
        user :{
            name: "user1",
            email: "user1@user.com",
            password: "user"
        }
    */
    // if (req.body.user.name.length === 0 ||
    //     req.body.user.email.length === 0 ||
    //     req.body.user.password.length === 0)
    // {
    //     res.status(400).json({
    //         message: "User name, email or password is empty"
    //     });
    //     return;
    // }
    //
    // // TODO - Check if user is valid
    // const callback = (data) => {
    //     // TODO -  Generate the confirmation token
    //     // TODO - Send the confirmation token to the user's email
    //     res.status(data.status).send(data);
    // }
    // register(req.body.user, callback)
})

router.post('/logout', function(req, res, next) {
    if (checkUser(req)) {
        //Delete cookie
        res.clearCookie('token');
        res.status(200).send({
            message: 'Logout success'
        });
    } else {
        res.status(304).send({
            message: 'User not found'
        });
    }
})

router.post('/login', function(req, res, next) {
    if (checkUser(req)) {

        //Redirect user if is already logged in
        res.status(200).send({message: 'User already logged in'})
    } else {
        // Check if User exists
        if (!req.body.user) {
            res.status(404).send({message: 'username or password empty'});
        }

        const callback = (err, response) => {
            if (err) {
                res.status(404).send({message: 'username or password not corret'});
                return;
            }

            const token = jwt.sign({
                id: response.user.id,
                email: response.user.email,
                role: response.user.role
            }, process.env.JWT_SECRET);

            //Set token in cookie
            // TODO - to activate secure and domain
            res.cookie('token', token, {httpOnly: true})
                .send({ message: "Log in successfully"});
        }

        // Login { user, token}
        login(req.body.user, callback);
    }
});

router.get('/profile', async function(req, res, next) {
    const user = checkUser(req);
    if (user) {
        //Redirect user if is already logged in
        // User from database
        if (user.id) {
            getUserBy(user.id, (err, user_from_database) => {
                if (err) {
                    res.status(404).send({message: 'User not found'});
                    return;
                }
                res.status(user_from_database.status).send({
                    user: user_from_database.user
                });
            });
        } else {
            const client = new OAuth2Client()
            client.setCredentials({
                access_token: user.token,
                api_key: process.env.GOOGLE_API_KEY
            });

            //User from Google
            try {
                const google_user = await client.getRequestHeaders(
                    'https://www.googleapis.com/oauth2/v3/userinfo'
                );
                console.log("USER GOOGLE : ", google_user);
                res.status(200).send({ message: "Have to send user's data to the frontend"});
            } catch (e) {
                res.status(404).send({ message: "This user does not exist"});
            }
        }

    } else {
        res.status(404).send({ message: "Have to log first"});
    }
});

router.delete('/delete', async function(req, res, next) {
    const user_id = req.body.user_id;
    if (user_id) {
        deleteUser(user_id, (err, user_from_database) => {
            if (err) {
                res.status(404).send({message: 'User not found'});
                return;
            }
            res.status(user_from_database.status).send({
                message: user_from_database.message
            });
        });

    } else {
        res.status(404).send({ message: "User not found"});
    }
});

module.exports = router;
