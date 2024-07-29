import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SpotInfo from './SpotInfo';
import Favorites from '../widgets/Favorites'; // 올바른 경로 확인
import { useNavigate } from 'react-router-dom';

function SpotSelect() {
  const [selectedCoordinates, setSelectedCoordinates] = useState({
    latitude: 37.795,
    longitude: 128.908,
  });
  const [weatherCondition, setWeatherCondition] = useState(5);
  const [allMarkers, setAllMarkers] = useState([]);
  const [zoneType, setZoneType] = useState('surfing');
  const [selectedRegion, setSelectedRegion] = useState('강원도');
  const [favorites, setFavorites] = useState([]);

  const navigate = useNavigate();

  const weatherMarkerImages = {
    1: '/verygood.png',
    2: '/good.png',
    3: '/cool.png',
    4: '/bad.png',
    5: '/sobad.png',
  };

  const loadKakaoMapScript = async () => {
    return new Promise((resolve, reject) => {
      if (window.kakao && window.kakao.maps) {
        resolve(window.kakao);
      } else {
        const script = document.createElement('script');
        script.src = 'https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=cb8f3da28528e158b5e76f2e88e968b8';
        script.onload = () => resolve(window.kakao);
        script.onerror = (e) => reject(new Error('Failed to load script: ' + e.message));
        document.head.appendChild(script);
      }
    });
  };

  useEffect(() => {
    const initializeMap = async () => {
      try {
        const kakao = await loadKakaoMapScript();
        kakao.maps.load(() => {
          const mapContainer = document.getElementById('map');
          const options = {
            center: new kakao.maps.LatLng(selectedCoordinates.latitude, selectedCoordinates.longitude),
            level: 9,
          };
          const map = new kakao.maps.Map(mapContainer, options);

          const markerImage = new kakao.maps.MarkerImage(weatherMarkerImages[weatherCondition], new kakao.maps.Size(64, 69), {
            offset: new kakao.maps.Point(27, 69),
          });

          allMarkers.forEach(markerData => {
            const position = new kakao.maps.LatLng(markerData.latitude, markerData.longitude);
            const marker = new kakao.maps.Marker({
              position: position,
              image: markerImage,
            });
            marker.setMap(map);

            kakao.maps.event.addListener(marker, 'click', () => {
              map.setCenter(position);
            });

            const content = `<div class="customoverlay" data-name="${encodeURIComponent(markerData.name)}">${markerData.name}</div>`;
            const customOverlay = new kakao.maps.CustomOverlay({
              position: position,
              content: content,
              yAnchor: 1,
            });
            customOverlay.setMap(map);
          });

          // Event delegation to handle clicks on custom overlay
          document.querySelector('#map').addEventListener('click', (e) => {
            if (e.target && e.target.classList.contains('customoverlay')) {
              const name = decodeURIComponent(e.target.getAttribute('data-name'));
              handleSpotClick({ name });
            }
          });
        });
      } catch (error) {
        console.error('Error initializing Kakao Map:', error.message);
      }
    };

    initializeMap();
  }, [selectedCoordinates, weatherCondition, allMarkers]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [surfingResponse, divingResponse] = await Promise.all([
          axios.get('http://localhost:5000/zones/surfing-zones'),
          axios.get('http://localhost:5000/zones/diving-zones')
        ]);

        const combinedMarkers = [
          ...surfingResponse.data.map(item => ({ ...item, type: 'surfing', region: item.region })),
          ...divingResponse.data.map(item => ({ ...item, type: 'diving', region: item.region }))
        ];

        console.log("Fetched and combined markers: ", combinedMarkers);
        setAllMarkers(combinedMarkers);
      } catch (err) {
        console.error('Error fetching data:', err.message);
      }
    };

    fetchData();
  }, []);

  const handleFavoriteClick = async (markerData) => {
    try {
        // 1. 서버에 해변 이름으로 ID 조회 요청
        const idResponse = await axios.get('http://localhost:5000/favorites/get-id-by-name', {
            params: {
                name: markerData.name,
                type: markerData.type // 'surfing' 또는 'diving'
            }
        });

        const zoneId = idResponse.data.id;

        // 2. 즐겨찾기 추가 요청
        const response = await axios.post('http://localhost:5000/favorites', {
            username: 'testuser', // 실제 로그인된 사용자 정보를 사용해야 함
            surfing_zone_id: markerData.type === 'surfing' ? zoneId : null,
            diving_zone_id: markerData.type === 'diving' ? zoneId : null,
            favorite_date: new Date().toISOString()
        });

        if (response.status === 201) {
            setFavorites(prevFavorites => [...prevFavorites, { 
                id: response.data.id, 
                name: markerData.name, 
                type: markerData.type 
            }]);
        }
    } catch (err) {
        console.error('Error adding favorite:', err.message);
    }
  };

  const handleRemoveFavorite = (id) => {
    setFavorites(favorites.filter(fav => fav.id !== id));
  };

  const getFilteredMarkers = () => {
    const result = allMarkers.filter(marker => marker.type === zoneType && marker.region === selectedRegion);
    console.log("Markers after filtering: ", result);
    return result;
  };

  const handleRegionChange = (e) => {
    const newRegion = e.target.value;
    setSelectedRegion(newRegion);
    setSelectedCoordinates(
      newRegion === '강원도' ? { latitude: 37.795, longitude: 128.908 } : { latitude: 33.249, longitude: 126.413 }
    );
  };

  const handleZoneTypeChange = (e) => {
    setZoneType(e.target.value);
  };

  const handleAlarmClick = (markerData) => {
    alert(`알람 설정: ${markerData.name}`);
  };

  const handleSpotClick = (markerData) => {
    const detailPage = selectedRegion === '제주' ? 'detail2' : 'detail';
    navigate(`/${detailPage}?name=${encodeURIComponent(markerData.name)}`);
  };

  const filteredMarkers = getFilteredMarkers();

  return (
    <div className="App">
      <div className="map-container">
        <div id="map" className="map"></div>
      </div>
      {/* 오른쪽 스팟 목록 영역 */}
      <div className="spot-content">
          <hr />
          <br />
          <h2>Home - 스팟 선택</h2>
          <br />
          <hr />
          <input placeholder="내용을 입력하세요" />
          <div className="icon-container">
            <div>
              <select onChange={handleRegionChange} value={selectedRegion}>
                <option value="강원도">강원도</option>
                <option value="제주">제주</option>
              </select>
            </div>
            <br />
            <div>
              <select onChange={handleZoneTypeChange} value={zoneType}>
                <option value="surfing">서핑존</option>
                <option value="diving">다이빙존</option>
              </select>
            </div>
            <br /> <br /> <br /> <br /> <br />
            <h2>검색 결과</h2>
            <hr />
            <div className='spot-info-container'>
              {filteredMarkers.length === 0 ? (
                <p>현재 보이는 스팟이 없습니다</p>
              ) : (
                filteredMarkers.map((markerData, index) => (
                  <SpotInfo
                    key={index}
                    markerData={markerData}
                    onAlarmClick={handleAlarmClick}
                    onFavoriteClick={handleFavoriteClick}
                    onSpotClick={() => handleSpotClick(markerData)} // Handle spot click
                  />
                ))
              )}
            </div>
          </div>
      </div>
    </div>
  );
}

export default SpotSelect;
