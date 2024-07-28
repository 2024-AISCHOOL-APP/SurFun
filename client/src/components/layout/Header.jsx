import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../../assets/img/surfun-logo1.png';

const HeaderContainer = styled.header`
  padding: 10px 0;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  img {
    width: 70px;
  }
`;

const Menu = styled.ul`
  list-style-type: none;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const MenuItem = styled.li`
  margin: 0 10px;
`;

const NavButton = styled.button`
  padding: 10px 20px;
  margin: 10px;
  background-color: #90e0ef;
  border: none;
  border-radius: 5px;
  color: #0077b6;
  cursor: pointer;
  font-size: 16px;
  white-space: nowrap;
  min-width: 120px;
  width: auto;
  text-align: center; 

  &:hover {
    background-color: #00b4d8;
    color: white;
  }
`;

const BlackButton = styled(NavButton)`
  background-color: #023e8a;
  color: white;

  &:hover {
    background-color: #03045e;
  }
`;

function Header({ loggedIn, username, toggleJoinModal, toggleLoginModal }) {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <HeaderContainer>
      <Nav>
        <Logo>
          <Link to="/">
            <img src={logo} alt="SurFun logo" />
          </Link>
        </Logo>
        <Menu>
          <MenuItem>
            <NavButton onClick={() => handleNavigation('/spot-select')}>Spot Select</NavButton>
          </MenuItem>
          <MenuItem>
            <NavButton onClick={() => handleNavigation('/community')}>Community</NavButton>
          </MenuItem>
          <MenuItem>
            <NavButton onClick={() => handleNavigation('/Detail')}>상세 정보</NavButton>
          </MenuItem>
          <MenuItem>
            <NavButton onClick={() => handleNavigation('/Weather-data')}>날씨 정보</NavButton>
          </MenuItem>
          {loggedIn && (
            <MenuItem style={{ color: 'black' }}>
              {`Welcome, ${username}`}
            </MenuItem>
          )}
          {!loggedIn && (
            <>
              <MenuItem>
                <BlackButton onClick={toggleJoinModal}>Sign Up</BlackButton>
              </MenuItem>
              <MenuItem>
                <BlackButton onClick={toggleLoginModal}>Sign In</BlackButton>
              </MenuItem>
            </>
          )}
        </Menu>
      </Nav>
    </HeaderContainer>
  );
}

export default Header;
