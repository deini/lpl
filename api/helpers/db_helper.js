var User = require('./../models/user'),
    Quote = require('./../models/quote'),
    Comment = require('./../models/comment'),
    sequelize = require('./../db/db'),
    request = require('request'),
    _ = require('lodash'),
    CronJob = require('cron').CronJob;

module.exports = {
    initialize: initialize,
    dbTaskUpdatePictures: dbTaskUpdatePictures
};

function initialize() {
    Quote.belongsTo(User, {as: 'Author', foreignKey: 'authorId'});
    Quote.belongsTo(User, {as: 'Poster', foreignKey: 'posterId'});
    Quote.hasMany(Comment, {as: 'Comments', foreignKey: 'quoteId'});
    Comment.belongsTo(User, {as: 'Poster', foreignKey: 'posterId'});

    // Creating tables
    sequelize.sync()// {force: true} // Emit success or failure
        .success(function () {
            console.log('Successful Sync');
        })
        .error(function (error) {
            console.log('Fail Sync');
            console.log(error);
        });

    new CronJob('0 0,30 * * * *', dbTaskUpdatePictures, null, true);
}


function dbTaskUpdatePictures() {
    var params = {
        redirect: 0,
        height: 200,
        width: 200,
        type: 'normal'
    };

    User.findAll()
        .then(function(users) {
            _.each(users, function(user) {
                var url = 'http://graph.facebook.com/v2.2/' + user.facebookId + '/picture';
                request.get({ url: url, qs: params, json: true }, function(err, response, picture) {
                    updatePicture(user.id, picture.data.url);
                });
            });
        });
}

function updatePicture(userId, picUrl) {
    if (!userId || !picUrl) {
        return;
    }

    User.find(userId)
        .then(function(user) {
            user.picture = picUrl;
            user.save();
        });
}
