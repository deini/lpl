var Quote = require('./../models/quote');

module.exports = {
    getQuotes: getQuotes,
    postQuote: postQuote
};

function getQuotes(req, res, next) {
    Quote.findAll()
        .then(function(result){
            return res.send(result);
        })
        .error(function(err) {
            return next(err);
        });
}

function postQuote(req, res, next) {
    Quote.create({
        text: req.body.text,
        context: req.body.context,
        posterId: req.user,
        authorId: req.body.author
    })
        .then(function() {
            console.log('Quote created');
        })
        .error(function(err) {
            console.log(err);
        });
}
