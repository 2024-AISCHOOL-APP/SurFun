import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import Layout from '../layout/Layout';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'post_date', direction: 'desc' });
  const [selectedPostId, setSelectedPostId] = useState(null);

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
  }, []);

  useEffect(() => {
    const sortPosts = () => {
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
    };

    sortPosts();
  }, [sortConfig]);

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

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleTextModal = () => {
    setIsTextModalOpen(!isTextModalOpen);
  };

  const handleSave = () => {
    setIsTextModalOpen(false);
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
          <p>Logged in as : {username}</p>
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
      {selectedPostId && <PostDetailModal postId={selectedPostId} onClose={() => setSelectedPostId(null)} />}
    </Layout>
  );
};

export default Community;
