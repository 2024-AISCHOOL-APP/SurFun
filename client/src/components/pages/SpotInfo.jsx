import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import emptyStar from '../../assets/img/empty_star.jpg';
import filledStar from '../../assets/img/filled_star.jpg';

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
  
  .button-icon {
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }
`;

function SpotInfo({ username, markerData, onAlarmClick, onFavoriteClick, onSpotClick, isFavorite }) {
  return (
    <SpotInfoContainer onClick={() => onSpotClick(markerData)}>
      <div className="buttons">
        <button onClick={(e) => { e.stopPropagation(); onAlarmClick(markerData); }}>🔔 알람</button>
        <button onClick={(e) => { e.stopPropagation(); onFavoriteClick(markerData); }}>
          <img
            src={isFavorite ? filledStar : emptyStar}
            alt="즐겨찾기"
            className="button-icon"
          />
          즐겨찾기
        </button>
      </div>
      <h2>{markerData.name}</h2>
      <br />
      <h3>{markerData.description}</h3>
    </SpotInfoContainer>
  );
}

SpotInfo.propTypes = {
  username: PropTypes.string.isRequired, // PropTypes에 username 추가
  markerData: PropTypes.object.isRequired,
  onAlarmClick: PropTypes.func.isRequired,
  onFavoriteClick: PropTypes.func.isRequired,
  onSpotClick: PropTypes.func.isRequired,
  isFavorite: PropTypes.bool.isRequired,
};

export default SpotInfo;
