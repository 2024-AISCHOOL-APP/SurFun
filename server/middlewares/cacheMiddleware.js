const redisClient = require('../config/redisConfig');
const axios = require('axios');


const cacheMiddleware = async (req, res, next) => {
    const { url } = req;
    try {
        const data = await redisClient.get(url);
        if (data) {
            res.send(JSON.parse(data));
        } else {
            // 오리지널 send 메서드를 백업
            res.sendResponse = res.send;
            res.send = async (body) => {
                await redisClient.set(url, JSON.stringify(body), 'EX', 3600); // 1시간 동안 캐싱
                res.sendResponse(body);
            };
            next();
        }
    } catch (err) {
        console.error('Redis error:', err);
        next();
    }
};

module.exports = cacheMiddleware;
