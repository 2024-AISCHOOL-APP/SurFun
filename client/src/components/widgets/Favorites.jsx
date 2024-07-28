import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Favorites = () => {
    const [news, setNews] = useState([]);

    useEffect(() => {
        const getNews = async () => {
            try {
                const newsData = await axios.get('http://localhost:5000/api/news');
                setNews(newsData.data);
            } catch (error) {
                console.error('Error fetching news', error);
            }
        };
        getNews();
    }, []);

    return (
        <div className="additional-sections">
            <section className="sortable-list">
                <h2 className="heading">즐겨찾는 해변</h2>
                <p className="description">나만의 즐겨찾는 서핑 스팟을 저장해 보세요.</p>
                <div className="sortable-item" data-menu-id="yonghwa">
                    <i className="fas fa-up-down-left-right drag-handle"></i>
                    <a href="/yonghwa">삼척 용화 해변 파도차트</a>
                    <span className="delete-icon">
                        <i className="fas fa-minus-circle"></i>
                    </span>
                </div>
                <div className="sortable-item" data-menu-id="yonghwa">
                    <i className="fas fa-up-down-left-right drag-handle"></i>
                    <a href="/yonghwa">어쩔 해변 파도차트</a>
                    <span className="delete-icon">
                        <i className="fas fa-minus-circle"></i>
                    </span>
                </div>
            </section>

            <section className="lower-sections">
                <div className="popular-posts">
                    <h2>인기글</h2>
                    <div className="sortable-item">
                        <h3>제목</h3>
                        <h5>작성자</h5>
                    </div>
                    <div></div>
                    <div></div>
                </div>

                <div className="news-section">
                    <h2>News</h2>
                    {news.map((item, index) => (
                        <div key={index} className="sortable-item">
                            <a href={item.link} target="_blank" rel="noopener noreferrer">
                                {item.title}
                                <br></br>
                            </a>
                        </div>
                    ))}
                </div>
                <br></br>
            </section>
        </div>
    );
};

export default Favorites;
