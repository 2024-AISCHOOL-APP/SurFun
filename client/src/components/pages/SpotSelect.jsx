import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SpotInfo from './SpotInfo';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addFavorite, removeFavorite, setFavorites } from '../../store/slices/favoritesSlices.js';
import '../../assets/scss/SpotSelect.scss';

function SpotSelect({ username }) {
  const [selectedCoordinates, setSelectedCoordinates] = useState({
    latitude: 37.795,
    longitude: 128.908,
  });
  const [weatherCondition, setWeatherCondition] = useState(5);
  const [allMarkers, setAllMarkers] = useState([]);
  const [zoneType, setZoneType] = useState('surfing');
  const [selectedRegion, setSelectedRegion] = useState('강원도');
  const favorites = useSelector((state) => state.favorites);
  const dispatch = useDispatch();
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

    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/favorites/${username}`);
        dispatch(setFavorites(response.data));
        console.log('Fetched favorites:', response.data);
      } catch (err) {
        console.error('Error fetching favorites:', err.message);
      }
    };

    fetchData();
    fetchFavorites();
  }, [username, dispatch]);

  const handleFavoriteClick = async (markerData) => {
    try {
      console.log('Marker Data:', markerData); // markerData 로그 출력
      
      const payload = {
        username, // 실제 로그인된 사용자 정보를 사용해야 함
        favorite_date: new Date().toISOString()
      };
  
      // zone type에 따라 적절한 필드 설정
      if (markerData.type === 'surfing') {
        payload.surfing_zone_id = markerData.surfing_zone_id;
      } else if (markerData.type === 'diving') {
        payload.diving_zone_id = markerData.diving_zone_id;
      }
  
      console.log('Sending payload:', payload); // 요청 데이터 로그 출력
  
      const response = await axios.post('http://localhost:5000/favorites', payload);
  
      console.log('Response:', response); // 응답 데이터 로그 출력
  
      if (response.status === 201) {
        dispatch(addFavorite({
          id: response.data.id,
          name: markerData.name,
          type: markerData.type,
          surfing_zone_name: markerData.type === 'surfing' ? markerData.name : null,
          diving_zone_name: markerData.type === 'diving' ? markerData.name : null
        }));
      }
    } catch (err) {
      if (err.response) {
        // 서버가 400 에러를 반환한 경우
        console.error('Error adding favorite:', err.response.data); // 상세 에러 메시지 출력
        console.error('Status:', err.response.status); // 상태 코드 출력
        console.error('Headers:', err.response.headers); // 응답 헤더 출력
      } else if (err.request) {
        // 요청이 전송되었으나 응답이 없을 경우
        console.error('Error adding favorite: No response received:', err.request);
      } else {
        // 기타 에러
        console.error('Error adding favorite:', err.message);
      }
    }
  };

  const handleRemoveFavorite = async (markerData) => {
    try {
      console.log('Removing Favorite Marker Data:', markerData); // markerData 로그 출력

      const favorite = favorites.find(fav => fav.name === markerData.name && fav.type === markerData.type);
      if (!favorite) {
        console.error('Favorite not found');
        return;
      }

      console.log('Removing Favorite ID:', favorite.id); // 삭제할 즐겨찾기 ID 로그 출력

      const response = await axios.delete(`http://localhost:5000/favorites/${favorite.id}`);
      if (response.status === 200) {
        dispatch(removeFavorite(favorite));
      }
    } catch (err) {
      console.error('Error removing favorite:', err.message);
    }
  };

  const isFavorite = (markerData) => {
    return favorites.some(fav => fav.name === markerData.name && fav.type === markerData.type);
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
                    username={username} // username 전달
                    markerData={markerData}
                    onAlarmClick={handleAlarmClick}
                    onFavoriteClick={() => isFavorite(markerData) ? handleRemoveFavorite(markerData) : handleFavoriteClick(markerData)}
                    isFavorite={isFavorite(markerData)}
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
