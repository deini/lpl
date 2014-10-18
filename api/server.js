// Modules
var express = require('express'),
    mongoskin = require('mongoskin'),
    bodyParser = require('body-parser'),
    logger = require('morgan');

// Vars
var app = express(),
    db = mongoskin.db('mongodb://@localhost:27017/bukiquotes', { safe: true }),
    id = mongoskin.helper.toObjectID,
    origin = process.env.ORIGIN || 'http://localhost:3000';

// Custom Middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

app
    .use(bodyParser.urlencoded())
    .use(bodyParser.json())
    .use(logger())
    .use(allowCrossDomain)

    .param('collectionName', function(req, res, next, collectionName) {
        req.collection = db.collection(collectionName);
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
        req.collection.insert(req.body, {}, function(err, results) {
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

    .listen(1337, function() {
        console.log('Server running :1337');
    });