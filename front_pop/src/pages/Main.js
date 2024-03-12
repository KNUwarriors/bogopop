import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios'
import './main.css';
import { Link } from 'react-router-dom';

function Main() {
    const [movieData, setMovieData] = useState([]);
    const [randomMovie, setRandomMovie] = useState(null); // 추가된 부분, 메인페이지 랜덤배너
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

    useEffect(() => {
        axios.get('/movies')
            .then((response) => {
                // 가져온 데이터에서 이미지 URL만 추출하여 저장
                const moviesWithImages = response.data.map(movie => ({
                    id: movie.id,
                    korean_title: movie.korean_title,
                    poster_path: movie.poster_path,
                    backdrop_path: movie.backdrop_path
                }));

                setMovieData(moviesWithImages);

                // 랜덤으로 영화 선택
                const randomIndex = Math.floor(Math.random() * moviesWithImages.length);
                setRandomMovie(moviesWithImages[randomIndex]);
            })
            .catch((error) => {
                console.error('Error fetching movie data:', error);
                setMovieData([]);
            });
    }, []);


    const scroll = (direction) => {
        const scrollAmount = 500; // 스크롤 양 조절 가능
        const currentScroll = containerRef.current.scrollLeft;

        if (direction === 'left') {
            containerRef.current.scrollLeft = Math.max(currentScroll - scrollAmount, 0);
        } else if (direction === 'right') {
            containerRef.current.scrollLeft = Math.min(currentScroll + scrollAmount, containerRef.current.scrollWidth);
        }
    };

    return (
        <div>
            {randomMovie && ( // randomMovie가 있는 경우에만 MainTopImage를 표시
                <Link className='MainTopImage' to={`/movies/${randomMovie.id}`}>
                    <div className='gradientOverlay'></div>
                    <img src={randomMovie.backdrop_path} alt="MainImage" className="mainImage" />
                    <div className='textOverlay'><h2>{randomMovie.korean_title}</h2></div>
                </Link>
            )}

            <h1>이번 주 인기 영화!</h1>

            <div className='MainPopularWrapper'>
                {isLeftButtonVisible && (
                    <button className="scrollButton_main left" onClick={() => scroll('left')}>&lt;</button>
                )}
                <div className='MainPopular' ref={containerRef}>
                    {movieData.map((movie) => {
                        return (
                            <Link key={movie.id} to={`/movies/${movie.id}`}>
                                <div className="moviePoster">
                                    <img src={movie.poster_path} alt={movie.korean_title} />
                                </div>
                            </Link>
                        );
                    })}

                </div>

                {isRightButtonVisible && (
                    <button className="scrollButton_main right" onClick={() => scroll('right')}>&gt;</button>
                )}
            </div>
        </div>
    );
}
export default Main;


