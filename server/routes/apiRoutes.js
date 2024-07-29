const express =require('express');
const router =express.Router();
const cacheMiddleware= require('../middlewares/cacheMiddleware');
const axios =require('axios');
require('dotenv').config();

const clientId = process.env.NAVER_CLIENT_ID;
const clientSecret = process.env.NAVER_CLIENT_SECRET;

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

// // 네이버 뉴스 API 경로
// router.get('/news',async (req,res)=>{
//     try {
//         const response = await axios.get('https://openapi.naver.com/v1/search/news.json', {
//             params: {
//                 query: '해양 액티비티',
//                 display: 5,
//                 start: 1,
//                 sort: 'date'
//             },
//             headers: {
//                 'X-Naver-Client-Id': clientId,
//                 'X-Naver-Client-Secret': clientSecret
//             }
//         });
//         res.json(response.data);
//     } catch (error) {
//         console.error('Error fetching news:', error);
//         res.status(500).json({ error: 'Failed to fetch news' });
//     }
// });

module.exports=router;