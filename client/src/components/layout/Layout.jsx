import React from 'react';
import Footer from './Footer';
import Header from './Header';
import styled from 'styled-components';

const Body = styled.body`
  margin-top: 70px; /* Header 높이만큼 추가 */
  padding-top: 10px;
  margin-bottom: 20px;
`; 

const Layout = ({ children }) => {
    
    
    return (
        <div>
            {/* <Header
                loggedIn={loggedIn}
                username={username}
                toggleJoinModal={toggleJoinModal}
                toggleLoginModal={toggleLoginModal}
            /> */}
            {/* <Header /> */}
            <Body>
                {children}
            </Body>
            <Footer />
        </div>
    );
};

export default Layout;
