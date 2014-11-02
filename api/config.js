module.exports = {
    TOKEN_SECRET: process.env.TOKEN_SECRET || 'A hard to guess string',
    DB_NAME: process.env.DB_NAME || 'bukiquotes',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || null,
    FACEBOOK_SECRET: process.env.FACEBOOK_SECRET || '9428ffbc13210a45ce7ef7fe1fbabc55',
    PORT: process.env.PORT || '1337'
};
