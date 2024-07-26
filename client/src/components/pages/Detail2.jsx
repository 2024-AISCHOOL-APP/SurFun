import React, { useEffect, useState } from 'react';

const WeatherData = () => {
  const [weatherData, setWeatherData] = useState(null); // 날씨 정보를 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [error, setError] = useState(null); // 에러 상태 추가

  useEffect(() => {
    const fetchWeatherData = async () => {
      const apiUrl = 'https://cors-anywhere.herokuapp.com/http://www.khoa.go.kr/api/oceangrid/beach/search.do?ServiceKey=cu0xn0qs6k9NGAdddoJtjg==&BeachCode=BCH001&ResultType=json'; // CORS 프록시를 사용한 API 주소
      try {
        const response = await fetch(apiUrl, {
          //mode: 'no-cors'
        });
        if (!response.ok) {
          throw new Error('날씨 정보를 불러오는 데 문제가 발생했습니다.');
        }
        const data = await response.json();
        console.log('Data:', data); // 응답 데이터를 콘솔에 출력

        setWeatherData(data.result.data); // 날씨 데이터를 상태에 설정합니다.
      } catch (error) {
        setError('날씨 정보를 불러오는 도중 에러가 발생했습니다.'); // 에러 상태 설정
      } finally {
        setLoading(false); // 로딩 상태 종료
      }
    };

    fetchWeatherData(); // 날씨 데이터를 가져오는 함수 호출
  }, []);

  if (loading) {
    return <p>로딩 중...</p>; // 로딩 중일 때 표시할 메시지
  }

  if (error) {
    return <p>{error}</p>; // 에러 메시지 표시
  }

  return (
    <div className='weather-data'>
      <h2>해변 정보</h2>
      <pre>{JSON.stringify(weatherData, null, 2)}</pre>
    </div>
  );
};

export default WeatherData;
