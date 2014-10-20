// Modules
var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    jwt = require('jwt-simple'),
    moment = require('moment'),
    request = require('request'),
    qs = require('querystring'),
    _ = require('lodash'),
    cors = require('cors'),
    timestamps = require('mongoose-timestamp');

// Config
var config = require('./config');

// Schema
var userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true, lowercase: true },
    firstName: String,
    lastName: String,
    fullName: String,
    facebook: String
});

var quoteSchema = new mongoose.Schema({
    text: { type: String, required: true },
    context: String,
    score: Number,
    posted_by: { type: mongoose.Schema.ObjectId, ref: 'userSchema' },
    by: { type: mongoose.Schema.ObjectId, ref: 'userSchema' }
});

mongoose.plugin(timestamps, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

quoteSchema.plugin(timestamps);

// Vars
var app = express(),
    User = mongoose.model('User', userSchema),
    Quote = mongoose.model('Quote', quoteSchema),
    origin = process.env.ORIGIN || 'http://localhost:3000',
    collections = ['quotes', 'users'],
    models = {
        users: User,
        quotes: Quote
    };

// DB Setup
mongoose.connect(config.MONGO_URI);

// Randy helper
var id = function(id) {
    return mongoose.Types.ObjectId(id);
};

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
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    };
    return jwt.encode(payload, config.TOKEN_SECRET);
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
        req.collection = mongoose.connection.db.collection(collectionName);
        req.model = models[collectionName];
        return next();
    })

    .get('/:collectionName', function(req, res, next) {
        req.collection.find({}).toArray(function(err, results) {
            if (err) {
                return next(err);
            }
            res.send(results);
        });
    })

    .post('/:collectionName', function(req, res, next) {
        req.model.create(req.body, function(err, results) {
            if (err) {
                return next(err);
            }
            res.send(results);
        });
    })

    .get('/:collectionName/:id', function(req, res, next) {
        req.collection.findOne({ _id: id(req.params.id) }, function(err, result) {
            if (err) {
                return next (err);
            }
            res.send(result);
        });
    })

    .put('/:collectionName/:id', function(req, res, next) {
        req.collection.update({ _id: id(req.params.id) }, { $set:req.body }, { safe: true, multi: false },
            function(err, result) {
                if (err) {
                    return next(err);
                }
                res.send((result === 1) ? { msg: 'success' } : { msg: 'error' });
            });
    })

    .del('/:collectionName/:id', function(req, res, next) {
        req.collection.remove({ _id: id(req.params.id) }, function(err, result) {
            if (err) {
                return next(err);
            }
            res.send((result === 1) ? { msg: 'success' } : { msg: 'error' });
        });
    })

    /*
     |--------------------------------------------------------------------------
     | GET /api/me
     |--------------------------------------------------------------------------
     */
    .get('/api/me', ensureAuthenticated, function(req, res) {
        User.findById(req.user, function (err, user) {
            res.send(user);
        });
    })

    /*
     |--------------------------------------------------------------------------
     | Login with Facebook
     |--------------------------------------------------------------------------
     */
    .post('/auth/facebook', function(req, res) {
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
                    User.findOne({ facebook: profile.id }, function(err, existingUser) {
                        if (existingUser) {
                            return res.send({ token: createToken(existingUser) });
                        }

                        var user = new User();
                        user.email = profile.email;
                        user.username = profile.username;
                        user.firstName = profile.first_name;
                        user.lastName = profile.last_name;
                        user.fullName = profile.name;
                        user.facebook = profile.id;
                        user.save(function(err) {
                            res.send({ token: createToken(user) });
                        });
                    });
                }
            });
        });
    })

    .listen(app.get('port'), function() {
        console.log('Server running on port ' + app.get('port'));
    });
