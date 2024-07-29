import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const SpotInfoContainer = styled.div`
  cursor: pointer;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
  
  &:hover {
    background-color: #f0f0f0;
  }
  
  .buttons {
    margin-bottom: 10px;
  }
`;

function SpotInfo({ markerData, onAlarmClick, onFavoriteClick, onSpotClick }) {
  return (
    <SpotInfoContainer onClick={onSpotClick}>
      <div className="buttons">
        <button onClick={(e) => { e.stopPropagation(); onAlarmClick(markerData); }}>🔔 알람</button>
        <button onClick={(e) => { e.stopPropagation(); onFavoriteClick(markerData); }}>⭐ 즐겨찾기</button>
      </div>
      <h2>{markerData.name}</h2>
      <br />
      <h3>{markerData.description}</h3>
    </SpotInfoContainer>
  );
}

SpotInfo.propTypes = {
  markerData: PropTypes.object.isRequired,
  onAlarmClick: PropTypes.func.isRequired,
  onFavoriteClick: PropTypes.func.isRequired,
  onSpotClick: PropTypes.func.isRequired,
};

export default SpotInfo;
