var Sequelize = require('sequelize'),
    sequelize = require('./../db/db');


// User Model
var User = sequelize.define('User', {
    username: Sequelize.STRING,
    email: Sequelize.STRING,
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    fullName: Sequelize.STRING,
    facebookId: Sequelize.STRING,
    picture: Sequelize.STRING
}, {
    timestamps: false
});

User.afterCreate(function() {
    // Avoiding circular require
    var dbHelper = require('./../helpers/db_helper');
    dbHelper.dbTaskUpdatePictures();
});

module.exports = User;
