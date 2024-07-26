import React, { useEffect, useState } from 'react';

const Detail = () => {
  const [weatherData, setWeatherData] = useState(null); // 날씨 정보를 저장할 상태

  useEffect(() => {
    const fetchWeatherData = async () => {
      const apiUrl = 'http://www.khoa.go.kr/api/oceangrid/beach/search.do?ServiceKey=wldhxng34hkddbsgm81lwldhxng34hkddbsgm81l==&BeachCode=BCH001&ResultType=json'; // API 주소

      try {
        const response = await fetch(apiUrl, {
          mode: 'cors', // CORS 모드로 변경
        });

        if (!response.ok) {
          throw new Error('날씨 정보를 불러오지 못했습니다.');
        }

        const data = await response.json();
        // API에서 필요한 날씨 데이터를 추출하여 설정합니다.
        const weatherInfo = {
          time: data.result.data[0].obs_time, // 날씨 관측 시간
          wind: `${data.result.data[0].wind_direct} ${data.result.data[0].wind_speed} m/s`, // 바람 방향과 속도
          wave: `${data.result.data[0].tide} m`, // 조수 (파고 예시)
          temp: `${data.result.data[0].water_temp} °C`, // 기온
          day1_am_status: data.result.data[0].day1_am_status, // 첫째 날 오전 상태
          day1_pm_status: data.result.data[0].day1_pm_status, // 첫째 날 오후 상태
          day2_am_status: data.result.data[0].day2_am_status, // 둘째 날 오전 상태
          day2_pm_status: data.result.data[0].day2_pm_status, // 둘째 날 오후 상태
          day3_am_status: data.result.data[0].day3_am_status, // 셋째 날 오전 상태
          day3_pm_status: data.result.data[0].day3_pm_status, // 셋째 날 오후 상태
        };

        setWeatherData(weatherInfo); // 날씨 데이터를 상태에 설정합니다.
      } catch (error) {
        console.error('날씨 정보를 불러오는 도중 에러가 발생했습니다:', error);
      }
    };

    fetchWeatherData(); // 날씨 데이터를 가져오는 함수 호출
  }, []);

  return (
    <div className='detailcontainer'>
      <h1 className='search-h1'>
        바다예보
        <img src='/parassol.png' className='solimg' alt='sun' />
      </h1>
      <br />
      <div>
        <h1 className='detail-h1'>
          {weatherData && (
            <>
              {weatherData.meta.beach_name} 
              <button>관심스팟</button>
              <button>추천일 알람설정</button>
            </>
          )}
        </h1>
        <hr className='csshr' />
      </div>
      <div className='graph'>
        <h2 className='graph-h2'>
          주간예보 <span className='graph-h2span'>일간예보</span>
        </h2>
        <div>
          <canvas className='canvas' />
        </div>
        <div className='todaysea'>
          {weatherData && (
            <>
              <h1 className='todayseah1'>오늘의바다</h1>
              <hr className='csshr' />
              <img src='/surfgood.png' className='surfgoodimg' alt='surf' />
              <h3 className='todayexplain'>
                오늘 {weatherData.time}은 서핑 하기 참 좋은날이어유 초보 서퍼들은 서핑보드들고 냅다 나가봐유
              </h3>
            </>
          )}
        </div>
        <div className='first-line'>
          <h2>Beach Information</h2>
          <table className='beach-info-table'>
            <thead>
              <tr>
                <th>Time</th>
                <th>Wind</th>
                <th>Wave</th>
                <th>Temperature</th>
                <th colSpan='2'>Weather Status</th>
              </tr>
            </thead>
            <tbody>
              {weatherData && (
                <tr>
                  <td>{weatherData.time}</td>
                  <td>{weatherData.wind}</td>
                  <td>{weatherData.wave}</td>
                  <td>{weatherData.temp}</td>
                  <td>AM</td>
                  <td>PM</td>
                </tr>
              )}
              {weatherData && (
                <tr>
                  <td colSpan='4'>Day 1</td>
                  <td>{weatherData.day1_am_status}</td>
                  <td>{weatherData.day1_pm_status}</td>
                </tr>
              )}
              {weatherData && (
                <tr>
                  <td colSpan='4'>Day 2</td>
                  <td>{weatherData.day2_am_status}</td>
                  <td>{weatherData.day2_pm_status}</td>
                </tr>
              )}
              {weatherData && (
                <tr>
                  <td colSpan='4'>Day 3</td>
                  <td>{weatherData.day3_am_status}</td>
                  <td>{weatherData.day3_pm_status}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Detail;
