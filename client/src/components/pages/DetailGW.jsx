import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import '../../assets/scss/WeatherStyles.scss';
import lv1 from '../../assets/img/lv1.png';
import lv2 from '../../assets/img/lv2.png';
import lv3 from '../../assets/img/lv3.png';
import lv4 from '../../assets/img/lv4.png';
import lv5 from '../../assets/img/lv5.png';

export default function DetailGW() {
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState([]);
  const [shortWeather, setShortWeather] = useState([]);
  const [expandedDates, setExpandedDates] = useState({});

  const getActivityData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/modeling'); // Flask 서버에서 데이터 가져오기
      const result = await response.json();
      if (result.error) {
        console.error(result.error);
      } else {
        setActivityData(result);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const getShortWeather = async () => {
    const response = await fetch(
      `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=V0b7rWgoRS5gxO0CfD1KDpRRmDv3lq8Zx%2BAUCVpi%2FVzym7%2Fyf48i%2BL7grZzQo6fkDX5GKonjMWTYR1vZtEYrrQ%3D%3D&pageNo=1&numOfRows=1000&dataType=JSON&base_date=20240729&base_time=0500&nx=38&ny=128`
    );
    const result = await response.json();
    setShortWeather(result.response.body.items.item);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getActivityData();
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

  const getActivityLevelDescription = (level) => {
    switch (level) {
      case 1:
        return ['매우 좋음', lv1];
      case 2:
        return ['좋음', lv2];
      case 3:
        return ['보통', lv3];
      case 4:
        return ['나쁨', lv4];
      case 5:
        return ['매우 나쁨', lv5];
      default:
        return ['알 수 없음', ''];
    }
  };

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

  const calculateAverageActivityLevel = (data) => {
    const dateMap = {};
    data.forEach(entry => {
      const date = entry.date.split(' ')[0];
      if (!dateMap[date]) {
        dateMap[date] = [];
      }
      dateMap[date].push(entry.act_lv);
    });

    const averageData = Object.keys(dateMap).map(date => {
      const levels = dateMap[date];
      const avgLevel = levels.reduce((sum, val) => sum + val, 0) / levels.length;
      return {
        date,
        avgLevel: avgLevel.toFixed(2),
        description: getActivityLevelDescription(Math.round(avgLevel))
      };
    });

    return averageData;
  };

  const averageActivityData = calculateAverageActivityLevel(activityData);

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="weather-container">
          <h1>GangWon Weather Forecast</h1>
          {averageActivityData.length > 0 && (
            <div className="weekly-forecast">
              <h2>해양 액티비티 레벨</h2>
              <div className="forecast-grid">
                {averageActivityData.map((data, index) => (
                  <div key={index} className="daily-forecast">
                    <h3>{data.date}</h3>
                    <div className="condition">
                      <img src={data.description[1]} alt={data.description[0]} />
                      <p>예측 활동 수준: {data.description[0]} ({data.avgLevel})</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="detailed-forecast">
            <h2>상세 예보 (1시간 간격)</h2>
            {Object.keys(shortForecastData).map((date) => (
              <div key={date} className="date-forecast">
                <h3 onClick={() => toggleDate(date)}>{getDayLabel(date)}</h3>
                {expandedDates[date] && (
                  <div className="hourly-forecast-container">
                    <Line data={chartData(date)} options={{ responsive: true, maintainAspectRatio: false }} />
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
