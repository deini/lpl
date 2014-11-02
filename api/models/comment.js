var Sequelize = require('sequelize'),
    sequelize = require('./../db/db');

// Comments Model
var Comment = sequelize.define('Comment', {
    text: {
        type: Sequelize.STRING,
        validate: { notEmpty: true }
    }
}, {
    timestamps: true
});

module.exports = Comment;


