import React, { useState } from 'react';
import './ranks.css';

function Ranks() {
    const movieData = [
        { id: 1, title: '위시', poster: '/img/poster_1.jpg', rating: 4.9 },
        { id: 2, title: '로키', poster: '/img/poster_2.jpg', rating: 4.5 },
        { id: 3, title: '오펜하이머', poster: '/img/poster_3.jpg', rating: 4.3 },
        { id: 4, title: '아메리칸 셰프', poster: '/img/poster_4.jpg', rating: 4.1 },
        { id: 5, title: '짱구', poster: '/img/poster_5.jpg', rating: 3.7 },
        { id: 6, title: '콜바넴', poster: '/img/poster_6.jpg', rating: 3.4 },
        { id: 7, title: '작은 아씨들', poster: '/img/poster_7.jpg', rating: 2.6 },

    ];

    const userData = [
        { id: 1, username: '정원카', profile: '/img/poco.png' },
        { id: 2, username: '유니쿠', profile: '/img/poco.png' },
        { id: 3, username: '세현팍', profile: '/img/poco.png' },
        { id: 4, username: 'KNUwarriors', profile: '/img/poco.png' },
        { id: 5, username: '보고팝팝', profile: '/img/poco.png' },
        { id: 6, username: '윌리웡카', profile: '/img/poco.png' },
    ];

    const itemsToShowInitially = 5;
    const [movieCount, setMovieCount] = useState(itemsToShowInitially);
    const [userCount, setUserCount] = useState(itemsToShowInitially);

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const decimalPart = rating % 1 * 10;
        let cnt = 0;

        // 노란 별 추가
        for (let i = 0; i < fullStars; i++) {
            stars.push(<div key={`yellow-star-${i}`} className="star yellow-star"></div>);
            cnt += 1;
        }

        if (decimalPart < 4) {
            // 평점이 4.0 ~ 4.3인 경우에는 까만 별 1개 추가
            stars.push(<div key={`black-star`} className="star black-star"></div>);
            cnt += 1;
        } else if (decimalPart < 8) {
            // 평점이 4.4 ~ 4.7인 경우에는 회색 별 1개 추가
            stars.push(<div key={`grey-star`} className="star grey-star"></div>);
            cnt += 1;
        } else {
            // 그 외에는 노란 별 추가
            stars.push(<div key={`yellow-star`} className="star yellow-star"></div>);
            cnt += 1;
        }

        if (cnt < 5) {
            for (let i = 0; i < 5 - cnt; i++) {
                stars.push(<div key={`black-star`} className="star black-star"></div>);
            }
        }
        return stars;
    };

    const handleMovieMoreClick = () => {
        setMovieCount((prevCount) => prevCount + itemsToShowInitially);
    };

    const handleUserMoreClick = () => {
        setUserCount((prevCount) => prevCount + itemsToShowInitially);
    };

    return (
        <div className="ranks-container">
            <div className="rank-section">
                <h1>영화 랭킹</h1>
                {movieData.slice(0, movieCount).map((movie) => (
                    <div key={movie.id} className="rank-item">
                        <img src={movie.poster} alt={movie.title} className='movie-poster' />
                        <div className='movie-info'>
                            <h3>{movie.title}</h3>
                            <div className="star-rating">{renderStars(movie.rating)}</div>
                        </div>
                    </div>
                ))}
                {movieCount < movieData.length && (
                    <button onClick={handleMovieMoreClick}>더 보기</button>
                )}
            </div>

            <div className="rank-section">
                <h1>유저 랭킹</h1>
                {userData.slice(0, userCount).map((user) => (
                    <div key={user.id} className="rank-item">
                        <img src={user.profile} alt={user.username} className='user-image' />
                        <h3 className='user-name'>{user.username}</h3>
                    </div>
                ))}
                {userCount < userData.length && (
                    <button onClick={handleUserMoreClick}>더 보기</button>
                )}
            </div>
        </div>
    )
}
export default Ranks;