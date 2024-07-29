import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Link 컴포넌트 임포트

const SpotSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allZones, setAllZones] = useState([]);
  const [filteredZones, setFilteredZones] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false); // 검색 결과 표시 여부 상태

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await axios.get('/zones/surfing-zones'); // API 엔드포인트
        // '제주'와 '강원도'만 필터링합니다.
        const filteredData = response.data.filter(zone => zone.region === '제주' || zone.region === '강원도');
        setAllZones(filteredData);
        setFilteredZones(filteredData);
      } catch (error) {
        console.error('데이터를 가져오는 데 실패했습니다.', error);
      }
    };
    
    fetchZones();
  }, []);

  const handleSearch = () => {
    const filtered = allZones.filter(zone =>
      zone.name.includes(searchQuery) &&
      (selectedRegion === '' || zone.region === selectedRegion)
    );
    setFilteredZones(filtered);
    setShowSearchResults(true); // 검색 후 결과 표시
  };

  const handleRegionChange = (region) => {
    setSelectedRegion(region);
    const filtered = allZones.filter(zone =>
      zone.region === region && zone.name.includes(searchQuery)
    );
    setFilteredZones(filtered);
    setShowSearchResults(false); // 지역 선택 시 검색 결과 숨기기
  };

  const regions = {
    '제주': [],
    '강원도': []
  };

  allZones.forEach(zone => {
    if (regions[zone.region]) {
      regions[zone.region].push(zone);
    }
  });

  return (
    <div>
      <video autoPlay loop muted className="video-background">
        <source src="/videos/surfing.mp4" type="video/mp4" />
      </video>
      <div className='welcome-message'>
        <h1>지역 검색</h1>
        <div>
          <input
            placeholder='ex) 제주 서귀포'
            className='search'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className='search-button' onClick={handleSearch}>검색</button>
        </div>
      </div>
      <div>
        <h2 className='select-h2'>지역 선택</h2>
        <ul className="region-list">
          {Object.keys(regions).map(region => (
            <li key={region} className="region-item">
              <h3 className="region-name" onClick={() => handleRegionChange(region)}>{region}</h3>
              <ul className="city-list">
                {regions[region].map(zone => (
                  <li key={zone.surfing_zone_id}>
                    <Link to={`/detail/${zone.surfing_zone_id}`} className="zone-link">{zone.name}</Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      <h2>검색 결과</h2>
      {showSearchResults && (
        <div>
          <ul className="region-list">
            {filteredZones.map(zone => (
              <li key={zone.surfing_zone_id} className="region-item">
                <Link to={`/detail/${zone.surfing_zone_id}`} className="zone-link">{zone.name}</Link>
                <p>{zone.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SpotSearch;
