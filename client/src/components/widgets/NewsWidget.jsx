import axios from 'axios';

const getNews = async () => {
  try {
    const response = await axios.get('<http://localhost:5000/api/news>');
    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};

export default getNews;