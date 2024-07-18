import axios from 'axios';

const API_KEY = '1fc7ebdf437586e4a64c8ec8e9bdc7c9'; // 새로운 OpenWeatherMap API 키

// getWeatherData 함수: 도시 이름을 받아 해당 도시의 날씨 데이터를 가져옴
const getWeatherData = async (city) => {
    try {
        // OpenWeatherMap API 호출
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
                q: city,
                units: 'metric', // 섭씨 단위로 설정
                appid: API_KEY // API 키 설정
            }
        });
        console.log('Weather data:', response.data); // 응답 데이터 확인 (디버그 용도)
        return response.data;
    } catch (error) {
        // 에러 처리
        console.error('Error fetching weather data:', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        }
        throw error;
    }
};

export default getWeatherData;
