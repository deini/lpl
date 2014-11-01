// Modules
var express = require('express'),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    cors = require('cors'),
    config = require('./config'),
    //db = require('./helpers/db_helper'),
    Sequelize = require('sequelize');
    //routes = require('./routes/routes');

//db.initialize();




var sequelize = new Sequelize('seqtest', 'root', null);

var User = sequelize.define('User', {
    username: Sequelize.STRING,
    email: Sequelize.STRING,
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    fullName: Sequelize.STRING,
    facebookId: Sequelize.STRING
}, {
    timestamps: false
});

var Quote = sequelize.define('Quote', {
    text: {
        type: Sequelize.STRING,
        validate: { notEmpty: true }
    },
    context: Sequelize.STRING,
    score: Sequelize.DECIMAL(10, 2)
}, {
    timestamps: true
});

Quote.belongsTo(User, { as: 'Author', foreignKey: 'authorId' });
Quote.belongsTo(User, { as: 'Poster', foreignKey: 'posterId' });


// Creating tables
sequelize.sync({ force: true }) // Emit success or failure
    .success(function() {
        User.create({
            username: 'deini',
            email: 'danielalmaguer@gmail.com',
            firstName: 'Daniel',
            lastName: 'Almaguer',
            fullName: 'Daniel Almaguer',
            facebookId: '100003234521485'
        })
            .success(function(user) {
                Quote.create({
                    text: 'Da Dream'
                })
                    .success(function(quote) {
                        quote.setAuthor(user);
                    });
            });
    });


// Vars
var app = express(),
    origin = process.env.ORIGIN || 'http://localhost:3000';

app
    .set('port', config.PORT)
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use(logger('dev'))
    .use(cors({ origin: origin }));

//routes(app);

app.listen(app.get('port'), function() {
    console.log('Server running on port ' + app.get('port'));
});

