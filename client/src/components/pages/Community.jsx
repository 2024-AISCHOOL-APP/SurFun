import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import PostDetailModal from './PostDetailModal';
import TextModal from '../core/TextModal';

const CommunityContainer = styled.div`
  text-align: center;
  color: black;
  margin-top: 20px;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const VideoBackground = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const BoardContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 20px;
  margin: 50px auto;
  width: 80%;
  max-width: 1200px;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
`;

const Th = styled.th`
  background-color: #87CEEB;
  color: white;
  padding: 10px;
  border: 1px solid #ddd;
  cursor: pointer;
`;

const Td = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: #E0FFFF;
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
  right: 20px;

  &:hover {
    background-color: #005f8d;
  }
`;

const PostImage = styled.img`
  max-width: 100px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Community = ({ username }) => {
  const [posts, setPosts] = useState([]);
  const [sortedPosts, setSortedPosts] = useState([]); // 추가
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'post_date', direction: 'desc' });
  const [selectedPostId, setSelectedPostId] = useState(null);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/community/posts');
        console.log(response.data); // 서버에서 받은 데이터 로그 출력, 추후 삭제할 부분
        setPosts(response.data);
      } catch (error) {
        console.error('게시글을 불러오는데 실패했습니다:', error);
      }
    };
    fetchPosts();
  }, []);

  // 정렬 설정이 변경되거나 posts가 변경될 때마다 게시글을 정렬
  useEffect(() => {
    const sortPosts = () => {
      let sorted = [...posts];
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
      setSortedPosts(sorted); // sortedPosts를 업데이트
    };

    sortPosts();
  }, [sortConfig, posts]); // posts가 변경될 때도 다시 정렬 로직을 실행하도록 의존성 배열에 posts 추가

  // 정렬 요청 함수
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // 페이지네이션 함수
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // 글쓰기 모달 토글 함수
  const toggleTextModal = () => {
    setIsTextModalOpen(!isTextModalOpen);
  };
  
  // 새 게시글 저장 후 게시글 목록 갱신
  const handleSave = () => {
    setIsTextModalOpen(false);
    axios.get('http://localhost:5000/community/posts')
      .then(response => {
        console.log(response.data); // 서버에서 받은 데이터 로그 출력, 추후 삭제할 부분
        setPosts(response.data);
      })
      .catch(error => {
        console.error('게시글을 불러오는데 실패했습니다:', error);
      });
  };

  const totalPosts = posts.length; // 총 게시글 수
  const totalPages = Math.ceil(totalPosts / postsPerPage); // 총 페이지 수

  return (
    <>
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
                <Th>이미지</Th>
              </Tr>
            </thead>
            <tbody>
              {currentPosts.map((post, index) => (
                <Tr key={post.post_id} onClick={() => setSelectedPostId(post.post_id)}>
                  <Td>{indexOfFirstPost + index + 1}</Td>
                  <Td><Link to={`/post/${post.post_id}`}>{post.title}</Link></Td>
                  <Td>{post.username}</Td>
                  <Td>{new Date(post.post_date).toLocaleDateString()}</Td>
                  <Td>{post.views}</Td>
                  <Td>{post.image && <PostImage src={`http://localhost:5000/uploads/${post.image}`} alt={post.title} />}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
          <Pagination>
            {/* 이전 페이지 버튼, 첫 페이지에서는 비활성화 */}
            <PageNumber 
              onClick={() => currentPage > 1 && paginate(currentPage - 1)} 
              disabled={currentPage === 1}
            >
              &lt; 이전
            </PageNumber>
            {[...Array(totalPages).keys()].map(number => (
              // 페이지 번호 버튼
              <PageNumber 
                key={number + 1} 
                onClick={() => paginate(number + 1)} 
                className={currentPage === number + 1 ? 'active' : ''}
              >
                {number + 1}
              </PageNumber>
            ))}
            {/* 다음 페이지 버튼, 마지막 페이지에서는 비활성화 */}
            <PageNumber 
              onClick={() => currentPage < totalPages && paginate(currentPage + 1)} 
              disabled={currentPage === totalPages}
            >
              다음 &gt;
            </PageNumber>
          </Pagination>
          <WriteButton onClick={toggleTextModal}>글쓰기</WriteButton>
        </BoardContainer>
      </CommunityContainer>
      <TextModal isOpen={isTextModalOpen} onClose={toggleTextModal} onSave={handleSave} username={username} />
      {selectedPostId && <PostDetailModal postId={selectedPostId} onClose={() => setSelectedPostId(null)} username={username}/>}
    </>
  );
};

export default Community;
