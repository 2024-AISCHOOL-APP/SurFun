const express =require('express');
const router =express.Router();
const cacheMiddleware= require('../middlewares/cacheMiddleware');
const axios =require('axios');

// 외부 API 호출 함수
const fetchExternalAPI = async (url) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching data from external API');
    }
};

// 날씨 API 경로
router.get('/weather', cacheMiddleware, async (req, res) => {
    try {
        const weatherData = await fetchExternalAPI('https://api.example.com/weather');
        res.send(weatherData);
    } catch (error) {
        res.status(500).send('Error fetching weather data');
    }
});

// 뉴스 API 경로
router.get('/news', cacheMiddleware, async (req, res) => {
    try {
        const newsData = await fetchExternalAPI('https://api.example.com/news');
        res.send(newsData);
    } catch (error) {
        res.status(500).send('Error fetching news data');
    }
});

module.exports=router;