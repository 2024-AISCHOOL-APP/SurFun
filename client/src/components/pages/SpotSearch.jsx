import React from 'react'

const SpotSearch = () => {
  return (
    <div className=''>
      <video autoPlay loop muted className="video-background">
        <source src="/videos/surfing.mp4" type="video/mp4" />
      </video>
      <div className='welcome-message'>
      <h1>지역검색</h1>
        <div>
        <input placeholder='ex)제주 서귀포' className='search'></input>
        <button className='search-button'>검색</button>
        </div>
      </div>
      <div>
        <h2 className='select-h2'>지역선택</h2>
        <ul className="region-list">
        <li className="region-item">
          <h3 className="region-name">경기도</h3>
          <ul className="city-list">
            <li>수원</li>
            <li>성남</li>
            <li>용인</li>
            {/* 다른 경기도 도시들 */}
          </ul>
        </li>
        <li className="region-item">
          <h3 className="region-name">전라도</h3>
          <ul className="city-list">
            <li>전주</li>
            <li>순천</li>
            <li>여수</li>
            {/* 다른 전라도 도시들 */}
          </ul>
        </li>
        <li className="region-item">
          <h3 className="region-name">경상도</h3>
          <ul className="city-list">
            <li>부산</li>
            <li>대구</li>
            <li>울산</li>
            {/* 다른 경상도 도시들 */}
          </ul>
        </li>
      </ul>
      <ul className="region-list">
        <li className="region-item">
          <h3 className="region-name">강원도</h3>
          <ul className="city-list">
            <li>춘천</li>
            <li>원주</li>
            <li>강릉</li>
            {/* 다른 강원도 도시들 */}
          </ul>
        </li>
        <li className="region-item">
          <h3 className="region-name">충청도</h3>
          <ul className="city-list">
            <li>대전</li>
            <li>천안</li>
            <li>세종</li>
            {/* 다른 충청도 도시들 */}
          </ul>
        </li>
        <li className="region-item">
          <h3 className="region-name">제주도</h3>
          <ul className="city-list">
            <li>제주</li>
            <li>서귀포</li>
            {/* 다른 제주도 도시들 */}
          </ul>
        </li>
      </ul>

      </div>
    </div>
  ) 
}

export default SpotSearch