import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

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

const CommentsContainer = styled.div`
  margin-top: 20px;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

const Comment = styled.div`
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
`;

const CommentForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const TextArea = styled.textarea`
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

const Button = styled.button`
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #0077b6;
  color: white;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #005f8d;
  }

  &:not(:last-child) {
    margin-right: 10px;
  }
`;

const PostDetailModal = ({ postId, onClose, username }) => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/community/posts/${postId}`);
        setPost(response.data);
      } catch (error) {
        console.error('Failed to fetch post:', error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/community/comments/${postId}`);
        setComments(response.data);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
        setComments([]); //댓글이 없는 경우 빈 배열로 설정!
      }
    };

    fetchPost();
    fetchComments();
  }, [postId]);

  useEffect(() => {
    console.log('PostDetailModal username:', username); // username 확인
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('postId:', postId);
    console.log('username:', username);
    console.log('newComment:', newComment);

    if (!postId || !username || !newComment) {
      console.error('Post ID, username, and content are required');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/community/comments`, {
        post_id: postId,
        username: username,
        content: newComment,
      });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to submit comment:', error);
    }
  };

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
        <CommentsContainer>
          {comments.map((comment, index) => (
            <Comment key={index}>
              <p>{comment.content}</p>
              <small>{comment.username}</small>
            </Comment>
          ))}
          <CommentForm onSubmit={handleSubmit}>
            <TextArea
              rows="4"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button type="submit">Submit</Button>
          </CommentForm>
        </CommentsContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default PostDetailModal;
