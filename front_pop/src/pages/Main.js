import React, { useRef, useEffect, useState } from 'react';
import './main.css';
import { Link } from 'react-router-dom';

function Main() {

    const movieData = [
        { id: 1, title: '위시', poster: '/img/poster_1.jpg', rating: 4.9 },
        { id: 2, title: '로키', poster: '/img/poster_2.jpg', rating: 4.5 },
        { id: 3, title: '오펜하이머', poster: '/img/poster_3.jpg', rating: 4.3 },
        { id: 4, title: '아메리칸 셰프', poster: '/img/poster_4.jpg', rating: 4.1 },
        { id: 5, title: '짱구', poster: '/img/poster_5.jpg', rating: 3.7 },
        { id: 6, title: '콜바넴', poster: '/img/poster_6.jpg', rating: 3.4 },
        { id: 7, title: '작은 아씨들', poster: '/img/poster_7.jpg', rating: 2.6 },
    ];

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
            <Link className='MainTopImage' to={'/'}>
                <div className='gradientOverlay'></div>
                <img src='/img/MainTop.jpg' alt="MainImage" className="mainImage" />
                <div className='textOverlay'><h2>오펜하이머</h2></div>
            </Link>

            <h1>이번 주 인기 영화!</h1>

            <div className='MainPopularWrapper'>
                {isLeftButtonVisible && (
                    <button className="scrollButton_main left" onClick={() => scroll('left')}>&lt;</button>
                )}
                <div className='MainPopular' ref={containerRef}>
                    {movieData.map((movie) => (
                        <Link key={movie.id} to={`/movies/${movie.id}`}>
                            <div className="moviePoster">
                                <img src={movie.poster} alt={movie.title} />
                            </div>
                        </Link>
                    ))}
                </div>
                {isRightButtonVisible && (
                    <button className="scrollButton_main right" onClick={() => scroll('right')}>&gt;</button>
                )}
            </div>
        </div>
    );
}
export default Main;


