import React, { useState, useEffect } from 'react';
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
  width: 500px;
  max-width: 100%;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  height: 150px;
`;

const Button = styled.button`
  padding: 10px 20px;
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

const TextModal = ({ isOpen, onClose, onSave, username }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      });
    }
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSave = async () => {
    try {
      const post_date = new Date().toISOString();
      if (latitude === null || longitude === null) {
        console.error('Latitude or Longitude is null');
        return;
      }

      const formData = new FormData();
      formData.append('username', username);
      formData.append('title', title);
      formData.append('content', content);
      formData.append('post_date', post_date);
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      formData.append('image', image);

      const response = await axios.post('http://localhost:5000/community/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      onSave(); // 저장 후 호출
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <Title>글쓰기</Title>
        <Input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextArea
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <div>
          <Button onClick={handleSave}>저장</Button>
          <Button onClick={onClose}>취소</Button>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
};

export default TextModal;