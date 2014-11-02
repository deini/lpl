// DB init
var config = require('./../config'),
    Sequelize = require('sequelize');

var sequelize = new Sequelize(config.DB_NAME, config.DB_USER, config.DB_PASSWORD);

module.exports = sequelize;
