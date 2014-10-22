// DB init
var config = require('./../config'),
    thinky = require('thinky')({
    host: config.DB_HOST,
    port: config.DB_PORT,
    db: config.DB_NAME
});

module.exports = thinky;
