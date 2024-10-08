import React, { useState, useEffect } from 'react';
import '../../assets/scss/Main.scss';
import { useNavigate } from 'react-router-dom';
import Favorites from '../widgets/Favorites'; 


function Main({ onLoginSuccess, loggedIn: isLoggedInProp, favorites, onRemoveFavorite }) {
        
    const [isLoginModalOpen, setIsLoginModalOpen] =  useState(false); // 로그인 모달 열림 여부
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false); // 회원가입 모달 열림 여부
    const [loggedIn, setLoggedIn] = useState(false); // 로그인 상태
    const [error, setError] = useState(''); // 에러 메시지
    const [username, setUsername] = useState(''); // 로그인한 사용자 이름
    const navigate = useNavigate(); // 페이지 이동을 위한 hook

    const handleNavigation = (path) => {
        navigate(path);
    };

    // 로그인 모달 토글 함수
    const toggleLoginModal = () => {
        setIsLoginModalOpen(!isLoginModalOpen);
        console.log('Login modal toggled:', isLoginModalOpen);
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

        console.log("Logged in:", loggedIn);  // 로그인 상태 확인 로그

        // 로그인 성공 후 이동경로
        navigate('/');
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const username = params.get('username');
        if (username) {
            handleLoginSuccess(username);
        }
    }, []);

    return (
        <div className="Main">
            {/* 비디오 배경 컨테이너 */}
            <div>
                <button onClick={() => handleNavigation('/Divemain')} className='dive-button'>
                    Go Dive
                </button>
            </div>

            {/* 비디오 배경 컨테이너 */}
            <div className="video-container">
                <video autoPlay loop muted className="video-background">
                    <source src="/videos/surfing.mp4" type="video/mp4" />
                </video>

                {/* 환영 메시지 */}
                <div className="welcome-message">
                    <h1>Surfun</h1>
                    <h2>서핑을 즐기자</h2>
                    <button onClick={() => handleNavigation('/spot-select')} className='main-button'>
                        서핑하러 가기!
                    </button>
                    <img src='surfgood.png' className='surfgoodimg2' alt='Surfgood' />
                </div>
            </div>

             {/* 즐겨찾기 */}
            <Favorites loggedIn={isLoggedInProp} favorites={favorites} onRemoveFavorite={onRemoveFavorite} />
        </div>
    );
}

export default Main;
