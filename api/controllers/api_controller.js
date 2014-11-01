var thinky = require('./../db/db'),
    apiHelpers = require('./../helpers/api_helper');

module.exports = {
    getCollections: function(req, res, next) {
        apiHelpers.response(thinky.r.table(req.model.getTableName()).run(), res, next);
    },
    getCollection: function(req, res, next) {
        apiHelpers.response(req.model.get(req.params.id).run(), res, next);
    },
    postCollection: function(req, res, next) {
        apiHelpers.response(req.model.save(req.body), res, next);
    },
    putCollection: function(req, res, next) {
        apiHelpers.response(req.model.get(req.params.id).update(req.body).run(), res, next);
    },
    delCollection: function(req, res, next) {
        apiHelpers.response(req.model.get(req.params.id).delete().run(), res, next);
    }
};
