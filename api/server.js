// Modules
var express = require('express'),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    jwt = require('jwt-simple'),
    moment = require('moment'),
    request = require('request'),
    qs = require('querystring'),
    _ = require('lodash'),
    cors = require('cors'),
    config = require('./config'),
    thinky = require('thinky')({
        host: config.DB_HOST,
        port: config.DB_PORT,
        db: config.DB_NAME
    });

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

var Quote = thinky.createModel('quote', {
    text: { _type: String, enforce_missing: true },
    context: String,
    score: Number,
    author: { _type: String, enforce_missing: true },
    created_at: { _type: Date, default: thinky.r.now() }
    }, {
    enforce_extra: 'remove'
});

User.hasMany(Quote, 'quotes', 'id', 'authorId');
Quote.belongsTo(User, 'author', 'authorId', 'id');

// Vars
var app = express(),
    origin = process.env.ORIGIN || 'http://localhost:3000',
    collections = ['quote', 'user'];

/*
 |--------------------------------------------------------------------------
 | Login Required Middleware
 |--------------------------------------------------------------------------
 */
function ensureAuthenticated(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
    }

    var token = req.headers.authorization.split(' ')[1];
    console.log('token');
    console.log(token);
    var payload = jwt.decode(token, config.TOKEN_SECRET);

    if (payload.exp <= moment().unix()) {
        return res.status(401).send({ message: 'Token has expired' });
    }

    req.user = payload.sub;
    next();
}

/*
 |--------------------------------------------------------------------------
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */
function createToken(user) {
    var payload = {
        sub: user.facebook,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    };
    return jwt.encode(payload, config.TOKEN_SECRET);
}


function apiHelper(promise, res, next) {
    promise
        .then(function(result) {
            return res.send(result);
        })
        .error(function(err) {
            return next(err);
        });
}

app
    .set('port', process.env.PORT || 1337)
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use(logger('dev'))
    .use(cors({ origin: origin }))

    .param('collectionName', function(req, res, next, collectionName) {
        if (!_.contains(collections, collectionName)) {
            return next(new Error('Collection not found.'));
        }
        req.model = thinky.models[collectionName];
        return next();
    })

    /*
    |--------------------------------------------------------------------------
    | GET /api/me
    |--------------------------------------------------------------------------
    */
    .get('/api/me', ensureAuthenticated, function(req, res, next) {
        User.getAll(req.user, { index: 'facebook' }).limit(1).run()
            .then(function(result){
                return res.send(result[0]);
            })
            .error(function(err) {
                return next(err);
            });
    })

    /*
    |--------------------------------------------------------------------------
    | Login with Facebook
    |--------------------------------------------------------------------------
    */
    .post('/auth/facebook', function(req, res, next) {
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
                                console.log('Existing User');
                                console.log(existingUser);
                                return res.send({ token: createToken(existingUser) });
                            }

                            User.save({
                                email: profile.email,
                                username: profile.username,
                                firstName: profile.first_name,
                                lastName: profile.last_name,
                                fullName: profile.name,
                                facebook: profile.id
                            })
                                .then(function(user) {
                                    return res.send({ token: createToken(user) });
                                })
                                .error(function(err) {
                                    return next(err);
                                })
                    });
                }
            });
        });
    })

    .get('/:collectionName', function(req, res, next) {
        apiHelper(thinky.r.table(req.model.getTableName()).run(), res, next);
    })

    .post('/:collectionName', function(req, res, next) {
        apiHelper(req.model.save(req.body), res, next);
    })

    .get('/:collectionName/:id', function(req, res, next) {
        apiHelper(req.model.get(req.params.id).run(), res, next);
    })

    .put('/:collectionName/:id', function(req, res, next) {
        apiHelper(req.model.get(req.params.id).update(req.body).run(), res, next);
    })

    .del('/:collectionName/:id', function(req, res, next) {
        apiHelper(req.model.get(req.params.id).delete().run(), res, next);
    })


    .listen(app.get('port'), function() {
        console.log('Server running on port ' + app.get('port'));
    });
