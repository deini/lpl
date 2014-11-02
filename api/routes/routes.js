var authHelper = require('./../helpers/auth_helper'),
    user = require('./../controllers/user_controller'),
    quote = require('./../controllers/quote_controller');

module.exports = function (app) {
    app
        // User Specific
        .get('/api/me', authHelper.ensureAuthenticated, user.me)
        .post('/auth/facebook', user.facebookLogin)

        // Quotes
        .get('/api/quotes', authHelper.ensureAuthenticated, quote.getQuotes)
        .post('/api/quotes', authHelper.ensureAuthenticated, quote.postQuote);
};
