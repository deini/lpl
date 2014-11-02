// DB init
var config = require('./../config'),
    Sequelize = require('sequelize');

var sequelize = new Sequelize('seqtest', 'root', null);

module.exports = sequelize;
