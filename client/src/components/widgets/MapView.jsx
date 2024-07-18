import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 서핑 스팟 데이터를 배열로 정의
const surfSpots = [
  { name: 'Spot 1', lat: 37.5665, lon: 126.9780, conditions: 'Good' },
  { name: 'Spot 2', lat: 37.5705, lon: 126.9760, conditions: 'Moderate' },
  { name: 'Spot 3', lat: 37.5685, lon: 126.9820, conditions: 'Excellent' },
  // 필요에 따라 더 많은 스팟 추가 가능
];

// MapView 컴포넌트 정의
const MapView = ({ latitude, longitude }) => {
  return (
    // Leaflet MapContainer 설정
    <MapContainer 
      center={[latitude, longitude]} // 지도의 중심을 지정된 위도와 경도로 설정
      zoom={13} // 지도의 초기 줌 레벨 설정
      style={{ height: "500px", width: "100%" }} // 지도의 높이와 너비 설정
      id="map"
    >
      {/* 타일 레이어 설정 */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // OpenStreetMap 타일 URL
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* 서핑 스팟 마커 표시 */}
      {surfSpots.map((spot, index) => (
        <Marker key={index} position={[spot.lat, spot.lon]}>
          <Popup>
            {/* 팝업에 서핑 스팟 이름과 조건 표시 */}
            <strong>{spot.name}</strong><br />
            Conditions: {spot.conditions}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;
