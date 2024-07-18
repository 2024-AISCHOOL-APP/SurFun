const session = require('express-session');
const RedisStore = require('connect-redis').default;
const Redis = require('ioredis');

let redisClient;
try {
    redisClient = new Redis();
    redisClient.on('error', err => {
        console.error('Redis connection error:', err);
    });
} catch (err) {
    console.error('Could not establish a connection with Redis. Exiting...');
    process.exit(1);
}

const sessionConfig = session({
    store: new RedisStore({ client: redisClient }),
    secret: 'your_secret_key', //이후에 설정 REDIS
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // https 사용시 true로 설정
});

module.exports = sessionConfig;
