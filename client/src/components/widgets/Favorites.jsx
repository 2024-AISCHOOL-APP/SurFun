import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import axios from 'axios';
import { setFavorites } from '../../store/slices/favoritesSlices.js';

const Favorites = () => {
    const dispatch = useDispatch();
    const favorites = useSelector(state => state.favorites);
    const username = useSelector(state => state.user.username);
    const [news, setNews] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/favorites/${username}`);
                dispatch(setFavorites(response.data));
            } catch (error) {
                console.error('Error fetching favorites', error);
            }
        };

        const fetchNews = async () => {
            try {
                const newsData = await axios.get('http://localhost:5000/api/news');
                setNews(newsData.data);
            } catch (error) {
                console.error('Error fetching news', error);
            }
        };

        if (username) {
            fetchFavorites();
        }

        fetchNews();
    }, [username, dispatch]);

    return (
        <div className="additional-sections">
            <section className="sortable-list">
                <h2 className="heading">즐겨찾는 해변</h2>
                <p className="description">나만의 즐겨찾는 서핑 스팟을 저장해 보세요.</p>
                {username ? (
                    favorites.length === 0 ? (
                        <p>즐겨찾는 해변이 없습니다.</p>
                    ) : (
                        favorites.map((favorite, index) => (
                            <div key={index} className="sortable-item" data-menu-id={favorite.id}>
                                <i className="fas fa-up-down-left-right drag-handle"></i>
                                <a href={`/detail/${favorite.surfing_zone_id || favorite.diving_zone_id}`}>
                                    {favorite.surfing_zone_id ? `서핑존: ${favorite.surfing_zone_name}` : `다이빙존: ${favorite.diving_zone_name}`}
                                </a>
                                <span className="delete-icon">
                                    <i className="fas fa-minus-circle"></i>
                                </span>
                            </div>
                        ))
                    )
                ) : (
                    <p>로그인이 필요합니다. <a href="/login">로그인</a>하세요.</p>
                )}
            </section>


  
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
      
      {/* 즐겨찾기 */}
      <section className="sortable-list">
        <p>
          <h2 className="heading">즐겨찾는 해변</h2>
        </p>
        <p className="description">나만의 즐겨찾는 서핑 스팟을 저장해 보세요.</p>
        
        {/* 로그인 상태 */}
        {isLoggedInProp && (
          <>
            {favorites.length === 0 ? (
              <p>즐겨찾는 항목이 없습니다.</p>
            ) : (
              favorites.map((name, index) => (
                <div className="sortable-item" key={index}>
                  <i className="fas fa-up-down-left-right drag-handle"></i>
                  <a href={`/spot/${name}`}>{name}</a>
                  <span
                    className="delete-icon"
                    onClick={() => onRemoveFavorite(name)} // 삭제 핸들러 호출
                  >
                    <i className="fas fa-minus-circle"></i>
                  </span>
                </div>
              ))
            )}
          </>
        )}

        {/* 로그아웃 상태 */}
        {!isLoggedInProp && (
          <p>로그인이 필요한 기능입니다.</p>
        )}
      </section>

      {/* The rest of the component remains unchanged */}
      <section className="lower-sections">
        <div className="popular-posts">
          <h2>인기글</h2>
          {posts.length === 0 ? (
            <p>인기 게시글을 불러오는 중입니다...</p>
          ) : (
            posts.map(post => (
              <div className="sortable-item" key={post.post_id}>
                <h3>
                  <Link to={`/post/${post.post_id}`}>{post.title}</Link>
                </h3>
              </div>
            ))
          )}
        </div>

        
        <div className="news-section">
                    <h2>News</h2>
                    {news.map((item, index) => (
                        <div key={index} className="sortable-item">
                            <a href={item.link} target="_blank" rel="noopener noreferrer">
                                {item.title}
                                <br />
                            </a>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );

};

export default Favorites;
