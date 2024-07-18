import React from 'react';
import { Link,useNavigate } from 'react-router-dom';

function Header({ loggedIn, username, toggleJoinModal, toggleLoginModal }) {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };
    return (
        <header>
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="logo">
                    <Link to="/">
                        <img src="/path/to/logo.png" alt="SurFun Logo" />
                    </Link>
                </div>
                <ul style={{ listStyleType: 'none', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    {loggedIn && (
                        <li style={{ margin: '0 10px', color: 'white' }}>
                            {`Welcome, ${username}`}
                        </li>
                    )}
                    <li style={{ margin: '0 10px' }}>
                        <button onClick={() => handleNavigation('/spot-select')}>Spot Select</button>
                    </li>
                    <li style={{ margin: '0 10px' }}>
                        <button onClick={() => handleNavigation('/community')}>Community</button>
                    </li>
                    <li style={{ margin: '0 10px' }}>
                        <button  onClick={() => handleNavigation('/profile')}>Profile</button>
                    </li>
                    {!loggedIn && (
                        <>
                            <li style={{ margin: '0 10px' }}>
                                <button className='black-button' onClick={toggleJoinModal}>회원가입</button>
                            </li>
                            <li style={{ margin: '0 10px' }}>
                                <button className='black-button' onClick={toggleLoginModal}>로그인</button>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Header;
