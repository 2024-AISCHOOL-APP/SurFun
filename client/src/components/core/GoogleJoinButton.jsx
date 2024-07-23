import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const responseGoogle = (response) => {
  console.log(response);
  fetch('http://localhost:5000/auth/google', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: response.credential }),
  })
  .then(res => res.json())
  .then(data => {
    console.log(data);
  });
};

function GoogleJoinButton() {
  return (
    <GoogleOAuthProvider clientId="process.env.REACT_APP_GOOGLE_CLIENT_ID">
      <div className="GoogleJoin">
        <GoogleLogin
          onSuccess={responseGoogle}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      </div>
    </GoogleOAuthProvider>
  );
}

export default GoogleJoinButton;
