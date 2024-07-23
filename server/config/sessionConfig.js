const session = require('express-session');
const RedisStore = require('connect-redis').default;
const redisClient =require('./redisConfig');

const sessionConfig = session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET, //이후에 설정 REDIS - 환경변수에서 비밀 키를 가져옴
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // https 사용시 true로 설정
});

module.exports = sessionConfig;
