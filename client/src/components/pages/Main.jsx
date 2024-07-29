import { React, useEffect } from 'react';
import '../../assets/scss/Main.scss';
import { useNavigate } from 'react-router-dom';
import Favorites from '../widgets/Favorites';
import Footer from '../layout/Footer';

function Main({ loggedIn, username, onLoginSuccess }) {
    const navigate = useNavigate(); // 페이지 이동을 위한 hook

    const handleNavigation = (path) => {
        navigate(path);
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const username = params.get('username');
        if (username) {
            onLoginSuccess(username);
        }
    }, [onLoginSuccess]);

    return (
        <div className="Main">
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

            <Favorites />

            {/* 메인 컨텐츠 */}
            <div className="content">
                {!loggedIn && <h1>로그인해주세요</h1>}
                {loggedIn && <h1>Welcome, {username}!</h1>}
            </div>

            <Footer />
        </div>
    );
}

export default Main;
