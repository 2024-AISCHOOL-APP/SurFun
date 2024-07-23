import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function JoinModal({ onJoinSuccess, onClose }) {
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerPhoneNumber, setRegisterPhoneNumber] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPreference, setRegisterPreference] = useState('');
    const navigate = useNavigate();

    const register = async () => {
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
            navigate('/'); // 회원가입이 완료되면 홈페이지로 이동
        } catch (error) {
            console.error('Error registering:', error);
        }
    };

    return (
        <div>
            <button
                className="close-button" 
                onClick={onClose} // 닫기 버튼 클릭 시 모달창 닫기
                >
                &times; {/* 닫기 버튼을 '×'로 표시 */}
            </button>
            <h1 align='center'>회원가입</h1>
            <br/>
            아이디*
            <br/>
            <input
                type="text"
                placeholder="ID"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
            />
            <br/>
            비밀번호*
            <br/>
            <input
                type="password"
                placeholder="●●●●●●●●"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
            />
            <br/>
            비밀번호확인*
            <br/>
            <input
                type="password"
                placeholder="●●●●●●●●"
            />
            <br/>
            휴대폰번호*
            <br/>
            <input
                type="text"
                placeholder="Phone Number"
                value={registerPhoneNumber}
                onChange={(e) => setRegisterPhoneNumber(e.target.value)}
            />
            <br/>
            이메일
            <br/>
            <input
                type="text"
                placeholder="Email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
            />
            <br/>
            Preference가 선호지역인가?
            <br/>
            <input
                type="text"
                placeholder="Preference"
                value={registerPreference}
                onChange={(e) => setRegisterPreference(e.target.value)}
            />
            <br/>
            <button onClick={register}>가입</button>
        </div>
    );
}

export default JoinModal;
