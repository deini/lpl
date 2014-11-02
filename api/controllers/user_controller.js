var User = require('./../models/user'),
    request = require('request'),
    qs = require('querystring'),
    authHelper = require('./../helpers/auth_helper'),
    config = require('./../config');

module.exports = {
    me: me,
    getUsers: getUsers,
    facebookLogin: facebookLogin
};

function me(req, res, next) {
    User.find(req.user)
        .then(function(result) {
            if (!result) {
                res.status(401);
            }
            return res.send(result);
        })
        .error(function(err) {
            return next(err);
        });
}

function getUsers(req, res, next) {
    User.findAll()
        .then(function(result) {
            return res.send(result);
        })
        .error(function(err) {
            return next(err);
        });
}

function facebookLogin(req, res, next) {
    var accessTokenUrl = 'https://graph.facebook.com/oauth/access_token';
    var graphApiUrl = 'https://graph.facebook.com/me';

    var params = {
        client_id: req.body.clientId,
        redirect_uri: req.body.redirectUri,
        client_secret: config.FACEBOOK_SECRET,
        code: req.body.code
    };

    // Step 1. Exchange authorization code for access token.
    request.get({ url: accessTokenUrl, qs: params }, function(err, response, accessToken) {
        accessToken = qs.parse(accessToken);

        // Step 2. Retrieve profile information about the current user.
        request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {

            if (!req.headers.authorization) {
                // Step 3. Create a new user account or return an existing one.
                User.find({ where: { facebookId: profile.id }})
                    .then(function(result) {
                        var existingUser = result;

                        if (existingUser) {
                            return res.send({ token: authHelper.createToken(existingUser) });
                        }

                        User.create({
                            email: profile.email,
                            username: profile.username,
                            firstName: profile.first_name,
                            lastName: profile.last_name,
                            fullName: profile.name,
                            facebookId: profile.id
                        })
                            .then(function(user) {
                                return res.send({ token: authHelper.createToken(user) });
                            })
                            .error(function(err) {
                                return next(err);
                            })
                    });
            }
        });
    });
}
