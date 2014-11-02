var Quote = require('./../models/quote'),
    Comment = require('./../models/comment');

module.exports = {
    getQuotes: getQuotes,
    getQuote: getQuote,
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

function getQuote(req, res, next) {
    var data = {};

    Quote.find(req.param('quoteId'))
        .then(function(result){
            data.quote = result;
            return Comment.findAll({ where: { quoteId: req.param('quoteId') }})
        })
        .then(function(result) {
            data.comments = result;
            res.send(data);
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
