var Sequelize = require('sequelize'),
    sequelize = require('./../db/db'),
    email = require('./../helpers/email_helper');

// Quote Model
var Quote = sequelize.define('Quote', {
    text: {
        type: Sequelize.STRING,
        validate: { notEmpty: true }
    },
    context: Sequelize.STRING,
    score: Sequelize.DECIMAL(10, 2)
}, {
    timestamps: true
});

// Enable this hook for emails
//Quote.afterCreate(function(quote) {
//    email.send(quote);
//});

module.exports = Quote;
