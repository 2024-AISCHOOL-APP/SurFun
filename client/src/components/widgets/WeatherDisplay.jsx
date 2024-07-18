import React from 'react';

// WeatherDisplay 컴포넌트: weatherData prop을 받아 현재 날씨를 표시
function WeatherDisplay({ weatherData }) {
    // weatherData가 없으면 로딩 메시지 표시
    if (!weatherData) {
        return <div>Loading...</div>;
    }

    // weatherData에서 필요한 정보 추출
    const { name, main, weather } = weatherData;
    const iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

    return (
        <div>
            <h2>Current Weather in {name}</h2>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={iconUrl} alt={weather[0].description} />
                <div>
                    <p>Temperature: {main.temp} °C</p>
                    <p>Weather: {weather[0].description}</p>
                    <p>Humidity: {main.humidity}%</p>
                    <p>Pressure: {main.pressure} hPa</p>
                </div>
            </div>
        </div>
    );
}

export default WeatherDisplay;
