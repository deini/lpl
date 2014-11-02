// DB init
var config = require('./../config'),
    Sequelize = require('sequelize');

var sequelize = new Sequelize('bukiquotes', 'root', null);

module.exports = sequelize;
