import React, { useState, useEffect } from 'react';
import '../../assets/scss/WeatherStyles.scss';

export default function DisplayWeather() {
  const [midWeather, setMidWeather] = useState(null);
  const [shortWeather, setShortWeather] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDates, setExpandedDates] = useState({});

  const getMidWeather = async () => {
    const response = await fetch(
      `https://apis.data.go.kr/1360000/MidFcstInfoService/getMidSeaFcst?serviceKey=V0b7rWgoRS5gxO0CfD1KDpRRmDv3lq8Zx%2BAUCVpi%2FVzym7%2Fyf48i%2BL7grZzQo6fkDX5GKonjMWTYR1vZtEYrrQ%3D%3D&pageNo=1&numOfRows=10&dataType=JSON&regId=12B10000&tmFc=202407280600`
    );
    const result = await response.json();
    setMidWeather(result.response.body.items.item[0]);
  };

  const getShortWeather = async () => {
    const response = await fetch(
      `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=V0b7rWgoRS5gxO0CfD1KDpRRmDv3lq8Zx%2BAUCVpi%2FVzym7%2Fyf48i%2BL7grZzQo6fkDX5GKonjMWTYR1vZtEYrrQ%3D%3D&pageNo=1&numOfRows=1000&dataType=JSON&base_date=20240728&base_time=0500&nx=33&ny=126`
    );
    const result = await response.json();
    setShortWeather(result.response.body.items.item);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getMidWeather();
      await getShortWeather();
      setLoading(false);
    };
    fetchData();
  }, []);

  const formatShortForecast = (data) => {
    const forecast = {};
    data.forEach((item) => {
      const date = item.fcstDate;
      const time = item.fcstTime;
      if (!forecast[date]) {
        forecast[date] = {};
      }
      if (!forecast[date][time]) {
        forecast[date][time] = {};
      }
      forecast[date][time][item.category] = item.fcstValue;
    });
    return forecast;
  };

  const shortForecastData = formatShortForecast(shortWeather);

  const filterTimes = ['0600', '1200', '1800', '0000'];

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case '맑음':
        return 'http://openweathermap.org/img/wn/01d.png';
      case '구름조금':
        return 'http://openweathermap.org/img/wn/02d.png';
      case '구름많음':
        return 'http://openweathermap.org/img/wn/03d.png';
      case '흐림':
        return 'http://openweathermap.org/img/wn/04d.png';
      case '비':
        return 'http://openweathermap.org/img/wn/09d.png';
      case '눈':
        return 'http://openweathermap.org/img/wn/13d.png';
      default:
        return 'http://openweathermap.org/img/wn/01d.png';
    }
  };

  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const getDayLabel = (date) => {
    const year = date.slice(0, 4);
    const month = date.slice(4, 6);
    const day = date.slice(6, 8);
    const d = new Date(`${year}-${month}-${day}`);
    return `${d.getMonth() + 1}.${d.getDate()} (${days[d.getDay()]})`;
  };

  const toggleDate = (date) => {
    setExpandedDates((prev) => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="weather-container">
          <h1>gangwondo Weather Forecast</h1>
          {midWeather && (
            <div className="weekly-forecast">
              <h2>중기 예보 (2024/07/27 - 2024/08/03)</h2>
              <div className="forecast-grid">
                {[...Array(7)].map((_, index) => {
                  const date = new Date(2024, 6, 27 + index); // Adjust the date to 27th July 2024 and onwards
                  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
                  const label = getDayLabel(dateStr);
                  return (
                    <div key={index} className="daily-forecast">
                      <h3>{label}</h3>
                      <div className="morning">
                        <img src={getWeatherIcon(midWeather[`wf${index + 3}Am`])} alt={midWeather[`wf${index + 3}Am`]} />
                        <p>{midWeather[`wf${index + 3}Am`]} (파고: {midWeather[`wh${index + 3}AAm`]}m)</p>
                      </div>
                      <div className="afternoon">
                        <img src={getWeatherIcon(midWeather[`wf${index + 3}Pm`])} alt={midWeather[`wf${index + 3}Pm`]} />
                        <p>{midWeather[`wf${index + 3}Pm`]} (파고: {midWeather[`wh${index + 3}APm`]}m)</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div className="detailed-forecast">
            <h2>상세 예보 (6시간 간격)</h2>
            {Object.keys(shortForecastData).map((date) => (
              <div key={date} className="date-forecast">
                <h3 onClick={() => toggleDate(date)}>{getDayLabel(date)}</h3>
                {expandedDates[date] && (
                  <div className="hourly-forecast-container">
                    {Object.keys(shortForecastData[date]).filter(time => filterTimes.includes(time)).map((time) => (
                      <div key={time} className="hourly-forecast">
                        <h4>{time.slice(0, 2)}:00</h4>
                        <p>기온: {shortForecastData[date][time]?.TMP}℃</p>
                        <p>강수확률: {shortForecastData[date][time]?.POP}%</p>
                        <p>강수형태: {shortForecastData[date][time]?.PTY}</p>
                        <p>1시간 강수량: {shortForecastData[date][time]?.PCP}</p>
                        <p>습도: {shortForecastData[date][time]?.REH}%</p>
                        <p>1시간 신적설: {shortForecastData[date][time]?.SNO}</p>
                        <p>하늘상태: {shortForecastData[date][time]?.SKY}</p>
                        <p>일 최저기온: {shortForecastData[date][time]?.TMN}℃</p>
                        <p>일 최고기온: {shortForecastData[date][time]?.TMX}℃</p>
                        <p>풍속(동서성분): {shortForecastData[date][time]?.UUU}m/s</p>
                        <p>풍속(남북성분): {shortForecastData[date][time]?.VVV}m/s</p>
                        <p>파고: {shortForecastData[date][time]?.WAV}m</p>
                        <p>풍향: {shortForecastData[date][time]?.VEC}deg</p>
                        <p>풍속: {shortForecastData[date][time]?.WSD}m/s</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
