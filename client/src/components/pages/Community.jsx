import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link } from 'react-router-dom';
import TextModal from '../core/TextModal'; // TextModal import
import Layout from '../layout/Layout';

const CommunityContainer = styled.div`
  text-align: center;
  color: black; /* 기본 텍스트 색상 */
  margin-top: 20px; /* 비디오 아래에 여백 추가 */
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh; /* 비디오 높이 설정 */
  overflow: hidden;
`;

const VideoBackground = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover; /* 비디오를 컨테이너에 맞게 조정 */
`;

const BoardContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.9); /* 반투명 배경 */
  border-radius: 10px;
  padding: 20px;
  margin: 50px auto;
  width: 80%;
  max-width: 1200px;
  position: relative;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
`;

const Th = styled.th`
  background-color: #f2f2f2;
  padding: 10px;
  border: 1px solid #ddd;
  cursor: pointer; /* 클릭할 수 있음을 나타내는 커서 변경 */
`;

const Td = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
`;

const PageNumber = styled.span`
  margin: 0 5px;
  cursor: pointer;
  color: #0077b6;
  
  &.active {
    font-weight: bold;
    text-decoration: underline;
  }
`;

const WriteButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #0077b6;
  color: white;
  font-size: 16px;
  cursor: pointer;
  position: absolute;
  bottom: 20px;
  right: 20px; /* 이 부분을 수정하면 버튼 위치 변경 가능 */

  &:hover {
    background-color: #005f8d;
  }
`;

const WeatherContainer = styled.div`
  margin: 20px 0;
  padding: 20px;
  background-color: #e0f7fa;
  border-radius: 10px;
`;

const PostImage = styled.img`
  max-width: 100px;
  height: auto;
`;

const Community = ({ username }) => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false); // Modal 상태 추가
  const [sortConfig, setSortConfig] = useState({ key: 'post_date', direction: 'desc' });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/community/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };
    fetchPosts();
  }, []); // 빈 의존성 배열을 추가하여 초기 로딩 시에만 데이터를 불러오도록 설정

  useEffect(() => {
    let sortedPosts = [...posts];
    if (sortConfig !== null) {
      sortedPosts.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    setPosts(sortedPosts);
  }, [sortConfig]); // sortConfig가 변경될 때만 실행

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleTextModal = () => {
    setIsTextModalOpen(!isTextModalOpen);
  };

  const handleSave = () => {
    setIsTextModalOpen(false);
    // 글 저장 후 게시글 목록 새로고침
    axios.get('http://localhost:5000/community/posts').then(response => {
      setPosts(response.data);
    }).catch(error => {
      console.error('Failed to fetch posts:', error);
    });
  };

  return (
    <Layout>
      <VideoContainer>
        <VideoBackground autoPlay loop muted>
          <source src="/videos/surfing.mp4" type="video/mp4" />
        </VideoBackground>
        <div className="welcome-message">
          <h1>Welcome to Community</h1>
        </div>
      </VideoContainer>
      <CommunityContainer>
        <BoardContainer>
          <Table>
            <thead>
              <Tr>
                <Th onClick={() => requestSort('index')}>번호</Th>
                <Th onClick={() => requestSort('title')}>제목</Th>
                <Th onClick={() => requestSort('username')}>글쓴이</Th>
                <Th onClick={() => requestSort('post_date')}>날짜</Th>
                <Th onClick={() => requestSort('views')}>조회수</Th>
              </Tr>
            </thead>
            <tbody>
              {currentPosts.map((post, index) => (
                <Tr key={post.post_id}>
                  <Td>{indexOfFirstPost + index + 1}</Td>
                  <Td><Link to={`/post/${post.post_id}`}>{post.title}</Link></Td>
                  <Td>{post.username}</Td>
                  <Td>{new Date(post.post_date).toLocaleDateString()}</Td>
                  <Td>{post.views}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
          <Pagination>
            <PageNumber onClick={() => paginate(currentPage - 1)}>&lt; Previous</PageNumber>
            {[...Array(Math.ceil(posts.length / postsPerPage)).keys()].map(number => (
              <PageNumber key={number + 1} onClick={() => paginate(number + 1)} className={currentPage === number + 1 ? 'active' : ''}>
                {number + 1}
              </PageNumber>
            ))}
            <PageNumber onClick={() => paginate(currentPage + 1)}>Next &gt;</PageNumber>
          </Pagination>
          <WriteButton onClick={toggleTextModal}>글쓰기</WriteButton>
        </BoardContainer>
      </CommunityContainer>
      <TextModal isOpen={isTextModalOpen} onClose={toggleTextModal} onSave={handleSave} username={username} />
    </Layout>
  );
};

export default Community;
