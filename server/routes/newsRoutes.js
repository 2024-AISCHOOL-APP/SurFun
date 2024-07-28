const express = require('express');
const Parser = require('rss-parser');
const axios = require('axios');
const cheerio = require('cheerio');

const router = express.Router();
const parser = new Parser();

router.get('/', async (req, res) => {
  try {
    const feed = await parser.parseURL('https://news.google.com/rss/search?q=%ED%95%B4%EC%96%91+%EC%95%A1%ED%8B%B0%EB%B9%84%ED%8B%B0&hl=ko&gl=KR&ceid=KR:ko');
    const items = feed.items.slice(0, 5); // 최대 5개만 가져옴

    const fetchFirstImage = async (url) => {
      try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        let imageUrl = $('img').first().attr('src') || $('img').first().attr('data-src');
        
        console.log(`Fetched image URL for ${url}: ${imageUrl}`);
        return imageUrl;
      } catch (error) {
        console.error(`Error fetching image for URL ${url}:`, error);
        return null;
      }
    };

    const newsWithImages = await Promise.all(items.map(async (item) => {
      const image = await fetchFirstImage(item.link);
      return { ...item, image: image || 'https://via.placeholder.com/150' };
    }));

    res.json(newsWithImages);
  } catch (error) {
    console.error('Failed to fetch news:', error);
    res.status(500).send('Failed to fetch news');
  }
});

module.exports = router;
