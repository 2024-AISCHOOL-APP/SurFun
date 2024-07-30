import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from './store/slices/userSlice.js';
import { setFavorites } from './store/slices/favoritesSlices.js';
import Main from './components/pages/Main';
import Community from './components/pages/Community';
import SpotSelect from './components/pages/SpotSelect';
import SpotSearch from './components/pages/SpotSearch';
import Detail from './components/pages/Detail';
import Header from './components/layout/Header';
import LoginModal from './components/core/LoginModal';
import JoinModal from './components/core/JoinModal';
import DetailGW from './components/pages/DetailGW';
import PostDetailModal from './components/pages/PostDetailModal';
import Divemain from './components/pages/Divemain';
import SpotSearch from './components/pages/SpotSearch';
import axios from 'axios';
import Footer from './components/layout/Footer';

function App() {
    const dispatch = useDispatch();
    const [loggedIn, setLoggedIn] = useState(false); // 로그인 여부
    const [username, setUsername] = useState(''); // 사용자 이름
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // 로그인 모달 열림 여부
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false); // 회원가입 모달 열림 여부
    const [favorites, setFavorites] = useState([]); // 즐겨찾기 항목 상태 추가
    const { loggedIn, username } = useSelector((state) => state.user);

    // 페이지 로드 시 로컬 스토리지에서 로그인 상태를 불러오는 useEffect
    useEffect(() => {
        const storedLoggedIn = localStorage.getItem('loggedIn') === 'true'; // 로컬 스토리지에서 로그인 여부 확인
        const storedUsername = localStorage.getItem('username') || ''; // 로컬 스토리지에서 사용자 이름 확인
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || []; // 로컬 스토리지에서 즐겨찾기 항목 불러오기
        
        if (storedLoggedIn) { // 로그인 상태일 경우
            setLoggedIn(true);
            setUsername(storedUsername || '');
            setFavorites(storedFavorites); // 불러온 즐겨찾기 항목 설정
        }
    }, []); // 빈 배열을 의존성으로 사용하여 컴포넌트가 처음 렌더링될 때만 실행

    const handleLoginSuccess = (username) => {
        dispatch(login(username));
        fetchFavorites(username);
        setLoggedIn(true); // 로그인 상태로 설정
        setUsername(username); // 사용자 이름 설정
        setIsLoginModalOpen(false); // 로그인 모달 닫기
        localStorage.setItem('loggedIn', 'true'); // 로컬 스토리지에 로그인 상태 저장
        localStorage.setItem('username', username); // 로컬 스토리지에 사용자 이름 저장
    };

    // 로그아웃 처리 함수
    const handleLogout = () => {
        setLoggedIn(false); // 로그인 상태 해제
        setUsername(''); // 사용자 이름 초기화
        setFavorites([]); // 로그아웃 시 즐겨찾기 항목 초기화
        localStorage.removeItem('loggedIn'); // 로컬 스토리지에서 로그인 상태 제거
        localStorage.removeItem('username'); // 로컬 스토리지에서 사용자 이름 제거
        localStorage.removeItem('favorites'); // 로컬 스토리지에서 즐겨찾기 항목 제거
    };
  
  const toggleJoinModal = () => {
    setIsJoinModalOpen(!isJoinModalOpen);
  };

  const toggleLoginModal = () => {
    setIsLoginModalOpen(!isLoginModalOpen);
  };

  const fetchFavorites = async (username) => {
    try {
      const response = await axios.get(`http://localhost:5000/favorites/${username}`);
      dispatch(setFavorites(response.data));
    } catch (err) {
      console.error('Error fetching favorites:', err.message);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const username = params.get('username');
    if (username) {
      handleLoginSuccess(username);
    }
  }, []);

    const handleRemoveFavorite = (name) => {
        const updatedFavorites = favorites.filter(favorite => favorite !== name);
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites)); // 로컬 스토리지에 업데이트된 즐겨찾기 항목 저장
    };

    return (
        <>
            <Router>
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Header
                        loggedIn={loggedIn}
                        username={username}
                        toggleJoinModal={toggleJoinModal}
                        toggleLoginModal={toggleLoginModal}
                    />
                    <Routes>
                        <Route path="/" element={<Main onLoginSuccess={handleLoginSuccess} />} />
                        <Route path="*" element={<Main onLoginSuccess={handleLoginSuccess} />} />
                        <Route path="/community" element={<Community username={username} />} />
                        <Route path="/post/:id" element={<PostDetailModal username={username} />} />
                        <Route path="/Detail" element={<Detail />} />
                        <Route path="/Detail2" element={<DetailGW />} />
                        <Route path="/spot-select" element={<SpotSelect />} />
                        <Route path="/divemain" element={<Divemain />} />
                        <Route path='/SpotSearch' element={<SpotSearch />} />
                    </Routes>
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
                                <LoginModal
                                    onLoginSuccess={handleLoginSuccess}
                                    onClose={toggleLoginModal}
                                    toggleJoinModal={toggleJoinModal}
                                    toggleLoginModal={toggleLoginModal}
                                />
                            </div>
                        </div>
                    )}
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
                                <JoinModal
                                    onJoinSuccess={() => setIsJoinModalOpen(false)}
                                    onClose={toggleJoinModal}
                                    toggleJoinModal={toggleJoinModal}
                                    toggleLoginModal={toggleLoginModal}
                                />
                            </div>
                        </div>
                    )}
                    <Footer />
                </div>
            </Router>
        </>
    );
}

export default App;
