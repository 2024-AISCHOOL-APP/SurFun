import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import '../../assets/scss/WeatherStyles.scss'; //웹

export default function DisplayWeather() {
  const [midWeather, setMidWeather] = useState(null);
  const [shortWeather, setShortWeather] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDates, setExpandedDates] = useState({});


  
  const getMidWeather = async () => {
    const response = await fetch(
      `https://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa?serviceKey=V0b7rWgoRS5gxO0CfD1KDpRRmDv3lq8Zx%2BAUCVpi%2FVzym7%2Fyf48i%2BL7grZzQo6fkDX5GKonjMWTYR1vZtEYrrQ%3D%3D&pageNo=1&numOfRows=10&dataType=JSON&regId=11G00201&tmFc=202407300600`
    );
    const result = await response.json();
    setMidWeather(result.response.body.items.item[0]);
  };

  const getShortWeather = async () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const baseDate = `${year}${month}${day}`;
  
    const response = await fetch(
      `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=V0b7rWgoRS5gxO0CfD1KDpRRmDv3lq8Zx%2BAUCVpi%2FVzym7%2Fyf48i%2BL7grZzQo6fkDX5GKonjMWTYR1vZtEYrrQ%3D%3D&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${baseDate}&base_time=0500&nx=33&ny=126`
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

  useEffect(() => {
    // 페이지 로드 시 기본적으로 모든 차트를 열어놓기
    if (shortWeather.length > 0) {
      const dates = shortWeather.reduce((acc, item) => {
        acc[item.fcstDate] = true;
        return acc;
      }, {});
      setExpandedDates(dates);
    }
  }, [shortWeather]);

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

  const chartData = (date) => {
    const labels = [];
    const tempData = [];
    const wavData = [];
    const wsdData = [];

    if (shortForecastData[date]) {
      Object.keys(shortForecastData[date])
        .filter(time => parseInt(time, 10) >= 600) // 시작 시간을 06시로 설정
        .sort()
        .forEach(time => {
          const forecast = shortForecastData[date][time];
          labels.push(`${time.slice(0, 2)}:00`);
          tempData.push(forecast.TMP);
          wavData.push(forecast.WAV);
          wsdData.push(forecast.WSD);
        });

    }

    return {
      labels,
      datasets: [
        {
          label: 'Temperature (℃)',
          data: tempData,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true
        },
        {
          label: 'Wave Height (m)',
          data: wavData,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: true
        },
        {
          label: 'Wind Speed (m/s)',
          data: wsdData,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: true
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000, // 애니메이션 시간 설정 (ms)
      easing: 'easeInOutBounce', // 애니메이션 이징 함수 easeInQuad, easeOutQuad, easeInOutQuad, linear,easeInOutBounce, easeInOutElastic
    }
  };

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="weather-container">
          <h1>Jeju Weather Forecast</h1>
          {midWeather && (
            <div className="weekly-forecast">
              <h2>주간 해양 </h2>
              <div className="forecast-grid">
                {[...Array(7)].map((_, index) => {
                  const date =new Date();
                  date.setDate(date.getDate() + index); //오늘 날짜부터 시작
                  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
                  const label = getDayLabel(dateStr);
                  const taMin = midWeather[`taMin${index + 3}`];
                  const taMax = midWeather[`taMax${index + 3}`];
                  const amCondition = midWeather[`wf${index + 3}Am`] || '맑음';
                  const pmCondition = midWeather[`wf${index + 3}Pm`] || '맑음';
                  return (
                    <div key={index} className="daily-forecast">
                      <h3>{label}</h3>
                      <div className="temperature">
                        <p>최저: {taMin}℃</p>
                        <p>최고: {taMax}℃</p>
                      </div>
                      <div className="condition">
                        <div className="morning">
                          <img src={getWeatherIcon(amCondition)} alt={amCondition} />
                          <p>{amCondition}</p>
                        </div>
                        <div className="afternoon">
                          <img src={getWeatherIcon(pmCondition)} alt={pmCondition} />
                          <p>{pmCondition}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div className="detailed-forecast">
            <h2>해양 상세</h2>
            {Object.keys(shortForecastData).map((date) => (
              <div key={date} className="date-forecast">
                <h3 onClick={() => toggleDate(date)}>{getDayLabel(date)}</h3>
                {expandedDates[date] && (
                  <div className="hourly-forecast-container">
                    <Line data={chartData(date)} options={chartOptions} />
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
