const Redis = require('ioredis');

let redisClient;
try {
    redisClient = new Redis(); // 여기서 Redis 인스턴스를 생성
    redisClient.on('error', err => {
        console.error('Redis connection error:', err);
    });
} catch (err) {
    console.error('Could not establish a connection with Redis. Exiting...');
    process.exit(1);
}

module.exports = redisClient;
