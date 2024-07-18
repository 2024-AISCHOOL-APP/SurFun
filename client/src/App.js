import { React, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './components/pages/Main';
import Community from './components/pages/Community';
import Profile from './components/pages/Profile';
import SpotSelect from './components/pages/SpotSelect';
import Header from './components/layout/Header';
import LoginModal from './components/core/LoginModal';
import JoinModal from './components/core/JoinModal';

function App() {
    // 상태 변수들 정의
    const [loggedIn, setLoggedIn] = useState(false); // 로그인 여부
    const [username, setUsername] = useState(''); // 사용자 이름
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // 로그인 모달 열림 여부
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false); // 회원가입 모달 열림 여부

    // 로그인 성공 처리 함수
    const handleLoginSuccess = (username) => {
        setLoggedIn(true); // 로그인 상태로 설정
        setUsername(username); // 사용자 이름 설정
        setIsLoginModalOpen(false); // 로그인 모달 닫기
    };

    // 회원가입 모달 열기/닫기 함수
    const toggleJoinModal = () => {
        setIsJoinModalOpen(!isJoinModalOpen);
    };

    // 로그인 모달 열기/닫기 함수
    const toggleLoginModal = () => {
        setIsLoginModalOpen(!isLoginModalOpen);
    };

    return (
        <>
            <Router>
                {/* Header 컴포넌트에 로그인 상태와 모달 토글 함수들 전달 */}
                <Header
                    loggedIn={loggedIn}
                    username={username}
                    toggleJoinModal={toggleJoinModal}
                    toggleLoginModal={toggleLoginModal}
                />
                {/* 라우팅 설정 */}
                <Routes>
                    <Route path="/" element={<Main onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/spot-select" element={<SpotSelect />} />
                </Routes>
                {/* 로그인 모달 */}
                {isLoginModalOpen && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <div style={{
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '5px',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                        }}>
                            <LoginModal onLoginSuccess={handleLoginSuccess} />
                        </div>
                    </div>
                )}
                {/* 회원가입 모달 */}
                {isJoinModalOpen && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <div style={{
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '5px',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                        }}>
                            <JoinModal onJoinSuccess={() => setIsJoinModalOpen(false)} />
                        </div>
                    </div>
                )}
            </Router>
        </>
    );
}

export default App;
