import React from 'react';
import '../../assets/scss/Main.scss';

const Profile=()=> {
    
        return (
            <div>
                <h1>Welcome to ProfilePage</h1>
                <video autoPlay loop muted className="video-background">
                <source src="/videos/surfing.mp4" type="video/mp4" />
            </video>
            </div>
        );
    }

export default Profile;