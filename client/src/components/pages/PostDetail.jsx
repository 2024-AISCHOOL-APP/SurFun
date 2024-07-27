// PostDetailModal.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import CommentSection from './CommentSection';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 800px;
  max-width: 100%;
  max-height: 80%;
  overflow-y: auto;
  position: relative;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
`;

const MetaInfo = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
`;

const Content = styled.div`
  font-size: 16px;
`;

const CloseButton = styled.button`
  background-color: transparent;
  border: none;
  font-size: 20px;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const PostDetailModal = ({ postId, onClose }) => {
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/community/posts/${postId}`);
        setPost(response.data);
      } catch (error) {
        console.error('Failed to fetch post:', error);
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Title>{post.title}</Title>
        <MetaInfo>
          {post.username} | {new Date(post.post_date).toLocaleDateString()} | 조회수: {post.views}
        </MetaInfo>
        <Content>{post.content}</Content>
        <CommentSection postId={postId} />
      </ModalContent>
    </ModalOverlay>
  );
};

export default PostDetailModal;