var User = require('./../models/user'),
    request = require('request'),
    qs = require('querystring'),
    authHelper = require('./../helpers/auth_helper'),
    config = require('./../config');

module.exports = {
    me: me,
    facebookLogin: facebookLogin
};

function me(req, res, next) {
    User.getAll(req.user, { index: 'facebook' }).limit(1).run()
        .then(function(result){
            return res.send(result[0]);
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
                User.getAll(profile.id, {index: 'facebook' }).limit(1).run()
                    .then(function(result) {
                        var existingUser = result[0];

                        if (existingUser) {
                            return res.send({ token: authHelper.createToken(existingUser) });
                        }

                        User.save([{
                            email: profile.email,
                            username: profile.username,
                            firstName: profile.first_name,
                            lastName: profile.last_name,
                            fullName: profile.name,
                            facebook: profile.id
                        }])
                            .then(function(user) {
                                return res.send({ token: authHelper.createToken(user[0]) });
                            })
                            .error(function(err) {
                                return next(err);
                            })
                    });
            }
        });
    });
}
