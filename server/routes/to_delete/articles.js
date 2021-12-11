const express = require('express');
const router = express.Router();
const { findAll, findBy, deleteBy, create, find} = require("../../src/controllers/to_delete/article_controller");
const {checkUser} = require("../../src/controllers/to_delete/user_controller");

/* GET articles visible true created by Admin */
router.get('/', function(req, res, next) {
    const user =  checkUser(req);
    const query = req.query
    console.log(query)
    return
    // TODO - separate admin and user requests -- soon (.role === 'ROLE_ADMIN' || user.role === 'ROLE_USER')
    if (user) {
        // TODO : User - return all visible articles created by this user
        findBy({user_id: user.id }, (error, response)=>{
            if (error) {
                res.status(error.status).json(error);
            } else {
                res.status(response.status).json({
                    articles: response.articles
                })
            }
        });
    } else {
        // Visitors - return all visible articles created by Admin
        // TODO : User - return all visible articles created by this user
        findBy(null, (error, response)=>{
            if (error) {
                res.status(error.status).json(error);
            } else {
                res.status(response.status).json({
                    articles: response.articles
                })
            }
        });
    }
});

/* TODO - GET article visible by Id Vibible  */
/* TODO - Check if is logged and if article belongs to him or admin   */
/* TODO - Check if !user return article if existe and created by admin and is visible or null  */
router.get('/:id', function(req, res, next) {
    const user =  checkUser(req);
    console.log(req.params.id);
    console.log(user);
    // TODO - separate admin and user requests -- soon (.role === 'ROLE_ADMIN' || user.role === 'ROLE_USER')
    if (user) {
        // TODO : User - return all visible articles created by this user
        find(req.params.id, (error, response)=>{
            if (error) {
                res.status(error.status).json(error);
            } else {

                //TODO -
                res.status(response.status).json({
                    article: response.article
                })
            }
        });
    } else {
        // Visitors - return all visible articles created by Admin
        // TODO : User - return all visible articles created by this user
        find(req.params.id, (error, response)=>{
            if (error) {
                res.status(error.status).json(error);
            } else {
                res.status(response.status).json({
                    article: response.article
                })
            }
        });
    }
});

//
// /* POST create article */
// router.post('/create', function(req, res, next) {
//     //check if user not empty
//     /*
//         user :{
//             name: "user1",
//             email: "user1@user.com",
//             password: "user"
//         }
//     */
//     if (req.body.user.name.length === 0 ||
//         req.body.user.email.length === 0 ||
//         req.body.user.password.length === 0)
//     {
//         res.status(400).json({
//             message: "User name, email or password is empty"
//         });
//         return;
//     }
//
//     // TODO - Check if user is valid
//     const callback = (data) => {
//         // TODO -  Generate the confirmation token
//         // TODO - Send the confirmation token to the user's email
//         res.status(data.status).send(data);
//     }
//     register(req.body.user, callback)
// })
//
// /* PUT update article */
// router.put('/update/:id', function(req, res, next) {
//     if (checkUser(req)) {
//
//         //Redirect user if is already logged in
//         res.status(200).send({message: 'User already logged in'})
//     } else {
//         // Check if User exists
//         if (!req.body.user) {
//             res.status(404).send({message: 'username or password empty'});
//         }
//
//         const callback = (err, response) => {
//             if (err) {
//                 res.status(404).send({message: 'username or password not corret'});
//                 return;
//             }
//
//             const token = jwt.sign({
//                 id: response.user.id,
//                 email: response.user.email,
//                 role: response.user.role
//             }, process.env.JWT_SECRET);
//
//             //Set token in cookie
//             // TODO - to activate secure and domain
//             res.cookie('token', token, {httpOnly: true})
//                 .send({ message: "Log in successfully"});
//         }
//
//         // Login { user, token}
//         login(req.body.user, callback);
//     }
// });
//
// router.delete('/delete/:id', async function(req, res, next) {
//     const user_id = req.body.user_id;
//     if (user_id) {
//         deleteUser(user_id, (err, user_from_database) => {
//             if (err) {
//                 res.status(404).send({message: 'User not found'});
//                 return;
//             }
//             res.status(user_from_database.status).send({
//                 message: user_from_database.message
//             });
//         });
//
//     } else {
//         res.status(404).send({ message: "User not found"});
//     }
// });

module.exports = router;
