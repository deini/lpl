var User = require('./../models/user'),
    Quote = require('./../models/quote');

module.exports = {
    initialize: initialize
};

function initialize() {
    User.hasMany(Quote, 'quotes', 'id', 'authorId');
    Quote.belongsTo(User, 'author', 'authorId', 'id');
}
