import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import instagramLogo from '../../assets/img/instagram-logo.png';
import facebookLogo from '../../assets/img/facebook-logo2.png';
import googlelogo from '../../assets/img/google-logo2.png';

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f0f8ff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  width: 350px;
  margin: auto;
  text-align: center;
  font-family: 'Arial, sans-serif';
`;

const SocialButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 10px 0;
`;

const SocialButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;

  img {
    width: 40px; /* 로고 이미지 크기 */
    height: 40px;
  }

  &:hover img {
    opacity: 0.7; /* 호버 시 투명도 조절 */
  }
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 10px;
  color: #0077b6;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: none;
  border-radius: 4px;
  background-color: #0077b6;
  color: white;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #023e8a;
  }
`;

const ErrorMessage = styled.p`
  color: red;
`;

const FooterText = styled.p`
  font-size: 14px;
  color: #666;
`;

const LinkText = styled.a`
  color: #0077b6;
  text-decoration: none;
  margin-left: 5px;

  &:hover {
    text-decoration: underline;
  }
`;

function LoginModal({ onLoginSuccess, onClose, toggleJoinModal, toggleLoginModal }) {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleClick = (event) => {
    event.preventDefault();
    toggleLoginModal(); // Login Modal을 닫고
    toggleJoinModal(); // Join Modal을 열기
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  const login = async () => {
    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        username: loginUsername,
        password: loginPassword
      });
      console.log(response.data);
      onLoginSuccess(loginUsername); // 로그인 성공 시 사용자 이름 전달
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage('Login failed. Please check your credentials.');
    }
  };

  return (
    <ModalContainer>
      <Title>Let's Sign In!</Title>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      <Input
        type="text"
        placeholder="이메일(ID)"
        value={loginUsername}
        onChange={(e) => setLoginUsername(e.target.value)}
      />
      <Input
        type="password"
        placeholder="비밀번호"
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
      />
      <label>
        <input type="checkbox" />
        로그인 상태 유지
      </label>
      <Button onClick={login}>Sign In</Button>
      <SocialButtonWrapper>
        <SocialButton onClick={handleGoogleLogin}>
          <img src={googlelogo} alt="google" />
        </SocialButton>
        <SocialButton>
          <img src={instagramLogo} alt="Instagram" />
        </SocialButton>
        <SocialButton>
          <img src={facebookLogo} alt="Facebook" />
        </SocialButton>
      </SocialButtonWrapper>
      <FooterText>
        <a href="#">아이디/비밀번호 찾기</a>
      </FooterText>
      <FooterText>
        계정이 없으신가요?
        <LinkText onClick={handleClick}>회원가입</LinkText>
      </FooterText>
      <Button onClick={onClose}>Close</Button>
    </ModalContainer>
  );
}

export default LoginModal;
