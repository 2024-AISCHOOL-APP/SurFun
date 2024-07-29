import React from 'react';

const Footer = () => {
  // 스타일 정의
  const footerStyle = {
    
    width: '100%',
    display: 'flex',
    flexDirection: 'column', // 수직으로 나열
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(to bottom, #FFFFFF, #EEEDED)',
    padding: '40px 20px', // 위아래 패딩 추가
    position: 'relative',
    marginTop: 'auto', // Footer를 페이지 하단으로 밀어냄
    // borderTop: '1px solid #D8D8D8', // 상단 경계선 추가
    fontFamily: 'Arial, sans-serif', // 폰트 설정
    // color: '#333' // 텍스트 색상
  };

  const textContainerStyle = {
    textAlign: 'center',
    maxWidth: '800px', // 최대 너비 설정
    margin: '0 auto' // 중앙 정렬
  };

  const linkStyle = {
    margin: '0 10px', // 링크 간격 조정
    color: '#007BFF', // 링크 색상
    textDecoration: 'none',
    fontWeight: 'bold'
  };

  const linkHoverStyle = {
    textDecoration: 'underline'
  };

  return (
    <footer style={footerStyle}>
      <div style={textContainerStyle}>
        <p>Copyright © 2024 SurFun. All rights reserved.</p>
        <p>광주광역시 동구 제봉로 92 광주대성학원 3F Classroom6</p>
        <p>Contact Us: example@example.com</p>
        <p>
          <a 
            href="https://www.example.com/privacy-policy" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={linkStyle} 
            onMouseOver={e => e.target.style.textDecoration = linkHoverStyle.textDecoration}
            onMouseOut={e => e.target.style.textDecoration = linkStyle.textDecoration}
          >
            Privacy Policy
          </a> | 
          <a 
            href="https://www.example.com/email-refusal" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={linkStyle} 
            onMouseOver={e => e.target.style.textDecoration = linkHoverStyle.textDecoration}
            onMouseOut={e => e.target.style.textDecoration = linkStyle.textDecoration}
          >
            No Unauthorized Email Collection
          </a> | 
          <a 
            href="https://www.example.com/sitemap" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={linkStyle} 
            onMouseOver={e => e.target.style.textDecoration = linkHoverStyle.textDecoration}
            onMouseOut={e => e.target.style.textDecoration = linkStyle.textDecoration}
          >
            Site Map
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
