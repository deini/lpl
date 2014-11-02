var Sequelize = require('sequelize'),
    sequelize = require('./../db/db');

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

module.exports = Quote;
