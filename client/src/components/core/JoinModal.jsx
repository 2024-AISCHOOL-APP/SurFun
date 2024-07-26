import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GoogleJoinButton from './GoogleJoinButton';
import styled from 'styled-components';
import GoogleLoginButton from './GoogleLoginButton';
import { GoogleLogin } from '@react-oauth/google';


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

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 10px;
  color: #0077b6;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #023e8a;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const Select = styled.select`
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

const GoogleButtonWrapper = styled.div`
  width: 100%;
  margin: 10px 0;
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

const Message = styled.p`
  font-size: 12px;
  margin: 5px 0 0;
  color: ${props => props.color || 'black'};
`;

function JoinModal({ onJoinSuccess, onClose, toggleJoinModal, toggleLoginModal}) {
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerPasswordCheck, setRegisterPasswordCheck] = useState('');
  const [registerPhoneNumber, setRegisterPhoneNumber] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPreference, setRegisterPreference] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordMessageColor, setPasswordMessageColor] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // 로그인 모달 열림 여부
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false); // 회원가입 모달 열림 여부

  const navigate = useNavigate();

  const handleClick = (event) => {
    event.preventDefault();
    toggleJoinModal(); // Join Modal을 닫고
    toggleLoginModal(); // Login Modal을 열기
  };

  const register = async () => {
    if (registerPassword !== registerPasswordCheck) {
      setPasswordMessage('Passwords do not match.');
      setPasswordMessageColor('red');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/auth/register', {
        username: registerUsername,
        password: registerPassword,
        phone_number: registerPhoneNumber,
        email: registerEmail,
        preference: registerPreference
      });
      console.log(response.data);
      onJoinSuccess();
      toggleLoginModal(); // 회원가입이 완료되면 로그인 모달로 이동
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  const handlePasswordCheck = (e) => {
    const value = e.target.value;
    setRegisterPasswordCheck(value);

    if (value === registerPassword) {
      setPasswordMessage('Passwords match.');
      setPasswordMessageColor('green');
    } else {
      setPasswordMessage('Passwords do not match.');
      setPasswordMessageColor('red');
    }
  };

  return (
    <ModalContainer>
      <Title>Join the Wave!</Title>
      <Subtitle>Catch the best waves and join the surfing community today.</Subtitle>
      <Input
        type="text"
        placeholder="Username*"
        value={registerUsername}
        onChange={(e) => setRegisterUsername(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Phone Number*"
        value={registerPhoneNumber}
        onChange={(e) => setRegisterPhoneNumber(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Email*"
        value={registerEmail}
        onChange={(e) => setRegisterEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password*"
        value={registerPassword}
        onChange={(e) => setRegisterPassword(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Confirm Password*"
        value={registerPasswordCheck}
        onChange={handlePasswordCheck}
      />
      {passwordMessage && <Message color={passwordMessageColor}>{passwordMessage}</Message>}
      <Select
        value={registerPreference}
        onChange={(e) => setRegisterPreference(e.target.value)}
      >
        <option value="">Select Preference*</option>
        <option value="Jeju">Jeju</option>
        <option value="Gangwon">Gangwon</option>
      </Select>
      <Button onClick={register}>Sign Up</Button>
      <GoogleButtonWrapper>
        <GoogleJoinButton />
      </GoogleButtonWrapper>
      <FooterText>
        Already have an account?
        <LinkText href="#" onClick={handleClick}>Sign In</LinkText> 
      </FooterText>
      <Button onClick={onClose}>Close</Button>
    </ModalContainer>
  );
}

export default JoinModal;
