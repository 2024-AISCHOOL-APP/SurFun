import { React, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './components/pages/Main';
import Community from './components/pages/Community';
import SpotSelect from './components/pages/SpotSelect';
import Header from './components/layout/Header';
import LoginModal from './components/core/LoginModal';
import JoinModal from './components/core/JoinModal';
import PostModal from './components/core/PostModal';
import SpotSearch from './components/pages/SpotSearch';
import Detail from './components/pages/Detail';
import './assets/scss/Modal.css'; // 스타일을 import합니다.

function App() {
    // 상태 변수들 정의
    const [loggedIn, setLoggedIn] = useState(false); // 로그인 여부
    const [username, setUsername] = useState(''); // 사용자 이름
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // 로그인 모달 열림 여부
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false); // 회원가입 모달 열림 여부
    // const [postContent, setPostContent] = useState(''); // 게시글 내용

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

    // // 게시글작성 모달 열기/닫기 함수
    // const togglePostModal = () => {
    //     setIsPostModalOpen(!isPostModalOpen);
    // }

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
                   
                    <Route path="/spot-select" element={<SpotSelect />} />
                    <Route path="/SpotSearch" element={<SpotSearch />} />
                    <Route path="/Detail" element={<Detail />} />
                    
                </Routes>
                {/* 로그인 모달 */}
                {isLoginModalOpen && (
                    <div className='modal-background'>
                        <div className='login-modal'>
                            <LoginModal onLoginSuccess={handleLoginSuccess} onClose={toggleLoginModal}/>
                        </div>
                    </div>
                )}
                {/* 회원가입 모달 */}
                {isJoinModalOpen && (
                    <div className='modal-background'>
                        <div className='join-modal'>
                            <JoinModal onJoinSuccess={() => setIsJoinModalOpen(false)} onClose={toggleJoinModal} />
                        </div>
                    </div>
                )}
                {/* 게시글 작성 모달
                {isPostModalOpen && (
                    <div className='modal-background'>
                        <div className='post-modal'>
                            <PostModal onLoginSuccess={() => setIsPostModalOpen(false)} onClose={toggleJoinModal} />
                        </div>
                    </div>
                )} */}
                

            </Router>
        </>
    );
}

export default App;
