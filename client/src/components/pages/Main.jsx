import React, { useState, useEffect } from 'react';
import LoginModal from '../core/LoginModal';
import JoinModal from '../core/JoinModal';
import WeatherDisplay from '../../components/widgets/WeatherDisplay';
import getWeatherData from '../../services/WeatherService';
import MapView from '../../components/widgets/MapView';
import '../../assets/scss/Main.scss';
import { useNavigate } from 'react-router-dom';
import Favorites from '../widgets/Favorites';

function Main({ onLoginSuccess }) {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // 로그인 모달 열림 여부
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false); // 회원가입 모달 열림 여부
    const [loggedIn, setLoggedIn] = useState(false); // 로그인 상태
    const [weatherData, setWeatherData] = useState(null); // 날씨 데이터
    const [error, setError] = useState(''); // 에러 메시지
    const [latitude, setLatitude] = useState(33.4996); // 제주도 위도
    const [longitude, setLongitude] = useState(126.5312); // 제주도 경도
    const [username, setUsername] = useState(''); // 로그인한 사용자 이름
    const navigate = useNavigate(); // 페이지 이동을 위한 hook

    // 로그인 모달 토글 함수
    const toggleLoginModal = () => {
        setIsLoginModalOpen(!isLoginModalOpen);
    };

    // 회원가입 모달 토글 함수
    const toggleJoinModal = () => {
        setIsJoinModalOpen(!isJoinModalOpen);
    };

    // 로그인 성공 시 호출되는 함수
    const handleLoginSuccess = async (loggedInUsername) => {
        setLoggedIn(true);
        setUsername(loggedInUsername);
        toggleLoginModal();
        onLoginSuccess(loggedInUsername);

        // 도시 이름 설정 (예: 제주)
        const city = 'Jeju';

        try {
            console.log(`Fetching weather data for city: ${city}`);
            const data = await getWeatherData(city);
            setWeatherData(data);
            setError(''); // 이전 에러 메시지 제거
        } catch (error) {
            console.error('Failed to fetch weather data:', error);

            if (error.response && (error.response.status >= 400 && error.response.status < 500)) {
                setError('Failed to fetch weather data. Please check the request and try again.');
            } else if (error.response && (error.response.status >= 500)) {
                setError('Failed to fetch weather data. Server error, please try again later.');
            } else {
                setError('Failed to fetch weather data. Please try again later.');
            }
        }

        // 로그인 성공 후 이동경로
        navigate('/');
    };

    // 초기화 작업 (예: 현재 위치의 날씨 정보 가져오기)
    useEffect(() => {
        const fetchInitialWeatherData = async () => {
            if (loggedIn) {
                const city = 'Jeju'; // 예시 도시 설정
                try {
                    const data = await getWeatherData(city);
                    setWeatherData(data);
                    setError('');
                } catch (error) {
                    console.error('Failed to fetch initial weather data:', error);
                    setError('Failed to fetch weather data. Please try again later.');
                }
            }
        };

        fetchInitialWeatherData();
    }, [loggedIn]);

    return (
        <>
            <div className="Main">
                {/* 비디오 배경 컨테이너 */}
                <div className="video-container">
                    <video autoPlay loop muted className="video-background">
                        <source src="/videos/surfing.mp4" type="video/mp4" />
                    </video>
                    {/* 환영 메시지 */}
                    <div className="welcome-message">
                        <h1>Welcome to SurFun</h1>
                    </div>
                    {/* 즐겨찾기 컴포넌트 */}
                    <Favorites />
                </div>

                {/* 메인 컨텐츠 */}
                <div className="content">
                    {!loggedIn && (
                        <h1></h1>
                    )}

                    {loggedIn && (
                        <>
                            {error && (
                                <p style={{ color: 'red' }}>{error}</p>
                            )}

                            {weatherData && (
                                <WeatherDisplay weatherData={weatherData} />
                            )}

                            {/* 지도 컨테이너 */}
                            <div className="map-container">
                                <MapView latitude={latitude} longitude={longitude} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default Main;
