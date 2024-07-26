const axios = require('axios');

// const getWeatherForecast = async () => {
//   try {
//     const response = await axios.get('http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst', {
//       params: {
//         serviceKey: 'V0b7rWgoRS5gxO0CfD1KDpRRmDv3lq8Zx%2BAUCVpi%2FVzym7%2Fyf48i%2BL7grZzQo6fkDX5GKonjMWTYR1vZtEYrrQ%3D%3D',  // 발급받은 인증키
//         numOfRows: '14',             // 한 페이지 결과 수
//         pageNo: '1',                 // 페이지 번호
//         base_date: '20240727',       // 발표일자 (내일 날짜)
//         base_time: '0600',           // 발표시각
//         nx: '55',                    // 예보지점 X 좌표
//         ny: '127',                   // 예보지점 Y 좌표
//         dataType: 'JSON'             // 응답자료형식
//       }
//     });

//     const items = response.data.response.body.items.item;
//     if (items && items.length > 0) {
//       console.log('Forecast data:', items);
//     } else {
//       console.log('No data available for the specified date and time.');
//     }
//   } catch (error) {
//     console.error('Error fetching weather data:', error);
//   }
// };

const serviceKey = 'V0b7rWgoRS5gxO0CfD1KDpRRmDv3lq8Zx%2BAUCVpi%2FVzym7%2Fyf48i%2BL7grZzQo6fkDX5GKonjMWTYR1vZtEYrrQ%3D%3D'; // 자신의 인증키로 대체

export const getMidLandFcst = async (tmFc) => {
  try {
    const response = await axios.get('http://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst', {
      params: {
        serviceKey,
        numOfRows: 10,
        pageNo: 1,
        dataType: 'JSON',
        regId: '11B00000', // 서울, 인천, 경기도 예보구역 코드
        tmFc,
      }
    });
    return response.data.response.body.items.item;
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    return [];
  }
};


export default getMidLandFcst;
