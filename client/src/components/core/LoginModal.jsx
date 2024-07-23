import React, { useState } from 'react';
import axios from 'axios';
import "../../assets/scss/Main.scss"

function LoginModal({ onLoginSuccess }) {
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [errorMessage, setErrorMessage]=useState('');

    const close = () => {
        
    }

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
        </div>
    );
}

export default LoginModal;
