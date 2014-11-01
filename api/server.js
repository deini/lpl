// Modules
var express = require('express'),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    cors = require('cors'),
    config = require('./config'),
    db = require('./helpers/db_helper'),
    routes = require('./routes/routes');

db.initialize();

// Vars
var app = express(),
    origin = process.env.ORIGIN || 'http://localhost:3000';

app
    .set('port', config.PORT)
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use(logger('dev'))
    .use(cors({ origin: origin }));

routes(app);

app.listen(app.get('port'), function() {
    console.log('Server running on port ' + app.get('port'));
});
