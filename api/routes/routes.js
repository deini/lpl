var api = require('./../controllers/api_controller'),
    apiHelper = require('./../helpers/api_helper'),
    authHelper = require('./../helpers/auth_helper'),
    user = require('./../controllers/user_controller');

module.exports = function (app) {
    app
        // User Specific
        .get('/api/me', authHelper.ensureAuthenticated, user.me)
        .post('/auth/facebook', user.facebookLogin)

        // Generic Collections
        .param('collectionName', apiHelper.collection)
        .get('/:collectionName', api.getCollections)
        .post('/:collectionName', api.postCollection)
        .get('/:collectionName/:id', api.getCollection)
        .put('/:collectionName/:id', api.putCollection)
        .delete('/:collectionName/:id', api.delCollection);
};
