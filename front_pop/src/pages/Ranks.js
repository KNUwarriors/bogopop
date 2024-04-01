import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'
import './ranks.css';

function Ranks() {
    const [movieData, setMovieData] = useState([]);
    const [userData, setUserData] = useState([]);
    const itemsToShowInitially = 5;
    const [movieCount, setMovieCount] = useState(itemsToShowInitially);
    const [userCount, setUserCount] = useState(itemsToShowInitially);

    useEffect(() => {
        axios.get(`/movies/ranking`)
            .then((response) => {
                const movieData = response.data.map(movie => ({
                    id: movie.id,
                    korean_title: movie.koreanTitle,
                    poster_path: movie.poster_path,
                    pop_score: movie.popScore
                }));
                setMovieData(movieData);
            })
            .catch((error) => {
                console.error('Error fetching ordered movies:', error);
                setMovieData([]);
            });
        axios.get(`/users/ranking`)
            .then((response) => {
                console.log(response.data);
                const data = response.data;
                setUserData(data);
            })
            .catch((error) => {
                console.error('Error fetching user ranking:', error);
                setUserData([]);
            });
    }, []);



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
                    <Link key={movie.id} to={`/movies/${movie.id}`} className='link-style'>
                        <div className="rank-item">
                            <img src={movie.poster_path} alt={movie.korean_title} className='movie-poster' />
                            <div className='movie-info'>
                                <h3>{movie.korean_title}</h3>
                                <div className="star-rating">{renderStars(movie.pop_score)}</div>
                            </div>
                        </div>
                    </Link>
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