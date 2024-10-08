import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../../assets/img/surfun-logo1.png';
import { useState } from 'react';

const HeaderContainer = styled.header`
  // background-color: #0077b6; /* 바다 느낌의 배경색 */
  padding: 10px 0;
  @media (max-width: 768px) {
    padding: 5px 0;
  }
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Logo = styled.div`
  img {
    width: 70px;
    @media (max-width: 768px) {
      width: 50px;
    }
  }
`;

const Menu = styled.ul`
  list-style-type: none;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    width: 100%;
    overflow-x: auto;
    white-space: nowrap;
  }
`;

const MenuItem = styled.li`
  margin: 0 10px;
  @media (max-width: 768px) {
    margin: 5px 0;
  }
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

  @media (max-width: 768px) {
    padding: 5px 10px;
    margin: 5px;
    font-size: 14px;
  }
`;

const BlackButton = styled(NavButton)`
  background-color: #023e8a;
  color: white;

  &:hover {
    background-color: #03045e;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;

  input {
    padding: 8px;
    margin-right: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;

    @media (max-width: 768px) {
      flex: 1;
      margin-right: 5px;
    }
  }

  button {
    padding: 8px 20px;
    border: none;
    border-radius: 5px;
    background-color: #00b4d8;
    color: white;
    cursor: pointer;

    &:hover {
      background-color: #0077b6;
    }

    @media (max-width: 768px) {
      padding: 5px 10px;
    }
  }

  @media (max-width: 768px) {
    flex-direction: row;
    width: 100%;
    padding: 0 10px;
  }
`;

function Header({ loggedIn, username, toggleJoinModal, toggleLoginModal, handleLogout }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');



  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      if (searchQuery.trim() === '기사문') {
        navigate(`/detail2?name=${encodeURIComponent(searchQuery)}`);
      } else {
        navigate(`/detail?name=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  return (
    <HeaderContainer>
      <Nav>
        <Logo>
          <Link to="/">
            <img src={logo} alt="SurFun logo" />
          </Link>
        </Logo>
        <SearchContainer>
          <input
            type="text"
            placeholder="Search for zones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </SearchContainer>
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
            <NavButton onClick={() => handleNavigation('/SpotSearch')}>지역 검색</NavButton>
          </MenuItem>
          {loggedIn && (
            <>
              <MenuItem style={{ color: 'black' }}>
                {`Welcome, ${username}`}
              </MenuItem>
              <MenuItem>
                <BlackButton onClick={handleLogout}>Logout</BlackButton> {/* 로그아웃 버튼 */}
              </MenuItem>
            </>
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
