import React, { useEffect, useState } from 'react';

function SpotSelect() {
  const [selectedCoordinates, setSelectedCoordinates] = useState({
    latitude: 37.795, // Default latitude
    longitude: 128.908, // Default longitude
  });

  const [weatherCondition, setWeatherCondition] = useState(4); // 기본 날씨 상태 값

  // 날씨 상태에 따른 이미지 파일 URL
  const weatherMarkerImages = {
    1: '/verygood.png', // 날씨 상태 1에 해당하는 이미지 파일 경로
    2: '/good.png', // 날씨 상태 2에 해당하는 이미지 파일 경로
    3: '/cool.png', // 날씨 상태 3에 해당하는 이미지 파일 경로
    4: '/bad.png', // 날씨 상태 4에 해당하는 이미지 파일 경로
    5: '/sobad.png', // 날씨 상태 5에 해당하는 이미지 파일 경로
  };

  // 스크립트를 동적으로 로드하는 함수
  const new_script = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.addEventListener('load', () => {
        resolve();
      });
      script.addEventListener('error', (e) => {
        reject(e);
      });
      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    // Kakao 지도 API 스크립트를 로드
    const my_script = new_script(
      'https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=cb8f3da28528e158b5e76f2e88e968b8'
    );

    my_script.then(() => {
      console.log('script loaded!!!');
      const kakao = window['kakao'];
      kakao.maps.load(() => {
        const mapContainer = document.getElementById('map');
        const options = {
          center: new kakao.maps.LatLng(
            selectedCoordinates.latitude,
            selectedCoordinates.longitude
          ),
          level: 9,
        };
        // Kakao 지도 객체 생성
        const map = new kakao.maps.Map(mapContainer, options);

        // 기본 마커 이미지 설정
        const markerImage = new kakao.maps.MarkerImage(weatherMarkerImages[weatherCondition], new kakao.maps.Size(64, 69), {
          offset: new kakao.maps.Point(27, 69),
        });

        // Default 마커 설정
        const markerPosition = new kakao.maps.LatLng(
          selectedCoordinates.latitude,
          selectedCoordinates.longitude
        );
        const marker = new kakao.maps.Marker({
          position: markerPosition,
          image: markerImage,
        });
        marker.setMap(map);

        // 추가적인 마커들 배열
        const additionalMarkers = [
          { latitude: 33.228, longitude: 126.308 }, // 사계
          { latitude: 38.007, longitude: 128.731 }, // 기사문
          { latitude: 37.973, longitude: 128.760 }, // 죽도
          { latitude: 37.946, longitude: 128.784 }, // 남애
          { latitude: 33.556, longitude: 126.795 }, // 
          { latitude: 38.116, longitude: 128.636 }, // 낙산
        ];

        // 추가적인 마커들을 지도에 추가
        additionalMarkers.forEach((coords) => {
          const markerPosition = new kakao.maps.LatLng(coords.latitude, coords.longitude);
          const marker = new kakao.maps.Marker({
            position: markerPosition,
            image: markerImage, // 여기서도 동일한 이미지를 사용하려면 이 줄을 수정해야 합니다.
          });
          marker.setMap(map);
        });

        // 커스텀 오버레이 설정
        const content = '<div class="customoverlay"></div>';
        const customOverlay = new kakao.maps.CustomOverlay({
          position: markerPosition,
          content: content,
          yAnchor: 1,
        });
        customOverlay.setMap(map);
      });
    });
  }, [selectedCoordinates, weatherCondition]);

  // 지역 선택 변경 핸들러
  const handleRegionChange = (e) => {
    const selectedRegion = e.target.value;
    switch (selectedRegion) {
      case '강원도':
        setSelectedCoordinates({ latitude: 37.8, longitude: 128.9 });
        break;
      case '제주':
        setSelectedCoordinates({ latitude: 33.249, longitude: 126.413 });
        break;
      default:
        setSelectedCoordinates({
          latitude: 37.795,
          longitude: 128.908,
        });
        break;
    }
  };

  // 날씨 상태 변경 핸들러
  const handleWeatherChange = (weather) => {
    setWeatherCondition(weather); // 날씨 상태 업데이트
  };

  return (
    <div className="App">
      <div className="map-container">
        <div id="map" className="map"></div>
        <div className="spot-content">
          <hr />
          <br />
          <h2>Home - 스팟선택</h2>
          <br />
          <hr />
          <input placeholder="내용을 입력하세요" />
          <div className="icon-container">
            <div>
              <select onChange={handleRegionChange}>
                <option value="강원도">강원도</option>
                <option value="제주">제주</option>
              </select>
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <h2>검색결과</h2>
            <hr />
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpotSelect;
