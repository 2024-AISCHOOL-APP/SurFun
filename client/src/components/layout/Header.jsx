import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../../assets/img/surfun-logo1.png';

const HeaderContainer = styled.header`
  background-color: #0077b6; /* 바다 느낌의 배경색 */
  padding: 10px 0;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  img {
    width: 70px; /* 로고 너비를 px로 조정 */

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
  background-color: #90e0ef; /* 버튼 배경색 */
  border: none;
  border-radius: 5px;
  color: #0077b6; /* 버튼 글자색 */
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #00b4d8; /* 호버 시 배경색 */
    color: white; /* 호버 시 글자색 */
  }
`;

const BlackButton = styled(NavButton)`
  background-color: #023e8a; /* 검정색 버튼 배경색 */
  color: white;

  &:hover {
    background-color: #03045e; /* 호버 시 배경색 */
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
            <img src={logo} alt="SurFun logo"/>
          </Link>
        </Logo>
        <Menu>
          {loggedIn && (
            <MenuItem style={{ color: 'white' }}>
              {`Welcome, ${username}`}
            </MenuItem>
          )}
          <MenuItem>
            <NavButton onClick={() => handleNavigation('/spot-select')}>Spot Select</NavButton>
          </MenuItem>
          <MenuItem>
            <NavButton onClick={() => handleNavigation('/community')}>Community</NavButton>
          </MenuItem>
          <MenuItem>
            <NavButton onClick={() => handleNavigation('/profile')}>Profile</NavButton>
          </MenuItem>
          {!loggedIn && (
            <>
              <MenuItem>
                <BlackButton onClick={toggleJoinModal}>회원가입</BlackButton>
              </MenuItem>
              <MenuItem>
                <BlackButton onClick={toggleLoginModal}>로그인</BlackButton>
              </MenuItem>
            </>
          )}
        </Menu>
      </Nav>
    </HeaderContainer>
  );
}

export default Header;
