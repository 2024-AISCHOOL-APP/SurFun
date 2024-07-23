import { React, useState } from 'react';
import {Link, useNavigate} from "react-router-dom";

function Community () {
    // 상태 변수 정의
    const [username, setUsername] = useState(''); // 로그인한 사용자 이름
    const [loggedIn, setLoggedIn] = useState(false); // 로그인 상태
    const [isPostModalOpen, setIsPostModalOpen] = useState(false); // 게시글 작성 모달 열림 여부
    const navigate = useNavigate(); // 페이지 이동을 위한 hook

    // 게시글작성 모달 열기/닫기 함수
    const togglePostModal = () => {
        setIsPostModalOpen(!isPostModalOpen);
    }
    
        return (
            <div>
                <h1>Welcome to Community</h1>
                <video autoPlay loop muted className="video-background">
                    <source src="/videos/surfing.mp4" type="video/mp4" />
                </video>

                <div>
                    <hr/>
                    <Link to="/Community">자유게시판</Link>
                    &nbsp;&nbsp; | &nbsp;&nbsp;
                    <Link to="/Community/News">News</Link>
                    <hr/>
                </div>

                <div>
                    <nav>
                        게시글목록
                    </nav>                   
                </div>

                <div
                    style={{display: 'flex', justifyContent: 'flex-end'}}
                >
                    <button
                        onClick={togglePostModal}
                    >
                        글쓰기
                    </button>
                </div>

                <div>
                    <hr/>
                    페이지선택할곳
                </div>
            </div>
        );
    }

export default Community;