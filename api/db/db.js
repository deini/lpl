// DB init
var config = require('./../config'),
    thinky = require('thinky')({ //ToDo: Cambiar esto a require('thinky')(config.thinky) en todos lados para poder borrar este archivo
    host: config.DB_HOST,
    port: config.DB_PORT,
    db: config.DB_NAME
});

module.exports = thinky;
