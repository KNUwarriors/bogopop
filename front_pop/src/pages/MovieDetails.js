import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'
import './moviedetails.css';
import Reviews from './Reviews';
import SignIn from '../components/SignIn.js';
import YouTube from 'react-youtube';

function MovieDetails() {
    const { id } = useParams();
    const [movieData, setMovieData] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [ReviewPopup, setReviewPopup] = useState(false);
    const [LoginPopup, setLoginPopup] = useState(false);
    const navigate = useNavigate();

    const checkAuthentication = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoggedIn(false);
                return;
            }
            const response = await axios.get('/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setLoggedIn(true);
            } else {
                setLoggedIn(false);
            }
        } catch (error) {
            console.error('Error checking authentication status:', error);
            setLoggedIn(false); // 로그인되어 있지 않음
        }
    };
    useEffect(() => {
        checkAuthentication();
    }, [isLoggedIn]);

    useEffect(() => {
        axios.get(`/movies`)
            .then((response) => {
                // 가져온 데이터에서 이미지 URL만 추출하여 저장
                const moviesWithImages = response.data.map(movie => ({
                    id: movie.id,
                    korean_title: movie.korean_title,
                    original_title: movie.original_title,
                    poster_path: movie.poster_path,
                    pop_score: movie.pop_score,
                    overview: movie.overview,
                    release_year: movie.release_date.slice(0, 4),
                    release_date: movie.release_date,
                    directors: formatArrayToString(movie.directors),
                    cast: formatArrayToString(movie.cast),
                    trailer: getVideoIdFromUrl(movie.trailer),
                }));

                setMovieData(moviesWithImages);
            })
            .catch((error) => {
                console.error('Error fetching movie data:', error);
                setMovieData([]);
            });

        // 리뷰 데이터 가져오기
        if (id) {
            axios.get(`/reviews/${id}`)
                .then((response) => {
                    setReviews(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching reviews:', error);
                    setReviews([]);
                });
        }
    }, [id]);

    // id에 해당하는 영화 정보 찾기
    const movie = movieData.find((movie) => movie.id === parseInt(id, 10));

    // id에 해당하는 영화가 없으면 에러 메시지 출력
    if (!movie) {
        return <div>영화를 찾을 수 없습니다.</div>;
    }

    // pop score
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
        if (cnt < 5) {
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
        }

        if (cnt < 5) {
            for (let i = 0; i < 5 - cnt; i++) {
                stars.push(<div key={`black-star`} className="star black-star"></div>);
            }
        }
        return stars;
    };

    // 리뷰쓰기 버튼 클릭 시
    const handleSubmitReview = () => {
        if (isLoggedIn) {
            setReviewPopup(true);
        } else {
            setLoginPopup(true);
        }
    };
    // 리뷰쓰기 팝업 창 닫기
    const closeModal = () => {
        setReviewPopup(false);
        setLoginPopup(false);
    };

    return (
        <div className="movie-details-container">
            <div className="poster-section">
                <img src={movie.poster_path} alt={movie.korean_title} className='poster-img' />
                <div className="star-rating">{renderStars(movie.pop_score)} ({movie.pop_score})</div>
                {/* 리뷰 쓰기 버튼 */}
                <button onClick={handleSubmitReview}>리뷰 쓰기</button>
                {ReviewPopup && (
                    <Reviews isOpen={setReviewPopup} setLoggedIn={setLoggedIn} onClose={closeModal} />
                )}
                {LoginPopup && (
                    <SignIn isOpen={setLoginPopup} setLoggedIn={setLoggedIn} onClose={closeModal} />
                )}
            </div>


            <div className='info-container'>
                <div className="info-section">
                    <div className='title-section'>
                        <h2 className='korean_title'>{movie.korean_title}</h2>
                        <p className='release_year'>{movie.release_year}</p>
                    </div>
                    <p className='original_title'>{movie.original_title}</p>
                    <YouTube
                        videoId={movie.trailer}
                        opts={{
                            width: "560",
                            height: "315",
                            playerVars: {
                                autoplay: 1,
                                rel: 0,
                                modestbranding: 1,
                            },
                        }}
                        onEnd={(e) => { e.target.stopVideo(0); }}
                    />
                    <p className='overview'>{movie.overview}</p>
                    <p className='directors'>감독: {movie.directors}</p>
                    <p className='cast'>출연진: {movie.cast}</p>
                    <hr />
                    {/* 리뷰 목록 */}
                    <div className="reviews">
                        <h3>리뷰</h3>
                        <ul>
                            {reviews.map((review, index) => (
                                <li key={index}>{review}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default MovieDetails;

function formatArrayToString(str) {
    if (typeof str === 'string') {
        // 대괄호와 작은 따옴표 제거
        return str.replace(/[\[\]']+/g, '').trim();
    }
    return str; // 문자열이 아닌 경우 그대로 반환
}

// YouTube URL에서 videoId 추출하는 함수
function getVideoIdFromUrl(url) {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
}