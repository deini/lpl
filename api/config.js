module.exports = {
    TOKEN_SECRET: process.env.TOKEN_SECRET || 'A hard to guess string',
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: process.env.DB_PORT || 28015,
    DB_NAME: process.env.DB_NAME || 'bukiquotes',
    FACEBOOK_SECRET: process.env.FACEBOOK_SECRET || '9428ffbc13210a45ce7ef7fe1fbabc55'
};
