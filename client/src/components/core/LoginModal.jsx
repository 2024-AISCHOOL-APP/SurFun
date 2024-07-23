import React, { useState } from 'react';
import axios from 'axios';
import "../../assets/scss/Main.scss"
import '../../assets/scss/Modal.css'; // 스타일을 import합니다.

function LoginModal({ onLoginSuccess, onClose }) {
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [errorMessage, setErrorMessage]=useState('');

    const close = () => {
        
    }
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);


    // const onClose = () => {
    //     console.log('Close buttion is clicked');
    //     setIsLoginModalOpen(false);
    // }

    const login = async () => {
        try {
            const response = await axios.post('http://localhost:5000/auth/login', { 
                username: loginUsername, 
                password: loginPassword 
            });
            console.log(response.data);
            onLoginSuccess(loginUsername); //로그인 성공 시 사용자 이름 전달
        } catch (error) {
            console.error('Error logging in:', error);
            setErrorMessage('Login failed. Please check your credentials.');
            alert('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="loginbox" style={{zIndex : '999'}}>
            <div className='logincontainer'>
                <button onClick={close}>닫기</button>
                <h1>Login</h1>
                {errorMessage && <p style={{color:'red'}}>{errorMessage}</p>}
                <input
                    type="text"
                    placeholder="Username"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                />
                <br/>
                <input
                    type="password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                />
                <br/>
                <button onClick={login}>Login</button>
            </div>
        <div className='login-modal-content'>
            <button
                className="close-button" 
                onClick={onClose} // 닫기 버튼 클릭 시 모달창 닫기
                >
                &times; {/* 닫기 버튼을 '×'로 표시 */}
            </button>
            <h1 align="center">로그인</h1>
            <input
                type="text"
                placeholder="아이디"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
            />
            <br/>
            <input
                type="password"
                placeholder="비밀번호"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
            />
            <br/>
            {errorMessage && <p style={{color:'red'}}>{errorMessage}</p>}
            <button
                onClick={login}
                className="login-button"
            >
                로그인
            </button>
            <br></br>
            <button
                // onClick={login}
                className="login-button"
            >
                Google로그인
            </button>
        </div>
    );
}

export default LoginModal;
