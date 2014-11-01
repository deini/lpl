var thinky = require('./../db/db');

// Quote Model
var Quote = thinky.createModel('quote', {
    text: { _type: String, enforce_missing: true },
    context: String,
    score: Number,
    author: { _type: String, enforce_missing: true },
    created_at: { _type: Date, default: thinky.r.now() }
}, {
    enforce_extra: 'remove'
});

module.exports = Quote;
