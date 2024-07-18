import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function JoinModal({ onJoinSuccess }) {
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
            <h1>Register</h1>
            <input
                type="text"
                placeholder="Username"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
            />
            <br/>
            <input
                type="password"
                placeholder="Password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
            />
            <br/>
            <input
                type="text"
                placeholder="Phone Number"
                value={registerPhoneNumber}
                onChange={(e) => setRegisterPhoneNumber(e.target.value)}
            />
            <br/>
            <input
                type="text"
                placeholder="Email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
            />
            <br/>
            <input
                type="text"
                placeholder="Preference"
                value={registerPreference}
                onChange={(e) => setRegisterPreference(e.target.value)}
            />
            <br/>
            <button onClick={register}>Register</button>
        </div>
    );
}

export default JoinModal;
