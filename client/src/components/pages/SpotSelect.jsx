import React, { useEffect, useState } from 'react';
import Layout from '../layout/Layout';

function SpotSelect() {
  const [selectedCoordinates, setSelectedCoordinates] = useState({
    latitude: 37.795, // Default latitude
    longitude: 128.908, // Default longitude
  });

  // 스크립트 파일 읽어오기
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
    // 카카오맵 스크립트 읽어오기
    const my_script = new_script(
      'https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=cb8f3da28528e158b5e76f2e88e968b8'
    );

    // 스크립트 읽기 완료 후 카카오맵 설정
    my_script.then(() => {
      console.log('script loaded!!!');
      const kakao = window['kakao'];
      kakao.maps.load(() => {
        const mapContainer = document.getElementById('map');
        const options = {
          center: new kakao.maps.LatLng(
            selectedCoordinates.latitude,
            selectedCoordinates.longitude
          ), // Use selected coordinates
          level: 9,
        };
        const map = new kakao.maps.Map(mapContainer, options); //맵생성
        //마커설정
        const markerPosition = new kakao.maps.LatLng(
          selectedCoordinates.latitude,
          selectedCoordinates.longitude
        );
        const marker = new kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);
      });
    });
  }, [selectedCoordinates]); // Add selectedCoordinates as dependency

  const handleRegionChange = (e) => {
    const selectedRegion = e.target.value;
    switch (selectedRegion) {
      case '강원도':
        setSelectedCoordinates({ latitude: 37.8, longitude: 128.9 });
        break;
      case '제주':
        setSelectedCoordinates({ latitude: 33.249, longitude: 126.413 });
        break;
      // Add more cases for other regions if needed
      default:
        setSelectedCoordinates({
          latitude: 37.795, // Default latitude
          longitude: 128.908, // Default longitude
        });
        break;
    }
  };

  return ( 
    <Layout>
      <div className="map-container">
        <div id="map" className="map"></div>
        <div className="spot-content">
          <hr />
          <br />
          <h2>Home - 스팟선택</h2>
          <br />
          <hr />
          <input placeholder="내용을 입력하세요" />
          {/* 나중에 아이콘 추가 */}
          {/* 추가적인 내용을 넣으세요 */}
          <div className="icon-container">
            <div>
              {/* 드롭다운 메뉴 */}
              <select onChange={handleRegionChange}>
                <option value="강원도">강원도</option>
                <option value="제주">제주</option>
                {/* 필요한 지역들을 추가합니다 */}
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
    </Layout>
  );
}

export default SpotSelect;
