var User = require('./../models/user'),
    Quote = require('./../models/quote'),
    Comment = require('./../models/comment'),
    sequelize = require('./../db/db');

module.exports = {
    initialize: initialize
};

function initialize() {
    Quote.belongsTo(User, {as: 'Author', foreignKey: 'authorId'});
    Quote.belongsTo(User, {as: 'Poster', foreignKey: 'posterId'});
    Quote.hasMany(Comment, {as: 'Comments', foreignKey: 'quoteId'});
    Comment.belongsTo(User, {as: 'Poster', foreignKey: 'posterId'});

    // Creating tables
    sequelize.sync({force:true})// {force: true} // Emit success or failure
        .success(function () {
            console.log('Successful Sync');
        })
        .error(function (error) {
            console.log('Fail Sync');
            console.log(error);
        });
}
