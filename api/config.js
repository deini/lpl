var fs = require('fs'),
    path = require('path');


var privKey = fs.readFileSync(path.join(process.env.HOME, '.ssh/id_rsa'), 'utf8');

module.exports = {
    TOKEN_SECRET: privKey,
    DB_NAME: process.env.DB_NAME || 'bukiquotes',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || null,
    FACEBOOK_SECRET: process.env.FACEBOOK_SECRET,
    PORT: process.env.PORT || '1337',
    EMAIL: process.env.EMAIL || 'email@example.com',
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    EMAIL_SMTP: process.env.EMAIL_SMTP
};
