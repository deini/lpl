module.exports = {
    TOKEN_SECRET: process.env.TOKEN_SECRET || 'A hard to guess string',
    MONGO_URI: process.env.MONGO_URI || 'localhost:27017/bukiquotes',
    FACEBOOK_SECRET: process.env.FACEBOOK_SECRET || '9428ffbc13210a45ce7ef7fe1fbabc55'
};
