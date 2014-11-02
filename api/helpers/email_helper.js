var email = require('emailjs'),
    config = require('./../config'),
    User = require('./../models/user'),
    _ = require('lodash');

module.exports = {
    send: send
};

var smtpServer  = email.server.connect({
    user: config.EMAIL,
    password: config.EMAIL_PASSWORD,
    host: config.EMAIL_SMTP,
    ssl: true
});

function send(quote) {
    User.findAll()
        .then(function(users) {
            _.each(users, function(user) {
                sendHelper(user.email, quote.id);
            });
        });
}

function sendHelper(recipient, quoteId) {
    smtpServer.send({
        text:    'New Buki Quote: \nhttp://random.lpl.la/quotes/' + quoteId,
        from:    config.EMAIL,
        to:      recipient,
        subject: 'New Buki Quote Subject'
    }, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log('Mail sent!');
        }
    });
}
