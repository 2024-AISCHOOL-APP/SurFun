const session = require('express-session');
const RedisStore = require('connect-redis').default;
const redisClient =require('./redisConfig');

const sessionConfig = session({
    store: new RedisStore({ client: redisClient }),
    secret: 'your_secret_key', //이후에 설정 REDIS
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // https 사용시 true로 설정
});

module.exports = sessionConfig;
