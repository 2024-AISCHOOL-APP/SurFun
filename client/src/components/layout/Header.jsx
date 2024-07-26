import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../../assets/img/surfun-logo1.png';

const HeaderContainer = styled.header`
  // background-color: #0077b6; /* 바다 느낌의 배경색 */
  padding: 10px 0;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
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
  white-space: nowrap; /* 텍스트 줄 바꿈 방지 */
  min-width: 120px; /* 버튼의 최소 너비 설정 */
  width: auto; /* 버튼 너비를 자동으로 조정 */
  text-align: center; /* 텍스트를 버튼 중앙에 정렬 */ 

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
            <MenuItem style={{ color: 'white' }}>
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
