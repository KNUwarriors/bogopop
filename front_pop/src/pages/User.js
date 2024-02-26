import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './user.css';

const UserContainer = ({ title, movieData }) => {
    const containerRef = useRef(null);
    const [isLeftButtonVisible, setIsLeftButtonVisible] = useState(true);
    const [isRightButtonVisible, setIsRightButtonVisible] = useState(true);

    const handleScroll = () => {
        const container = containerRef.current;
        const maxScrollLeft = container.scrollWidth - container.clientWidth;
        setIsLeftButtonVisible(container.scrollLeft > 0);
        setIsRightButtonVisible(container.scrollLeft < maxScrollLeft);
    };

    useEffect(() => {
        const container = containerRef.current;
        container.addEventListener('scroll', handleScroll);
        return () => {
            container.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scroll = (direction) => {
        const scrollAmount = 500;
        const currentScroll = containerRef.current.scrollLeft;

        if (direction === 'left') {
            containerRef.current.scrollLeft = Math.max(currentScroll - scrollAmount, 0);
        } else if (direction === 'right') {
            containerRef.current.scrollLeft = Math.min(
                currentScroll + scrollAmount,
                containerRef.current.scrollWidth - containerRef.current.clientWidth
            );
        }
    };

    return (
        <div className='favorites-container'>
            <h2>{title}</h2>
            <hr />
            {isLeftButtonVisible && (
                <button className="scrollButton left" onClick={() => scroll('left')}>&lt;</button>
            )}
            <div className='favorites' ref={containerRef}>
                {movieData.map((movie) => (
                    <Link key={movie.id} to={`/movies/${movie.id}`}>
                        <div className="MoviePoster">
                            <img src={movie.poster} alt={movie.title} />
                        </div>
                    </Link>
                ))}
            </div>
            {isRightButtonVisible && (
                <button className="scrollButton right" onClick={() => scroll('right')}>&gt;</button>
            )}
        </div>
    );
};

function User() {
    const navigate = useNavigate();

    const movieData = [
        { id: 1, title: '위시', poster: '/img/poster_1.jpg', rating: 4.9 },
        { id: 2, title: '로키', poster: '/img/poster_2.jpg', rating: 4.5 },
        { id: 3, title: '오펜하이머', poster: '/img/poster_3.jpg', rating: 4.3 },
        { id: 4, title: '아메리칸 셰프', poster: '/img/poster_4.jpg', rating: 4.1 },
        { id: 5, title: '짱구', poster: '/img/poster_5.jpg', rating: 3.7 },
        { id: 6, title: '콜바넴', poster: '/img/poster_6.jpg', rating: 3.4 },
        { id: 7, title: '작은 아씨들', poster: '/img/poster_7.jpg', rating: 2.6 },
    ];

    const UserContainers = [
        { title: '좋아요한 영화', movieData: movieData },
        { title: '리스트 보관함', movieData: movieData },

        // 다른 컨테이너들을 필요한 만큼 추가
    ];

    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            // 토큰이 없으면 로그인 페이지로 리디렉션 또는 에러 처리
            console.error('토큰이 없습니다. 사용자는 로그인되어 있지 않습니다.');
            return;
        }

        const fetchUserData = async () => {
            try {
                // 서버로 토큰을 포함한 GET 요청 보냄
                const response = await axios.get('/user', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // 응답에서 사용자 데이터 추출
                const userData = response.data;

                // 사용자 데이터 설정
                setUserData(userData);
            } catch (error) {
                // 요청 실패 시 에러 처리
                console.error('사용자 데이터를 불러오는 데 실패했습니다:', error);
            }
        };

        fetchUserData();
    }, []);

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className='UserTop'>
                <div className='gradientOverlay'></div>
                <img src={userData.background} alt='topimage' className="TopImage" />
                <div className='UserProfile'>
                    <img src={userData.profile} alt='userimage' className='UserImage' />
                    <h1 className='UserName'>{userData.email}</h1>
                </div>
            </div>
            <div className='UserBottom'>
                {UserContainers.map((container, index) => (
                    <UserContainer key={index} title={container.title} movieData={container.movieData} />
                ))}
            </div>

        </div>
    )
}
export default User;