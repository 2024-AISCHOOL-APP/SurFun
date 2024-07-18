import React from 'react';

const Favorites=()=>{

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
                        <h2>인기글</h2>
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