var thinky = require('./../db/db');
// User Model

var User = thinky.createModel('user', {
    username: { _type: String, enforce_missing: true },
    email: { _type: String, enforce_missing: true },
    firstName: String,
    lastName: String,
    fullName: String,
    facebook: String
}, {
    enforce_extra: 'remove'
});

User.ensureIndex('facebook');

module.exports = User;
