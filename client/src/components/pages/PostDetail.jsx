import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const PostDetailContainer = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/community/posts/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error('Failed to fetch post:', error);
      }
    };

    fetchPost();
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <PostDetailContainer>
      <Title>{post.title}</Title>
      <MetaInfo>
        {post.username} | {new Date(post.post_date).toLocaleDateString()} | 조회수: {post.views}
      </MetaInfo>
      <Content>{post.content}</Content>
    </PostDetailContainer>
  );
};

export default PostDetail;
