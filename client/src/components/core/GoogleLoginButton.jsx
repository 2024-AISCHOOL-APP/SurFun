import React from 'react';
import '../../assets/scss/GoogleLoginButton.scss';
const GoogleLoginButton = () => {
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/auth/google';
        
    };

    return (
        <button className='google-login-button' onClick={handleGoogleLogin}>
             <svg className="google-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path fill="#4285F4" d="M47.5 24.5c0-1.6-.1-3.1-.3-4.5H24v9h13.3c-.6 3-2.5 5.5-5.3 7.2v6h8.6c5-4.6 7.9-11.5 7.9-17.7z"/>
                <path fill="#34A853" d="M24 48c6.5 0 12-2.1 16-5.6l-8.6-6c-2.2 1.5-5 2.4-7.4 2.4-5.7 0-10.5-3.8-12.2-9H3.3v6C7.3 43.2 15 48 24 48z"/>
                <path fill="#FBBC05" d="M11.8 29.3c-1-3-1-6.1 0-9H3.3v-6c-4.5 7.5-4.5 16.5 0 24l8.5-6.1z"/>
                <path fill="#EA4335" d="M24 9.5c3.4 0 6.5 1.1 8.9 3.2l6.7-6.7C35.9 2.5 30.5 0 24 0 15 0 7.3 4.8 3.3 12l8.5 6.1c1.7-5.2 6.5-9 12.2-9z"/>
            </svg>
            Login with Google
        </button>
    )
};

export default GoogleLoginButton;
