const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

// ENVIRONMENT VARIABLES
require('dotenv').config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Import routes
const userRouter = require('./routes/userRoutes');
const articleRouter = require('./routes/articleRoutes');
const providerRouter = require('./routes/providerRoutes');
const crypto_currencyRouter = require('./routes/crypto_currencyRoutes');
const {CLIENT_URL} = require("./config/config");

// Allow request only from client
app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}));

app.use(session({
  secret: "secret", // TODO: Change this
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

// Middlewares
// Default routes
//TODO - to check it soon
app.get('/', async (req, res) => {
    res.status(200).json({
        users: {
            get: '/users',
            get_: '/users/:id',
            post: '/users/login',
            put: '/users/:id',
            delete: '/users/:id',
            auth: {
                get: '/users/auth/google',
                get_: '/users/auth/google/callback',
            },
            users: {
                get: '/users/profile',
                post: '/users/register',
                post_: '/users/logout',
                delete: '/users/unsubscribe',
            }
        },
        articles: {
            get: '/articles',
            get_: '/articles/:id',
        },
        cryptos: {
            get: '/cryptos/[cmids=cmid1,cmid2,...]',
            post: '/cryptos',
            put: '/cryptos/:id',
            delete: '/cryptos/:id'
        },
    })
});

app.use('/users', userRouter);
app.use('/users/auth', providerRouter);
app.use('/articles', articleRouter);
app.use('/cryptos', crypto_currencyRouter);

module.exports = app;
