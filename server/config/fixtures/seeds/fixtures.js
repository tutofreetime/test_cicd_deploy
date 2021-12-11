const fixtures = require('pow-mongoose-fixtures');
const bcrypt = require("bcrypt");
const salt = 10;
User = [
    {
        name: 'user1',
        email: 'user1@example.com',
        password: bcrypt.hashSync('test', salt),
        role: 'ROLE_USER',
    },
    {
        name: 'user2',
        email: 'user2@example.com',
        password: bcrypt.hashSync('test', salt),
        role: 'ROLE_USER',
    },
    {
        name: 'admin1',
        email: 'admin1@example.com',
        password: bcrypt.hashSync('test', salt),
        role: 'ROLE_ADMIN',
    },
    {
        name: 'admin2',
        email: 'admin2@example.com',
        password: bcrypt.hashSync('test', salt),
        role: 'ROLE_ADMIN',
    }
];


//Objects
fixtures.load({
    User
});
