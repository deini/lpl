// API Helpers
var _ = require('lodash'),
    thinky = require('./../db/db');


var collections = ['quote', 'user'];

module.exports = {
    response: function(promise, res, next) {
        promise
            .then(function(result) {
                return res.send(result);
            })
            .error(function(err) {
                return next(err);
            });
    },

    collection: function(req, res, next, collectionName) {
        if (!_.contains(collections, collectionName)) {
            return next(new Error('Collection not found.'));
        }
        req.model = thinky.models[collectionName];
        return next();
    }
};
