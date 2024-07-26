import React, { useState } from 'react';
import axios from 'axios';
import '../../assets/scss/Modal.css'; // 스타일을 import합니다.

function PostModal({ onLoginSuccess, onClose }) {
    const [loggedIn, setLoggedIn] = useState(false); // 로그인 여부
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [isPostModalOpen, setIsPostModalOpen] = useState(false); // 게시글 작성 모달 열림 여부
    


    return (
        <div className='post-modal-content'>
            <h1 align="center">글쓰기</h1>
            <form>
                <input
                    type="text"
                    placeholder="자유롭게 작성해주세요"
                    // value={content}
                    onChange={(e) => setLoginUsername(e.target.value)}
                />
            </form>
            <br/>
            <button
                className="close-button" 
                onClick={onClose} // 취소 버튼 클릭 시 모달창 닫기
                >
                취소 {/* 닫기 버튼을 '×'로 표시 */}
            </button>
            <button
                className="close-button" 
                onClick={onClose} // 닫기 버튼 클릭 시 모달창 닫기
                >
                등록
            </button>
        </div>
    );
}

export default PostModal;
