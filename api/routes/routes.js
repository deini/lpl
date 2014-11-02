var authHelper = require('./../helpers/auth_helper'),
    user = require('./../controllers/user_controller'),
    quote = require('./../controllers/quote_controller'),
    comment = require('./../controllers/comment_controller');

module.exports = function (app) {
    app
        // User Specific
        .get('/api/me', authHelper.ensureAuthenticated, user.me)
        .post('/auth/facebook', user.facebookLogin)

        // Quotes
        .get('/api/quotes', authHelper.ensureAuthenticated, quote.getQuotes)
        .get('/api/quotes/:quoteId', authHelper.ensureAuthenticated, quote.getQuote)
        .post('/api/quotes', authHelper.ensureAuthenticated, quote.postQuote)

        // Comments
        .get('/api/quotes/:quoteId/comments', authHelper.ensureAuthenticated, comment.getComments)
        .post('/api/quotes/:quoteId/comments', authHelper.ensureAuthenticated, comment.postComment)
};

