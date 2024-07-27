// CommentSection.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

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

const CloseButton = styled(Button)`
  background-color: #d9534f;

  &:hover {
    background-color: #c9302c;
  }
`;

const CommentSection = ({ postId, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/community/posts/${postId}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };

    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5000/community/posts/${postId}/comments`, {
        content: newComment,
      });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to submit comment:', error);
    }
  };

  return (
    <CommentsContainer>
      <CloseButton onClick={onClose}>Close</CloseButton>
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
  );
};

export default CommentSection;