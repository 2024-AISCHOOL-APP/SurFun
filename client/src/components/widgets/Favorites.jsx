import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Favorites=()=>{
        const navigate = useNavigate();

        const handlePopularPostsClick = () => {
            navigate('/community');
        };

        return (
            <div className="additional-sections">
                <section>
                    <h2>즐겨찾는 해변</h2>
                    <div className="favorites-section">
                        즐겨찾는 해변 목록 표시 컴포넌트
                    </div>
                </section>
                <section className="lower-sections">
                    <div className="popular-posts">
                        <h2
                            onClick={handlePopularPostsClick}
                            style={{ cursor: 'pointer' }}
                        >
                                인기글
                        </h2>
                        인기글 목록 표시 컴포넌트
                    </div>
                    <div className="news-section">
                        <h2>News</h2>
                        News 목록 표시 컴포넌트
                    </div>
                </section>
            </div>
        );
};

export default Favorites;