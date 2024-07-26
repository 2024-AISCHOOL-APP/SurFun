import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import logo_insta from '../../assets/img/Instagram Logo.png'; // 경로를 실제 이미지 경로로 변경하십시오.
import logo_surf from '../../assets/img/Instagram Logo.png'; // 경로를 실제 이미지 경로로 변경하십시오.

const footerStyle = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column', // 수직으로 나열
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'white',
  // borderTop: '1px solid #D8D8D8',
  paddingTop: '20px', // 위아래 패딩 추가
  position: 'relative',
  // bottom: '0',
  // left: '0',
  margintop: 'auto' /* Footer를 페이지 하단으로 밀어냄 */
};

const snsContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '20px', // 요소들 사이의 간격을 조절합니다.
  marginBottom: '10px' // SNS 아이콘과 텍스트 사이의 간격을 조절합니다.
};

const textContainerStyle = {
  textAlign: 'center'
};

const Logo = styled.a`
  display: flex;
  align-items: center;
  img {
    max-height: 40px; // 이미지가 부모 요소의 높이를 넘지 않도록 합니다.
    height: auto;
  }
`;

const LinkText = styled.a`
  margin: 0 5px;
  color: inherit; // 부모 요소의 색상 상속
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <div className='sns_container' style={snsContainerStyle}>
        <Logo href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
          <img src={logo_insta} alt="Insta logo" />
        </Logo>
        <Logo href="https://www.surfun.com" target="_blank" rel="noopener noreferrer">
          <img src={logo_surf} alt="SurFun logo" />
        </Logo>
        <Logo href="https://www.surfun.com" target="_blank" rel="noopener noreferrer">
          <img src={logo_surf} alt="SurFun logo" />
        </Logo>
      </div>
      <div className='text_container' style={textContainerStyle}>
        <p>© 2024 SurFun. All rights reserved.</p>
        <p>
          <LinkText href="https://www.example.com/privacy-policy" target="_blank" rel="noopener noreferrer">개인정보처리방침</LinkText> | 
          <LinkText href="https://www.example.com/email-refusal" target="_blank" rel="noopener noreferrer">이메일무단수집거부</LinkText> | 
          <LinkText href="https://www.example.com/sitemap" target="_blank" rel="noopener noreferrer">사이트맵</LinkText>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
