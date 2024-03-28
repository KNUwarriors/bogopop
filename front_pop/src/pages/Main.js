import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios'
import './main.css';
import { Link } from 'react-router-dom';

const MainContainer = ({ title, movieData }) => {
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
        <div className='main-container'>
            <h2 className='container-title'>{title}</h2>
            <hr />
            {isLeftButtonVisible && (
                <button className="scrollButton left" onClick={() => scroll('left')}>&lt;</button>
            )}
            <div className='movies' ref={containerRef}>
                {movieData.map((movie) => {
                    return (
                        <Link key={movie.id} to={`/movies/${movie.id}`}>
                            <div className="moviePoster">
                                <img src={movie.poster_path} alt={movie.koreanTitle} />
                            </div>
                        </Link>
                    );
                })}
            </div>
            {isRightButtonVisible && (
                <button className="scrollButton right" onClick={() => scroll('right')}>&gt;</button>
            )}
        </div>
    );
};

function Main() {
    const [movieData, setMovieData] = useState([]);
    const [randomMovie, setRandomMovie] = useState(null);
    const [popularMoviesData, setPopularMoviesData] = useState([]);
    const [moviesByPopScoreData, setMoviesByPopScoreData] = useState([]);
    const [popularReviewsData, setPopularReviewsData] = useState([]);


    useEffect(() => {
        axios.get('/movies/OrderedMovies')
            .then((response) => {
                const data = response.data;
                const popularMoviesData = data.popularMovies.map(movie => ({
                    id: movie.id,
                    korean_title: movie.koreanTitle,
                    poster_path: movie.poster_path,
                    backdrop_path: movie.backdrop_path
                }));
                setPopularMoviesData(popularMoviesData);

                const moviesByPopScoreData = data.moviesByPopScore.map(movie => ({
                    id: movie.id,
                    korean_title: movie.koreanTitle,
                    poster_path: movie.poster_path,
                    backdrop_path: movie.backdrop_path
                }));
                setMoviesByPopScoreData(moviesByPopScoreData);

                // 랜덤으로 영화 선택
                const randomIndex = Math.floor(Math.random() * popularMoviesData.length);
                setRandomMovie(popularMoviesData[randomIndex]);
            })
            .catch((error) => {
                console.error('Error fetching ordered movies:', error);
                setPopularMoviesData([]);
                setMoviesByPopScoreData([]);
            });
        axios.get('/reviews/popularReviews')
            .then((response) => {
                const data = response.data;
                const popularReviewsData = data.popularReviews.map(review => ({
                    id: review.id,
                    movieId: review.movieId,
                    nickname: review.nickname,
                    content: review.content,
                    comments: review.comments,
                    likes: review.likes
                }));
                setPopularReviewsData(popularReviewsData);
            })
            .catch((error) => {
                console.error('Error fetching popular reviews:', error);
                setPopularReviewsData([]); // 에러 발생 시 빈 배열로 초기화
            });

        axios.get(`/movies`)
            .then((response) => {
                const moviesWithImages = response.data.map(movie => ({
                    id: movie.id,
                    korean_title: movie.koreanTitle,
                    original_title: movie.originalTitle,
                    poster_path: movie.poster_path,
                    release_year: movie.release_date.slice(0, 4),
                }));
                setMovieData(moviesWithImages);
            })
            .catch((error) => {
                console.error('Error fetching movie data:', error);
                setMovieData([]);
            });


    }, []);


    return (
        <div>
            {randomMovie && ( // randomMovie가 있는 경우에만 MainTopImage를 표시
                <Link className='MainTopImage' to={`/movies/${randomMovie.id}`}>
                    <div className='MainTopOverlay'></div>
                    <img src={randomMovie.backdrop_path} alt="MainImage" className="mainImage" />
                    <div className='textOverlay'><h2>{randomMovie.korean_title}</h2></div>
                </Link>
            )}
            <MainContainer title='이번 주 인기 영화' movieData={popularMoviesData} />
            <MainContainer title='평점 높은 영화' movieData={moviesByPopScoreData} />
            <div>
                <h2 className='top_review'>인기 리뷰</h2>
                <hr className='top_reivew_hr' />
                {popularReviewsData.map((review) => {
                    const movieInfo = movieData.find(movie => movie.id === review.movieId);
                    if (!movieInfo) return null;
                    return (
                        <div key={review.id} className='pop_review_item'>
                            <img src={movieInfo.poster_path} alt={movieInfo.korean_title} className='pop_review_poster' />
                            <div className='pop_review_container'>
                                <div className='pop_review_top'>
                                    <h3 className='pop_review_title'>{movieInfo.korean_title}</h3>
                                    <p className='pop_review_release_year'>{movieInfo.release_year}</p>
                                </div>
                                <div className='pop_review_mid'>
                                    <p className='pop_review_nickname'>{review.nickname}</p>
                                    <p className='pop_review_comments'>{review.comments}</p>
                                </div>
                                <p className='pop_review_content'>{review.content}</p>
                                <p className='pop_review_likes'>{review.likes} likes</p>
                            </div>

                        </div>

                    )
                })}

            </div>
        </div>
    );
}
export default Main;