const redisClient = require('../config/redisConfig');

const cacheMiddleware = (req, res, next) => {
    const { url } = req;

    redisClient.get(url, (err, data) => {
        if (err) {
            console.error('Redis error:', err);
            next();
            return;
        }

        if (data) {
            res.send(JSON.parse(data));
            return;
        }

        res.sendResponse = res.send;
        res.send = (body) => {
            redisClient.set(url, JSON.stringify(body), 'EX', 3600); // 1시간 동안 캐싱
            res.sendResponse(body);
        };

        next();
    });
};

module.exports = cacheMiddleware;
