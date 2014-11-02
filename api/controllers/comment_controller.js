var Comment = require('./../models/comment');

module.exports = {
    getComments: getComments,
    postComment: postComment
};

function getComments(req, res, next) {
    Comment.find({ where: { quoteId: req.param('quoteId') }})
        .then(function(result){
            return res.send(result);
        })
        .error(function(err) {
            return next(err);
        });
}

function postComment(req, res, next) {
    console.log('dem bodey');
    console.log(req.body.text);
    Comment.create({
        text: req.body.text,
        posterId: req.user,
        quoteId: req.param('quoteId')
    })
        .then(function() {
            console.log('Comment created');
        })
        .error(function(err) {
            console.log(err);
        });
}
