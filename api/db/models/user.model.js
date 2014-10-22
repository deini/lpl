var thinky = require('./../db');
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


function me(req, res, next) {
    User.getAll(req.user, { index: 'facebook' }).limit(1).run()
        .then(function(result){
            return res.send(_.first(result));
        })
        .error(function(err) {
            return next(err);
        });
}

module.exports = {
    model: User,
    me: me
};
