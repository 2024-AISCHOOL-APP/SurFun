import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from './store/slices/userSlice.js';
import { setFavorites } from './store/slices/favoritesSlices.js';
import Main from './components/pages/Main';
import Community from './components/pages/Community';
import SpotSelect from './components/pages/SpotSelect';
import Header from './components/layout/Header';
import LoginModal from './components/core/LoginModal';
import JoinModal from './components/core/JoinModal';
import Detail from './components/pages/Detail';
import DetailGW from './components/pages/DetailGW';
import PostDetailModal from './components/pages/PostDetailModal';
import Divemain from './components/pages/Divemain';
import SpotSearch from './components/pages/SpotSearch';
import axios from 'axios';

function App() {
  const dispatch = useDispatch();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const { loggedIn, username } = useSelector((state) => state.user);

  const handleLoginSuccess = (username) => {
    dispatch(login(username));
    setIsLoginModalOpen(false);
    fetchFavorites(username);
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

  return (
    <Router>
      <Header
        loggedIn={loggedIn}
        username={username}
        toggleJoinModal={toggleJoinModal}
        toggleLoginModal={toggleLoginModal}
      />
      <Routes>
        <Route path="/" element={<Main onLoginSuccess={handleLoginSuccess} username={username} />} />
        <Route path="*" element={<Main onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/community" element={<Community username={username} />} />
        <Route path="/post/:id" element={<PostDetailModal username={username} />} />
        <Route path="/Detail" element={<Detail />} />
        <Route path="/Detail2" element={<DetailGW />} />
        <Route path="/spot-select" element={<SpotSelect username={username} />} />
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
    </Router>
  );
}

export default App;
